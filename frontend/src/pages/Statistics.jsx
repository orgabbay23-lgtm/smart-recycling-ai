import { useEffect, useState } from 'react'
import {
  BarChart3,
  Loader2,
  AlertCircle,
  RefreshCw,
  ScanLine,
  Recycle,
  Apple,
  CalendarDays,
} from 'lucide-react'
import Button from '../components/Button'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Waste categories paired with the bin colour used across the app.
const WASTE_TYPES = [
  { key: 'glass', label: 'Glass', color: '#a855f7' },
  { key: 'metal', label: 'Metal', color: '#f97316' },
  { key: 'paper', label: 'Paper', color: '#3b82f6' },
  { key: 'plastic', label: 'Plastic', color: '#10b981' },
]

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function StatCard({ Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-white/60 bg-white/85 p-5 shadow-card backdrop-blur">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${accent}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <div className="font-display text-3xl font-extrabold text-slate-900 tabular-nums">{value}</div>
        <div className="text-sm font-medium text-slate-500">{label}</div>
      </div>
    </div>
  )
}

// Pure-SVG donut with on-slice percentages and external category labels.
function DonutChart({ data, total }) {
  // Wider-than-tall viewBox leaves room for the labels around the ring.
  const W = 300
  const H = 210
  const cx = W / 2
  const cy = H / 2
  const midRadius = 66
  const thickness = 22
  const outerRadius = midRadius + thickness / 2
  const circumference = 2 * Math.PI * midRadius

  // Point on a circle of radius r at the given angle (degrees, 0 = right, clockwise).
  const polar = (r, angleDeg) => {
    const a = (angleDeg * Math.PI) / 180
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  }

  let drawOffset = 0 // accumulated dash length for slice placement
  let labelAcc = 0 // accumulated fraction for label angles

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[320px]">
      {/* Ring (slices), rotated so the first slice starts at the top */}
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {total === 0 ? (
          <circle cx={cx} cy={cy} r={midRadius} fill="none" stroke="#e2e8f0" strokeWidth={thickness} />
        ) : (
          data.map((slice) => {
            if (slice.value === 0) return null
            const dash = (slice.value / total) * circumference
            const segment = (
              <circle
                key={slice.key}
                cx={cx}
                cy={cy}
                r={midRadius}
                fill="none"
                stroke={slice.color}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-drawOffset}
              />
            )
            drawOffset += dash
            return segment
          })
        )}
      </g>

      {/* Per-slice labels: % on the band, category name just outside it */}
      {total > 0 &&
        data.map((slice) => {
          if (slice.value === 0) return null
          const fraction = slice.value / total
          const midAngle = -90 + (labelAcc + fraction / 2) * 360
          labelAcc += fraction
          const band = polar(midRadius, midAngle)
          const outer = polar(outerRadius + 15, midAngle)
          const cosA = Math.cos((midAngle * Math.PI) / 180)
          const anchor = cosA > 0.25 ? 'start' : cosA < -0.25 ? 'end' : 'middle'
          return (
            <g key={slice.key}>
              <text
                x={band.x}
                y={band.y}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: 11, fontWeight: 700, fill: '#ffffff' }}
              >
                {Math.round(fraction * 100)}%
              </text>
              <text
                x={outer.x}
                y={outer.y}
                textAnchor={anchor}
                dominantBaseline="central"
                style={{ fontSize: 12, fontWeight: 600, fill: slice.color }}
              >
                {slice.label}
              </text>
            </g>
          )
        })}

      {/* Center total */}
      <text x={cx} y={cy - 4} textAnchor="middle" style={{ fontSize: 28, fontWeight: 800, fill: '#0f172a' }}>
        {total}
      </text>
      <text x={cx} y={cy + 16} textAnchor="middle" style={{ fontSize: 11, fill: '#94a3b8' }}>
        waste scans
      </text>
    </svg>
  )
}

const BAR_CHART_HEIGHT = 160 // px height of the plot area

function BarChart({ counts }) {
  const max = Math.max(1, ...counts)
  return (
    <div>
      {/* Bars: fixed-height plot area so each bar's pixel height is unambiguous. */}
      <div className="flex items-end justify-between gap-2" style={{ height: BAR_CHART_HEIGHT }}>
        {counts.map((count, index) => (
          <div
            key={DAY_LABELS[index]}
            className="flex flex-1 items-end self-stretch overflow-hidden rounded-lg bg-slate-100/60"
          >
            <div
              className="w-full rounded-lg bg-gradient-to-t from-emerald-500 to-teal-400 transition-all duration-700 ease-out"
              style={{ height: count > 0 ? Math.max((count / max) * BAR_CHART_HEIGHT, 4) : 0 }}
              title={`${count} scan${count === 1 ? '' : 's'}`}
            />
          </div>
        ))}
      </div>
      {/* Day labels aligned under each bar. */}
      <div className="mt-2 flex justify-between gap-2">
        {DAY_LABELS.map((day) => (
          <span key={day} className="flex-1 text-center text-xs font-medium text-slate-400">
            {day}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Statistics() {
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadStats() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/history`)
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.detail || 'Failed to load statistics')
      }
      setScans(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  // --- Derived analytics ---
  const wasteScans = scans.filter((s) => s.scan_type === 'waste')
  const freshnessScans = scans.filter((s) => s.scan_type === 'freshness')

  // Sorted high -> low so both the donut and the legend read in ranked order.
  const wasteDistribution = WASTE_TYPES.map((type) => ({
    ...type,
    value: wasteScans.filter((s) => s.predicted_label === type.key).length,
  })).sort((a, b) => b.value - a.value)

  // Freshness outcomes (Fresh vs. Rotten) — the food-waste angle.
  const freshCount = freshnessScans.filter((s) => s.predicted_label === 'fresh').length
  const rottenCount = freshnessScans.filter((s) => s.predicted_label === 'rotten').length
  const freshRate = freshnessScans.length
    ? Math.round((freshCount / freshnessScans.length) * 100)
    : 0

  // Scans recorded in the last 7 days — a practical recent-activity metric.
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const scansThisWeek = scans.filter((s) => {
    const t = new Date(s.timestamp).getTime()
    return !Number.isNaN(t) && t >= weekAgo
  }).length

  const dayCounts = Array(7).fill(0)
  scans.forEach((scan) => {
    const date = new Date(scan.timestamp)
    if (!Number.isNaN(date.getTime())) dayCounts[date.getDay()] += 1
  })
  const busiestDayIndex = dayCounts.reduce((best, count, i) => (count > dayCounts[best] ? i : best), 0)
  const busiestDay = dayCounts[busiestDayIndex] > 0 ? DAY_LABELS[busiestDayIndex] : '—'

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2.5 font-display text-3xl font-bold text-slate-900">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-soft">
            <BarChart3 className="h-6 w-6" />
          </span>
          Statistics
        </h1>
        <Button
          onClick={loadStats}
          variant="secondary"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p>Loading statistics...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/60 bg-white/80 py-16 text-center shadow-card backdrop-blur">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="text-lg font-semibold text-slate-800">Could not load statistics</p>
          <p className="text-sm text-slate-500">{error}</p>
          <Button onClick={loadStats} variant="secondary" className="mt-2">
            Try Again
          </Button>
        </div>
      ) : scans.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-white/60 bg-white/80 py-16 text-center text-slate-500 shadow-card backdrop-blur">
          <span className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <ScanLine className="h-8 w-8 text-slate-300" />
          </span>
          <p className="text-lg font-medium text-slate-700">No data yet</p>
          <p className="text-sm">Scan some items and your statistics will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              Icon={ScanLine}
              label="Total Scans"
              value={scans.length}
              accent="bg-slate-100 text-slate-600"
            />
            <StatCard
              Icon={Recycle}
              label="Waste Scans"
              value={wasteScans.length}
              accent="bg-emerald-100 text-emerald-600"
            />
            <StatCard
              Icon={Apple}
              label="Freshness Scans"
              value={freshnessScans.length}
              accent="bg-amber-100 text-amber-600"
            />
            <StatCard
              Icon={CalendarDays}
              label="This Week"
              value={scansThisWeek}
              accent="bg-blue-100 text-blue-600"
            />
          </div>

          {/* Distribution charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-card backdrop-blur">
              <h2 className="mb-4 font-display text-lg font-bold text-slate-900">Waste Type Distribution</h2>
              <div className="flex flex-col items-center gap-5">
                <DonutChart data={wasteDistribution} total={wasteScans.length} />
                <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
                  {wasteDistribution
                    .filter((type) => type.value > 0)
                    .map((type) => (
                      <li key={type.key} className="flex items-center gap-2 text-sm">
                        <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: type.color }} />
                        <span className="font-medium capitalize text-slate-600">{type.label}</span>
                        <span className="ml-auto font-semibold tabular-nums text-slate-800">{type.value}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-card backdrop-blur">
              <h2 className="mb-4 font-display text-lg font-bold text-slate-900">Freshness Outcomes</h2>
              {freshnessScans.length === 0 ? (
                <div className="flex h-40 flex-col items-center justify-center gap-2 text-center text-slate-400">
                  <Apple className="h-8 w-8" />
                  <p className="text-sm">No freshness scans yet.</p>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex items-baseline gap-2">
                    <span className="font-display text-4xl font-extrabold text-emerald-600">{freshRate}%</span>
                    <span className="text-sm text-slate-500">of food scanned was still fresh</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Fresh', value: freshCount, bar: 'bg-emerald-500' },
                      { label: 'Rotten', value: rottenCount, bar: 'bg-rose-500' },
                    ].map((row) => {
                      const pct = (row.value / freshnessScans.length) * 100
                      return (
                        <div key={row.label}>
                          <div className="mb-1.5 flex justify-between text-sm">
                            <span className="font-medium text-slate-600">{row.label}</span>
                            <span className="font-semibold tabular-nums text-slate-800">
                              {row.value} ({pct.toFixed(0)}%)
                            </span>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${row.bar} transition-all duration-700 ease-out`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Activity chart */}
          <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-card backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-slate-900">Scans by Day of Week</h2>
              <span className="text-sm text-slate-500">
                Busiest: <span className="font-semibold text-slate-700">{busiestDay}</span>
              </span>
            </div>
            <BarChart counts={dayCounts} />
          </div>
        </div>
      )}
    </div>
  )
}

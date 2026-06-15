import { useEffect, useState } from 'react'
import { History as HistoryIcon, Loader2, AlertCircle, RefreshCw, ImageOff } from 'lucide-react'
import Button from '../components/Button'
import { TONES, getResultMeta, ResultGlyph } from '../components/resultMeta'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const SCAN_TYPE_STYLES = {
  waste: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  freshness: 'bg-amber-50 text-amber-700 border-amber-100',
}

// Where a past scan ends up: the bin for waste, an eat/toss verdict for freshness.
function destinationFor(meta) {
  if (meta.kind === 'fresh') return { main: 'Good to eat', caption: 'freshness' }
  if (meta.kind === 'rotten') return { main: 'Toss it out', caption: 'freshness' }
  return { main: meta.title, caption: 'where it goes' }
}

function formatTimestamp(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function History() {
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadHistory() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/history`)
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.detail || 'Failed to load history')
      }
      setScans(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2.5 font-display text-3xl font-bold text-slate-900">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-soft">
            <HistoryIcon className="h-6 w-6" />
          </span>
          Scan History
        </h1>
        <Button
          onClick={loadHistory}
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
          <p>Loading history...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/60 bg-white/80 py-16 text-center shadow-card backdrop-blur">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="text-lg font-semibold text-slate-800">Could not load history</p>
          <p className="text-sm text-slate-500">{error}</p>
          <Button onClick={loadHistory} variant="secondary" className="mt-2">
            Try Again
          </Button>
        </div>
      ) : scans.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-white/60 bg-white/80 py-16 text-center text-slate-500 shadow-card backdrop-blur">
          <span className="mb-1 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <HistoryIcon className="h-8 w-8 text-slate-300" />
          </span>
          <p className="text-lg font-medium text-slate-700">No scans yet</p>
          <p className="text-sm">Your recent scans will appear here.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {scans.map((scan) => {
            const meta = getResultMeta(scan.predicted_label)
            const tone = TONES[meta.tone]
            const dest = destinationFor(meta)
            return (
              <li
                key={scan.id}
                className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/85 p-3 shadow-card backdrop-blur transition-colors hover:bg-emerald-50/40"
              >
                {scan.thumbnail ? (
                  <img
                    src={scan.thumbnail}
                    alt={scan.predicted_label}
                    className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
                    <ImageOff className="h-8 w-8" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        SCAN_TYPE_STYLES[scan.scan_type] || 'bg-slate-50 text-slate-700 border-slate-100'
                      }`}
                    >
                      {scan.scan_type}
                    </span>
                    <span className="truncate font-semibold capitalize text-slate-800">
                      {scan.predicted_label}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{formatTimestamp(scan.timestamp)}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className={`flex items-center justify-end gap-1.5 font-bold whitespace-nowrap ${tone.title}`}>
                    <ResultGlyph kind={meta.kind} className="h-5 w-5" />
                    <span>{dest.main}</span>
                  </div>
                  <div className="text-xs text-slate-400">{dest.caption}</div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

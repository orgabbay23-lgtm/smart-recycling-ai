import { useEffect, useState } from 'react'
import { AlertCircle, Loader2, RefreshCw, History as HistoryIcon } from 'lucide-react'
import Button from '../components/Button'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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

const SCAN_TYPE_STYLES = {
  waste: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  freshness: 'bg-amber-50 text-amber-700 border-amber-100',
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
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-card backdrop-blur">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5 font-semibold">Type</th>
                <th className="px-5 py-3.5 font-semibold">Prediction</th>
                <th className="px-5 py-3.5 font-semibold">Confidence</th>
                <th className="px-5 py-3.5 font-semibold">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scans.map((scan) => (
                <tr key={scan.id} className="transition-colors hover:bg-emerald-50/40">
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                        SCAN_TYPE_STYLES[scan.scan_type] || 'bg-slate-50 text-slate-700 border-slate-100'
                      }`}
                    >
                      {scan.scan_type}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold capitalize text-slate-800">
                    {scan.predicted_label}
                  </td>
                  <td className="px-5 py-4 text-slate-600 tabular-nums">
                    {(scan.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {formatTimestamp(scan.timestamp)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

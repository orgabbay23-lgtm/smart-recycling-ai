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
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <HistoryIcon className="h-7 w-7 text-emerald-600" />
          Scan History
        </h1>
        <Button
          onClick={loadHistory}
          variant="secondary"
          disabled={loading}
          className="inline-flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p>Loading history...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="text-lg font-semibold text-gray-800">Could not load history</p>
          <p className="text-sm text-gray-500">{error}</p>
          <Button onClick={loadHistory} variant="secondary" className="mt-2">
            Try Again
          </Button>
        </div>
      ) : scans.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center text-gray-500">
          <HistoryIcon className="h-10 w-10 text-gray-300" />
          <p className="text-lg font-medium text-gray-700">No scans yet</p>
          <p className="text-sm">Your recent scans will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Prediction</th>
                <th className="px-5 py-3 font-medium">Confidence</th>
                <th className="px-5 py-3 font-medium">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {scans.map((scan) => (
                <tr key={scan.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${
                        SCAN_TYPE_STYLES[scan.scan_type] || 'bg-gray-50 text-gray-700 border-gray-100'
                      }`}
                    >
                      {scan.scan_type}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium capitalize text-gray-800">
                    {scan.predicted_label}
                  </td>
                  <td className="px-5 py-4 text-gray-600">
                    {(scan.confidence * 100).toFixed(1)}%
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
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

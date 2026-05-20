import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Button from './Button'

export default function ScanResult({ result, error, onRetry }) {
  if (!result && !error) return null

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-7 text-center shadow-card backdrop-blur animate-fade-in-up">
      {error ? (
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
            <AlertCircle className="h-9 w-9 text-red-500" />
          </span>
          <p className="text-lg font-semibold text-slate-800">Something went wrong</p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
            <CheckCircle className="h-9 w-9 text-emerald-500" />
          </span>
          <p className="font-display text-2xl font-bold capitalize text-slate-900">{result.label}</p>

          <div className="mt-1 w-full">
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-medium text-slate-500">Confidence</span>
              <span className="font-semibold text-slate-700">{(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700 ease-out"
                style={{ width: `${Math.min(result.confidence * 100, 100)}%` }}
              />
            </div>
          </div>

          {result.recommendation && (
            <p className="mt-2 leading-relaxed text-slate-600">{result.recommendation}</p>
          )}
        </div>
      )}

      <Button
        onClick={onRetry}
        variant="secondary"
        className="mt-6 inline-flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  )
}

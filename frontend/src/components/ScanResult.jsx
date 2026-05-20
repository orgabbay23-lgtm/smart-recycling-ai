import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Button from './Button'

export default function ScanResult({ result, error, onRetry }) {
  if (!result && !error) return null

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md text-center">
      {error ? (
        <div className="flex flex-col items-center gap-3">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <p className="text-lg font-semibold text-gray-800">Something went wrong</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle className="h-12 w-12 text-emerald-500" />
          <p className="text-2xl font-bold text-gray-800">{result.label}</p>

          <div className="w-full">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Confidence</span>
              <span>{(result.confidence * 100).toFixed(1)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${Math.min(result.confidence * 100, 100)}%` }}
              />
            </div>
          </div>

          {result.recommendation && (
            <p className="mt-2 text-gray-700">{result.recommendation}</p>
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

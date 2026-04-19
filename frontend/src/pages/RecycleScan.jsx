import { useState } from 'react'
import ImageCapture from '../components/ImageCapture'
import Button from '../components/Button'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function RecycleScan() {
  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleAnalyze() {
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', image)

    try {
      const res = await fetch(`${API_URL}/predict/waste`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.detail || 'Prediction failed')
      }
      setResult(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-gray-800">Scan Waste</h1>
      <p className="text-gray-500">Take a photo or upload an image of a waste item</p>

      <ImageCapture image={image} onImageSelect={setImage} />

      <Button
        disabled={!image || loading}
        onClick={handleAnalyze}
        variant="primary"
      >
        {loading ? 'Analyzing...' : 'Analyze Waste'}
      </Button>

      {error && (
        <p className="text-red-600 font-medium">{error}</p>
      )}

      {result && (
        <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md text-center">
          <p className="text-lg font-semibold text-gray-800">{result.label}</p>
          <p className="text-sm text-gray-500 mt-1">
            Confidence: {(result.confidence * 100).toFixed(1)}%
          </p>
          <p className="mt-3 text-gray-700">{result.recommendation}</p>
        </div>
      )}

      {(result || error) && (
        <Button
          onClick={() => {
            setImage(null)
            setResult(null)
            setError(null)
          }}
          variant="secondary"
        >
          Try Again
        </Button>
      )}
    </div>
  )
}
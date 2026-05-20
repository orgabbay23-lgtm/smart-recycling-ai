import { useState } from 'react'
import ImageCapture from '../components/ImageCapture'
import Button from '../components/Button'
import ScanResult from '../components/ScanResult'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function FreshnessScan() {
  const [image, setImage] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleRetry() {
    setImage(null)
    setResult(null)
    setError(null)
  }

  async function handleAnalyze() {
    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', image)

    try {
      const res = await fetch(`${API_URL}/predict/freshness`, {
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
      <h1 className="text-3xl font-bold text-gray-800">Check Food Freshness</h1>
      <p className="text-gray-500">Take a photo or upload an image of a fruit</p>

      <ImageCapture image={image} onImageSelect={setImage} />

      <Button
        disabled={!image || loading}
        onClick={handleAnalyze}
        variant="warning"
      >
        {loading ? 'Analyzing...' : 'Analyze Food'}
      </Button>

      <ScanResult result={result} error={error} onRetry={handleRetry} />
    </div>
  )
}
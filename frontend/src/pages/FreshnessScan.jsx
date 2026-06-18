import { useState } from 'react'
import { Apple } from 'lucide-react'
import ImageCapture from '../components/ImageCapture'
import Button from '../components/Button'
import ScanResult from '../components/ScanResult'
import { API_URL } from '../services/api'

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
        throw new Error(body?.detail || 'We couldn’t analyze that image. Please try again.')
      }
      setResult(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2 text-center animate-fade-in-up">
        <span className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-soft">
          <Apple className="h-7 w-7" />
        </span>
        <h1 className="font-display text-3xl font-bold text-slate-900">Check Food Freshness</h1>
        <p className="text-slate-500">Take a photo or upload an image of a fruit</p>
      </div>

      <div className="flex w-full flex-col items-center gap-6 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-card backdrop-blur animate-fade-in-up">
        <ImageCapture image={image} onImageSelect={setImage} />

        <Button
          disabled={!image || loading}
          onClick={handleAnalyze}
          variant="warning"
        >
          {loading ? 'Analyzing...' : 'Analyze Food'}
        </Button>
      </div>

      <ScanResult result={result} error={error} onRetry={handleRetry} />
    </div>
  )
}
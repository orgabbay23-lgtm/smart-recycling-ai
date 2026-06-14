import { AlertCircle, RefreshCw, Info, ChefHat, AlertTriangle } from 'lucide-react'
import Button from './Button'
import { TONES, getResultMeta, ResultGlyph } from './resultMeta'

// Strip the leading bin name from the backend guidance so it doesn't repeat the hero title.
// "Blue Bin — paper recycling" -> "paper recycling"; text with no dash is kept as-is.
function guidanceFrom(recommendation) {
  if (!recommendation) return null
  const parts = recommendation.split(/\s+[—–-]\s+/)
  return parts.length > 1 ? parts.slice(1).join(' — ').trim() : recommendation
}

export default function ScanResult({ result, error, onRetry }) {
  if (!result && !error) return null

  const meta = result ? getResultMeta(result.label) : null
  const tone = meta ? TONES[meta.tone] : null
  const guidance = result ? guidanceFrom(result.recommendation) : null
  const confidencePct = result ? Math.round(result.confidence * 100) : 0

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/60 bg-white/90 p-7 text-center shadow-card backdrop-blur animate-fade-in-up">
      {error ? (
        <div className="flex flex-col items-center gap-3">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
            <AlertCircle className="h-9 w-9 text-red-500" />
          </span>
          <p className="text-lg font-semibold text-slate-800">Oops, something went wrong!</p>
          <p className="text-sm text-slate-500">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {meta.kind === 'bin' ? (
            // waste: show the detected item big, right beside the bin drawing
            <div className="flex items-center justify-center gap-4">
              <span className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] shadow-soft ring-8 ${tone.badge}`}>
                <ResultGlyph kind={meta.kind} />
              </span>
              <div className="text-left">
                <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-slate-400">We found</p>
                <p className="font-display text-3xl font-extrabold leading-tight text-slate-900">{meta.item}</p>
              </div>
            </div>
          ) : (
            // freshness: the Fresh/Rotten verdict sits right below, so the icon stands alone
            <span className={`flex h-24 w-24 items-center justify-center rounded-[1.75rem] shadow-soft ring-8 ${tone.badge}`}>
              <ResultGlyph kind={meta.kind} />
            </span>
          )}

          {/* the answer: which bin / freshness */}
          <div className="mt-1">
            {meta.eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{meta.eyebrow}</p>
            )}
            <p className={`font-display text-3xl font-extrabold leading-tight ${tone.title}`}>{meta.title}</p>
          </div>

          {guidance && (
            <p className="max-w-xs leading-relaxed text-slate-600">{guidance}</p>
          )}

          {result.storage_tip && (
            <div className="flex items-start gap-2 bg-blue-50 text-blue-800 border border-blue-100 rounded-xl p-4 text-left text-sm mt-2">
              <Info className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="leading-relaxed">
                <span className="font-semibold">💡 How to store it: </span>
                {result.storage_tip}
              </p>
            </div>
          )}

          {result.recipe_suggestion && (
            <div className="flex items-start gap-2 bg-amber-50 text-amber-800 border border-amber-100 rounded-xl p-4 text-left text-sm mt-2">
              <ChefHat className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="leading-relaxed">
                <span className="font-semibold">👩‍🍳 Recipe idea: </span>
                {result.recipe_suggestion}
              </p>
            </div>
          )}

          {result.safety_tip && (
            <div className="flex items-start gap-2 bg-red-50 text-red-800 border border-red-100 rounded-xl p-4 text-left text-sm mt-2">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="leading-relaxed">
                <span className="font-semibold">⚠️ Safety warning: </span>
                {result.safety_tip}
              </p>
            </div>
          )}

          {/* confidence — quiet footer: how sure the model is, not the headline */}
          <div
            className="mt-2 flex items-center gap-2 text-xs text-slate-400"
            title="How certain our AI is about this result"
          >
            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
              <span
                className="block h-full rounded-full bg-slate-300"
                style={{ width: `${Math.min(confidencePct, 100)}%` }}
              />
            </span>
            <span>{confidencePct}% sure</span>
          </div>
        </div>
      )}

      <Button
        onClick={onRetry}
        variant="secondary"
        className="mt-6 inline-flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        Start over
      </Button>
    </div>
  )
}

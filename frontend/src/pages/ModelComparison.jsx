import { Link } from 'react-router-dom'
import {
  Recycle, Apple, ArrowLeft, ArrowRight, Check, TrendingUp,
  Cpu, Layers, Scaling, Images, Sparkles,
} from 'lucide-react'

// Old (ResNet18) vs. new (EfficientNetV2-S) numbers, taken from each model's
// evaluation report. Percentages are 0–100.
const COMPARISON = [
  {
    task: 'Waste Sorting',
    Icon: Recycle,
    old: { acc: 92.0, precision: 92.0, recall: 92.0, f1: 92.0, classes: 4, evalImages: 560, input: 224 },
    neu: { acc: 99.6, precision: 99.5, recall: 99.5, f1: 99.5, classes: 10, evalImages: 7351, input: 384 },
    confusionOld: '/metrics/confusion_matrix_waste_v1.png',
    confusionNew: '/metrics/confusion_matrix_waste.png',
  },
  {
    task: 'Food Freshness',
    Icon: Apple,
    old: { acc: 98.0, precision: 98.0, recall: 98.0, f1: 98.0, classes: 2, evalImages: 232, input: 224 },
    neu: { acc: 98.8, precision: 98.8, recall: 98.6, f1: 98.7, classes: 2, evalImages: 14264, input: 384 },
    confusionOld: '/metrics/confusion_matrix_freshness_v1.png',
    confusionNew: '/metrics/confusion_matrix_freshness.png',
  },
]

const METRIC_KEYS = [
  { key: 'acc', label: 'Accuracy' },
  { key: 'precision', label: 'Precision' },
  { key: 'recall', label: 'Recall' },
  { key: 'f1', label: 'F1-Score' },
]

const OLD_NAME = 'ResNet18 (v1)'
const NEW_NAME = 'EfficientNetV2 (v2)'

function VersionChip({ color, label }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      {label}
    </span>
  )
}

// One metric: the old bar above the new bar, with a "+x pts" badge.
function MetricRow({ label, oldVal, newVal }) {
  const delta = newVal - oldVal
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          {delta >= 0 ? '+' : ''}{delta.toFixed(1)} pts
        </span>
      </div>
      <Bar label={OLD_NAME} value={oldVal} color="bg-slate-300" valueColor="text-slate-500" />
      <div className="h-2" />
      <Bar label={NEW_NAME} value={newVal} color="bg-emerald-500" valueColor="text-emerald-700" />
    </div>
  )
}

// Full-width bar (label + value on top, track below) so the length difference
// stays readable on every screen size, phones included.
function Bar({ label, value, color, valueColor }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <span className={`text-sm font-semibold tabular-nums ${valueColor}`}>{value.toFixed(1)}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

// "Mistakes per 100 items" — the most intuitive view of the improvement.
function MistakesCompare({ oldAcc, newAcc }) {
  const oldErr = 100 - oldAcc
  const newErr = 100 - newAcc
  const fewer = Math.round(((oldErr - newErr) / oldErr) * 100)
  // Both bars are scaled against the old error so the shrink is obvious.
  const newWidth = (newErr / oldErr) * 100
  return (
    <div className="mt-6 rounded-2xl bg-slate-50 p-5">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-emerald-600" />
        <h4 className="text-sm font-semibold text-slate-700">Mistakes per 100 items</h4>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <span className="w-32 shrink-0 text-xs font-medium text-slate-500 sm:w-36">{OLD_NAME}</span>
          <div className="relative h-6 flex-1 overflow-hidden rounded-lg bg-slate-100">
            <div className="flex h-full items-center justify-end rounded-lg bg-rose-300 px-2" style={{ width: '100%' }}>
              <span className="text-xs font-bold text-rose-900">{oldErr.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-32 shrink-0 text-xs font-medium text-slate-500 sm:w-36">{NEW_NAME}</span>
          <div className="relative h-6 flex-1 overflow-hidden rounded-lg bg-slate-100">
            <div
              className="flex h-full min-w-[2.5rem] items-center justify-end rounded-lg bg-emerald-500 px-2 transition-all duration-700"
              style={{ width: `${Math.max(newWidth, 6)}%` }}
            >
              <span className="text-xs font-bold text-white">{newErr.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">
        That’s about <span className="font-bold text-emerald-700">{fewer}% fewer mistakes</span> for
        every 100 items the model looks at.
      </p>
    </div>
  )
}

function SpecChip({ Icon, label, oldVal, newVal, changed = true }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-white p-3.5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div>
        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <span className="text-slate-400 line-through decoration-slate-300">{oldVal}</span>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <span className={changed ? 'text-emerald-700' : 'text-slate-700'}>{newVal}</span>
        </div>
      </div>
    </div>
  )
}

function ModelCompareCard({ model }) {
  const { old, neu } = model
  const accDelta = (neu.acc - old.acc).toFixed(1)
  return (
    <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-card backdrop-blur sm:p-8">
      {/* Header + before → after accuracy */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <model.Icon className="h-6 w-6" />
          </span>
          <h2 className="font-display text-xl font-bold text-slate-900">{model.task}</h2>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-2.5">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-slate-400">{old.acc}%</div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">Before</div>
          </div>
          <ArrowRight className="h-5 w-5 text-emerald-500" />
          <div className="text-center">
            <div className="font-display text-2xl font-extrabold text-emerald-700">{neu.acc}%</div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-emerald-600">Now</div>
          </div>
          <span className="ml-1 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white">
            +{accDelta}
          </span>
        </div>
      </div>

      {/* Metric bars */}
      <div className="rounded-2xl border border-slate-100 bg-slate-50/40 p-5">
        {METRIC_KEYS.map((m) => (
          <MetricRow key={m.key} label={m.label} oldVal={old[m.key]} newVal={neu[m.key]} />
        ))}
      </div>

      {/* Mistakes per 100 items */}
      <MistakesCompare oldAcc={old.acc} newAcc={neu.acc} />

      {/* Spec chips */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <SpecChip Icon={Cpu} label="Architecture" oldVal="ResNet18" newVal="EfficientNetV2-S" />
        <SpecChip Icon={Layers} label="Categories" oldVal={old.classes} newVal={neu.classes} changed={old.classes !== neu.classes} />
        <SpecChip Icon={Scaling} label="Image size" oldVal={`${old.input}px`} newVal={`${neu.input}px`} />
        <SpecChip Icon={Images} label="Tested on" oldVal={`${old.evalImages.toLocaleString()} imgs`} newVal={`${neu.evalImages.toLocaleString()} imgs`} />
      </div>

      {/* Confusion matrices side by side */}
      <div className="mt-7 border-t border-slate-100 pt-6">
        <h4 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Confusion matrix — before vs. now
        </h4>
        <p className="mb-4 text-sm leading-relaxed text-slate-500">
          A brighter, cleaner diagonal means fewer mix-ups. The new model’s grid is almost perfectly
          diagonal{model.old.classes !== model.neu.classes ? ` — and it now covers ${model.neu.classes} categories instead of ${model.old.classes}.` : '.'}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            { src: model.confusionOld, tag: OLD_NAME, ring: 'border-slate-200' },
            { src: model.confusionNew, tag: NEW_NAME, ring: 'border-emerald-200' },
          ].map((m) => (
            <figure key={m.tag} className={`overflow-hidden rounded-2xl border ${m.ring} bg-white`}>
              <figcaption className="border-b border-slate-100 px-3 py-2 text-center text-xs font-semibold text-slate-500">
                {m.tag}
              </figcaption>
              <a href={m.src} target="_blank" rel="noopener noreferrer">
                <img src={m.src} alt={`${model.task} confusion matrix — ${m.tag}`} loading="lazy" className="w-full object-contain" />
              </a>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}

const TAKEAWAYS = [
  'Waste sorting jumped from 92% to 99.6% accuracy — that’s about 95% fewer mistakes.',
  'The new waste model recognizes 10 types of waste instead of just 4.',
  'Freshness kept its ~99% accuracy while being checked on 60× more photos (232 → 14,264), so the result is far more trustworthy on real-world images.',
  'Both models moved to the newer, stronger EfficientNetV2-S network and now look at images in higher resolution (224 → 384 px).',
]

export default function ModelComparison() {
  return (
    <div className="px-4 py-8 animate-fade-in-up">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/about"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to About
        </Link>

        <div className="mb-2 flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-soft">
            <Sparkles className="h-6 w-6" />
          </span>
          <h1 className="font-display text-3xl font-bold text-slate-900">Previous Versions</h1>
        </div>
        <p className="mb-6 max-w-2xl leading-relaxed text-slate-600">
          We recently retrained the app’s AI. Here’s a side-by-side look at the original models
          (<span className="font-semibold">ResNet18</span>) versus the ones running today
          (<span className="font-semibold">EfficientNetV2</span>) — so you can see exactly why the
          upgrade was worth it. Higher bars are better; longer red bars (mistakes) are worse.
        </p>

        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-white/60 bg-white/70 px-5 py-3 shadow-soft">
          <span className="text-sm font-semibold text-slate-500">Legend:</span>
          <VersionChip color="bg-slate-300" label={`${OLD_NAME} — the old model`} />
          <VersionChip color="bg-emerald-500" label={`${NEW_NAME} — the current model`} />
        </div>

        <div className="space-y-6">
          {COMPARISON.map((model) => (
            <ModelCompareCard key={model.task} model={model} />
          ))}
        </div>

        {/* Plain-language takeaways */}
        <div className="mt-6 rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 shadow-card sm:p-8">
          <h2 className="mb-4 font-display text-xl font-bold text-slate-900">The bottom line</h2>
          <ul className="space-y-3">
            {TAKEAWAYS.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="leading-relaxed text-slate-700">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

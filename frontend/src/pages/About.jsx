import { BarChart3, Recycle, Apple } from 'lucide-react'

const MODELS = [
  {
    name: 'Waste Classification',
    Icon: Recycle,
    accuracy: '92%',
    accent: {
      icon: 'text-emerald-600',
      pillBg: 'bg-emerald-50 border-emerald-100',
      pillLabel: 'text-emerald-600',
      pillValue: 'text-emerald-700',
    },
    classRows: [
      { label: 'Glass', precision: '0.93', recall: '0.91', f1: '0.92', support: '140' },
      { label: 'Metal', precision: '0.91', recall: '0.91', f1: '0.91', support: '140' },
      { label: 'Paper', precision: '0.95', recall: '0.96', f1: '0.96', support: '140' },
      { label: 'Plastic', precision: '0.90', recall: '0.91', f1: '0.90', support: '140' },
    ],
    summaryRows: [
      { label: 'Accuracy', precision: '—', recall: '—', f1: '0.92', support: '560' },
      { label: 'Macro avg', precision: '0.92', recall: '0.92', f1: '0.92', support: '560' },
      { label: 'Weighted avg', precision: '0.92', recall: '0.92', f1: '0.92', support: '560' },
    ],
    confusionSrc: '/metrics/confusion_matrix_waste.png',
    confusionAlt: 'Waste Classification — Confusion Matrix',
    confusionNote:
      'Predicted versus true labels across the four waste categories on the held-out test set. A strong diagonal indicates accurate, well-separated classes.',
  },
  {
    name: 'Freshness Detection',
    Icon: Apple,
    accuracy: '98%',
    accent: {
      icon: 'text-blue-600',
      pillBg: 'bg-blue-50 border-blue-100',
      pillLabel: 'text-blue-600',
      pillValue: 'text-blue-700',
    },
    classRows: [
      { label: 'Fresh', precision: '0.97', recall: '0.99', f1: '0.98', support: '116' },
      { label: 'Rotten', precision: '0.99', recall: '0.97', f1: '0.98', support: '116' },
    ],
    summaryRows: [
      { label: 'Accuracy', precision: '—', recall: '—', f1: '0.98', support: '232' },
      { label: 'Macro avg', precision: '0.98', recall: '0.98', f1: '0.98', support: '232' },
      { label: 'Weighted avg', precision: '0.98', recall: '0.98', f1: '0.98', support: '232' },
    ],
    confusionSrc: '/metrics/confusion_matrix_freshness.png',
    confusionAlt: 'Freshness Detection — Confusion Matrix',
    confusionNote:
      'Predicted versus true labels for the fresh and rotten classes on the held-out test set. The dominant diagonal reflects highly reliable predictions.',
  },
]

export default function About() {
  return (
    <div className="px-4 py-8 animate-fade-in-up">
      <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 font-display text-3xl font-bold text-slate-900">About the Project</h1>
      <div className="rounded-3xl border border-white/60 bg-white/85 p-8 shadow-card backdrop-blur">
        <h2 className="mb-4 font-display text-xl font-bold text-gradient-emerald">
          Smart Recycling and Food Waste Prevention System
        </h2>
        <p className="mb-6 leading-relaxed text-slate-600">
          This application leverages artificial intelligence to help users properly sort their recycling and identify the freshness of their food. By utilizing computer vision, we aim to reduce improper recycling and minimize food waste in households and businesses.
        </p>

        <h3 className="mb-3 text-lg font-semibold text-slate-800">Powered by Deep Learning</h3>
        <p className="mb-6 leading-relaxed text-slate-600">
          Under the hood, the system uses custom PyTorch ResNet18 models trained specifically for these tasks. Our models have achieved impressive real-world performance:
        </p>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-400/10 blur-2xl" />
            <div className="mb-1 text-sm font-semibold text-emerald-600">Waste Classification</div>
            <div className="font-display text-4xl font-extrabold text-emerald-700">92%</div>
            <div className="mt-1 text-sm text-emerald-600/80">Accuracy</div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-5">
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-400/10 blur-2xl" />
            <div className="mb-1 text-sm font-semibold text-blue-600">Freshness Detection</div>
            <div className="font-display text-4xl font-extrabold text-blue-700">98%</div>
            <div className="mt-1 text-sm text-blue-600/80">Accuracy</div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Created By</h3>
          <p className="font-semibold text-slate-800">Or Gabbay &amp; Daniel Yerichman</p>
        </div>
      </div>
      </div>

      <div className="mx-auto mt-8 max-w-4xl">
        <div className="mb-2 flex items-center gap-2.5 px-1">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-soft">
            <BarChart3 className="h-5 w-5" />
          </span>
          <h2 className="font-display text-2xl font-bold text-slate-900">Model Performance &amp; Metrics</h2>
        </div>
        <p className="mb-6 px-1 leading-relaxed text-slate-600">
          Each model was evaluated on a held-out test set. The tables report per-class
          precision, recall, F1-score, and support, while the confusion matrices visualize
          correct versus incorrect predictions. Click any chart to open it full size.
        </p>

        <div className="space-y-6">
          {MODELS.map((model) => (
            <div
              key={model.name}
              className="rounded-3xl border border-white/60 bg-white/85 p-8 shadow-card backdrop-blur"
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${model.accent.pillBg} ${model.accent.icon}`}>
                    <model.Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900">{model.name}</h3>
                </div>
                <div
                  className={`flex items-baseline gap-2 rounded-xl border px-4 py-2 ${model.accent.pillBg}`}
                >
                  <span className={`text-sm font-medium ${model.accent.pillLabel}`}>
                    Overall Accuracy
                  </span>
                  <span className={`font-display text-2xl font-extrabold ${model.accent.pillValue}`}>
                    {model.accuracy}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm tabular-nums">
                  <thead>
                    <tr className="border-b-2 border-slate-200 text-xs uppercase tracking-wider text-slate-500">
                      <th className="py-2 pr-4 text-left font-semibold">Class</th>
                      <th className="px-4 py-2 text-right font-semibold">Precision</th>
                      <th className="px-4 py-2 text-right font-semibold">Recall</th>
                      <th className="px-4 py-2 text-right font-semibold">F1-Score</th>
                      <th className="py-2 pl-4 text-right font-semibold">Support</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.classRows.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                      >
                        <td className="py-2.5 pr-4 text-left font-semibold text-slate-800">
                          {row.label}
                        </td>
                        <td className="px-4 py-2.5 text-right text-slate-700">{row.precision}</td>
                        <td className="px-4 py-2.5 text-right text-slate-700">{row.recall}</td>
                        <td className="px-4 py-2.5 text-right text-slate-700">{row.f1}</td>
                        <td className="py-2.5 pl-4 text-right text-slate-700">{row.support}</td>
                      </tr>
                    ))}
                    {model.summaryRows.map((row, index) => (
                      <tr
                        key={row.label}
                        className={`bg-slate-50/70 font-semibold text-slate-800 ${
                          index === 0 ? 'border-t-2 border-slate-200' : 'border-t border-slate-100'
                        }`}
                      >
                        <td className="py-2.5 pr-4 text-left">{row.label}</td>
                        <td className="px-4 py-2.5 text-right">{row.precision}</td>
                        <td className="px-4 py-2.5 text-right">{row.recall}</td>
                        <td className="px-4 py-2.5 text-right">{row.f1}</td>
                        <td className="py-2.5 pl-4 text-right">{row.support}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Confusion Matrix
                </h4>
                <a
                  href={model.confusionSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={model.confusionSrc}
                    alt={model.confusionAlt}
                    loading="lazy"
                    className="mx-auto w-full max-w-3xl rounded-xl border border-slate-100 bg-white object-contain transition-shadow hover:shadow-md"
                  />
                </a>
                <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-slate-500">
                  {model.confusionNote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

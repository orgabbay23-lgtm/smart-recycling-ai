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
    <div className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About the Project</h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-semibold text-emerald-700 mb-4">
          Smart Recycling and Food Waste Prevention System
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          This application leverages artificial intelligence to help users properly sort their recycling and identify the freshness of their food. By utilizing computer vision, we aim to reduce improper recycling and minimize food waste in households and businesses.
        </p>
        
        <h3 className="text-lg font-medium text-gray-800 mb-3">Powered by Deep Learning</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Under the hood, the system uses custom PyTorch ResNet18 models trained specifically for these tasks. Our models have achieved impressive real-world performance:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="text-emerald-600 text-sm font-medium mb-1">Waste Classification</div>
            <div className="text-3xl font-bold text-emerald-700">92%</div>
            <div className="text-emerald-600/80 text-sm mt-1">Accuracy</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="text-blue-600 text-sm font-medium mb-1">Freshness Detection</div>
            <div className="text-3xl font-bold text-blue-700">98%</div>
            <div className="text-blue-600/80 text-sm mt-1">Accuracy</div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 mt-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Created By</h3>
          <p className="text-gray-800 font-medium">Or Gabbay &amp; Daniel Yerichman</p>
        </div>
      </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6">
        <div className="flex items-center gap-2 mb-2 px-1">
          <BarChart3 className="h-6 w-6 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-900">Model Performance &amp; Metrics</h2>
        </div>
        <p className="text-gray-600 mb-6 px-1 leading-relaxed">
          Each model was evaluated on a held-out test set. The tables report per-class
          precision, recall, F1-score, and support, while the confusion matrices visualize
          correct versus incorrect predictions. Click any chart to open it full size.
        </p>

        <div className="space-y-6">
          {MODELS.map((model) => (
            <div
              key={model.name}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
            >
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <model.Icon className={`h-6 w-6 ${model.accent.icon}`} />
                  <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                </div>
                <div
                  className={`flex items-baseline gap-2 rounded-xl border px-4 py-2 ${model.accent.pillBg}`}
                >
                  <span className={`text-sm font-medium ${model.accent.pillLabel}`}>
                    Overall Accuracy
                  </span>
                  <span className={`text-2xl font-bold ${model.accent.pillValue}`}>
                    {model.accuracy}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm tabular-nums">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                      <th className="py-2 pr-4 text-left font-semibold">Class</th>
                      <th className="py-2 px-4 text-right font-semibold">Precision</th>
                      <th className="py-2 px-4 text-right font-semibold">Recall</th>
                      <th className="py-2 px-4 text-right font-semibold">F1-Score</th>
                      <th className="py-2 pl-4 text-right font-semibold">Support</th>
                    </tr>
                  </thead>
                  <tbody>
                    {model.classRows.map((row) => (
                      <tr
                        key={row.label}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-2.5 pr-4 text-left font-medium text-gray-800">
                          {row.label}
                        </td>
                        <td className="py-2.5 px-4 text-right text-gray-700">{row.precision}</td>
                        <td className="py-2.5 px-4 text-right text-gray-700">{row.recall}</td>
                        <td className="py-2.5 px-4 text-right text-gray-700">{row.f1}</td>
                        <td className="py-2.5 pl-4 text-right text-gray-700">{row.support}</td>
                      </tr>
                    ))}
                    {model.summaryRows.map((row, index) => (
                      <tr
                        key={row.label}
                        className={`bg-gray-50/70 font-medium text-gray-800 ${
                          index === 0 ? 'border-t-2 border-gray-200' : 'border-t border-gray-100'
                        }`}
                      >
                        <td className="py-2.5 pr-4 text-left">{row.label}</td>
                        <td className="py-2.5 px-4 text-right">{row.precision}</td>
                        <td className="py-2.5 px-4 text-right">{row.recall}</td>
                        <td className="py-2.5 px-4 text-right">{row.f1}</td>
                        <td className="py-2.5 pl-4 text-right">{row.support}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
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
                    className="w-full max-w-3xl mx-auto object-contain rounded-lg border border-gray-100 bg-white transition-shadow hover:shadow-md"
                  />
                </a>
                <p className="text-sm text-gray-500 mt-3 text-center max-w-2xl mx-auto leading-relaxed">
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

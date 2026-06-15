import { Link } from 'react-router-dom'
import { BarChart3, Recycle, Apple, Cpu, Database, SlidersHorizontal, History } from 'lucide-react'

const MODELS = [
  {
    name: 'Waste Classification',
    Icon: Recycle,
    accuracy: '99.6%',
    accent: {
      icon: 'text-emerald-600',
      pillBg: 'bg-emerald-50 border-emerald-100',
      pillLabel: 'text-emerald-600',
      pillValue: 'text-emerald-700',
    },
    classRows: [
      { label: 'Battery', precision: '1.000', recall: '0.998', f1: '0.999', support: '453' },
      { label: 'Biological', precision: '0.991', recall: '1.000', f1: '0.995', support: '419' },
      { label: 'Cardboard', precision: '0.997', recall: '0.998', f1: '0.997', support: '846' },
      { label: 'Clothes', precision: '0.999', recall: '1.000', f1: '1.000', support: '1135' },
      { label: 'Glass', precision: '0.997', recall: '0.998', f1: '0.998', support: '1041' },
      { label: 'Metal', precision: '0.991', recall: '0.995', f1: '0.993', support: '558' },
      { label: 'Paper', precision: '0.998', recall: '0.990', f1: '0.994', support: '801' },
      { label: 'Plastic', precision: '0.997', recall: '0.995', f1: '0.996', support: '958' },
      { label: 'Shoes', precision: '1.000', recall: '1.000', f1: '1.000', support: '869' },
      { label: 'Trash', precision: '0.978', recall: '0.978', f1: '0.978', support: '271' },
    ],
    summaryRows: [
      { label: 'Accuracy', precision: '—', recall: '—', f1: '0.996', support: '7351' },
      { label: 'Macro avg', precision: '0.995', recall: '0.995', f1: '0.995', support: '7351' },
      { label: 'Weighted avg', precision: '0.996', recall: '0.996', f1: '0.996', support: '7351' },
    ],
    confusionSrc: '/metrics/confusion_matrix_waste.png',
    confusionAlt: 'Waste Classification — Confusion Matrix',
    confusionNote:
      'Across all ten waste types, almost every image lands on the diagonal — the model very rarely mistakes one kind of waste for another.',
  },
  {
    name: 'Freshness Detection',
    Icon: Apple,
    accuracy: '98.8%',
    accent: {
      icon: 'text-blue-600',
      pillBg: 'bg-blue-50 border-blue-100',
      pillLabel: 'text-blue-600',
      pillValue: 'text-blue-700',
    },
    classRows: [
      { label: 'Fresh', precision: '0.988', recall: '0.994', f1: '0.991', support: '9469' },
      { label: 'Rotten', precision: '0.989', recall: '0.977', f1: '0.983', support: '4795' },
    ],
    summaryRows: [
      { label: 'Accuracy', precision: '—', recall: '—', f1: '0.988', support: '14264' },
      { label: 'Macro avg', precision: '0.988', recall: '0.986', f1: '0.987', support: '14264' },
      { label: 'Weighted avg', precision: '0.988', recall: '0.988', f1: '0.988', support: '14264' },
    ],
    confusionSrc: '/metrics/confusion_matrix_freshness.png',
    confusionAlt: 'Freshness Detection — Confusion Matrix',
    confusionNote:
      'The two bright squares on the diagonal show fresh and rotten being told apart cleanly, with only a handful of items ending up in the wrong box.',
  },
]

// Key training facts, taken straight from the Kaggle training notebooks.
const TRAINING_FACTS = [
  {
    Icon: Cpu,
    title: 'Architecture',
    body: 'We build on EfficientNetV2-S, which already comes pretrained on ImageNet. Then we swap in a fresh final layer to fit each task — 10 options for waste, 2 for freshness (fresh or rotten).',
  },
  {
    Icon: Database,
    title: 'Datasets',
    body: 'Waste: Garbage Classification v2 — about 36.7K images across 10 categories. Freshness: Food Freshness Dataset — about 71.3K images, fresh vs. rotten. For both, we used 80% of the images to train the model and saved 20% to test it, keeping every category evenly represented.',
  },
  {
    Icon: SlidersHorizontal,
    title: 'Optimization',
    body: 'Trained with the AdamW optimizer (learning rate 1e-4, weight decay 1e-4) and CrossEntropyLoss, on 384×384 images. We ran mixed precision (AMP) on an NVIDIA T4 GPU with a batch size of 32, plus light image tweaks (random resized crop, horizontal flip, color jitter) so the model handles new photos well.',
  },
  {
    Icon: BarChart3,
    title: 'Schedule',
    body: 'We trained for up to 50 passes over the data (epochs), but stopped early if the model went 7 rounds without improving — and always kept the best version. Waste finished at 99.6% and freshness at 98.8% validation accuracy.',
  },
]

// The real training loop, kept as a single code block. Lines carrying a `tag`
// are highlighted to mark the key idea happening on that line.
const TRAINING_CODE = [
  { code: '# EfficientNetV2-S transfer learning (per task)' },
  { code: 'weights = EfficientNet_V2_S_Weights.DEFAULT', tag: 'pretrained on ImageNet' },
  { code: 'model = models.efficientnet_v2_s(weights=weights)' },
  { code: 'model.classifier[1] = nn.Linear(', tag: 'swap head → our classes' },
  { code: '    model.classifier[1].in_features, num_classes)' },
  { code: '' },
  { code: 'criterion = nn.CrossEntropyLoss()' },
  { code: 'optimizer = optim.AdamW(model.parameters(),' },
  { code: '                        lr=1e-4, weight_decay=1e-4)' },
  { code: 'scaler = GradScaler("cuda")            # mixed precision on T4' },
  { code: '' },
  { code: 'for epoch in range(EPOCHS):            # EPOCHS = 50, early stop @ patience 7' },
  { code: '    for inputs, labels in train_loader:        # batch size 32, 384x384' },
  { code: '        optimizer.zero_grad(set_to_none=True)' },
  { code: '        with autocast("cuda"):' },
  { code: '            loss = criterion(model(inputs), labels)', tag: 'measure the error' },
  { code: '        scaler.scale(loss).backward()', tag: 'learn & improve' },
  { code: '        scaler.step(optimizer); scaler.update()' },
  { code: '    # keep the checkpoint with the lowest validation loss', tag: 'save best' },
]

// Plain-language, first-timer-friendly explanations of each metric column.
const METRIC_GUIDE = [
  {
    term: 'Precision',
    plain: 'When the model picks a category, how often it’s actually right — so it rarely raises a false alarm.',
  },
  {
    term: 'Recall',
    plain: 'Out of all the items that truly belong to a category, how many it managed to catch — so it rarely misses one.',
  },
  {
    term: 'F1-Score',
    plain: 'A single “report-card” grade that blends precision and recall into one easy number per category.',
  },
  {
    term: 'Support',
    plain: 'How many real test images that row is based on — the more images, the more trustworthy the score.',
  },
  {
    term: 'Accuracy',
    plain: 'The big picture: out of everything we tested, the share the model got right overall.',
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
          This app uses AI to help you sort your recycling the right way and check whether your food is still fresh. With a bit of computer vision, it recognizes what an item is and where it belongs — so less waste ends up in the wrong bin, and less good food gets thrown away at home or at work.
        </p>

        <h3 className="mb-3 text-lg font-semibold text-slate-800">Powered by Deep Learning</h3>
        <p className="mb-6 leading-relaxed text-slate-600">
          Behind the scenes, the app runs on <span className="font-semibold">EfficientNetV2-S</span> models built with PyTorch. We started with models that already knew how to read images, then retrained them for our two tasks — an approach called transfer learning. After learning from tens of thousands of photos, here’s how accurate they turned out to be:
        </p>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-400/10 blur-2xl" />
            <div className="mb-1 text-sm font-semibold text-emerald-600">Waste Classification</div>
            <div className="font-display text-4xl font-extrabold text-emerald-700">99.6%</div>
            <div className="mt-1 text-sm text-emerald-600/80">Accuracy · 10 categories</div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-5">
            <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-400/10 blur-2xl" />
            <div className="mb-1 text-sm font-semibold text-blue-600">Freshness Detection</div>
            <div className="font-display text-4xl font-extrabold text-blue-700">98.8%</div>
            <div className="mt-1 text-sm text-blue-600/80">Accuracy · fresh vs. rotten</div>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-6">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Created By</h3>
          <p className="font-semibold text-slate-800">Or Gabbay &amp; Daniel Yerichman</p>
        </div>
      </div>
      </div>

      {/* How we trained the models */}
      <div className="mx-auto mt-8 max-w-4xl">
        <div className="mb-2 flex items-center gap-2.5 px-1">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-soft">
            <Cpu className="h-5 w-5" />
          </span>
          <h2 className="font-display text-2xl font-bold text-slate-900">How We Trained the Models</h2>
        </div>
        <p className="mb-6 px-1 leading-relaxed text-slate-600">
          We trained both models on Kaggle using an NVIDIA T4 GPU. Rather than starting
          from zero, we began with EfficientNetV2-S models already trained on ImageNet
          (a giant image collection) and taught them our specific tasks. This shortcut —
          known as transfer learning — reaches high accuracy in a fraction of the time it
          would take to learn everything from scratch.
        </p>

        <div className="rounded-3xl border border-white/60 bg-white/85 p-8 shadow-card backdrop-blur">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {TRAINING_FACTS.map((fact) => (
              <div key={fact.title} className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <fact.Icon className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="mb-1 font-semibold text-slate-800">{fact.title}</h4>
                  <p className="text-sm leading-relaxed text-slate-600">{fact.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h4 className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Core Training Loop
            </h4>
            <p className="mb-4 text-sm leading-relaxed text-slate-500">
              This is the real training code. The highlighted lines point out the key step happening on each one.
            </p>
            <div className="overflow-x-auto rounded-2xl bg-slate-900 p-4 font-mono text-xs leading-relaxed sm:p-5 sm:text-sm">
              <div className="min-w-max">
                {TRAINING_CODE.map((line, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between gap-6 rounded px-2 ${
                      line.tag
                        ? 'border-l-2 border-emerald-400 bg-emerald-400/10'
                        : 'border-l-2 border-transparent'
                    }`}
                  >
                    <code className="whitespace-pre text-slate-100">{line.code || ' '}</code>
                    {line.tag && (
                      <span className="shrink-0 select-none rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                        {line.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance & metrics */}
      <div className="mx-auto mt-8 max-w-4xl">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-soft">
              <BarChart3 className="h-5 w-5" />
            </span>
            <h2 className="font-display text-2xl font-bold text-slate-900">Model Performance &amp; Metrics</h2>
          </div>
          <Link
            to="/previous-versions"
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700 shadow-soft transition-colors hover:bg-emerald-100"
          >
            <History className="h-4 w-4" />
            Previous Versions
          </Link>
        </div>
        <p className="mb-6 px-1 leading-relaxed text-slate-600">
          We tested each model on images it had never seen during training. For every
          category, the tables below show its precision, recall, F1-score, and support —
          and the confusion matrices reveal where the model got things right and where it
          slipped up. Click any chart to open it full size.
        </p>

        {/* First-timer-friendly legend for the metric columns */}
        <div className="mb-6 rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 shadow-card">
          <h3 className="mb-4 font-semibold text-slate-800">
            New to these numbers? Here’s the plain-English version 👇
          </h3>
          <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
            {METRIC_GUIDE.map((m) => (
              <div key={m.term} className="flex gap-2.5">
                <dt className="shrink-0 font-semibold text-emerald-700">{m.term}</dt>
                <dd className="text-sm leading-relaxed text-slate-600">{m.plain}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 border-t border-emerald-100 pt-4 text-sm text-slate-500">
            Every score runs from 0 to 1.00 — the closer to{' '}
            <span className="font-semibold text-slate-700">1.00</span>, the better
            (e.g. 0.99 means right about 99% of the time).
          </p>
        </div>

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
                <div className="mx-auto mt-4 max-w-2xl rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                  <p className="mb-2">
                    <span className="font-semibold text-slate-700">How to read this 👀</span> — each{' '}
                    <span className="font-semibold">row</span> is what the item truly is, and each{' '}
                    <span className="font-semibold">column</span> is what the model guessed. The diagonal
                    running from the top-left to the bottom-right is every correct answer, so a bright,
                    solid diagonal is exactly what we want. Any number off that line is an occasional mix-up.
                  </p>
                  <p>{model.confusionNote}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

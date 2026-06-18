import { useState } from 'react'
import {
  Code2, ChevronDown, Brain, Layers, ArrowRight, Repeat, Images, Target,
  Save, Crop, FlipHorizontal, Palette, Camera, FolderTree, Check,
} from 'lucide-react'

/* ------------------------------------------------------------------ *
 * Every snippet below is copied verbatim from our real Kaggle training
 * notebook (models/new_models_efficientnetv2/..). Lines we skipped for
 * readability are shown as a dimmed "⋯". Nothing here is made up.
 * ------------------------------------------------------------------ */

// ---- tiny, dependency-free Python highlighter (display only) -------------
const KEYWORDS = new Set([
  'for', 'in', 'with', 'if', 'else', 'elif', 'while', 'return', 'def', 'class',
  'import', 'from', 'as', 'try', 'except', 'finally', 'and', 'or', 'not', 'is',
  'None', 'True', 'False', 'lambda', 'pass', 'break', 'continue', 'global',
  'assert', 'del', 'yield', 'raise',
])
const BUILTINS = new Set([
  'range', 'len', 'print', 'open', 'enumerate', 'sorted', 'list', 'dict', 'set',
  'tuple', 'int', 'float', 'str', 'min', 'max', 'sum', 'abs', 'zip', 'map', 'super',
])
const TOKEN_COLOR = {
  comment: 'text-slate-500 italic',
  string: 'text-emerald-300',
  number: 'text-amber-300',
  keyword: 'text-violet-300',
  builtin: 'text-sky-300',
  name: 'text-slate-100',
  punct: 'text-slate-400',
}

function tokenize(line) {
  const tokens = []
  const re = /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\.?\d*(?:e-?\d+)?\b)|([A-Za-z_]\w*)|(\s+)|([^\s])/g
  let m
  while ((m = re.exec(line)) !== null) {
    if (m[1]) tokens.push(['comment', m[1]])
    else if (m[2]) tokens.push(['string', m[2]])
    else if (m[3]) tokens.push(['number', m[3]])
    else if (m[4]) {
      const w = m[4]
      const type = KEYWORDS.has(w) ? 'keyword' : BUILTINS.has(w) ? 'builtin' : 'name'
      tokens.push([type, w])
    } else if (m[5]) tokens.push(['space', m[5]])
    else tokens.push(['punct', m[6]])
  }
  return tokens
}

function Highlighted({ line }) {
  return (
    <>
      {tokenize(line).map(([type, text], i) =>
        type === 'space'
          ? text
          : <span key={i} className={TOKEN_COLOR[type]}>{text}</span>,
      )}
    </>
  )
}

// ---- the dark code block, with a left gutter that numbers marked lines ----
function CodeBlock({ lines }) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-slate-900 p-3 sm:p-4">
      <div className="min-w-max font-mono text-xs leading-relaxed sm:text-[0.82rem]">
        {lines.map((line, i) => {
          if (line.ellipsis) {
            return (
              <div key={i} className="border-l-2 border-transparent">
                <span className="select-none pl-8 text-slate-600">⋯</span>
              </div>
            )
          }
          return (
            <div
              key={i}
              className={`flex items-start rounded-r px-1 ${
                line.mark
                  ? 'border-l-2 border-emerald-400 bg-emerald-400/10'
                  : 'border-l-2 border-transparent'
              }`}
            >
              <span className="mr-2 mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center">
                {line.mark && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-slate-900">
                    {line.mark}
                  </span>
                )}
              </span>
              <code className="whitespace-pre">
                <Highlighted line={line.code} />
              </code>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---- "what the highlighted lines mean" callout list -----------------------
function Notes({ notes }) {
  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li key={note.n} className="flex gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white">
            {note.n}
          </span>
          <p className="text-sm leading-relaxed text-slate-600">
            <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.78rem] text-slate-700">
              {note.code}
            </code>{' '}
            — {note.text}
          </p>
        </li>
      ))}
    </ul>
  )
}

/* ----------------------------- visualizations ---------------------------- */
function Chip({ Icon, label, tone = 'emerald' }) {
  const tones = {
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    slate: 'border-slate-200 bg-slate-50 text-slate-600',
    sky: 'border-sky-200 bg-sky-50 text-sky-700',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold ${tones[tone]}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  )
}

function ModelVisual() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-3 py-2.5">
        <Brain className="mb-1 h-4 w-4 text-emerald-600" />
        <div className="text-xs font-bold text-slate-800">EfficientNetV2-S</div>
        <div className="text-[11px] text-slate-500">already trained on millions of ImageNet photos</div>
      </div>
      <ArrowRight className="h-5 w-5 text-slate-400" />
      <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/70 px-3 py-2.5">
        <Layers className="mb-1 h-4 w-4 text-amber-600" />
        <div className="text-xs font-bold text-slate-800">New final layer</div>
        <div className="text-[11px] text-slate-500">10 waste types · or fresh / rotten</div>
      </div>
    </div>
  )
}

function TrainVisual() {
  return (
    <div className="space-y-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <Chip Icon={Images} label="A batch of photos" tone="slate" />
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <Chip Icon={Brain} label="Model guesses" />
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <Chip Icon={Target} label="Measure the error" tone="amber" />
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <Chip Icon={Repeat} label="Adjust & improve" />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <Repeat className="h-3.5 w-3.5 text-emerald-500" />
        Repeat for every batch, up to 50 full passes
        <span className="mx-1 text-slate-300">|</span>
        <Chip Icon={Save} label="Keep the best version" tone="emerald" />
      </div>
    </div>
  )
}

function DataVisual() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Chip Icon={Camera} label="1 photo" tone="slate" />
      <ArrowRight className="h-4 w-4 text-slate-400" />
      <div className="flex flex-wrap gap-2">
        <Chip Icon={Crop} label="Zoom" />
        <Chip Icon={FlipHorizontal} label="Mirror" />
        <Chip Icon={Palette} label="Re-light" />
      </div>
      <ArrowRight className="h-4 w-4 text-slate-400" />
      <span className="text-xs font-semibold text-slate-600">many views, same label</span>
    </div>
  )
}

function DiscoverVisual() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-slate-600">
        <div className="mb-1 flex items-center gap-1.5 font-sans text-xs font-semibold text-slate-500">
          <FolderTree className="h-3.5 w-3.5" /> dataset folders
        </div>
        <div><span className="text-slate-400 line-through">TRAIN/</span>glass</div>
        <div><span className="text-slate-400 line-through">TEST/</span>glass</div>
        <div><span className="text-slate-400 line-through">TRAIN/</span>metal</div>
      </div>
      <ArrowRight className="h-5 w-5 text-slate-400" />
      <div className="flex flex-wrap gap-2">
        <Chip Icon={Check} label="glass" />
        <Chip Icon={Check} label="metal" />
        <span className="self-center text-xs text-slate-400">…</span>
      </div>
    </div>
  )
}

/* ------------------------------- the data -------------------------------- */
const EXAMPLES = [
  {
    id: 'model',
    tab: 'The model',
    Icon: Brain,
    source: 'Step 4 · Build the model',
    title: 'Start from a model that already knows how to see',
    blurb:
      'Instead of teaching a model from a blank slate, we take EfficientNetV2-S — already trained on millions of labelled photos — and replace just its last layer so it answers our question.',
    Visual: ModelVisual,
    code: [
      { code: 'weights = EfficientNet_V2_S_Weights.DEFAULT   # needs Internet ON the first time', mark: 1 },
      { code: 'model = models.efficientnet_v2_s(weights=weights)' },
      { code: 'model.classifier[1] = nn.Linear(model.classifier[1].in_features, num_classes)', mark: 2 },
      { ellipsis: true },
      { code: 'criterion = nn.CrossEntropyLoss()', mark: 3 },
      { code: 'optimizer = optim.AdamW(model.parameters(), lr=LEARNING_RATE, weight_decay=WEIGHT_DECAY)', mark: 4 },
    ],
    notes: [
      { n: 1, code: 'EfficientNet_V2_S_Weights.DEFAULT', text: 'load the version already trained on ImageNet, so it starts out knowing edges, shapes and textures.' },
      { n: 2, code: 'model.classifier[1] = nn.Linear(...)', text: 'swap only the final layer, so the model now chooses between our categories (10 for waste, 2 for freshness) instead of ImageNet’s 1,000.' },
      { n: 3, code: 'CrossEntropyLoss()', text: 'the “grade” that measures how wrong each guess was.' },
      { n: 4, code: 'AdamW(...)', text: 'the optimizer that nudges the model’s settings so it makes fewer mistakes next time.' },
    ],
  },
  {
    id: 'train',
    tab: 'Training loop',
    Icon: Repeat,
    source: 'Step 5 · Training loop',
    title: 'Guess, measure the mistake, improve — over and over',
    blurb:
      'This is the heart of training. The model looks at a batch of photos, sees how far off its guesses were, and adjusts itself a little. Repeat thousands of times and it gets good.',
    Visual: TrainVisual,
    code: [
      { code: 'for epoch in range(EPOCHS):', mark: 1 },
      { code: '    model.train()' },
      { ellipsis: true },
      { code: '    for inputs, labels in train_loader:', mark: 2 },
      { code: '        inputs = inputs.to(device, non_blocking=True)' },
      { code: '        labels = labels.to(device, non_blocking=True)' },
      { code: '        optimizer.zero_grad(set_to_none=True)' },
      { code: '        with amp_ctx():' },
      { code: '            outputs = model(inputs)' },
      { code: '            loss = criterion(outputs, labels)', mark: 3 },
      { code: '        scaler.scale(loss).backward()', mark: 4 },
      { code: '        scaler.step(optimizer)' },
      { code: '        scaler.update()' },
      { ellipsis: true },
      { code: '    if val_loss < best_val_loss:', mark: 5 },
      { code: '        best_model_wts = copy.deepcopy(model.state_dict())' },
      { code: '        torch.save({ … }, MODEL_SAVE_PATH)' },
    ],
    notes: [
      { n: 1, code: 'for epoch in range(EPOCHS)', text: 'go over the whole photo collection up to 50 times. Training stops early if 7 rounds pass with no improvement.' },
      { n: 2, code: 'for inputs, labels in train_loader', text: 'work through the photos in small batches of 32 at a time.' },
      { n: 3, code: 'loss = criterion(outputs, labels)', text: 'compare the model’s guesses to the right answers and measure the error.' },
      { n: 4, code: 'scaler.scale(loss).backward()', text: 'trace that error back through the model so it can adjust. (scaler is mixed-precision — it makes this run faster on the GPU.)' },
      { n: 5, code: 'if val_loss < best_val_loss', text: 'after each round, only keep the version that does best on photos it didn’t train on — saved as a self-describing checkpoint.' },
    ],
  },
  {
    id: 'data',
    tab: 'Photo prep',
    Icon: Images,
    source: 'Step 3 · Image transforms',
    title: 'Turn one photo into many, so the model learns the object',
    blurb:
      'Every time the model sees a training photo, we tweak it slightly. From one picture it effectively sees many — so it learns the item itself, not the exact snapshot, and copes better with real-world photos.',
    Visual: DataVisual,
    code: [
      { code: 'train_tf = transforms.Compose([' },
      { code: '    transforms.RandomResizedCrop(IMG_SIZE, scale=(0.65, 1.0)),', mark: 1 },
      { code: '    transforms.RandomHorizontalFlip(),', mark: 2 },
      { code: '    transforms.ColorJitter(0.2, 0.2, 0.2),', mark: 3 },
      { code: '    transforms.ToTensor(),' },
      { code: '    transforms.Normalize(MEAN, STD),', mark: 4 },
      { code: '])' },
    ],
    notes: [
      { n: 1, code: 'RandomResizedCrop', text: 'zoom into a random part each time, so the model isn’t thrown off by where the item sits or how close it is.' },
      { n: 2, code: 'RandomHorizontalFlip', text: 'sometimes mirror the photo left-to-right.' },
      { n: 3, code: 'ColorJitter', text: 'nudge brightness, contrast and colour a little, mimicking different lighting.' },
      { n: 4, code: 'Normalize(MEAN, STD)', text: 'put the pixel values on the same scale the pretrained model expects.' },
    ],
  },
  {
    id: 'discover',
    tab: 'Reading folders',
    Icon: FolderTree,
    source: 'Step 2 · Discover classes',
    title: 'Figure out what each photo is — the key fix',
    blurb:
      'Before any learning happens, the code has to know each photo’s category. This little routine was the fix that brought the models back to life after an earlier version learned something meaningless.',
    Visual: DiscoverVisual,
    code: [
      { code: 'def discover_samples(base_dir):' },
      { code: '    samples = []' },
      { code: '    for root, dirs, files in os.walk(base_dir):' },
      { ellipsis: true },
      { code: '        cls = os.path.basename(root)', mark: 1 },
      { code: '        if cls.lower() in SPLIT_NAMES:   # images directly inside a split/wrapper -> not a class', mark: 2 },
      { code: '            continue' },
      { code: '        for f in imgs:' },
      { code: '            samples.append((os.path.join(root, f), cls))', mark: 3 },
      { code: '    return samples' },
    ],
    notes: [
      { n: 1, code: 'cls = os.path.basename(root)', text: 'a photo’s category is simply the name of the folder it sits in — so …/TRAIN/glass and …/TEST/glass both become “glass”, merging the split automatically.' },
      { n: 2, code: 'if cls.lower() in SPLIT_NAMES', text: 'skip generic wrapper folders like “train” or “test” so they’re never mistaken for a real category. (The old model broke exactly here — it had learned “is this a train or a test photo”, which is meaningless.)' },
      { n: 3, code: 'samples.append(...)', text: 'collect every photo paired with its real category, ready for training.' },
    ],
  },
]

/* ------------------------------ the component ---------------------------- */
export default function CodeExamples() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const ex = EXAMPLES[active]

  return (
    <div className="mt-8 border-t border-slate-100 pt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-left transition-colors hover:bg-emerald-100/70"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-soft">
            <Code2 className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-semibold text-slate-800">View Code Examples</span>
            <span className="block text-sm text-slate-500">Real snippets from our training notebook, explained simply</span>
          </span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-emerald-600 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="mt-4 animate-fade-in-up">
          {/* snippet picker */}
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((e, i) => (
              <button
                key={e.id}
                type="button"
                onClick={() => setActive(i)}
                className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-semibold transition-colors ${
                  i === active
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-soft'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <e.Icon className="h-4 w-4" />
                {e.tab}
              </button>
            ))}
          </div>

          {/* active snippet */}
          <div key={ex.id} className="mt-4 animate-fade-in rounded-2xl border border-slate-100 bg-white p-5 shadow-soft">
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-600">{ex.source}</div>
            <h5 className="mb-1.5 font-display text-lg font-bold text-slate-900">{ex.title}</h5>
            <p className="mb-4 text-sm leading-relaxed text-slate-600">{ex.blurb}</p>

            {/* visualization */}
            <div className="mb-4 rounded-2xl bg-slate-50 p-4">
              <ex.Visual />
            </div>

            {/* real code */}
            <CodeBlock lines={ex.code} />

            {/* per-line explanations */}
            <div className="mt-4 rounded-2xl bg-emerald-50/50 p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                What the highlighted lines do
              </div>
              <Notes notes={ex.notes} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Loader2, AlertCircle, Check, X, Trophy, ArrowRight, Sparkles } from 'lucide-react'
import Button from '../components/Button'
import { API_URL } from '../services/api'

// Bin options for waste questions. `categories` lists the dataset labels that
// belong in each bin, so we can score an answer and explain the right one.
const WASTE_OPTIONS = [
  { id: 'orange', label: 'Orange Bin', sub: 'Plastic / Metal', categories: ['plastic', 'metal'] },
  { id: 'blue', label: 'Blue Bin', sub: 'Paper', categories: ['paper'] },
  { id: 'purple', label: 'Purple Bin', sub: 'Glass', categories: ['glass'] },
]

const FOOD_OPTIONS = [
  { id: 'fresh', label: 'Fresh', sub: 'Safe to eat', categories: ['fresh'] },
  { id: 'rotten', label: 'Rotten', sub: 'Discard or compost', categories: ['rotten'] },
]

function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text
}

export default function Quiz() {
  const [question, setQuestion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [score, setScore] = useState({ correct: 0, total: 0 })

  async function loadQuestion() {
    setLoading(true)
    setError(null)
    setSelectedId(null)
    try {
      const res = await fetch(`${API_URL}/quiz/random`)
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.detail || 'Failed to load question')
      }
      setQuestion(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadQuestion()
  }, [])

  const options = question?.item_type === 'waste' ? WASTE_OPTIONS : FOOD_OPTIONS
  const correctOption = question
    ? options.find((opt) => opt.categories.includes(question.correct_answer))
    : null
  const answered = selectedId !== null
  const isCorrect = answered && correctOption?.id === selectedId

  function handleAnswer(optionId) {
    if (answered) return // lock in the first choice
    setSelectedId(optionId)
    const correct = correctOption?.id === optionId
    setScore((prev) => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }))
  }

  function optionClasses(option) {
    if (!answered) {
      return 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50'
    }
    if (option.id === correctOption?.id) {
      return 'border-emerald-300 bg-emerald-50 ring-2 ring-emerald-200'
    }
    if (option.id === selectedId) {
      return 'border-red-300 bg-red-50 ring-2 ring-red-200'
    }
    return 'border-slate-200 bg-white opacity-50'
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-fade-in-up">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2.5 font-display text-3xl font-bold text-slate-900">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-soft">
            <Sparkles className="h-6 w-6" />
          </span>
          Sorting Quiz
        </h1>
        <div className="flex items-center gap-2 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-2.5">
          <Trophy className="h-5 w-5 text-amber-500" />
          <span className="font-semibold text-amber-700 tabular-nums">
            Correct: {score.correct} / {score.total}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-16 text-slate-500">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p>Loading question...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-white/60 bg-white/80 py-16 text-center shadow-card backdrop-blur">
          <AlertCircle className="h-10 w-10 text-red-500" />
          <p className="text-lg font-semibold text-slate-800">Could not load the quiz</p>
          <p className="text-sm text-slate-500">{error}</p>
          <Button onClick={loadQuestion} variant="secondary" className="mt-2">
            Try Again
          </Button>
        </div>
      ) : question ? (
        <div className="rounded-3xl border border-white/60 bg-white/85 p-6 shadow-card backdrop-blur sm:p-8">
          <p className="mb-4 text-center text-slate-600">
            {question.item_type === 'waste'
              ? 'Which bin does this item belong in?'
              : 'Is this fruit fresh or rotten?'}
          </p>

          <div className="mb-6 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
            <img
              src={`data:image/jpeg;base64,${question.image_base64}`}
              alt="Quiz item"
              className="mx-auto h-64 w-full object-contain"
            />
          </div>

          <div
            className={`grid gap-3 ${
              question.item_type === 'waste' ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
            }`}
          >
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswer(option.id)}
                disabled={answered}
                className={`relative flex flex-col items-center gap-1 rounded-2xl border-2 p-4 text-center transition-all duration-200 disabled:cursor-default ${optionClasses(
                  option,
                )}`}
              >
                <span className="font-display text-base font-bold text-slate-800">{option.label}</span>
                <span className="text-xs text-slate-500">{option.sub}</span>
                {answered && option.id === correctOption?.id && (
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
                    <Check className="h-4 w-4" />
                  </span>
                )}
                {answered && option.id === selectedId && option.id !== correctOption?.id && (
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow">
                    <X className="h-4 w-4" />
                  </span>
                )}
              </button>
            ))}
          </div>

          {answered && (
            <div
              className={`mt-5 rounded-2xl border p-4 text-sm ${
                isCorrect
                  ? 'border-emerald-100 bg-emerald-50 text-emerald-800'
                  : 'border-red-100 bg-red-50 text-red-800'
              }`}
            >
              <p className="flex items-center gap-2 font-semibold">
                {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                {isCorrect ? 'Correct!' : 'Not quite!'}
              </p>
              <p className="mt-1 leading-relaxed">
                This is <span className="font-semibold capitalize">{question.correct_answer}</span>
                {question.item_type === 'waste'
                  ? `, which goes in the ${correctOption?.label} (${correctOption?.sub}).`
                  : '.'}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-center">
            <Button
              onClick={loadQuestion}
              disabled={!answered}
              className="inline-flex items-center gap-2"
            >
              Next Question
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

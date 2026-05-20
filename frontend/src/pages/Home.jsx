import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="mt-6 flex flex-col items-center gap-8 sm:mt-14">
      <div className="flex flex-col items-center gap-3 text-center animate-fade-in-up">
        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="text-gradient-emerald">What would you like to scan?</span>
        </h1>
        <p className="text-lg text-slate-500">Choose a mode to get started</p>
      </div>

      <div className="mt-2 grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
        <Link
          to="/recycle"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/30 animate-fade-in-up"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col items-center gap-3 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-4xl ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              ♻️
            </span>
            <span className="font-display text-xl font-bold">Recycle Scan</span>
            <span className="text-sm text-emerald-50/90">Identify waste type and get recycling tips</span>
            <span className="mt-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 transition-all duration-300 group-hover:bg-white/25">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>

        <Link
          to="/freshness"
          className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-white shadow-xl shadow-amber-500/20 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/30 animate-fade-in-up"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/15 blur-2xl transition-transform duration-500 group-hover:scale-150" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex flex-col items-center gap-3 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-4xl ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              🍎
            </span>
            <span className="font-display text-xl font-bold">Freshness Scan</span>
            <span className="text-sm text-amber-50/90">Check if your fruit is fresh or rotten</span>
            <span className="mt-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/25 transition-all duration-300 group-hover:bg-white/30">
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}

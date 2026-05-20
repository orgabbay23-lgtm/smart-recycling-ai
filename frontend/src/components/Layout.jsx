import { Link, NavLink, Outlet } from 'react-router-dom'
import { Leaf } from 'lucide-react'

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-emerald-50 text-emerald-700'
      : 'text-slate-500 hover:bg-emerald-50/70 hover:text-emerald-700'
  }`

export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute -right-20 top-44 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-glow-emerald transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-gradient-emerald">
              Smart Recycling AI
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <NavLink to="/history" className={navLinkClass}>
              History
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </div>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10">
        <Outlet />
      </main>
    </div>
  )
}

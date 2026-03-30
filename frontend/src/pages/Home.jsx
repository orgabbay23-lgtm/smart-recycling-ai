import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 mt-12">
      <h1 className="text-4xl font-bold text-gray-800">What would you like to scan?</h1>
      <p className="text-gray-500 text-lg">Choose a mode to get started</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg mt-4">
        <Link
          to="/recycle"
          className="flex flex-col items-center gap-3 rounded-xl bg-emerald-600 p-8 text-white shadow-md hover:bg-emerald-700 transition-colors"
        >
          <span className="text-4xl">♻️</span>
          <span className="text-xl font-semibold">Recycle Scan</span>
          <span className="text-emerald-100 text-sm text-center">Identify waste type and get recycling tips</span>
        </Link>

        <Link
          to="/freshness"
          className="flex flex-col items-center gap-3 rounded-xl bg-amber-500 p-8 text-white shadow-md hover:bg-amber-600 transition-colors"
        >
          <span className="text-4xl">🍎</span>
          <span className="text-xl font-semibold">Freshness Scan</span>
          <span className="text-amber-100 text-sm text-center">Check if your fruit is fresh or rotten</span>
        </Link>
      </div>
    </div>
  )
}

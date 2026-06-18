// Single source of truth for the backend API base URL.
//
// - In production, set VITE_API_URL (e.g. in Vercel's environment variables)
//   to your deployed FastAPI backend, such as https://your-backend.onrender.com
// - Locally, it falls back to the FastAPI dev server on http://localhost:8000
//
// Every page imports API_URL from here, so the backend address only ever
// needs to be changed in one place.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

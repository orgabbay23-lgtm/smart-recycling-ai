#!/usr/bin/env bash
#
# Smart Recycling AI - start backend (FastAPI) and frontend (Vite) together.
# Both run in the background; output is written to backend.log and frontend.log.
# Press Ctrl+C to stop both.

# Run from the directory this script lives in, so it works when called from anywhere.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Activate the Python virtual environment if it exists (Unix layout).
if [ -f "venv/bin/activate" ]; then
  source venv/bin/activate
fi

echo "============================================"
echo "  Smart Recycling AI - Starting servers"
echo "============================================"
echo

# Backend is run from the project root so that "backend.main:app" imports resolve.
echo "Starting FastAPI backend (http://localhost:8000)..."
python -m uvicorn backend.main:app --reload > backend.log 2>&1 &
BACKEND_PID=$!

echo "Starting Vite frontend (http://localhost:3000)..."
(cd frontend && npm run dev) > frontend.log 2>&1 &
FRONTEND_PID=$!

echo
echo "Both servers are starting."
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "Logs:      backend.log and frontend.log"
echo "Press Ctrl+C to stop both servers."

# Kill both child processes when this script is interrupted or terminated.
trap 'echo; echo "Stopping servers..."; kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null; exit 0' INT TERM

# Keep the script alive so the background servers keep running.
wait

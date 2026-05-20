@echo off
echo ============================================
echo   Smart Recycling AI - Starting servers
echo ============================================
echo.

echo Starting FastAPI backend (http://localhost:8000)...
start "Smart Recycling AI - Backend" cmd /k "cd /d "%~dp0" && call venv\Scripts\activate.bat && python -m uvicorn backend.main:app --reload"

echo Starting Vite frontend (http://localhost:3000)...
start "Smart Recycling AI - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo The app will be available at http://localhost:3000
echo (Backend API at http://localhost:8000)
echo.
echo You can close this window. Closing the server windows stops the servers.
pause

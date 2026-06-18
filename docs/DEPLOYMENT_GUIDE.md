# 🚀 Deployment Guide

How the project would go online. For the academic demo we run it **locally**
(simplest and most reliable), but here is the recommended path to the web and
the reasons behind it.

---

## Recommended setup

```
   Browser
      │
      ▼
  Frontend (React)            Backend (FastAPI + PyTorch)
  hosted on Vercel    ───►    hosted on Render / Railway / Fly.io / Cloud Run
                                   │
                                   ▼
                              Model .pth files  +  database
```

| Part | Where to host | Why |
|---|---|---|
| **Frontend** (React/Vite) | **Vercel** | Built for static front-ends; free tier; instant deploys from Git. |
| **Backend** (FastAPI) | **Render**, **Railway**, **Fly.io**, or **Google Cloud Run** | These run a normal long-lived Python server, which is what we need to keep the model loaded in memory. |

---

## Why NOT run the backend as a Vercel serverless function

It's tempting to put everything on Vercel, but the backend is a bad fit for
serverless here:

1. **PyTorch + torchvision are heavy.** They blow past typical serverless size
   limits and make cold starts slow.
2. **The model files are large** (tens of MB each). Loading them on every cold
   start is slow and wasteful; a serverless function may not even fit them.
3. **SQLite is local-only.** Serverless functions have a temporary,
   non-persistent filesystem, so a local SQLite history file would be wiped
   between invocations. That's not suitable for production data.

A normal always-on server (Render/Railway/Fly/Cloud Run) loads the model **once**
at startup and keeps it ready — much better for an AI backend.

---

## Frontend configuration

The frontend reads the backend address from a single environment variable.
It's defined in one place: [`frontend/src/services/api.js`](../frontend/src/services/api.js).

- **In production**, set this in your Vercel project settings:
  ```
  VITE_API_URL=https://your-backend-url
  ```
  (for example `https://smart-recycling-ai.onrender.com`)

- **Locally**, you don't need to set anything. If `VITE_API_URL` is missing, the
  app falls back to:
  ```
  http://localhost:8000
  ```

> Vite only exposes variables that start with `VITE_`, which is why it's
> `VITE_API_URL` and not just `API_URL`.

---

## Backend configuration

- **CORS** is already open (`allow_origins=["*"]` in
  [`backend/main.py`](../backend/main.py)) so the hosted frontend can call it.
  For a real production deployment you'd narrow this to your frontend's domain.
- **Start command** on the host:
  ```
  uvicorn backend.main:app --host 0.0.0.0 --port $PORT
  ```
- **Dependencies** come from [`requirements.txt`](../requirements.txt).
- **Model files** must be present at the paths in
  [`backend/config.py`](../backend/config.py). Because the `.pth` files aren't in
  Git, you either upload them with the deploy, pull them from cloud storage on
  startup, or use a host that lets you attach large files.

---

## What to do about scan history in production

The history/statistics features use a local **SQLite** file
(`backend/scan_history.db`). That's perfect for a local demo but not for a
shared, always-on production service. Pick one:

| Option | When to use | What it means |
|---|---|---|
| **Keep it local** (default) | The academic demo | Run everything on your laptop; history just works. |
| **Disable it for production** | Quick public demo, no data needed | Skip the `record_scan` call / hide History & Statistics. |
| **Use hosted Postgres** | A "real" deployment | Replace the SQLite calls in [`backend/database.py`](../backend/database.py) with a hosted database (e.g. Render Postgres, Supabase, Neon). Same table, different storage. |

For this project, **keeping it local for the demo is the recommended and
expected choice.**

---

## Suggested deployment steps (high level)

1. Push the repo to GitHub.
2. **Backend:** create a service on Render/Railway → point it at the repo → set
   the start command above → make sure the `.pth` files are available → note the
   public URL.
3. **Frontend:** import the repo into Vercel → set the root to `frontend/` →
   add `VITE_API_URL` = your backend URL → deploy.
4. Open the Vercel URL and run a scan to confirm the two are talking.

---

## For the demo: just run it locally

You do **not** need any of the above to present. Local is simpler and avoids
network surprises. See the README "Run it locally" section or just use
`start_app.bat` (Windows) / `start_app.sh` (Mac/Linux).

[![CI](https://github.com/Dtzul04/Magnifit/actions/workflows/ci.yml/badge.svg)](https://github.com/Dtzul04/Magnifit/actions/workflows/ci.yml)

# Magnifit

**Live demo:** [magnifit.vercel.app](https://magnifit.vercel.app/)

A full-stack workout tracker (Magnify + Fitness) built with React, Express, and TypeScript.

Track workouts by name, type, duration, and date — with full create, read, update, and delete.

The live demo uses an **in-memory mock store**. Data resets when the API restarts. PostgreSQL is optional if you run your own copy.

## How data works

| Mode | When | Notes |
| ---- | ---- | ----- |
| **Mock (default)** | `USE_MOCK=true` or no `DATABASE_URL` | In-memory list in `apps/api/src/store/workouts.ts`. No database. Live demo uses this. |
| **PostgreSQL (optional)** | `USE_MOCK=false` + `DATABASE_URL` | Real SQL (Supabase or any Postgres). Same API and UI. |

## Tech stack

| Layer | Tools |
| ----- | ----- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Data | Mock store (default) or PostgreSQL |

## Features

- View all workouts and filter by type
- Add, edit, and delete workouts
- REST CRUD API
- Loading, empty, and error states in the UI

## Project structure

```
Magnifit/
├── apps/
│   ├── api/                 # Express API → Render (root directory: apps/api)
│   │   ├── src/
│   │   │   ├── index.ts     # HTTP: CORS, routes, status codes
│   │   │   └── store/workouts.ts  # Mock or Postgres
│   │   └── db/schema.sql    # Optional Postgres table
│   └── web/                 # Vite + React → Vercel (root directory: apps/web)
├── .github/workflows/ci.yml
└── README.md
```

`dist/` is build output (`tsc` / `vite build`). Do not commit it. Delete the folder anytime; `npm run build` or a deploy recreates it.

## Local setup (mock — fastest)

Use **two terminals**. There is no `package.json` at the repo root.

**API** (`http://localhost:3001`):

```bash
cd apps/api
cp .env.example .env
npm install
npm run dev
```

**Web** (`http://localhost:5173`):

```bash
cd apps/web
cp .env.example .env
npm install
npm run dev
```

You should see seed workouts with no database.

## Optional: PostgreSQL

The live demo does **not** need this. Use it if you want data to persist.

1. Create a Supabase project (or local Postgres).
2. In the SQL editor, run `apps/api/db/schema.sql`.
3. In `apps/api/.env`:

```env
USE_MOCK=false
DATABASE_URL=your_session_pooler_uri
FRONTEND_URL=http://localhost:5173
```

4. Prefer the Supabase **Session pooler** URI. URL-encode special characters in the password (`!` → `%21`).
5. Restart the API. The UI stays the same.

On Render, set `USE_MOCK` and `DATABASE_URL` on the **API** service, not on Vercel.

## Environment variables

| Variable | Where | Description |
| -------- | ----- | ----------- |
| `USE_MOCK` | API | `true` = in-memory store (demo default) |
| `DATABASE_URL` | API | Postgres URI (only if `USE_MOCK=false`) |
| `FRONTEND_URL` | API | Frontend origin for CORS (e.g. Vercel URL) |
| `PORT` | API | Server port (default `3001`) |
| `VITE_API_URL` | Web | Backend API URL |

## API endpoints

| Method | Route | Description |
| ------ | ----- | ----------- |
| GET | `/api/workouts` | List all workouts |
| GET | `/api/workouts?type=X` | Filter by type |
| POST | `/api/workouts` | Create a workout |
| PUT | `/api/workouts/:id` | Update a workout |
| DELETE | `/api/workouts/:id` | Delete a workout |

## Deploy

### Frontend (Vercel)

1. Import the repo → root directory `apps/web`
2. Build: `npm run build` · Output: `dist`
3. Env: `VITE_API_URL` = your API URL (e.g. `https://magnifit-api.onrender.com`)

### Backend (Render)

Web Service, root directory `apps/api`:

1. Build: `npm install && npm run build` · Start: `npm start`
2. Live demo env: `USE_MOCK=true` and `FRONTEND_URL=https://magnifit.vercel.app`
3. Optional Postgres: `USE_MOCK=false` + `DATABASE_URL`

The Vercel site is only the UI. Set `USE_MOCK` on the API service.

## Pull requests (how this repo ships)

GitHub **does not** update `main` just because you commit locally. A **pull request (PR)** is a reviewable request: “merge this branch into `main`.”

That only works if the work is on a **branch**, not committed straight to `main`.

Typical flow:

1. `git checkout -b some-feature` (or keep using an existing branch)
2. Commit and `git push -u origin HEAD`
3. Open a PR on GitHub: base `main` ← compare your branch
4. Wait for CI (the `api` and `web` jobs)
5. Merge. Then `main` (and Vercel/Render) update

Day-to-day work stays on a feature branch. Open a PR into `main`; do not push feature commits straight to `main`.

## Author

Daniel — full-stack development practice project.

## License

ISC

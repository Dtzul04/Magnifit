# Magnifit

**Live demo:** [magnifit.vercel.app](https://magnifit.vercel.app/)

A full-stack workout tracker (Magnify + Fitness) built with React, Express, and TypeScript.

Track workouts by name, type, duration, and date — with full create, read, update, and delete support.

## How data works

| Mode | When | Notes |
| ---- | ---- | ----- |
| **Mock (default)** | `USE_MOCK=true` or no `DATABASE_URL` | In-memory store in `src/store/workouts.ts`. No database setup. Live demo uses this. Data resets when the API server restarts. |
| **PostgreSQL (optional)** | `USE_MOCK=false` + `DATABASE_URL` | Real SQL via Supabase (or any Postgres). For local practice or your own deploy. |

Same REST API and frontend either way.

## Tech Stack

| Layer    | Tools                                |
| -------- | ------------------------------------ |
| Frontend | React, TypeScript, Tailwind CSS, Vite |
| Backend  | Node.js, Express, TypeScript         |
| Data     | Mock store (default) or PostgreSQL   |

## Features

- View all workouts
- Filter by type
- Add, edit, and delete workouts
- Full CRUD REST API
- Loading, empty, and error states in the UI

## Project Structure

```
Magnifit/
├── src/
│   ├── index.ts          # Express API (mock or Postgres)
│   └── store/workouts.ts # In-memory mock CRUD
├── frontend/             # React app (Vite) → deploys to Vercel
├── .env.example
└── README.md
```

## Local Setup (mock — fastest)

```bash
cp .env.example .env
# USE_MOCK=true is already set in .env.example

npm install
npm run dev
```

API: `http://localhost:3001`

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App: `http://localhost:5173`

You should see seed workouts with no database.

## Optional: PostgreSQL

1. Create a Supabase project (or local Postgres)
2. Run:

```sql
CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  workout_date DATE NOT NULL
);
```

3. In `.env`:

```env
USE_MOCK=false
DATABASE_URL=your_session_pooler_uri
FRONTEND_URL=http://localhost:5173
```

4. Prefer Supabase **Session pooler** URI; URL-encode special chars in the password (`!` → `%21`).

## Environment Variables

| Variable       | Where    | Description                                      |
| -------------- | -------- | ------------------------------------------------ |
| `USE_MOCK`     | Backend  | `true` = in-memory store (default for demo)      |
| `DATABASE_URL` | Backend  | Postgres URI (only if `USE_MOCK=false`)          |
| `FRONTEND_URL` | Backend  | Frontend origin for CORS (e.g. Vercel URL)       |
| `PORT`         | Backend  | Server port (default `3001`)                     |
| `VITE_API_URL` | Frontend | Backend API URL                                  |

## API Endpoints

| Method | Route                  | Description        |
| ------ | ---------------------- | ------------------ |
| GET    | `/api/workouts`        | List all workouts  |
| GET    | `/api/workouts?type=X` | Filter by type     |
| POST   | `/api/workouts`        | Create a workout   |
| PUT    | `/api/workouts/:id`    | Update a workout   |
| DELETE | `/api/workouts/:id`    | Delete a workout   |

## Deploy

### Frontend (Vercel)

1. Import repo → root directory `frontend`
2. Build: `npm run build` · Output: `dist`
3. Env: `VITE_API_URL` = your API URL (e.g. `https://magnifit-api.onrender.com`)

### Backend (API host)

Express still runs as a Node server (e.g. Render Web Service):

1. Build: `npm install && npm run build` · Start: `npm start`
2. Env for the **live demo**:
   - `USE_MOCK=true`
   - `FRONTEND_URL=https://magnifit.vercel.app`
3. Optional Postgres: `USE_MOCK=false` + `DATABASE_URL`

> The Vercel site is the UI. Set `USE_MOCK` on the **API** service, not in the frontend env.

## Author

Daniel — full-stack development practice project.

# Magnifit

**Live demo:** [magnifit.vercel.app](https://magnifit.vercel.app/)

A full-stack workout tracker (Magnify + Fitness) built with React, Express, TypeScript, and PostgreSQL.

Track workouts by name, type, duration, and date — with full create, read, update, and delete support.

## Tech Stack

| Layer    | Tools                           |
| -------- | ------------------------------- |
| Frontend | React, TypeScript, Tailwind CSS, Vite |
| Backend  | Node.js, Express, TypeScript    |
| Database | PostgreSQL (Supabase)           |

## Features

- View all workouts
- Filter by type (Cardio, Strength, Flexibility, Sports)
- Add, edit, and delete workouts
- Full CRUD REST API
- Loading, empty, and error states in the UI

## Project Structure

```
Magnifit/
├── src/index.ts          # Express API (backend)
├── frontend/             # React app (Vite)
│   └── src/
│       ├── App.tsx       # Main UI
│       ├── api/          # fetch calls to backend
│       └── types/        # TypeScript interfaces
├── .env.example          # Backend env template
└── README.md
```

## Database Schema

**Table: `workouts`**

| Column         | Type    | Notes                    |
| -------------- | ------- | ------------------------ |
| `id`           | SERIAL  | Primary key (auto)       |
| `name`         | TEXT    | Workout name             |
| `type`         | TEXT    | e.g. Cardio, Strength    |
| `duration`     | INTEGER | Duration in minutes      |
| `workout_date` | DATE    | When the workout happened |

**Example SQL** (run in Supabase SQL Editor):

```sql
CREATE TABLE workouts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  workout_date DATE NOT NULL
);
```

## Local Setup

### 1. Database (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the `CREATE TABLE` SQL above (+ optional seed `INSERT`s)
3. In **Connect** → choose **Session pooler** → copy the URI
4. Create `.env` from `.env.example` and paste your URI
5. URL-encode special characters in the password (`!` → `%21`, `#` → `%23`, `$` → `%24`)

> Use **Session pooler**, not Direct connection — Direct often fails on home networks.

### 2. Backend

```bash
cp .env.example .env
# Edit .env: DATABASE_URL, FRONTEND_URL=http://localhost:5173

npm install
npm run dev
```

Runs at `http://localhost:3001`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:3001 (default)

npm install
npm run dev
```

Runs at `http://localhost:5173`

**Keep both servers running** while developing.

## Environment Variables

| Variable       | Where    | Description                          |
| -------------- | -------- | ------------------------------------ |
| `DATABASE_URL` | Backend  | Supabase Session pooler URI          |
| `FRONTEND_URL` | Backend  | Frontend origin for CORS             |
| `PORT`         | Backend  | Server port (default `3001`)         |
| `VITE_API_URL` | Frontend | Backend URL (default `localhost:3001`) |

## API Endpoints

| Method | Route                  | Description        |
| ------ | ---------------------- | ------------------ |
| GET    | `/api/workouts`        | List all workouts  |
| GET    | `/api/workouts?type=X` | Filter by type     |
| POST   | `/api/workouts`        | Create a workout   |
| PUT    | `/api/workouts/:id`    | Update a workout   |
| DELETE | `/api/workouts/:id`    | Delete a workout   |

## Deploy

### Backend (Render)

1. Connect GitHub repo → new **Web Service**
2. Root directory: `/` (project root)
3. Build: `npm install && npm run build`
4. Start: `npm start`
5. Env vars: `DATABASE_URL`, `FRONTEND_URL` (your Vercel URL)

### Frontend (Vercel)

1. Import repo → set root directory to `frontend`
2. Build: `npm run build`
3. Output: `dist`
4. Env var: `VITE_API_URL` (your Render backend URL, e.g. `https://magnifit-api.onrender.com`)

## Author

Daniel — full-stack development practice project.

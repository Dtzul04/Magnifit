# Magnifit

> **Work in progress** — database setup complete; backend and frontend coming next.

A workout tracker app (Magnify + Fitness) built to practice full-stack development.

## Tech Stack

| Layer    | Tools                          |
| -------- | ------------------------------ |
| Frontend | React, TypeScript, Tailwind CSS |
| Backend  | Node.js, Express, TypeScript   |
| Database | PostgreSQL (Supabase)          |

## Database Schema

**Table: `workouts`**

| Column        | Type    | Notes                    |
| ------------- | ------- | ------------------------ |
| `id`          | SERIAL  | Primary key (auto)       |
| `name`        | TEXT    | Workout name             |
| `type`        | TEXT    | e.g. Cardio, Strength    |
| `duration`    | INTEGER | Duration in minutes      |
| `workout_date`| DATE    | When the workout happened |

Row Level Security (RLS) is **disabled** for development.

## Setup

### Database (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL in `database/` (or your saved SQL) in the Supabase SQL Editor
3. Confirm seed data in **Table Editor**

> **Note:** Do not commit database passwords or API keys. Use environment variables when the backend is added.

### Backend

```bash
# TBD
npm install
npm run dev
```

### Frontend

```bash
# TBD
npm install
npm run dev
```

## Author

Daniel — learning full-stack development.

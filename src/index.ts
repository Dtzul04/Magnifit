// Magnifit Backend — Express API + PostgreSQL (Supabase)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

// Load secrets from .env (DATABASE_URL, etc.) into process.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Render sets PORT in production
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS: browser blocks requests from localhost:5173 → localhost:3001 unless we allow it
app.use(cors({ origin: FRONTEND_URL }));

// Parses JSON request bodies so req.body works on POST/PUT (like express.json() reading fetch body)
app.use(express.json());

// Pool = reusable connection group to Postgres (better than opening a new connection every request)
// ssl required for Supabase; Session pooler URI goes in DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// --- HEALTH CHECK (Render pings this) ---
app.get('/', (_req, res) => {
  res.json({ status: 'Magnifit API running' });
});

// GET /api/workouts          → all workouts
// GET /api/workouts?type=Cardio → WHERE type = 'Cardio' (same SQL you practiced in Session 1)
app.get('/api/workouts', async (req, res) => {
  try {
    const { type } = req.query;

    const { rows } = type
      ? await pool.query('SELECT * FROM workouts WHERE type = $1 ORDER BY workout_date DESC', [type])
      : await pool.query('SELECT * FROM workouts ORDER BY workout_date DESC');

    res.json(rows); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/workouts with JSON body { name, type, duration, workout_date }
app.post('/api/workouts', async (req, res) => {
  try {
    const { name, type, duration, workout_date } = req.body;

    if (!name || !type || !duration || !workout_date) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const { rows } = await pool.query(
      `INSERT INTO workouts (name, type, duration, workout_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, type, duration, workout_date]
    );

    res.status(201).json(rows[0]); // 201 = "Created"
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/workouts/5 → update workout with id 5
app.put('/api/workouts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, duration, workout_date } = req.body;

    const { rows } = await pool.query(
      `UPDATE workouts
       SET name = $1, type = $2, duration = $3, workout_date = $4
       WHERE id = $5
       RETURNING *`,
      [name, type, duration, workout_date, id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a workout /api/workouts/5 → remove workout with id 5
app.delete('/api/workouts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      'DELETE FROM workouts WHERE id = $1 RETURNING *',
      [id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

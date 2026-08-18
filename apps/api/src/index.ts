// Magnifit Backend — Express API + PostgreSQL (Supabase)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import {
  getWorkouts, 
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from './store/workouts';

const useMock = process.env.USE_MOCK === 'true' || !process.env.DATABASE_URL;

// Load secrets from .env (DATABASE_URL, etc.) into process.env
dotenv.config();

// initialize express app
const app = express();
const PORT = process.env.PORT || 3001; // Render sets PORT in production
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Allowed origins for CORS
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

app.use(cors({
  origin(origin, callback) {
    // non-browser tools (curl, Postman) send no Origin
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
}));

// Parses JSON request bodies so req.body works on POST/PUT (like express.json() reading fetch body)
app.use(express.json());

// Pool = reusable connection group to Postgres (better than opening a new connection every request)
const pool = useMock
  ? null
  : new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'Magnifit API running' });
});

// Get /api/workouts → all workouts
app.get('/api/workouts', async (req, res) => {
  const { type } =  req.query as {type?: string};
  const rows = await getWorkouts(type);
  res.json(rows);
});

// POST /api/workouts with JSON body { name, type, duration, workout_date }
app.post('/api/workouts', async (req, res) => {
  // Creat workout if using mock data
  if (useMock) {
    const { name, type, duration, workout_date} = req.body;
    if (!name || !type || !duration || !workout_date) {
      res.status(400).json({ error: 'All field are required' });
      return;
    }
    const row = createWorkout({name, type, duration, workout_date });
    res.status(201).json(row);
    return;
  }

  // Check if database connection is established
  if (!pool) {
    res.status(500).json({ error: 'Database connectioncannot be established'});
    return;
  }

  // Create workout if using PostgreSQL
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
  // Use Id to update workout if using mock data
  const { id } = req.params;

  // Update workout using mock data
  if (useMock) {
    const updated = updateWorkout(Number(id), req.body);
    if  (!updated) {
      res.status(404).json({ error: 'Workout not found'});
      return;
    } else {
      res.json(updated);
      return;
    }
  }

  // Check if database connection is established
  if (!pool) {
    res.status(500).json({ error: 'Database connection cannot be established'});
    return;
  }

  // Update workout if using PostgreSQL
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

  // Use Id to delete workout if using mock data
  const { id } = req.params;

  // Delete workout using mock data
  if (useMock) {
    const deleted = deleteWorkout(Number(id));
    if (!deleted) {
      res.status(404).json({ error: 'Workout not found'});
      return;
    } else {
      res.json(deleted);
      return;
    }
  }

  // Check if database connection is established
  if (!pool) {
    res.status(500).json({ error: 'Database connection cannot be established'});
    return;
  }

  // Delete workout if using PostgreSQL
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
  console.log(useMock ? 'Using mock workout store' : 'Using PostgreSQL');
});

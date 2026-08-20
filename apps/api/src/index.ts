// Magnifit Backend — Express API + PostgreSQL (Supabase) or mock data
import express from 'express';
import cors from 'cors';
import {
  getWorkouts, 
  createWorkout,
  updateWorkout,
  deleteWorkout,
} from './store/workouts';

const app = express();
const PORT = process.env.PORT || 3001; 
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Configure allowed origins
const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

// Configure CORS
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
}));

app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.json({ status: 'Magnifit API running' });
});

// GET /api/workouts [type]
app.get('/api/workouts', async (req, res) => {
  const { type } =  req.query as {type?: string};
  const rows = await getWorkouts(type);
  res.json(rows);
});

// POST /api/workouts with JSON body [name, type, duration, workout_date]
app.post('/api/workouts', async (req, res) => {
  const { name, type, duration, workout_date } = req.body;

  if (!name || !type || !duration || !workout_date) {
    res.status(400).json({ error: 'All fields are required'});
    return;
  }

  const row = await createWorkout({name, type, duration, workout_date});
  res.status(201).json(row);
});

// PUT /api/workouts/[id] with ID and JSON body [name, type, duration, workout_date]
app.put('/api/workouts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, duration, workout_date } = req.body;

  if (!name || !type || !duration || !workout_date) {
    res.status(400).json({ error: 'All fields are required'});
    return;
  }

  const updated = await updateWorkout(Number(id), 
  { name, 
    type, 
    duration, 
    workout_date 
  });

  if (!updated) {
    res.status(404).json({ error: 'Workout not found'})
    return;
  } else {
    res.json(updated);
  }
});

// DELETE /api/workouts/[id] with ID
app.delete('/api/workouts/:id', async (req, res) => {
  const { id } = req.params;

  const deleted = await deleteWorkout(Number(id));
  if (!deleted) {
    res.status(404).json({ error: 'Workout not found'});
    return;
  }
  res.json(deleted);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

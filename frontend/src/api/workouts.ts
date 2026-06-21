// API layer — all HTTP calls to the Express backend live here
import type { Workout, WorkoutFormData } from '../types/workout';

// Vite env var; defaults to local backend. Set VITE_API_URL in production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// GET /api/workouts (optional ?type= filter)
export async function fetchWorkouts(type?: string): Promise<Workout[]> {
  const url = type
    ? `${API_URL}/api/workouts?type=${encodeURIComponent(type)}`
    : `${API_URL}/api/workouts`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch workouts');
  return res.json(); // parse JSON body into Workout[]
}

// POST /api/workouts
export async function createWorkout(data: WorkoutFormData): Promise<Workout> {
  const res = await fetch(`${API_URL}/api/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data), // convert JS object → JSON string for the server
  });
  if (!res.ok) throw new Error('Failed to create workout');
  return res.json();
}

// UPDATE — PUT /api/workouts/:id
export async function updateWorkout(id: number, data: WorkoutFormData): Promise<Workout> {
  const res = await fetch(`${API_URL}/api/workouts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update workout');
  return res.json();
}

// DELETE — DELETE /api/workouts/:id
export async function deleteWorkout(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/workouts/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete workout');
}

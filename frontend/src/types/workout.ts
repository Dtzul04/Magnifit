// TypeScript shapes that mirror your Postgres "workouts" table (Session 1 schema)
// Think of Workout interface ≈ one row from SELECT * FROM workouts

export interface Workout {
  id: number;
  name: string;
  type: string;
  duration: number;
  workout_date: string; // comes from API as ISO date string e.g. "2026-06-20T05:00:00.000Z"
}

// Form data = same fields but no id (server generates id on INSERT)
export type WorkoutFormData = Omit<Workout, 'id'>;

// Shared list of types for dropdowns (add + edit + filter)
export const WORKOUT_TYPES = ['Cardio', 'Strength', 'Flexibility', 'Sports'] as const;

// Default values when opening the "Add Workout" form
export const emptyForm: WorkoutFormData = {
  name: '',
  type: 'Cardio',
  duration: 30,
  workout_date: new Date().toISOString().split('T')[0], // today's date as YYYY-MM-DD
};

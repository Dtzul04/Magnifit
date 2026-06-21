// Workout type
export interface Workout {
  id: number;
  name: string;
  type: string;
  duration: number;
  workout_date: string;
}

// Form data = same fields but no id
export type WorkoutFormData = Omit<Workout, 'id'>;

// Shared list of types for dropdowns (add, edit, filter)
export const WORKOUT_TYPES = ['Cardio', 'Strength', 'Flexibility', 'Sports'] as const;

// Default values when opening the "Add Workout" form
export const emptyForm: WorkoutFormData = {
  name: '',
  type: 'Cardio',
  duration: 30,
  workout_date: new Date().toISOString().split('T')[0],
};

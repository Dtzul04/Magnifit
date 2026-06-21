import WorkoutForm from './WorkoutForm';
import { WORKOUT_TYPES, type Workout, type WorkoutFormData } from '../types/workout';

// Props for WorkoutList component
type Props = {
  workouts: Workout[];
  loading: boolean;
  error: string;
  filter: string;
  editingId: number | null;
  onFilterChange: (type: string) => void;
  onEdit: (id: number) => void;
  onCancelEdit: () => void;
  onUpdate: (id: number, data: WorkoutFormData) => Promise<void>;
  onDelete: (id: number) => void;
};

// WorkoutList component
export default function WorkoutList({
  workouts,
  loading,
  error,
  filter,
  editingId,
  onFilterChange,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
}: Props) {
  return (
    // Main workout list section
    <section className="card">
      <div className="list-header">
        <h2>Your Workouts</h2>
        <select value={filter} onChange={(e) => onFilterChange(e.target.value)}>
          <option value="">All types</option>
          {WORKOUT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Loading, error, and no workouts messages */}
      {loading && <p className="message">Loading workouts...</p>}
      {!loading && error && <p className="message error">{error}</p>}
      {!loading && !error && workouts.length === 0 && (
        <p className="message">No workouts yet. Add one above!</p>
      )}

      {/* Workout list */}
      <ul className="workout-list">
        {workouts.map((workout) => (
          <li key={workout.id}>
            {editingId === workout.id ? (
              <WorkoutForm
                initial={{
                  name: workout.name,
                  type: workout.type,
                  duration: workout.duration,
                  workout_date: workout.workout_date.split('T')[0],
                }}
                submitLabel="Save"
                onSubmit={(data) => onUpdate(workout.id, data)}
                onCancel={onCancelEdit}
              />
            ) : (
              // Workout row
              <div className="workout-row">
                <div>
                  <h3>{workout.name}</h3>
                  <p>{workout.type} · {workout.duration} min · {workout.workout_date.split('T')[0]}</p>
                </div>
                <div className="workout-actions">
                  <button type="button" onClick={() => onEdit(workout.id)}>Edit</button>
                  <button type="button" className="btn-danger" onClick={() => onDelete(workout.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

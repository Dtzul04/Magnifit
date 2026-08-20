import { useEffect, useState } from 'react';
import { createWorkout, deleteWorkout, fetchWorkouts, updateWorkout } from './api/workouts';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import { emptyForm, type Workout, type WorkoutFormData } from './types/workout';

function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  async function loadWorkouts() {
    setLoading(true);
    setError('');
    try {
      setWorkouts(await fetchWorkouts(filter || undefined));
    } catch {
      setError('Could not load workouts. Is the backend running?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkouts();
  }, [filter]);

  async function handleCreate(data: WorkoutFormData) {
    try {
      await createWorkout(data);
      await loadWorkouts();
    } catch (error) {
      setError('Failed to create workout');
    }
  }

  async function handleUpdate(id: number, data: WorkoutFormData) {
    try {
    await updateWorkout(id, data);
    setEditingId(null);
    await loadWorkouts();
    } catch (error) {
      setError('Failed to update workout');
    }
  }

  async function handleDelete(id: number) {
    try {
      if (!confirm('Delete this workout?')) return;
      await deleteWorkout(id);
      await loadWorkouts();
    } catch (error) {
      setError('Failed to delete workout');
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Magnifit</h1>
        <p>Track your workouts</p>
      </header>

      <main>
        <section className="card">
          <h2>Add Workout</h2>
          <WorkoutForm initial={emptyForm} submitLabel="Add Workout" onSubmit={handleCreate} />
        </section>

        <WorkoutList
          workouts={workouts}
          loading={loading}
          error={error}
          filter={filter}
          editingId={editingId}
          onFilterChange={setFilter}
          onEdit={setEditingId}
          onCancelEdit={() => setEditingId(null)}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;

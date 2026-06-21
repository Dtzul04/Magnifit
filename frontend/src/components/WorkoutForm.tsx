import { useState } from 'react';
import { WORKOUT_TYPES, type WorkoutFormData } from '../types/workout';

type Props = {
  initial: WorkoutFormData;
  submitLabel: string;
  onSubmit: (data: WorkoutFormData) => Promise<void>;
  onCancel?: () => void;
};

export default function WorkoutForm({ initial, submitLabel, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState(initial);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="form-grid">
      <label>
        Name
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </label>

      <label>
        Type
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          {WORKOUT_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>

      <label>
        Duration (min)
        <input
          required
          type="number"
          min={1}
          value={form.duration}
          onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
        />
      </label>

      <label>
        Date
        <input
          required
          type="date"
          value={form.workout_date}
          onChange={(e) => setForm({ ...form, workout_date: e.target.value })}
        />
      </label>

      <div className="form-actions">
        <button type="submit">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

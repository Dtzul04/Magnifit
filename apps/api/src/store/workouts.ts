import { Pool } from 'pg';

const useMock = process.env.USE_MOCK === 'true' || !process.env.DATABASE_URL;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// workout type
export type Workout = {
    id: number;
    name: string;
    type: string;
    duration: number;
    workout_date: string;
};

// mock workouts data
let workouts: Workout[] = [
    {
        id: 1,
        name: "Ab Workout",
        type: "Ab",
        duration: 30,
        workout_date: "2026-01-01",
    },
    {
        id: 2,
        name: "Bicep Workout",
        type: "Bicep",
        duration: 30,
        workout_date: "2026-01-02",
    },
    {
        id: 3,
        name: "Chest Workout",
        type: "Chest",
        duration: 30,
        workout_date: "2026-01-03",
    }
    
];

let nextId = 4;

// get all workouts or filter by type
export async function getWorkouts(type?: string): Promise<Workout[]> {
    if (useMock) {
        if (!type) {
            return [...workouts];
        }
        return workouts.filter((w) => w.type === type);
    }

    if (!type) {
        const result = await pool.query('SELECT * FROM workouts ORDER BY workout_date DESC');
        return result.rows;
    } else {
        const result = await pool.query('SELECT * FROM workouts WHERE type = $1 ORDER BY workout_date DESC', [type]);
        return result.rows;
    }
}

// create a new workout
export function createWorkout(data: {
    name: string;
    type: string;
    duration: number;
    workout_date: string;
}): Workout {
    const workout: Workout = {
        id: nextId++,
        name: data.name,
        type: data.type,
        duration: data.duration,
        workout_date: data.workout_date,
    }
    workouts.push(workout);
    return workout;
}

// update a workout
export function updateWorkout(id: number, data: {
    name: string;
    type: string;
    duration: number;
    workout_date: string;
}): Workout | null {
    const index = workouts.findIndex((w) => w.id === id);
    if (index === -1) {    
        return null;
    }
    workouts[index] = {id, ...data }
    return workouts[index];
}

export function deleteWorkout(id: number): Workout | null {
    const index = workouts.findIndex((w) => w.id === id);

    if (index ===-1) {
        return null;
    }
    const [removed] = workouts.splice(index, 1);
    return removed;
}
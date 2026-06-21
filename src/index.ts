// Import the necessary modules
import express from 'express';
import dotenv from 'dotenv';
import  { Pool } from 'pg';

dotenv.config();

// Create the express app
const app = express();
app.use(express.json());

// Create the database pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});


// Get all workouts
app.get('/api/workouts', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM workouts');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json( {
            error: 'Internal server error',
        });
    }
});


// Create a new workout
app.post('/api/workouts', async (req, res) => {
    try {
        const { name, type, duration, workout_date } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO workouts (name, type, duration, workout_date) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
            `,
            [name, type, duration, workout_date]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});


// Start the server
app.listen(3001, () => {
    console.log('Server running on 3001');
})


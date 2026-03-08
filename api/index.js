require('dotenv').config();
const express = require('express');
const cors = require('cors');
const schoolRoutes = require('../routes/schoolRoutes');
const { initializeDatabase } = require('../models/schoolModel');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', schoolRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'School Management API is running.' });
});

// Initialize DB table on cold start
let dbInitialized = false;
const ensureDb = async () => {
    if (!dbInitialized) {
        await initializeDatabase();
        dbInitialized = true;
    }
};

// Wrap with DB init for serverless
const handler = async (req, res) => {
    await ensureDb();
    return app(req, res);
};

module.exports = handler;

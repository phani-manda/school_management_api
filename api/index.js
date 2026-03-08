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

// Initialize DB table on cold start
let dbInitialized = false;
app.use(async (req, res, next) => {
    try {
        if (!dbInitialized) {
            await initializeDatabase();
            dbInitialized = true;
        }
        next();
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database initialization failed.' });
    }
});

// Routes
app.use('/', schoolRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'School Management API is running.' });
});

module.exports = app;

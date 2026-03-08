require('dotenv').config();
const express = require('express');
const cors = require('cors');
const schoolRoutes = require('./routes/schoolRoutes');
const { initializeDatabase } = require('./models/schoolModel');

const app = express();
const PORT = process.env.PORT || 3000;

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

// Initialize DB then start server
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to initialize database:', err.message);
        process.exit(1);
    });

module.exports = app;

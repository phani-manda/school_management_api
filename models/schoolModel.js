const pool = require('../config/db');

/**
 * Initialize the database: create the database and the schools table if they don't exist.
 */
async function initializeDatabase() {
    // Create the schools table using the pool
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS schools (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(255) NOT NULL,
            latitude FLOAT NOT NULL,
            longitude FLOAT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    await pool.query(createTableQuery);
    console.log('Database and schools table initialized successfully.');
}

module.exports = { initializeDatabase };

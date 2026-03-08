const pool = require('../config/db');

/**
 * Add a new school to the database.
 */
async function addSchool(req, res) {
    try {
        const { name, address, latitude, longitude } = req.body;

        // --- Input Validation ---
        const errors = [];

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            errors.push('name is required and must be a non-empty string.');
        }

        if (!address || typeof address !== 'string' || address.trim().length === 0) {
            errors.push('address is required and must be a non-empty string.');
        }

        if (latitude === undefined || latitude === null || latitude === '') {
            errors.push('latitude is required.');
        } else if (isNaN(parseFloat(latitude)) || parseFloat(latitude) < -90 || parseFloat(latitude) > 90) {
            errors.push('latitude must be a valid number between -90 and 90.');
        }

        if (longitude === undefined || longitude === null || longitude === '') {
            errors.push('longitude is required.');
        } else if (isNaN(parseFloat(longitude)) || parseFloat(longitude) < -180 || parseFloat(longitude) > 180) {
            errors.push('longitude must be a valid number between -180 and 180.');
        }

        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        // --- Insert into Database ---
        const insertQuery = `
            INSERT INTO schools (name, address, latitude, longitude)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.query(insertQuery, [
            name.trim(),
            address.trim(),
            parseFloat(latitude),
            parseFloat(longitude),
        ]);

        return res.status(201).json({
            success: true,
            message: 'School added successfully.',
            data: {
                id: result.insertId,
                name: name.trim(),
                address: address.trim(),
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
            },
        });
    } catch (error) {
        console.error('Error adding school:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

/**
 * Calculate distance between two coordinates using the Haversine formula (returns km).
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * List all schools sorted by proximity to the user's location.
 */
async function listSchools(req, res) {
    try {
        let userLat, userLon;
        const { id, latitude, longitude } = req.query;

        if (id) {
            // Look up coordinates from an existing school by ID
            const [rows] = await pool.query('SELECT latitude, longitude FROM schools WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ success: false, message: `School with id ${id} not found.` });
            }
            userLat = rows[0].latitude;
            userLon = rows[0].longitude;
        } else if (latitude !== undefined && longitude !== undefined) {
            // --- Input Validation ---
            const errors = [];

            if (latitude === null || latitude === '') {
                errors.push('latitude query parameter is required.');
            } else if (isNaN(parseFloat(latitude)) || parseFloat(latitude) < -90 || parseFloat(latitude) > 90) {
                errors.push('latitude must be a valid number between -90 and 90.');
            }

            if (longitude === null || longitude === '') {
                errors.push('longitude query parameter is required.');
            } else if (isNaN(parseFloat(longitude)) || parseFloat(longitude) < -180 || parseFloat(longitude) > 180) {
                errors.push('longitude must be a valid number between -180 and 180.');
            }

            if (errors.length > 0) {
                return res.status(400).json({ success: false, errors });
            }

            userLat = parseFloat(latitude);
            userLon = parseFloat(longitude);
        } else {
            return res.status(400).json({
                success: false,
                message: 'Provide either "id" or both "latitude" and "longitude" as query parameters.',
            });
        }

        // --- Fetch all schools ---
        const [schools] = await pool.query('SELECT * FROM schools');

        // --- Calculate distance and sort ---
        const schoolsWithDistance = schools.map((school) => ({
            ...school,
            distance_km: parseFloat(
                haversineDistance(userLat, userLon, school.latitude, school.longitude).toFixed(2)
            ),
        }));

        schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

        return res.status(200).json({
            success: true,
            count: schoolsWithDistance.length,
            data: schoolsWithDistance,
        });
    } catch (error) {
        console.error('Error listing schools:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
}

module.exports = { addSchool, listSchools };

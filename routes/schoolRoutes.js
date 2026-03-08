const express = require('express');
const router = express.Router();
const { addSchool, listSchools } = require('../controllers/schoolController');

// POST /addSchool  – Add a new school
router.post('/addSchool', addSchool);

// GET  /listSchools – List schools sorted by proximity
router.get('/listSchools', listSchools);

module.exports = router;

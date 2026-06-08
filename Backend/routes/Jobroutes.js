const express = require('express');
const router = express.Router();
const Job = require('../models/Job'); // 👈 add this

// GET all jobs from MongoDB
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find(); // 👈 MongoDB query

        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
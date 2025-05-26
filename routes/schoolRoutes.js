
const express = require('express');
const { body, validationResult, query } = require('express-validator');
const School = require("./models/schoolModel");
const {getDistance} = require("./utils/distance");


const router = express.Router();

// POST 
router.post(
  '/addSchool',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude must be between -90 and 90'),
    body('long').isFloat({ min: -180, max: 180 }).withMessage('Longitude must be between -180 and 180'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const school = new School(req.body);
      await school.save();
      res.status(201).json({ message: 'School added successfully', data: school });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET 
router.get(
  '/listSchools',
  [
    query('lat').isFloat({ min: -90, max: 90 }).withMessage('Latitude is required and must be valid'),
    query('long').isFloat({ min: -180, max: 180 }).withMessage('Longitude is required and must be valid'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const userLat = parseFloat(req.query.lat);
    const userLong = parseFloat(req.query.long);

    try {
      const schools = await School.find();
      const sorted = schools
        .map((school) => ({
          ...school.toObject(),
          distance: getDistance(userLat, userLong, school.lat, school.long),
        }))
        .sort((a, b) => a.distance - b.distance);

      res.json({ count: sorted.length, schools: sorted });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;

const express = require('express');
const router = express.Router();

const { listVolunteers, createVolunteer, updateAvailability } = require('../controllers/Volunteer');

router.get('/volunteers', listVolunteers);
router.post('/volunteers', createVolunteer);
router.put('/volunteers/:id/availability', updateAvailability);

module.exports = router;

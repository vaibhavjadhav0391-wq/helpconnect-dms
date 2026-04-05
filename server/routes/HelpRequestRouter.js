const express = require('express');
const router = express.Router();

const { listHelpRequests, createHelpRequest, updateHelpStatus } = require('../controllers/HelpRequest');

router.get('/help-requests', listHelpRequests);
router.post('/help-requests', createHelpRequest);
router.put('/help-requests/:id/status', updateHelpStatus);

module.exports = router;

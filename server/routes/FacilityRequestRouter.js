const express = require('express');
const router = express.Router();

const {
    createFacilityRequest,
    listFacilityRequests,
    approveFacilityRequest,
    rejectFacilityRequest,
    listFacilities
} = require('../controllers/FacilityRequest');

router.post('/facility-request', createFacilityRequest);
router.get('/facility-requests', listFacilityRequests);
router.get('/facilities', listFacilities);
router.put('/facility-request/:id/approve', approveFacilityRequest);
router.put('/facility-request/:id/reject', rejectFacilityRequest);

module.exports = router;

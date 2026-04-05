const express = require('express');
const router = express.Router();

const { getNotifications } = require('../controllers/Notification');

router.get('/', getNotifications);

module.exports = router;

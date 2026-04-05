const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const { listLiveIncidents, createLiveIncident, downloadIncidentPdf } = require('../controllers/LiveIncident');

const uploadDir = path.join(__dirname, '..', 'uploads', 'incidents');
const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, uploadDir),
	filename: (req, file, cb) => {
		const timestamp = Date.now();
		const safeName = file.originalname.replace(/\s+/g, '-');
		cb(null, `${timestamp}-${safeName}`);
	}
});

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/', listLiveIncidents);
router.post('/', upload.single('image'), createLiveIncident);
router.get('/:id/pdf', downloadIncidentPdf);

module.exports = router;

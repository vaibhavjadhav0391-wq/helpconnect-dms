const LiveIncident = require('../models/LiveIncident');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const listLiveIncidents = async (req, res) => {
    try {
        const incidents = await LiveIncident.find({}).sort({ createdAt: -1 });
        res.status(200).json({ incidents });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createLiveIncident = async (req, res) => {
    try {
        const {
            title,
            description,
            latitude,
            longitude,
            severity,
            locationName,
            state,
            district,
            taluka,
            village,
            submittedBy,
            affectedCount
        } = req.body;

        if (!title || !description || !severity) {
            return res.status(400).json({ error: 'Missing required incident fields.' });
        }

        const hasGps = latitude !== undefined && longitude !== undefined && latitude !== '' && longitude !== '';
        const hasManual = Boolean(state || district || taluka || village);
        if (!hasGps && !hasManual) {
            return res.status(400).json({ error: 'Provide GPS location or manual location details.' });
        }

        const imageUrl = req.file ? `/uploads/incidents/${req.file.filename}` : '';
        const manualLocation = [village, taluka, district, state].filter(Boolean).join(', ');
        const resolvedLocationName = locationName || manualLocation;
        const incident = await LiveIncident.create({
            title,
            description,
            latitude: latitude ? Number(latitude) : undefined,
            longitude: longitude ? Number(longitude) : undefined,
            severity,
            locationName: resolvedLocationName || '',
            state: state || '',
            district: district || '',
            taluka: taluka || '',
            village: village || '',
            submittedBy: submittedBy || '',
            affectedCount: affectedCount ? Number(affectedCount) : 0,
            imageUrl
        });

        const io = req.app.get('io');
        if (io) {
            io.emit('newIncident', incident);
        }

        res.status(201).json({ incident });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const downloadIncidentPdf = async (req, res) => {
    try {
        const { id } = req.params;
        const incident = await LiveIncident.findById(id);
        if (!incident) {
            return res.status(404).json({ error: 'Incident not found.' });
        }

        const doc = new PDFDocument({ margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=incident-${id}.pdf`);
        doc.pipe(res);

        doc.fontSize(20).text('HelpConnect', { align: 'left' });
        doc.moveDown(0.5);
        doc.fontSize(12).text('Incident Report', { align: 'left' });
        doc.moveDown(1);

        doc.fontSize(14).text(`Title: ${incident.title}`);
        doc.moveDown(0.25);
        doc.fontSize(12).text(`Description: ${incident.description}`);
        doc.moveDown(0.5);

        const manualLocation = [incident.village, incident.taluka, incident.district, incident.state]
            .filter(Boolean)
            .join(', ');
        const gpsLocation = incident.latitude && incident.longitude
            ? `${incident.latitude}, ${incident.longitude}`
            : '';
        const locationLine = manualLocation || incident.locationName || gpsLocation || 'Not provided';

        doc.text(`Location: ${locationLine}`);
        if (gpsLocation) {
            doc.text(`GPS: ${gpsLocation}`);
        }
        doc.text(`Severity: ${incident.severity}`);
        doc.text(`Affected Individuals: ${incident.affectedCount || 0}`);
        doc.text(`Submitted By: ${incident.submittedBy || 'Anonymous'}`);
        doc.text(`Date & Time: ${new Date(incident.createdAt).toLocaleString()}`);
        doc.moveDown(0.75);

        if (incident.imageUrl) {
            const imagePath = path.join(__dirname, '..', incident.imageUrl);
            if (fs.existsSync(imagePath)) {
                doc.image(imagePath, { width: 320, align: 'left' });
            }
        }

        doc.end();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    listLiveIncidents,
    createLiveIncident,
    downloadIncidentPdf
};

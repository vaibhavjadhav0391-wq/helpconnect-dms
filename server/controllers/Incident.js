const Incident = require('../models/Incident');
const Location = require('../models/Location');
const Notification = require('../models/Notification');

const getAllIncidents = async(req, res) => {
    try {
        // Fetch all incidents
        const incidents = await Incident.find({});
        
        // Fetch all locations
        const locations = await Location.find({});
        
        // Create a map of location ID to location document for quick lookup
        const locationMap = locations.reduce((map, location) => {
            map[location.LocationID] = location;
            return map;
        }, {});
        
        // Combine incidents with their corresponding locations
        const incidentsWithLocation = incidents.map(incident => {
            return {
                ...incident.toObject(),
                Location: locationMap[incident.LocationID] || null
            };
        });
        
        res.status(200).json({ incidents: incidentsWithLocation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
}

const updateIncident = async(req, res) => {
    try {
        const { id } = req.params;
        const {
            Volunteers,
            AffectedIndividual,
            ApproximateaffectedCount,
            LocationID,
            IncidentType,
            Description,
            IncidentLocation,
            CommunityID,
            ReportedBy,
            DateReported,
            Urgency,
            Status,
            AffectedCount
        } = req.body;

        const updatePayload = {
            Volunteers,
            AffectedIndividual,
            ApproximateaffectedCount,
            LocationID,
            IncidentType,
            Description,
            IncidentLocation,
            CommunityID,
            ReportedBy,
            Urgency,
            Status,
            AffectedCount
        };

        if (DateReported) {
            updatePayload.DateReported = new Date(DateReported);
        }

        const updatedIncident = await Incident.findOneAndUpdate(
            { IncidentID: Number(id) },
            updatePayload,
            { new: true }
        );

        if (!updatedIncident) {
            return res.status(404).json({ error: 'Incident not found.' });
        }

        res.status(200).json({ updatedIncident });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const deleteIncident = async (req, res) => {
    try {
        const { id } = req.params;
        const removed = await Incident.findOneAndDelete({ IncidentID: Number(id) });
        if (!removed) {
            return res.status(404).json({ error: 'Incident not found.' });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const createIncident= async(req, res) => {
    try {
        const {
            LocationID,
            IncidentType,
            Description,
            IncidentLocation,
            AffectedCount,
            CommunityID,
            ReportedBy,
            DateReported,
            Urgency,
            Status,
            Latitude,
            Longitude
        } = req.body;

        const count = await Incident.countDocuments();
        const IncidentID = count + 1;
        try {
            const imageUrl = req.file ? `/uploads/incidents/${req.file.filename}` : '';
            const newIncident = await Incident.create({
                IncidentID,
                LocationID: LocationID ? Number(LocationID) : undefined,
                IncidentType,
                Description,
                IncidentLocation,
                AffectedCount: AffectedCount ? Number(AffectedCount) : 0,
                CommunityID,
                ReportedBy,
                DateReported: DateReported ? new Date(DateReported) : new Date(),
                Urgency,
                Status,
                Latitude: Latitude ? Number(Latitude) : undefined,
                Longitude: Longitude ? Number(Longitude) : undefined,
                ImageUrl: imageUrl
            });
            const notificationCount = await Notification.countDocuments();
            await Notification.create({
                NotificationID: notificationCount + 1,
                IncidentID: IncidentID,
                Message: `New ${IncidentType} reported${IncidentLocation ? ` at ${IncidentLocation}` : ''}.`,
                Type: 'incident'
            });
                console.log(newIncident);
                
            res.status(201).json({newIncident });

        } catch (error) {
            console.log(error);
            
            res.status(500).json({ error: error.message });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
}





module.exports = {
    getAllIncidents,
    createIncident,
    updateIncident,
    deleteIncident
}
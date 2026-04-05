const Incident = require('../models/Incident');
const Community = require('../models/Community');
const Donation = require('../models/Donation');
const Location = require('../models/Location');
const EmergencyContact = require('../models/EmergencyContact');

async function getTotalDonationAmount() {
    try {
        // Fetch all donations and sum up the amounts
        const totalAmount = await Donation.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$Amount" }
                }
            }
        ]);

        // If no donations, totalAmount will be 0
        return totalAmount.length > 0 ? totalAmount[0].totalAmount : 0;
    } catch (err) {
        console.error('Error calculating total donation amount:', err);
        throw err;
    }
}

const home = async(req, res) => {
    try {
        const runningIncidents = await Incident.find({ Status: "Running" });
        const locations = await Location.find({});
        const locationMap = locations.reduce((map, location) => {
            map[location.LocationID] = location;
            return map;
        }, {});

        const contacts = await EmergencyContact.find({});

        const incidentList = runningIncidents.map((incident) => {
            const location = incident.LocationID ? locationMap[incident.LocationID] : null;
            const locationText = location ? location.Address : (incident.IncidentLocation || "Not specified");
            return {
                IncidentID: incident.IncidentID,
                IncidentType: incident.IncidentType,
                Description: incident.Description,
                Location: locationText,
                DateReported: JSON.stringify(incident.DateReported).split('T')[0],
                Urgency: incident.Urgency,
                Status: incident.Status,
                Longitude: location ? location.Longitude : null,
                Latitude: location ? location.Latitude : null
            };
        });

        const MapLocation = incidentList
            .filter((item) => item.Latitude && item.Longitude)
            .map((item) => ({
                position: [item.Latitude, item.Longitude],
                popupText: item.IncidentType
            }));
        
        

        const totalAmount = await getTotalDonationAmount();

        // Step 4: Send the retrieved locations in the response
        res.status(200).json({ incidentList, locations, contacts, MapLocation,totalAmount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
}  

const getAllLocations = async (req, res)=>{
    const AllLocations = await Location.find({});
    res.json({AllLocations});
}

module.exports = {
    home,
    getAllLocations
}
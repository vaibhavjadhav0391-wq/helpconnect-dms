const HomeRoute = require('./HomeRouter');
const AuthRouter = require('./AuthRouter');
const CommunityRouter = require('./CommunityRouter');
const IncidentRoute = require('./IncidentRouter');
const NotificationRoute = require('./NotificationRouter');
const EmergencyContactRoute = require('./EmergencyContactRouter');
const LiveIncidentRoute = require('./LiveIncidentRouter');
const FacilityRequestRoute = require('./FacilityRequestRouter');
const VolunteerRoute = require('./VolunteerRouter');
const HelpRequestRoute = require('./HelpRequestRouter');

module.exports = { HomeRoute, AuthRouter, CommunityRouter , IncidentRoute, NotificationRoute, EmergencyContactRoute, LiveIncidentRoute, FacilityRequestRoute, VolunteerRoute, HelpRequestRoute};

//please export the Router you just created
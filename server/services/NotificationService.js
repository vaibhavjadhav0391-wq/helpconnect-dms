let twilioClient = null;

const initTwilio = () => {
    if (twilioClient) return twilioClient;
    const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) return null;
    // Lazy load to avoid requiring dependency unless configured.
    // eslint-disable-next-line global-require
    const twilio = require('twilio');
    twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    return twilioClient;
};

const normalizePhone = (phone) => {
    if (!phone) return '';
    const trimmed = String(phone).trim();
    if (!trimmed) return '';
    if (trimmed.startsWith('+')) return trimmed;
    if (trimmed.startsWith('91') && trimmed.length >= 12) return `+${trimmed}`;
    return `+91${trimmed}`;
};

const notifyVolunteers = async (volunteers, message) => {
    const toNumbers = volunteers.map((v) => normalizePhone(v.phone)).filter(Boolean);
    if (!toNumbers.length) return;

    const client = initTwilio();
    if (!client) {
        console.log('Notify volunteers:', toNumbers.join(', '));
        console.log('Message:', message);
        return;
    }

    const fromNumber = process.env.TWILIO_FROM;
    if (!fromNumber) {
        console.log('TWILIO_FROM missing. Skipping SMS send.');
        return;
    }

    try {
        await Promise.all(
            toNumbers.map((phone) => client.messages.create({
                body: message,
                from: fromNumber,
                to: phone
            }))
        );
    } catch (error) {
        console.log('Twilio SMS failed:', error.message);
    }
};

module.exports = {
    notifyVolunteers
};

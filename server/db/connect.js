const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI;

if (!connectionString) {
    console.error('MONGODB_URI is undefined. Check your .env file and restart the server.');
} else {
    mongoose
        .connect(connectionString, {
            serverSelectionTimeoutMS: 10000
        })
        .then(() => {
            console.log('MongoDB Connected');
        })
        .catch((error) => {
            console.error('MongoDB Connection Failed');
            console.error(error.message || error);
        });
}
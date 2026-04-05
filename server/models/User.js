const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    UserID: {
        type: Number,
        required: true
    },
    Name: {
        type: String,
        required: [true,"Name must be provided"] ,
    },
    Email: {
        type: String,
        required: [true, "Email must be provided"],
        unique: true,
        validate: {
            validator: function(value) {
                // Email must be valid
                return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
            },
            message: 'Email must be valid'
        }
    },
    Phone: {
        type: String,
        required: false,
        validate: {
            validator: function(value) {
                // Phone number must contain exactly 11 digits
                return /^\d{11}$/.test(value);
            },
            message: 'Phone number must contain exactly 11 digits'
        }
    },

    Password: {
        type: String,
        required: false,
    },
    
    Address: {
        type: String,
        required: false
    },
    FirebaseUID: {
        type: String,
        unique: true,
        sparse: true
    },
    UserType: {
        type: [String],// string of arrays
        required: false,
        default: ["affected"], //admin, volunteer, donor, affected,
        enum : {
            values : ["admin","volunteer","donor","affected"],
            message : `UserType is not supported, must be of : admin, volunteer, donor, affected`
        }
    },
    Available: {
        type : Boolean,
        required: false,
        default: true
    },
    Community: {
        type: [Number], // array of Numbers
        default: []
    },
    CreationTime: {
        type: Date,
        default: Date.now,
        required: true
    }
},);

module.exports = mongoose.model('User', UserSchema);
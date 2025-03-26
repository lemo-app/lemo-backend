const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
    school_name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: false,
        trim: true
    },
    contact_number: {
        type: String,
        required: false,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    start_time: {
        type: Date, // Changed to Date type for ISO format
        required: false
    },
    end_time: {
        type: Date, // Changed to Date type for ISO format
        required: false
    },
    logo_url: {
        type: String,
        required: false
    },
    qr_url: {
        type: String,
        required: false
    },
    vpn_config_url: {
        type: String,
        required: false
    }
}, { timestamps: true });

const School = mongoose.model('School', schoolSchema);

module.exports = School; 
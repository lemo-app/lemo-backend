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
        type: String, // Consider using a more specific type if needed
        required: false
    },
    end_time: {
        type: String, // Consider using a more specific type if needed
        required: false
    }
});

const School = mongoose.model('School', schoolSchema);

module.exports = School; 
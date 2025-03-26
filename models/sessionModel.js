const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['in_progress', 'ended', 'cancelled'],
        default: 'in_progress'
    },
    tardy: {
        type: Boolean,
        default: false
    },
    early_leave: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
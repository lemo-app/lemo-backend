const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    accessToken: {
        type: String,
        default: ''
    },
    refreshToken: {
        type: String,
        default: ''
    },
    age: {
        type: Number,
        default: 0
    },
    gender: {
        type: String,
        default: ''
    },
    full_name: {
        type: String,
        required: false
    },
    section: {
        type: String,
        default: ''
    },
    roll_no: {
        type: String,
        default: ''
    },
    student_id: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['super_admin', 'admin', 'school_manager', 'student'],
        default: 'student'
    },
    email_verified: {
        type: Boolean,
        default: false
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: false
    },
    avatar_url: {
        type: String,
        required: false
    },
    job_title: {
        type: String,
        required: false
    }
}, { timestamps: true });

// Hash the password before saving the user model
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare password
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generatePasswordResetToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
};

const User = mongoose.model('User', userSchema);

module.exports = User; 
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.createUser = async (email, password) => {
    try {
        const newUser = new User({ email, password });
        await newUser.save();
        return newUser;
    } catch (error) {
        console.log('Error creating user:', error);
        throw new Error('User creation failed');
    }
};

exports.authenticateUser = async (email, password) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Invalid email or password');
        }

        return user;
    } catch (error) {
        console.log('Error authenticating user:', error);
        throw new Error('Authentication failed');
    }
};

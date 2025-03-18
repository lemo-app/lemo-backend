const User = require('../models/userModel');

exports.findUserById = async (id) => {
    try {
        return await User.findById(id);
    } catch (error) {
        console.log('Error finding user by ID:', error);
        throw new Error('Database query failed');
    }
};

exports.updateUser = async (id, updateData) => {
    try {
        return await User.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true, omitUndefined: true });
    } catch (error) {
        console.log('Error updating user:', error);
        throw new Error('Database update failed');
    }
};

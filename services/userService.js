const User = require('../models/userModel');

exports.findUserById = async (id, fieldsToSelect = '') => {
    try {
        return await User.findById(id).select(fieldsToSelect);
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

exports.findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        console.log('Error finding user by email:', error);
        throw new Error('Database query failed');
    }
};

exports.getAllUsers = async (query) => {
    try {
        const { type, school, section, job_title, search, sortBy, order = 'asc', page = 1, limit = 10 } = query;
        const sortOptions = {};

        if (sortBy) {
            sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        }

        const searchQuery = {
            ...(type && { type }),
            ...(school && { school }),
            ...(section && { section }),
            ...(job_title && { job_title }),
            ...(search && {
                $or: [
                    { full_name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { student_id: { $regex: search, $options: 'i' } }
                ]
            })
        };

        const users = await User.find(searchQuery)
            .select('-password')
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalUsers = await User.countDocuments(searchQuery);

        return { users, totalUsers };
    } catch (error) {
        console.log('Error fetching users:', error);
        throw new Error('Database query failed');
    }
};

exports.deleteUser = async (id) => {
    try {
        return await User.findByIdAndDelete(id);
    } catch (error) {
        console.log('Error deleting user:', error);
        throw new Error('Database delete failed');
    }
};

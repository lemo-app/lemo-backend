const School = require('../models/schoolModel');

exports.createSchool = async (schoolData) => {
    try {
        const newSchool = new School(schoolData);
        await newSchool.save();
        return newSchool;
    } catch (error) {
        console.log('Error creating school:', error);
        throw new Error('School creation failed');
    }
};

exports.findSchoolById = async (id) => {
    try {
        return await School.findById(id);
    } catch (error) {
        console.log('Error finding school by ID:', error);
        throw new Error('Database query failed');
    }
};

exports.updateSchool = async (id, updateData) => {
    try {
        return await School.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true, omitUndefined: true });
    } catch (error) {
        console.log('Error updating school:', error);
        throw new Error('Database update failed');
    }
};

exports.deleteSchool = async (id) => {
    try {
        return await School.findByIdAndDelete(id);
    } catch (error) {
        console.log('Error deleting school:', error);
        throw new Error('Database deletion failed');
    }
};

exports.getAllSchools = async (query) => {
    try {
        const { search, sortBy, order = 'asc', page = 1, limit = 10 } = query;
        const sortOptions = {};

        if (sortBy) {
            sortOptions[sortBy] = order === 'asc' ? 1 : -1;
        }

        const searchQuery = search
            ? {
                  $or: [
                      { school_name: { $regex: search, $options: 'i' } },
                      { address: { $regex: search, $options: 'i' } }
                  ]
              }
            : {};

        const schools = await School.find(searchQuery)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalSchools = await School.countDocuments(searchQuery);

        return { schools, totalSchools };
    } catch (error) {
        console.log('Error fetching schools:', error);
        throw new Error('Database query failed');
    }
}; 
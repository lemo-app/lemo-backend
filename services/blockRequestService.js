const BlockRequest = require('../models/blockRequestModel');

exports.createBlockRequest = async (blockRequestData) => {
    try {
        const newBlockRequest = new BlockRequest(blockRequestData);
        await newBlockRequest.save();
        return newBlockRequest;
    } catch (error) {
        console.log('Error creating block request:', error);
        throw new Error('Block request creation failed');
    }
};

exports.getBlockRequestById = async (id) => {
    try {
        return await BlockRequest.findById(id);
    } catch (error) {
        console.log('Error finding block request by ID:', error);
        throw new Error('Database query failed');
    }
};

exports.updateBlockRequest = async (id, updateData) => {
    try {
        return await BlockRequest.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    } catch (error) {
        console.log('Error updating block request:', error);
        throw new Error('Database update failed');
    }
};

exports.deleteBlockRequest = async (id) => {
    try {
        return await BlockRequest.findByIdAndDelete(id);
    } catch (error) {
        console.log('Error deleting block request:', error);
        throw new Error('Database deletion failed');
    }
};

exports.getAllBlockRequests = async (query) => {
    try {
        const filter = {};
        if (query.status) {
            filter.status = query.status;
        }
        if (query.school) {
            filter.school = query.school;
        }

        const sort = {};
        if (query.sortBy) {
            sort[query.sortBy] = query.order === 'asc' ? 1 : -1;
        }

        return await BlockRequest.find(filter).populate('user school').sort(sort);
    } catch (error) {
        console.log('Error fetching block requests:', error);
        throw new Error('Database query failed');
    }
};

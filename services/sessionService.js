const Session = require('../models/sessionModel');

exports.createSession = async (sessionData) => {
    try {
        const newSession = new Session(sessionData);
        await newSession.save();
        return newSession;
    } catch (error) {
        console.log('Error creating session:', error);
        throw new Error('Session creation failed');
    }
};

exports.findSessionById = async (id) => {
    try {
        return await Session.findById(id);
    } catch (error) {
        console.log('Error finding session by ID:', error);
        throw new Error('Database query failed');
    }
};

exports.updateSession = async (id, updateData) => {
    try {
        return await Session.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true, omitUndefined: true });
    } catch (error) {
        console.log('Error updating session:', error);
        throw new Error('Database update failed');
    }
};

exports.deleteSession = async (id) => {
    try {
        return await Session.findByIdAndDelete(id);
    } catch (error) {
        console.log('Error deleting session:', error);
        throw new Error('Database deletion failed');
    }
};

exports.patchSession = async (id, updateData) => {
    try {
        return await Session.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true, omitUndefined: true });
    } catch (error) {
        console.log('Error patching session:', error);
        throw new Error('Database patch failed');
    }
}; 
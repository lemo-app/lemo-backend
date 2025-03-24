const sessionService = require('../services/sessionService');
const jwt = require('jsonwebtoken');

exports.createSession = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded; // Attach decoded user info to request

        const { student, school, start_time, end_time, status, tardy, early_leave } = req.body;
        const newSession = await sessionService.createSession({ student, school, start_time, end_time, status, tardy, early_leave });
        res.status(201).json({
            status: 'success',
            message: 'Session created successfully',
            session: newSession
        });
    } catch (error) {
        console.log('Error creating session:', error);
        res.status(400).send('Error creating session: ' + error.message);
    }
};

exports.getSessionById = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;

        const { id } = req.params;
        const session = await sessionService.findSessionById(id);
        if (!session) {
            return res.status(404).send('Session not found');
        }
        res.json(session);
    } catch (error) {
        console.log('Error fetching session:', error);
        res.status(400).send('Error fetching session: ' + error.message);
    }
};

exports.updateSession = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;

        const { id } = req.params;
        const updateData = req.body;
        const updatedSession = await sessionService.updateSession(id, updateData);
        if (!updatedSession) {
            return res.status(404).send('Session not found');
        }
        res.json({
            status: 'success',
            message: 'Session updated successfully',
            session: updatedSession
        });
    } catch (error) {
        console.log('Error updating session:', error);
        res.status(400).send('Error updating session: ' + error.message);
    }
};

exports.deleteSession = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;

        const { id } = req.params;
        const deletedSession = await sessionService.deleteSession(id);
        if (!deletedSession) {
            return res.status(404).send('Session not found');
        }
        res.json({
            status: 'success',
            message: 'Session deleted successfully'
        });
    } catch (error) {
        console.log('Error deleting session:', error);
        res.status(400).send('Error deleting session: ' + error.message);
    }
};

exports.patchSession = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded;

        const { id } = req.params;
        const updateData = req.body;
        const patchedSession = await sessionService.patchSession(id, updateData);
        if (!patchedSession) {
            return res.status(404).send('Session not found');
        }
        res.json({
            status: 'success',
            message: 'Session patched successfully',
            session: patchedSession
        });
    } catch (error) {
        console.log('Error patching session:', error);
        res.status(400).send('Error patching session: ' + error.message);
    }
};
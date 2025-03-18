const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send('Verification token is required');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await userService.findUserById(decoded.id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        user.email_verified = true;
        await user.save();

        res.status(200).send('Email verified successfully. You can now login/proceed on the LEMO App');
    } catch (error) {
        console.log('Error verifying email:', error);
        res.status(400).send('Invalid or expired token');
    }
}; 
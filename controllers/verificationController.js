const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

exports.verifyEmail = async (req, res) => {
    const { email, temp_password, new_password, new_password_confirm } = req.body;

    if (!email) {
        return res.status(400).send('Email is required');
    }

    if (new_password !== new_password_confirm) {
        return res.status(400).send('Passwords do not match');
    }

    try {
        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const isMatch = await user.comparePassword(temp_password);
        if (!isMatch) {
            return res.status(400).send('Invalid temporary password');
        }

        user.password = new_password;
        user.email_verified = true;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Email verified and password updated successfully. You can now login/proceed on the LEMO App'
        });
    } catch (error) {
        console.log('Error verifying email:', error);
        res.status(500).send('An error occurred while verifying the email');
    }
}; 
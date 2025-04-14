const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

exports.getUserProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await userService.findUserById(decoded.id, '-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.log('Error fetching user profile:', error);
        res.status(401).send('Error fetching user profile');
    }
};

exports.updateUserProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No token provided');
    }

    const { userName, age, gender, type, section, roll_no, full_name, student_id, school, avatar_url, job_title } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const updatedUser = await userService.updateUser(decoded.id, { userName, age, gender, type, section, roll_no, full_name, student_id, school, avatar_url, job_title });

        if (updatedUser) {
            const userWithoutPassword = await userService.findUserById(updatedUser.id, '-password');
            res.json(userWithoutPassword);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.log('Error updating user profile:', error);
        res.status(401).send('Invalid token');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const { users, totalUsers } = await userService.getAllUsers(req.query);
        res.json({
            status: 'success',
            data: {
                users,
                totalUsers
            }
        });
    } catch (error) {
        console.log('Error fetching users:', error);
        res.status(400).send('Error fetching users: ' + error.message);
    }
};

exports.updateUserById = async (req, res) => {
    const { id } = req.params; // Get the user ID from the request parameters
    const { userName, age, gender, type, section, roll_no, full_name, student_id, school, avatar_url, job_title } = req.body;

    try {
        const updatedUser = await userService.updateUser(id, { userName, age, gender, type, section, roll_no, full_name, student_id, school, avatar_url, job_title });

        if (updatedUser) {
            const userWithoutPassword = await userService.findUserById(updatedUser.id, '-password');
            res.json(userWithoutPassword);
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.log('Error updating user:', error);
        res.status(400).json({ status: 'error', message: 'Error updating user: ' + error.message });
    }
};

exports.deleteUserById = async (req, res) => {
    const { id } = req.params; // Get the user ID from the request parameters

    try {
        const deletedUser = await userService.deleteUser(id);

        if (deletedUser) {
            res.status(200).json({ status: 'success', message: 'User deleted successfully' });
        } else {
            res.status(404).json({ status: 'error', message: 'User not found' });
        }
    } catch (error) {
        console.log('Error deleting user:', error);
        res.status(400).send('Error deleting user: ' + error.message);
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body; // Assuming the email is sent in the request body

    try {
        // Logic to generate a password reset token and send it via email
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const resetToken = user.generatePasswordResetToken(); // You need to implement this method in the user model
        await emailService.sendEmail(user.email, 'Password Reset', `Your reset token is: ${resetToken}`);

        res.status(200).json({ status: 'success', message: 'Password reset link sent to your email', token: resetToken });
    } catch (error) {
        console.log('Error in forgot password:', error);
        res.status(500).json({ status: 'error', message: 'Error processing request' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
        return res.status(400).json({ status: 'error', message: 'Token and new password are required' });
    }

    try {
        // Verify the token and get the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await userService.findUserById(decoded.id);

        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        // Update the user's password
        user.password = new_password; // Ensure the password is hashed in the user model
        await user.save();

        res.status(200).json({ status: 'success', message: 'Password has been reset successfully' });
    } catch (error) {
        console.log('Error resetting password:', error);
        res.status(500).send('Error processing request');
    }
};



const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

exports.getUserProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await userService.findUserById(decoded.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.log('Error fetching user profile:', error);
        res.status(401).send('Invalid token');
    }
};

exports.updateUserProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No token provided');
    }

    const { userName, age, gender, type, section, roll_no, full_name, student_id, school } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const updatedUser = await userService.updateUser(decoded.id, { userName, age, gender, type, section, roll_no, full_name, student_id, school });

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.log('Error updating user profile:', error);
        res.status(401).send('Invalid token');
    }
};

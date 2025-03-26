const userService = require('../services/userService');
const jwt = require('jsonwebtoken');

exports.getUserProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await userService.findUserById(decoded.id, '-password');
        console.log(user.job_title);
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

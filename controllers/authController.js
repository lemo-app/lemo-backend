const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

exports.googleCallback = async (req, res) => {
    try {
        const { accessToken, refreshToken, email, id } = req.user;
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET || 'your_jwt_secret');
        
        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);
        console.log('User ID:', id);
        console.log('JWT Token:', token);
        
        res.redirect(
            `/index.html?accessToken=${accessToken}&refreshToken=${refreshToken}&email=${email}&userId=${id}&token=${token}`
        );
    } catch (error) {
        console.log('Error in Google callback:', error);
        res.redirect('/login');
    }
};

exports.signup = async (req, res) => {
    const { email, type } = req.body;

    const temp_password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    if (!type) {
        return res.status(400).send('User type is required');
    }

    try {
        const newUser = await authService.createUser(email, temp_password, type);
        const verificationLink = process.env.FRONTEND_VERIFICATION_URL + '/verify-account?email=' + email;
        const mailBody = `Hey ${type}! Welcome to Lemoapp! Follow these instructions to verify your email! Your temporary password is ${temp_password}. Click this link to verify your email: ${verificationLink}`;

        // Send verification email
        await emailService.sendEmail(email, mailBody);

        const jwtToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'your_jwt_secret');
        res.status(201).json({
            status: 'success',
            message: 'User created successfully. Verification email sent.',
            token: jwtToken,
            email: newUser.email,
            userId: newUser.id,
            userName: newUser.userName,
            type: newUser.type,
            verificationEmail: mailBody
        });
    } catch (error) {
        console.log('Error creating user:', error);
        res.status(400).send('Error creating user: ' + error.message);
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authService.authenticateUser(email, password);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your_jwt_secret');
        res.json({
            token,
            email: user.email,
            userId: user.id,
            userName: user.userName
        });
    } catch (error) {
        console.log('Error logging in:', error);
        res.status(400).send('Error logging in: ' + error.message);
    }
};

const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');
const dotenv = require('dotenv');
dotenv.config();

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
    const { email, type, job_title } = req.body;

    const temp_password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    if (!type) {
        return res.status(400).send('User type is required');
    }

    try {
        const newUser = await authService.createUser(email, temp_password, type, job_title);
        const verificationLink = process.env.FRONTEND_VERIFICATION_URL + '/verify-account?email=' + email;
        const mailBody = `Hey ${type}! Welcome to Lemoapp! Follow these instructions to verify your email! Your temporary password is ${temp_password}. Click this link to verify your email: ${verificationLink}`;

        const htmlBody = `
        
<body style="margin: 0; padding: 0; width: 100%; font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333333;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 100%;">
        <tr>
            <td align="center">
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px;">
                    <!-- Header with Logo -->
                    <tr>
                        <td align="center" style="padding: 30px 20px; background-color: #ffffff;">
                            <img src="https://lemobucket.s3.eu-west-2.amazonaws.com/6.png" alt="LeMo Logo" style="max-width: 200px; height: auto;">
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 40px 30px; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333333;">Hi ${type},</p>
                            
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333333;">Welcome to the LeMo App! We're excited to have you on board.</p>
                            
                            <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.5; color: #333333;">You've been invited to access the LeMo App- a revolutionary new application that boosts productivity in any learning situation.</p>
                            
                            <h3 style="margin: 30px 0 15px; color: #6979F8; font-size: 18px;">To get started:</h3>
                            <ul style="margin: 0 0 30px; padding: 0 0 0 20px; color: #333333;">
                                <li style="margin-bottom: 10px;">Click <a href="${verificationLink}" style="color: #6979F8; text-decoration: none; font-weight: bold;">here</a> to activate your account</li>
                                <li style="margin-bottom: 10px;">Your temporary password is: ${temp_password}</li>
                            </ul>
                            
                            <div style="background-color: #E8F0FE; padding: 20px; border-radius: 8px; margin: 30px 0;">
                                <h3 style="margin: 0 0 15px; color: #6979F8; font-size: 18px;">Need help?</h3>
                                <p style="margin: 0; font-size: 16px; line-height: 1.5; color: #333333;">If you have any questions or need support getting started, our team is here to assist you every step of the way. Simply reply to this email or reach out to <a href="mailto:contact@lemoapp.com" style="color: #6979F8; text-decoration: none; font-weight: bold;">contact@lemoapp.com</a>.</p>
                            </div>
                            
                            <p style="margin: 30px 0 0; font-size: 16px; line-height: 1.5; color: #333333;">Warm regards,<br>The LeMo Team</p>
                        </td>
                    </tr>
                    
                    <!-- Call to Action Button -->
                    <tr>
                        <td align="center" style="padding: 30px 20px; background-color: #f9f9f9;">
                            
                        </td>
                    </tr>
                    
                    <!-- Promo Image -->
                    <tr>
                        <td align="center" style="padding: 20px; background-color: #f9f9f9;">
                            <img src="https://lemobucket.s3.eu-west-2.amazonaws.com/41df4bef-249d-49ec-ab86-4d7831208950.png" alt="Secure School Experience" style="max-width: 100%; height: auto; border-radius: 8px;">
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 20px; text-align: center; background-color: #f9f9f9;">
                            <p style="margin: 0 0 15px; font-size: 14px; color: #777777;">© 2025 LeMo App. All rights reserved.</p>
                           
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
        `;

        // Send verification email
        await emailService.sendEmail(email, "Welcome to Lemoapp! Verify your email", mailBody, htmlBody);

        const jwtToken = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'your_jwt_secret');
        res.status(201).json({
            status: 'success',
            message: 'User created successfully. Verification email sent.',
            token: jwtToken,
            email: newUser.email,
            userId: newUser.id,
            userName: newUser.userName,
            type: newUser.type,
            job_title: newUser.job_title,
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
            userName: user.userName,
            full_name: user.full_name, // Added full_name
            type: user.type, // Added type
            avatar_url: user.avatar_url // Added avatar_url
        });
    } catch (error) {
        console.log('Error logging in:', error);
        res.status(400).send('Error logging in: ' + error.message);
    }
};

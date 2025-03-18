const emailService = require('../services/emailService');

exports.sendEmail = async (req, res) => {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
        return res.status(400).send('To, subject, and body are required');
    }

    try {
        const info = await emailService.sendEmail(to, subject, body);
        res.status(200).json({ status: 'success', message: 'Email sent successfully', info});
    } catch (error) {
        console.log('Error in sending email:', error);
        res.status(500).send('Error sending email: ' + error.message);
    }
}; 
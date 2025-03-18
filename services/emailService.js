const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

exports.sendEmail = async (to, subject, body) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to,
            subject,
            text: body
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.log('Error sending email:', error);
        throw new Error('Email sending failed');
    }
}; 
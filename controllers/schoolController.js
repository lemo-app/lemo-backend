const schoolService = require('../services/schoolService');
const userService = require('../services/userService');
const QRCode = require('qrcode');

exports.createSchool = async (req, res) => {
    const { school_name, address, contact_number, description, start_time, end_time } = req.body;

    try {
        const newSchool = await schoolService.createSchool({ school_name, address, contact_number, description, start_time, end_time });
        res.status(201).json({
            status: 'success',
            message: 'School created successfully',
            school: newSchool
        });
    } catch (error) {
        console.log('Error creating school:', error);
        res.status(400).send('Error creating school: ' + error.message);
    }
};

exports.getSchoolById = async (req, res) => {
    const { id } = req.params;

    try {
        const school = await schoolService.findSchoolById(id);
        if (!school) {
            return res.status(404).send('School not found');
        }
        res.json(school);
    } catch (error) {
        console.log('Error fetching school:', error);
        res.status(400).send('Error fetching school: ' + error.message);
    }
};

exports.updateSchool = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedSchool = await schoolService.updateSchool(id, updateData);
        if (!updatedSchool) {
            return res.status(404).send('School not found');
        }
        res.json({
            status: 'success',
            message: 'School updated successfully',
            school: updatedSchool
        });
    } catch (error) {
        console.log('Error updating school:', error);
        res.status(400).send('Error updating school: ' + error.message);
    }
};

exports.deleteSchool = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSchool = await schoolService.deleteSchool(id);
        if (!deletedSchool) {
            return res.status(404).send('School not found');
        }
        res.json({
            status: 'success',
            message: 'School deleted successfully'
        });
    } catch (error) {
        console.log('Error deleting school:', error);
        res.status(400).send('Error deleting school: ' + error.message);
    }
};

exports.connectUserToSchool = async (req, res) => {
    const { user_email, school_id } = req.body;

    try {
        const user = await userService.findUserByEmail(user_email);
        if (!user) {
            return res.status(404).send('There is no user with this email');
        }

        const school = await schoolService.findSchoolById(school_id);
        if (!school) {
            return res.status(404).send('Cannot find school');
        }

        user.school = school_id;
        await user.save();

        res.json({
            status: 'success',
            message: `${school.school_name} is connected with ${user.email}`
        });
    } catch (error) {
        console.log('Error connecting user to school:', error);
        res.status(400).send('Error connecting user to school: ' + error.message);
    }
};

exports.generateQrCode = async (req, res) => {
    const { id } = req.params;

    try {
        const school = await schoolService.findSchoolById(id);
        if (!school) {
            return res.status(404).send('School not found');
        }

        const qrData = JSON.stringify(school);
        QRCode.toDataURL(qrData, { type: 'image/png' }, (err, url) => {
            if (err) {
                console.log('Error generating QR code:', err);
                return res.status(500).send('Error generating QR code');
            }

            const img = Buffer.from(url.split(',')[1], 'base64');
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });
            res.end(img);
        });
    } catch (error) {
        console.log('Error generating QR code:', error);
        res.status(500).send('Error generating QR code: ' + error.message);
    }
}; 
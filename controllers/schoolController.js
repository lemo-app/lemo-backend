const schoolService = require('../services/schoolService');
const userService = require('../services/userService');
const { QRCodeStyling } = require('qr-code-styling/lib/qr-code-styling.common.js');
const nodeCanvas = require('canvas');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const fileService = require('../services/fileService');

exports.createSchool = async (req, res) => {
    const { school_name, address, contact_number, description, start_time, end_time, logo_url, vpn_config_url } = req.body;

    try {
        const newSchool = await schoolService.createSchool({ school_name, address, contact_number, description, start_time, end_time, logo_url, vpn_config_url });
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

        const qrCodeOptions = {
            width: 300,
            height: 300,
            data: JSON.stringify({ school_id: school.id }),
            image: school.logo_url,
            dotsOptions: {
                color: "#4267b2",
                type: "rounded"
            },
            backgroundOptions: {
                color: "#e9ebee",
            },
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 20
            }
        };

        const qrCodeImage = new QRCodeStyling({
            jsdom: JSDOM,
            nodeCanvas,
            ...qrCodeOptions,
            imageOptions: {
                saveAsBlob: true,
                crossOrigin: "anonymous",
                margin: 5,
                imageSize: 0.5
            },
        });

        const buffer = await qrCodeImage.getRawData("png");

        // Create a file-like object for S3 upload
        const file = {
            originalname: `qr-code-${id}.png`,
            buffer: buffer,
            mimetype: 'image/png'
        };

        // Upload to S3
        const qrCodeUrl = await fileService.uploadFileToS3(file);

        res.json({
            status: 'success',
            qr_code_url: qrCodeUrl
        });
    } catch (error) {
        console.log('Error generating QR code:', error);
        res.status(500).send('Error generating QR code: ' + error.message);
    }
};

exports.getAllSchools = async (req, res) => {
    try {
        const { schools, totalSchools } = await schoolService.getAllSchools(req.query);
        res.json({
            status: 'success',
            data: {
                schools,
                totalSchools
            }
        });
    } catch (error) {
        console.log('Error fetching schools:', error);
        res.status(400).send('Error fetching schools: ' + error.message);
    }
}; 
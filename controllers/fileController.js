const fileService = require('../services/fileService');

exports.uploadFile = async (req, res) => {
    try {
        const file = req.file; // Assuming you're using a middleware like multer to handle file uploads
        if (!file) {
            return res.status(400).send('No file uploaded');
        }

        const fileUrl = await fileService.uploadFileToS3(file);
        res.json({
            status: 'success',
            file_url: fileUrl
        });
    } catch (error) {
        console.log('Error uploading file:', error);
        res.status(500).send('Error uploading file: ' + error.message);
    }
};

const blockRequestService = require('../services/blockRequestService');

exports.createBlockRequest = async (req, res) => {
    const { user, school, site_url, reason } = req.body;

    try {
        const newBlockRequest = await blockRequestService.createBlockRequest({ user, school, site_url, reason });
        res.status(201).json({
            status: 'success',
            message: 'Block request created successfully',
            blockRequest: newBlockRequest
        });
    } catch (error) {
        console.log('Error creating block request:', error);
        res.status(400).send('Error creating block request: ' + error.message);
    }
};

exports.getBlockRequestById = async (req, res) => {
    const { id } = req.params;

    try {
        const blockRequest = await blockRequestService.getBlockRequestById(id);
        if (!blockRequest) {
            return res.status(404).send('Block request not found');
        }
        res.json(blockRequest);
    } catch (error) {
        console.log('Error fetching block request:', error);
        res.status(400).send('Error fetching block request: ' + error.message);
    }
};

exports.updateBlockRequest = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedBlockRequest = await blockRequestService.updateBlockRequest(id, updateData);
        if (!updatedBlockRequest) {
            return res.status(404).send('Block request not found');
        }
        res.json({
            status: 'success',
            message: 'Block request updated successfully',
            blockRequest: updatedBlockRequest
        });
    } catch (error) {
        console.log('Error updating block request:', error);
        res.status(400).send('Error updating block request: ' + error.message);
    }
};

exports.deleteBlockRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedBlockRequest = await blockRequestService.deleteBlockRequest(id);
        if (!deletedBlockRequest) {
            return res.status(404).send('Block request not found');
        }
        res.json({
            status: 'success',
            message: 'Block request deleted successfully'
        });
    } catch (error) {
        console.log('Error deleting block request:', error);
        res.status(400).send('Error deleting block request: ' + error.message);
    }
};

exports.getAllBlockRequests = async (req, res) => {
    try {
        const blockRequests = await blockRequestService.getAllBlockRequests(req.query);
        res.json({
            status: 'success',
            data: blockRequests
        });
    } catch (error) {
        console.log('Error fetching block requests:', error);
        res.status(400).send('Error fetching block requests: ' + error.message);
    }
};

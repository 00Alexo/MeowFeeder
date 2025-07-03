const express = require('express');
const { 
    createDevice,
    addDeviceToUser,
    getDeviceById,
    getUserDevices,
    getUserDevicesWithDetails,
    modifyFeedingTime,
    addFeedingToHistory,
    getFeedingHistory
} = require('../controllers/deviceController');

const router = express.Router();

router.post('/createDevice', createDevice);
router.post('/addDeviceToUser', addDeviceToUser);
router.get('/getDeviceById/:deviceId', getDeviceById);
router.get('/getUserDevices/:userEmail', getUserDevices);
router.get('/getUserDevicesWithDetails/:userEmail', getUserDevicesWithDetails);
router.post('/modifyFeedingTime', modifyFeedingTime);
router.post('/addFeedingToHistory', addFeedingToHistory);
router.get('/getFeedingHistory/:deviceId', getFeedingHistory);

module.exports = router;
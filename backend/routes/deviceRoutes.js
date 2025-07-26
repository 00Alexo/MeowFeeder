const express = require('express');
const { 
    createDevice,
    addDeviceToUser,
    getDeviceById,
    getUserDevices,
    getUserDevicesWithDetails,
    modifyFeedingTime,
    addFeedingToHistory,
    getFeedingHistory,
    getDeviceSchedules,
    updateSchedule,
    updateAutoFeeding,
    addSchedule,
    deleteSchedule
} = require('../controllers/deviceController');

const router = express.Router();

//const verifyAuth = require('../middleware/verifyAuth');

//router.use(verifyAuth); for demo purposes, we are not using auth middleware

router.post('/createDevice', createDevice);
router.post('/addDeviceToUser', addDeviceToUser);
router.get('/getDeviceById/:deviceId', getDeviceById);
router.get('/getUserDevices/:userEmail', getUserDevices);
router.get('/getUserDevicesWithDetails/:userEmail', getUserDevicesWithDetails);
router.post('/modifyFeedingTime', modifyFeedingTime);
router.post('/addFeedingToHistory', addFeedingToHistory);
router.get('/getFeedingHistory/:deviceId', getFeedingHistory);

// mobile routes
router.get('/schedules/:deviceId', getDeviceSchedules);
router.put('/schedules/:scheduleId', updateSchedule);
router.put('/:deviceId/auto-feeding', updateAutoFeeding);
router.post('/:deviceId/addSchedule', addSchedule);
router.delete('/:deviceId/deleteSchedule', deleteSchedule);

module.exports = router;
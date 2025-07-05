const userModel = require('../models/userModel');
const deviceModel = require('../models/deviceModel');

const addDeviceToUser = async (req, res) => {
    try {  
        const { userEmail, deviceId } = req.body;
        if (!userEmail || !deviceId) {
            return res.status(400).json({ error: 'User email and device ID are required.' });
        }

        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const device = await deviceModel.findById(deviceId);

        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        if (device.user_email && device.user_email !== "notSet") {
            return res.status(400).json({ error: 'Device is already associated with a user.' });
        } 

        device.user_email = userEmail;
        device.status = 'online';
        const updatedDevice = await device.save();
        user.devices.push(updatedDevice._id);
        await user.save();

        return res.status(200).json({ message: 'Device added to user successfully.', device: updatedDevice });
    }  
    catch (error) {
        console.error("Error creating device:", error);
        return res.status(500).json({ error});
    }
}

const createDevice = async (req, res) => {
    try {
        const deviceData = {
            user_email: "notSet",
            status: 'offline',
            feedingTime: [],
            feedingHistory: []
        };
        const newDevice = await deviceModel.create(deviceData);
        return res.status(200).json({newDevice});
    } 
    catch (error) {
        console.error("Error creating device:", error);
        return res.status(500).json({ error});
    }
}

const getDeviceById = async (req, res) => {
    try {
        const { deviceId } = req.params;
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID is required.' });
        }

        const device = await deviceModel.findById(deviceId);
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }
        return res.status(200).json({ device });
    }
    catch (error) {
        console.error("Error fetching device:", error);
        return res.status(500).json({ error });
    }
}

const getUserDevices = async (req, res) =>{
    try {
        const { userEmail } = req.params;
        if (!userEmail) {
            return res.status(400).json({ error: 'User email is required.' });
        }

        const user = await userModel.findOne({ email: userEmail }).populate('devices');
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        return res.status(200).json({ devices: user.devices });
    }
    catch (error) {
        console.error("Error fetching user's devices:", error);
        return res.status(500).json({ error });
    }
}

const getUserDevicesWithDetails = async (req, res) => {
    try {
        const { userEmail } = req.params;
        if (!userEmail) {
            return res.status(400).json({ error: 'User email is required.' });
        }

        const user = await userModel.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Get all device details for each device ID
        const deviceDetails = await Promise.all(
            user.devices.map(async (deviceId) => {
                try {
                    const device = await deviceModel.findById(deviceId);
                    return device;
                } catch (error) {
                    console.error(`Error fetching device ${deviceId}:`, error);
                    return null;
                }
            })
        );

        // Filter out null devices (in case some devices were deleted)
        const validDevices = deviceDetails.filter(device => device !== null);

        return res.status(200).json({ devices: validDevices });
    } catch (error) {
        console.error("Error fetching user's devices with details:", error);
        return res.status(500).json({ error });
    }
}

const modifyFeedingTime = async (req, res) => {
    try {
        const { deviceId, feedingTime } = req.body;
        if (!deviceId || !feedingTime) {
            return res.status(400).json({ error: 'Device ID and feeding time are required.' });
        }

        const device = await deviceModel.findById(deviceId);
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }
        device.feedingTime = feedingTime;
        const updatedDevice = await device.save();
        return res.status(200).json({ message: 'Feeding time updated successfully.', device: updatedDevice });
    }
    catch (error) {
        console.error("Error updating feeding time:", error);
        return res.status(500).json({ error });
    }
}

const addFeedingToHistory = async (req, res) => {
    try {
        const { deviceId } = req.body;
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID is required.' });
        }

        const device = await deviceModel.findById(deviceId);
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        const feedingDate = new Date();
        
        device.feedingHistory.push(feedingDate);
        device.lastFeedTime = feedingDate;
        
        await device.save();

        return res.status(200).json({ 
            message: 'Feeding recorded successfully.',
            feedingDate: feedingDate.toISOString(),
            totalFeedings: device.feedingHistory.length
        });
    } catch (error) {
        console.error("Error recording feeding:", error);
        return res.status(500).json({ error: 'Failed to record feeding.' });
    }
}

const getFeedingHistory = async (req, res) => {
    try {
        const { deviceId } = req.params;
        if (!deviceId) {
            return res.status(400).json({ error: 'Device ID is required.' });
        }

        const device = await deviceModel.findById(deviceId);
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        return res.status(200).json({ 
            feedingHistory: device.feedingHistory,
            totalFeedings: device.feedingHistory.length,
            lastFeedTime: device.lastFeedTime
        });
    } catch (error) {
        console.error("Error fetching feeding history:", error);
        return res.status(500).json({ error: 'Failed to fetch feeding history.' });
    }
}

module.exports = {
    addDeviceToUser,
    createDevice,
    getDeviceById,
    getUserDevices,
    getUserDevicesWithDetails,
    modifyFeedingTime,
    addFeedingToHistory,
    getFeedingHistory,
}
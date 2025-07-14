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
        // Return device data directly (not wrapped in device object)
        return res.status(200).json(device);
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
        
        // If device is online and has an IP, try to send WebSocket command
        let webSocketSuccess = false;
        if (device.status === 'online' && device.ipAddress) {
            try {
                const WebSocket = require('ws');
                const ws = new WebSocket(`ws://${device.ipAddress}:81`);
                
                await new Promise((resolve, reject) => {
                    const timeout = setTimeout(() => {
                        ws.close();
                        reject(new Error('WebSocket connection timeout'));
                    }, 5000);
                    
                    ws.on('open', () => {
                        clearTimeout(timeout);
                        const feedCommand = {
                            command: 'feed_now',
                            deviceId: deviceId,
                            timestamp: Date.now()
                        };
                        ws.send(JSON.stringify(feedCommand));
                        webSocketSuccess = true;
                        ws.close();
                        resolve();
                    });
                    
                    ws.on('error', (error) => {
                        clearTimeout(timeout);
                        reject(error);
                    });
                });
            } catch (error) {
                console.log(`WebSocket feed command failed for device ${deviceId}:`, error.message);
                // Continue with database recording even if WebSocket fails
            }
        }
        
        // Always record in database
        device.feedingHistory.push(feedingDate);
        device.lastFeedTime = feedingDate;
        
        await device.save();

        return res.status(200).json({ 
            message: 'Feeding recorded successfully.',
            feedingDate: feedingDate.toISOString(),
            totalFeedings: device.feedingHistory.length,
            webSocketSuccess,
            deviceStatus: device.status
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

const getDeviceSchedules = async (req, res) => {
    try {
        const { deviceId } = req.params;
        
        const device = await deviceModel.findById(deviceId);
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        const schedules = device.feedingTime.map((time, index) => ({
            id: index,
            time: time,
            hour: time.split(':')[0],
            minute: time.split(':')[1],
            enabled: true, 
            portion: 'Standard portion'
        }));

        return res.status(200).json(schedules);
    } catch (error) {
        console.error("Error fetching device schedules:", error);
        return res.status(500).json({ error: 'Failed to fetch device schedules.' });
    }
}

const updateSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;
        const { enabled } = req.body;
        
        return res.status(200).json({ message: 'Schedule updated successfully.' });
    } catch (error) {
        console.error("Error updating schedule:", error);
        return res.status(500).json({ error: 'Failed to update schedule.' });
    }
}

const updateAutoFeeding = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { autoFeeding } = req.body;
        
        const device = await deviceModel.findById(deviceId);
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        device.autoFeeding = autoFeeding;
        await device.save();

        return res.status(200).json({ message: 'Auto feeding setting updated successfully.' });
    } catch (error) {
        console.error("Error updating auto feeding:", error);
        return res.status(500).json({ error: 'Failed to update auto feeding setting.' });
    }
}

const addSchedule = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { time } = req.body;
        
        if (!time) {
            return res.status(400).json({ error: 'Time is required.' });
        }
        
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(time)) {
            return res.status(400).json({ error: 'Invalid time format. Use HH:MM format.' });
        }
        
        const device = await deviceModel.findById(deviceId);
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        if (device.feedingTime.includes(time)) {
            return res.status(400).json({ error: 'This feeding time already exists.' });
        }

        device.feedingTime.push(time);
        await device.save();

        return res.status(200).json({ 
            message: 'Schedule added successfully.',
            feedingTime: device.feedingTime
        });
    } catch (error) {
        console.error("Error adding schedule:", error);
        return res.status(500).json({ error: 'Failed to add schedule.' });
    }
}

const deleteSchedule = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { scheduleIndex } = req.body;
        
        if (scheduleIndex === undefined || scheduleIndex === null) {
            return res.status(400).json({ error: 'Schedule index is required.' });
        }
        
        const device = await deviceModel.findById(deviceId);
        if (!device) {
            return res.status(404).json({ error: 'Device not found.' });
        }

        if (scheduleIndex < 0 || scheduleIndex >= device.feedingTime.length) {
            return res.status(400).json({ error: 'Invalid schedule index.' });
        }

        // Remove the schedule at the specified index
        device.feedingTime.splice(scheduleIndex, 1);
        await device.save();

        return res.status(200).json({ 
            message: 'Schedule deleted successfully.',
            feedingTime: device.feedingTime
        });
    } catch (error) {
        console.error("Error deleting schedule:", error);
        return res.status(500).json({ error: 'Failed to delete schedule.' });
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
    getDeviceSchedules,
    updateSchedule,
    updateAutoFeeding,
    addSchedule,
    deleteSchedule,
}
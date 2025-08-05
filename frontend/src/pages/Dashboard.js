import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDeviceControl } from '../hooks/useWebSocket';
import { Link } from 'react-router-dom';
import DeviceDetails from '../components/DeviceDetails';
import FeedingConfig from '../components/FeedingConfig';

const Dashboard = () => {
    const { user } = useAuthContext();
    const [devices, setDevices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showFeedingConfig, setShowFeedingConfig] = useState(false);
    const [feedingDeviceId, setFeedingDeviceId] = useState(null);
    const modalRef = useRef(null);

    const firstOnlineDevice = devices.find(d => d.status === 'online');
    const deviceIp = firstOnlineDevice?.ipAddress;
    const currentDeviceId = firstOnlineDevice?._id; // Get the current device ID
    const { 
        isConnected, 
        deviceStatus, 
        feedNow, 
        connectionError, 
        lastFeedResponse,
        reconnect 
    } = useDeviceControl(deviceIp, currentDeviceId);

    useEffect(() => {
        const fetchDevices = async () => {
            if (!user?.username) return;

            try {
                const response = await fetch(`${process.env.REACT_APP_API}/api/device/getUserDevicesWithDetails/${user.username}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch devices');
                }

                setDevices(data.devices || []);
            } catch (error) {
                console.log('Error fetching devices:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDevices();
    }, [user]);

    useEffect(() => {
        if (lastFeedResponse) {
            console.log('Feed response received:', lastFeedResponse);
            
            if (lastFeedResponse.success) {
                setTimeout(() => {
                    setFeedingDeviceId(null);
                    setDevices(prev => prev.map(d => 
                        d.status === 'feeding' ? { ...d, status: 'online' } : d
                    ));
                }, 2000);
            } else {
                setFeedingDeviceId(null);
                setError(`Feed failed: ${lastFeedResponse.message}`);
                setTimeout(() => setError(''), 5000);
            }
        }
    }, [lastFeedResponse]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleCloseModal();
            }
        };

        if (showModal) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden'; 
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'online':
                return 'bg-green-100 text-green-800';
            case 'offline':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleViewDetails = (device) => {
        setSelectedDevice(device);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDevice(null);
    };

    const handleOpenFeedingConfig = (device) => {
        setSelectedDevice(device);
        setShowFeedingConfig(true);
    };

    const handleCloseFeedingConfig = () => {
        setShowFeedingConfig(false);
        setSelectedDevice(null);
    };

    const handleSaveFeedingTimes = async (feedingTimes) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API}/api/device/modifyFeedingTime`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ 
                    deviceId: selectedDevice._id, 
                    feedingTime: feedingTimes 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update feeding times');
            }

            handleCloseFeedingConfig();
            
            // Refresh devices list
            const fetchDevices = async () => {
                if (!user?.username) return;
                try {
                    const response = await fetch(`${process.env.REACT_APP_API}/api/device/getUserDevicesWithDetails/${user.username}`, {
                        headers: {
                            'Authorization': `Bearer ${user.token}`
                        }
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setDevices(data.devices || []);
                    }
                } catch (error) {
                    console.log('Error refreshing devices:', error);
                }
            };
            fetchDevices();
        } catch (error) {
            console.error('Error saving feeding times:', error);
        }
    };



    const handleFeedNow = async (deviceId) => {
        try {
            setFeedingDeviceId(deviceId);
            
            const device = devices.find(d => d._id === deviceId);
            
            if (!device) {
                throw new Error('Device not found');
            }
            
            if (device.status !== 'online') {
                throw new Error('Device is offline');
            }
            
            if (!device.ipAddress) {
                throw new Error('Device IP address not configured. Please configure the device IP in settings.');
            }
            
            if (!isConnected) {
                throw new Error('Device not connected via WebSocket. DEVICES ARE NOT AVAILABLE TO THE PUBLIC, YOU CANNOT FEED IT as you do not own one. CHECK THE DEVLOGS\'S. Try configure feeding or view details instead, they work even if the device is offline.');
            }
            
            const actualDeviceId = device.deviceId || device._id;
            if (!actualDeviceId) {
                throw new Error('Device ID not found');
            }
            
            const success = feedNow(actualDeviceId);
            
            if (!success) {
                throw new Error('Failed to send feed command - WebSocket not connected');
            }
            
            console.log(`Feed command sent successfully to device: ${actualDeviceId}`);
            
            setError('');
            
            // Record feeding in backend immediately when button is clicked
            try {
                await fetch(`${process.env.REACT_APP_API}/api/device/addFeedingToHistory`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ deviceId })
                });
                console.log('Feeding recorded in backend for device:', deviceId);
            } catch (error) {
                console.error('Failed to record feeding in backend:', error);
            }
            
            setDevices(prev => prev.map(d => 
                d._id === deviceId 
                    ? { ...d, status: 'feeding' }
                    : d
            ));
            
            setTimeout(() => {
                setDevices(prev => prev.map(d => 
                    d._id === deviceId 
                        ? { ...d, status: 'online' }
                        : d
                ));
                setFeedingDeviceId(null);
            }, 15000);
            
        } catch (error) {
            console.error('Error feeding device:', error);
            setError(`Failed to feed device: ${error.message}`);
            setFeedingDeviceId(null);
            
            setTimeout(() => setError(''), 5000);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-meow-pink mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading your devices...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Connection Status */}
                {firstOnlineDevice && deviceIp ? (
                    <div className={`mb-4 p-3 rounded-lg flex items-center justify-between ${
                        isConnected ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span className="text-sm font-medium">
                                {isConnected ? 'Connected' : `You cannot connect to the device because you do not own one as they are not available to the public. Check the devlogs's.`}
                                {deviceStatus && ` (${deviceStatus.status})`}
                            </span>
                            {connectionError && (
                                <span className="text-red-600 text-sm">- {connectionError}</span>
                            )}
                        </div>
                        {!isConnected && (
                            <button 
                                onClick={reconnect}
                                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                            >
                                Reconnect
                            </button>
                        )}
                    </div>
                ) : firstOnlineDevice && !deviceIp ? (
                    <div className="mb-4 p-3 rounded-lg bg-blue-100 text-blue-800 flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">
                            Device IP address not configured. Real-time features disabled.
                        </span>
                    </div>
                ) : (
                    <div className="mb-4 p-3 rounded-lg bg-gray-100 text-gray-600 flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span className="text-sm font-medium">
                            No online devices found. Add a device to get started.
                        </span>
                    </div>
                )}
                
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.username}! Manage your MeowFeeder devices.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Your Devices</h2>
                        <Link
                            to="/add-device"
                            className="px-4 py-2 bg-meow-pink text-white rounded-lg hover:bg-meow-pink-hover transition-all duration-200"
                        >
                            Add New Device
                        </Link>
                    </div>

                    {devices.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-800 mb-2">No devices found</h3>
                            <p className="text-gray-600 mb-4">Get started by adding your first MeowFeeder device.</p>
                            <Link
                                to="/add-device"
                                className="inline-block px-6 py-2 bg-meow-pink text-white rounded-lg hover:bg-meow-pink-hover transition-all duration-200"
                            >
                                Add Your First Device
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {devices.map((device) => (
                                <div key={device._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-medium text-gray-800">
                                            Device {device?._id?.slice(-6)}
                                        </h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-red-500`}>
                                            OFFLINE
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div>
                                            <strong>ID:</strong> {device._id}
                                        </div>
                                        <div>
                                            <strong>Feeding Times:</strong> {device.feedingTime?.length || 0} scheduled
                                        </div>
                                        <div>
                                            <strong>Last Fed:</strong> {device.lastFeedTime 
                                                ? new Date(device.lastFeedTime).toLocaleDateString()
                                                : 'Never'
                                            }
                                        </div>
                                        <div>
                                            <strong>Last Updated:</strong> {new Date(device.updatedAt).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col space-y-2">
                                        <div className="flex space-x-2">
                                            <button 
                                                onClick={() => handleOpenFeedingConfig(device)}
                                                className="flex-1 py-2 px-3 bg-meow-pink text-white rounded-lg hover:bg-meow-pink-hover transition-all duration-200 text-sm"
                                            >
                                                Configure feeding
                                            </button>
                                            <button 
                                                onClick={() => handleViewDetails(device)}
                                                className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => handleFeedNow(device._id)}
                                            disabled={device.status !== 'online' || feedingDeviceId === device._id}
                                            className={`w-full py-2 px-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                                                feedingDeviceId === device._id
                                                    ? 'bg-orange-500 text-white cursor-not-allowed'
                                                    : device.status === 'online' 
                                                        ? 'bg-green-600 text-white hover:bg-green-700' 
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                        >
                                            {feedingDeviceId === device._id ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Feeding...
                                                </span>
                                            ) : device.status === 'online' ? '🐾 Feed Now' : 'Device Offline'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-meow-pink bg-opacity-20 rounded-lg">
                                <svg className="w-6 h-6 text-meow-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Devices</p>
                                <p className="text-2xl font-bold text-gray-800">{devices.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Online Devices</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {devices.filter(d => d.status === 'online').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Scheduled Feedings</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {devices.reduce((total, device) => total + (device.feedingTime?.length || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && selectedDevice && (
                <DeviceDetails
                    device={selectedDevice}
                    isOpen={showModal}
                    onClose={handleCloseModal}
                    onFeedNow={handleFeedNow}
                    onEditSchedule={handleOpenFeedingConfig}
                />
            )}

            {showFeedingConfig && selectedDevice && (
                <FeedingConfig
                    device={selectedDevice}
                    isOpen={showFeedingConfig}
                    onClose={handleCloseFeedingConfig}
                    onSave={handleSaveFeedingTimes}
                />
            )}
        </div>
    );
}

export default Dashboard;
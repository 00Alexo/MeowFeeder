import { useRef, useEffect } from 'react';

const DeviceDetails = ({ device, isOpen, onClose, onFeedNow, onEditSchedule }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

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

    const formatFeedingTime = (time) => {
        if (!time) return 'Not set';
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    if (!isOpen || !device) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Device Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Device ID</label>
                                    <p className="text-gray-800 font-mono text-sm bg-gray-50 p-2 rounded">
                                        {device._id}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Status</label>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(device.status)}`}>
                                        {device.status}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Owner Email</label>
                                    <p className="text-gray-800">{device.user_email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Created</label>
                                    <p className="text-gray-800">
                                        {new Date(device.createdAt).toLocaleDateString()} at {new Date(device.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                                    <p className="text-gray-800">
                                        {new Date(device.updatedAt).toLocaleDateString()} at {new Date(device.updatedAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Last Fed</label>
                                    <p className="text-gray-800">
                                        {device.lastFeedTime 
                                            ? `${new Date(device.lastFeedTime).toLocaleDateString()} at ${new Date(device.lastFeedTime).toLocaleTimeString()}`
                                            : 'Never'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Feeding Schedule</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Total Scheduled Feedings</label>
                                    <p className="text-2xl font-bold text-meow-pink">{device.feedingTime?.length || 0}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Total Feedings Done</label>
                                    <p className="text-2xl font-bold text-green-600">{device.feedingHistory?.length || 0}</p>
                                </div>
                                {device.feedingTime && device.feedingTime.length > 0 ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">Scheduled Times</label>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {device.feedingTime.map((time, index) => (
                                                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                                    <span className="text-gray-800 font-medium">
                                                        {formatFeedingTime(time)}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Daily
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-gray-500 text-sm">No feeding times scheduled</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Recent Feeding History</h3>
                        {device.feedingHistory && device.feedingHistory.length > 0 ? (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {device.feedingHistory
                                    .slice()
                                    .reverse()
                                    .slice(0, 10)
                                    .map((date, index) => (
                                        <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded">
                                            <span className="text-gray-800 font-medium">
                                                {new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString()}
                                            </span>
                                            <span className="text-xs text-green-600 font-medium">
                                                Fed
                                            </span>
                                        </div>
                                    ))}
                                {device.feedingHistory.length > 10 && (
                                    <p className="text-sm text-gray-500 text-center py-2">
                                        ... and {device.feedingHistory.length - 10} more feeding(s)
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                                <p className="text-gray-500 text-sm">No feeding history yet</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-between items-center pt-6 border-t">
                        <button
                            onClick={() => onFeedNow(device._id)}
                            disabled={device.status !== 'online'}
                            className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium ${
                                device.status === 'online'
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {device.status === 'online' ? '🐾 Feed Now' : 'Device Offline'}
                        </button>
                        <div className="flex space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                            >
                                Close
                            </button>
                            <button 
                                onClick={() => {
                                    onClose();
                                    onEditSchedule(device);
                                }}
                                className="px-4 py-2 bg-meow-pink text-white rounded-lg hover:bg-meow-pink-hover transition-all duration-200"
                            >
                                Edit Schedule
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceDetails;

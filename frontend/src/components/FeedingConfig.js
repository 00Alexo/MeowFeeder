import { useState, useRef, useEffect } from 'react';

const FeedingConfig = ({ device, isOpen, onClose, onSave }) => {
    const [feedingTimes, setFeedingTimes] = useState([]);
    const [newFeedingTime, setNewFeedingTime] = useState('');
    const modalRef = useRef(null);

    useEffect(() => {
        if (device) {
            setFeedingTimes(device.feedingTime || []);
        }
    }, [device]);

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

    const formatFeedingTime = (time) => {
        if (!time) return 'Not set';
        return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const handleAddFeedingTime = () => {
        if (newFeedingTime && !feedingTimes.includes(newFeedingTime)) {
            setFeedingTimes([...feedingTimes, newFeedingTime]);
            setNewFeedingTime('');
        }
    };

    const handleRemoveFeedingTime = (timeToRemove) => {
        setFeedingTimes(feedingTimes.filter(time => time !== timeToRemove));
    };

    const handleSave = () => {
        onSave(feedingTimes);
    };

    const handleClose = () => {
        setFeedingTimes([]);
        setNewFeedingTime('');
        onClose();
    };

    if (!isOpen || !device) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div ref={modalRef} className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Configure Feeding Schedule</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-4">
                            Device: <span className="font-medium">{device._id.slice(-6)}</span>
                        </p>
                    </div>

                    {/* Add new feeding time */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add Feeding Time
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="time"
                                value={newFeedingTime}
                                onChange={(e) => setNewFeedingTime(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meow-pink focus:border-transparent"
                            />
                            <button
                                onClick={handleAddFeedingTime}
                                disabled={!newFeedingTime}
                                className="px-4 py-2 bg-meow-pink text-white rounded-lg hover:bg-meow-pink-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Current feeding times */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Current Feeding Times ({feedingTimes.length})
                        </label>
                        {feedingTimes.length > 0 ? (
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {feedingTimes.sort().map((time, index) => (
                                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                        <span className="font-medium text-gray-800">
                                            {formatFeedingTime(time)}
                                        </span>
                                        <button
                                            onClick={() => handleRemoveFeedingTime(time)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm">No feeding times set</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-meow-pink text-white rounded-lg hover:bg-meow-pink-hover transition-all duration-200"
                        >
                            Save Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedingConfig;

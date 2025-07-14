import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';

const AddDevice = () => {
    const { user } = useAuthContext();
    const [deviceId, setDeviceId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleAddDevice = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await fetch(`${process.env.REACT_APP_API}/api/device/addDeviceToUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    userEmail: user.username,
                    deviceId: deviceId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add device');
            }

            setMessage('Device added successfully!');
            setDeviceId('');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add Device</h1>

                {/* Add Existing Device Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Add Existing Device</h2>
                    <form onSubmit={handleAddDevice}>
                        <div className="mb-4">
                            <label htmlFor="deviceId" className="block text-sm font-medium text-gray-700 mb-2">
                                Device ID
                            </label>
                            <input
                                type="text"
                                id="deviceId"
                                value={deviceId}
                                onChange={(e) => setDeviceId(e.target.value)}
                                placeholder="Enter device ID"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-meow-pink focus:border-transparent"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !deviceId}
                            className="w-full py-2 px-4 bg-meow-pink text-white rounded-lg hover:bg-meow-pink-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? 'Adding...' : 'Add Device'}
                        </button>
                    </form>
                </div>

                {/* Messages */}
                {message && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Instructions */}
                <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Instructions:</h3>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Copy the device ID from your hardware device</li>
                        <li>Enter the device ID to associate it with your account</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AddDevice;

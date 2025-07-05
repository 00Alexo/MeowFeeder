import React, { useState } from 'react';
import { useDeviceControl } from '../hooks/useWebSocket';

const WebSocketTester = () => {
  const [deviceIp, setDeviceIp] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [testIp, setTestIp] = useState('');
  const { isConnected, deviceStatus, feedNow, getStatus, connectionError, feedHistory } = useDeviceControl(testIp);

  const handleConnect = () => {
    if (deviceIp.trim()) {
      setTestIp(deviceIp.trim());
    }
  };

  const handleDisconnect = () => {
    setTestIp('');
  };

  const handleFeedNow = () => {
    if (!deviceId.trim()) {
      alert('Please enter a Device ID first');
      return;
    }
    feedNow(deviceId.trim());
  };

  const handleGetStatus = () => {
    if (!deviceId.trim()) {
      alert('Please enter a Device ID first');
      return;
    }
    getStatus(deviceId.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">WebSocket Device Tester</h1>
        
        {/* Connection Setup */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Device Connection</h2>
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Enter device IP (e.g., 192.168.1.100)"
              value={deviceIp}
              onChange={(e) => setDeviceIp(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-pink"
            />
            <button
              onClick={handleConnect}
              disabled={!deviceIp.trim() || isConnected}
              className="px-4 py-2 bg-meow-pink text-white rounded-md hover:bg-meow-pink-hover disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Connect
            </button>
            <button
              onClick={handleDisconnect}
              disabled={!testIp}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Disconnect
            </button>
          </div>
          
          {/* Device ID Configuration */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Device ID</label>
            <input
              type="text"
              placeholder="Enter device ID (e.g., meowfeeder_001, device_abc123)"
              value={deviceId}
              onChange={(e) => setDeviceId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-pink"
            />
            <p className="text-xs text-gray-500 mt-1">
              This should match the deviceId configured in your ESP32 device
            </p>
          </div>
          
          {/* Connection Status */}
          <div className={`p-3 rounded-lg flex items-center space-x-2 ${
            isConnected ? 'bg-green-100 text-green-800' : 
            testIp ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 
              testIp ? 'bg-red-500' : 'bg-gray-400'
            }`}></div>
            <span className="font-medium">
              {!testIp ? 'Not connected' : isConnected ? `Connected to ${testIp}` : `Failed to connect to ${testIp}`}
            </span>
          </div>
          
          {connectionError && (
            <div className="mt-2 p-3 bg-red-100 text-red-700 rounded-lg">
              <strong>Error:</strong> {connectionError}
            </div>
          )}
        </div>

        {/* Device Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Device Controls</h2>
          <div className="flex space-x-4 mb-4">
            <button
              onClick={handleFeedNow}
              disabled={!isConnected || !deviceId.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              🐾 Feed Now
            </button>
            <button
              onClick={handleGetStatus}
              disabled={!isConnected || !deviceId.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              📊 Get Status
            </button>
          </div>
          
          {!isConnected ? (
            <p className="text-gray-500 text-sm">Connect to a device to enable controls</p>
          ) : !deviceId.trim() ? (
            <p className="text-orange-600 text-sm">Enter a Device ID to enable controls</p>
          ) : null}
        </div>

        {/* Device Status */}
        {deviceStatus && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Device Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-semibold">{deviceStatus.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Daily Feed Count</p>
                <p className="font-semibold">{deviceStatus.dailyFeedCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Current Position</p>
                <p className="font-semibold">{deviceStatus.currentPosition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">WiFi Signal</p>
                <p className="font-semibold">{deviceStatus.wifiSignal} dBm</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Device Info</p>
              <p className="font-mono text-sm">ID: {deviceStatus.deviceId}</p>
              <p className="font-mono text-sm">Name: {deviceStatus.deviceName}</p>
              <p className="font-mono text-sm">Uptime: {Math.floor(deviceStatus.uptime / 1000)} seconds</p>
            </div>
          </div>
        )}

        {/* Feed History */}
        {feedHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Feed History</h2>
            <div className="space-y-2">
              {feedHistory.slice(-5).reverse().map((feed, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">{feed.message}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(feed.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Testing Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-700">
            <li>Make sure your ESP32 MeowFeeder device is powered on and connected to WiFi</li>
            <li>Check the Serial Monitor output to find the device's IP address</li>
            <li>Enter the IP address above and click Connect</li>
            <li>Once connected, use the controls to test device functionality</li>
            <li>Monitor the device status and feed history in real-time</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-100 rounded border border-blue-300">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> If connection fails, ensure:
            </p>
            <ul className="list-disc list-inside text-xs text-blue-700 mt-1">
              <li>Device and computer are on the same network</li>
              <li>ESP32 WebSocket server is running on port 81</li>
              <li>No firewall is blocking the connection</li>
              <li>IP address is correct and reachable</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketTester;

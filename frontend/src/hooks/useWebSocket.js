import { useState, useEffect, useRef } from 'react';

export const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const socketRef = useRef(null); // Keep a ref to the socket for better state management

  const connect = () => {
    // Don't try to connect if no URL is provided
    if (!url) {
      setConnectionError('No device IP configured');
      return;
    }

    // Close existing connection if any
    if (socketRef.current) {
      socketRef.current.close();
    }

    try {
      console.log('Attempting to connect to:', url);
      const ws = new WebSocket(url);
      socketRef.current = ws;
      
      ws.onopen = () => {
        console.log('WebSocket connected to:', url);
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
        setSocket(ws);
        
        setTimeout(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              command: 'get_status',
              timestamp: Date.now()
            }));
          }
        }, 100);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          setLastMessage({ ...data, receivedAt: Date.now() });
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        setSocket(null);
        
        if (socketRef.current === ws) {
          socketRef.current = null;
        }
        
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts && url) {
          const timeout = Math.pow(2, reconnectAttemptsRef.current) * 1000; // Exponential backoff
          console.log(`Attempting to reconnect in ${timeout}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, timeout);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError('Failed to connect after multiple attempts');
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error occurred');
      };

    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setConnectionError('Failed to create connection');
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (socketRef.current) {
      socketRef.current.close(1000, 'User disconnected');
      socketRef.current = null;
    }
    setSocket(null);
    setIsConnected(false);
  };

  const sendMessage = (message) => {
    console.log('Attempting to send message:', message);
    console.log('Socket state:', socketRef.current ? 'exists' : 'null', 'Connected:', isConnected);
    
    const currentSocket = socketRef.current;
    if (currentSocket && isConnected && currentSocket.readyState === WebSocket.OPEN) {
      currentSocket.send(JSON.stringify(message));
      console.log('Message sent successfully');
      return true;
    } else {
      console.warn('WebSocket not ready:', {
        socket: !!currentSocket,
        isConnected,
        readyState: currentSocket?.readyState,
        WebSocket_OPEN: WebSocket.OPEN
      });
      return false;
    }
  };

  useEffect(() => {
    if (url) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url]);

  return {
    isConnected,
    lastMessage,
    connectionError,
    sendMessage,
    connect,
    disconnect,
    reconnect: () => {
      disconnect();
      setTimeout(() => {
        reconnectAttemptsRef.current = 0;
        connect();
      }, 500);
    }
  };
};

export const useDeviceControl = (deviceIp, deviceId) => {
  const url = deviceIp && deviceIp !== 'esp32.local' && deviceIp.length > 0 
    ? `ws://${deviceIp}:81` 
    : null;
    
  const { isConnected, lastMessage, connectionError, sendMessage, reconnect } = useWebSocket(url);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [feedHistory, setFeedHistory] = useState([]);
  const [lastFeedResponse, setLastFeedResponse] = useState(null);

  // Function to record feeding in backend database
  const recordFeedingInBackend = async (deviceId) => {
    try {
      console.log('Recording feeding in backend for device:', deviceId);
      console.log('API URL:', `${process.env.REACT_APP_API}/api/device/addFeedingToHistory`);
      
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await fetch(`${process.env.REACT_APP_API}/api/device/addFeedingToHistory`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ deviceId })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to record feeding');
      }

      console.log('Feeding recorded successfully in backend:', data);
      return data;
    } catch (error) {
      console.error('Error recording feeding in backend:', error);
      // Don't throw - we don't want to break the feeding sequence if backend recording fails
    }
  };

  useEffect(() => {
    if (lastMessage) {
      console.log('Processing message:', lastMessage.type, lastMessage);
      
      switch (lastMessage.type) {
        case 'device_status':
          setDeviceStatus(lastMessage);
          console.log('Device status updated:', lastMessage.status);
          break;
          
        case 'feed_complete':
          console.log('Feed sequence completed!');
          setFeedHistory(prev => [...prev, {
            timestamp: lastMessage.timestamp,
            message: lastMessage.message,
            dailyCount: lastMessage.dailyCount
          }]);
          
          setTimeout(() => {
            if (isConnected) {
              sendMessage({
                command: 'get_status',
                timestamp: Date.now()
              });
            }
          }, 200);
          break;
          
        case 'feed_response':
          console.log('Feed response received:', lastMessage);
          setLastFeedResponse(lastMessage);
          break;
          
        default:
          console.log('Unknown message type:', lastMessage.type);
      }
    }
  }, [lastMessage, isConnected, sendMessage]);

  const feedNow = (deviceId) => {
    if (!deviceId) {
      console.warn('No device ID provided for feed command');
      return false;
    }
    return sendMessage({
      command: 'feed_now',
      deviceId: deviceId,
      timestamp: Date.now()
    });
  };

  const getStatus = (deviceId) => {
    if (!deviceId) {
      console.warn('No device ID provided for status command');
      return false;
    }
    return sendMessage({
      command: 'get_status',
      deviceId: deviceId,
      timestamp: Date.now()
    });
  };

  const stopFeed = (deviceId) => {
    if (!deviceId) {
      console.warn('No device ID provided for stop command');
      return false;
    }
    return sendMessage({
      command: 'stop_feed',
      deviceId: deviceId,
      timestamp: Date.now()
    });
  };

  return {
    isConnected,
    connectionError,
    deviceStatus,
    feedHistory,
    lastFeedResponse,
    feedNow,
    getStatus,
    stopFeed,
    reconnect
  };
};

import { useState, useEffect, useRef } from 'react'

export const useWebSocket = (url) => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const [connectionError, setConnectionError] = useState(null)
  const socketRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5

  const connect = () => {
    if (!url) {
      console.log('❌ No URL provided for WebSocket connection')
      setConnectionError('No device IP configured')
      return
    }

    console.log('🔗 Attempting WebSocket connection to:', url)

    if (socketRef.current) {
      console.log('🔄 Closing existing WebSocket connection')
      socketRef.current.close()
    }

    try {
      console.log('🚀 Creating new WebSocket connection')
      const ws = new WebSocket(url)
      socketRef.current = ws
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected successfully to:', url)
        setIsConnected(true)
        setConnectionError(null)
        reconnectAttemptsRef.current = 0
        
        // Request device status after connection
        console.log('📤 Requesting device status...')
        setTimeout(() => {
          if (ws.readyState === WebSocket.OPEN) {
            const statusMessage = {
              command: 'get_status',
              timestamp: Date.now()
            }
            console.log('📤 Sending status request:', statusMessage)
            ws.send(JSON.stringify(statusMessage))
          }
        }, 100)
      }
      
      ws.onmessage = (event) => {
        console.log('📩 WebSocket message received:', event.data)
        try {
          const data = JSON.parse(event.data)
          console.log('📦 Parsed message:', data)
          setLastMessage({ ...data, receivedAt: Date.now() })
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error)
        }
      }
      
      ws.onclose = (event) => {
        console.log('❌ WebSocket connection closed. Code:', event.code, 'Reason:', event.reason)
        setIsConnected(false)
        
        if (socketRef.current === ws) {
          socketRef.current = null
        }
        
        // Auto-reconnect if not manually closed
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts && url) {
          const timeout = Math.pow(2, reconnectAttemptsRef.current) * 1000
          console.log(`🔄 Reconnecting in ${timeout}ms (attempt ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts})`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++
            connect()
          }, timeout)
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.log('❌ Max reconnection attempts reached')
          setConnectionError('Failed to connect after multiple attempts')
        }
      }
      
      ws.onerror = (error) => {
        console.log('❌ WebSocket error:', error)
        setConnectionError('Connection error occurred')
      }

    } catch (error) {
      console.log('❌ Failed to create WebSocket connection:', error)
      setConnectionError('Failed to create connection')
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (socketRef.current) {
      socketRef.current.close(1000, 'User disconnected')
      socketRef.current = null
    }
    setIsConnected(false)
  }

  const sendMessage = (message) => {
    const currentSocket = socketRef.current
    console.log('📤 Attempting to send message:', message)
    console.log('📊 Socket state:', {
      socketExists: !!currentSocket,
      isConnected,
      readyState: currentSocket?.readyState,
      expectedState: WebSocket.OPEN
    })
    
    if (currentSocket && isConnected && currentSocket.readyState === WebSocket.OPEN) {
      try {
        const messageStr = JSON.stringify(message)
        console.log('📤 Sending message:', messageStr)
        currentSocket.send(messageStr)
        return true
      } catch (error) {
        console.error('❌ Error sending message:', error)
        return false
      }
    } else {
      console.log('❌ Cannot send message - WebSocket not ready')
      return false
    }
  }

  useEffect(() => {
    if (url) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [url])

  return {
    isConnected,
    lastMessage,
    connectionError,
    sendMessage,
    connect,
    disconnect,
    reconnect: () => {
      disconnect()
      setTimeout(() => {
        reconnectAttemptsRef.current = 0
        connect()
      }, 500)
    }
  }
}

export const useDeviceControl = (deviceIp, deviceId) => {
  const url = deviceIp && deviceIp !== 'esp32.local' && deviceIp.length > 0 
    ? `ws://${deviceIp}:81` 
    : null
  
  console.log('🔌 WebSocket URL:', { deviceIp, deviceId, url, attempting: !!url })
    
  const { isConnected, lastMessage, connectionError, sendMessage, reconnect } = useWebSocket(url)
  const [deviceStatus, setDeviceStatus] = useState(null)
  const [feedHistory, setFeedHistory] = useState([])
  const [lastFeedResponse, setLastFeedResponse] = useState(null)

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'device_status':
          setDeviceStatus(lastMessage)
          break
          
        case 'feed_complete':
          setFeedHistory(prev => [...prev, {
            timestamp: lastMessage.timestamp,
            message: lastMessage.message,
            dailyCount: lastMessage.dailyCount
          }])
          
          // Request status update after feeding
          setTimeout(() => {
            if (isConnected) {
              sendMessage({
                command: 'get_status',
                timestamp: Date.now()
              })
            }
          }, 200)
          break
          
        case 'feed_response':
          setLastFeedResponse(lastMessage)
          break
      }
    }
  }, [lastMessage, isConnected, sendMessage])

  const feedNow = (deviceId) => {
    console.log('🍽️ Feed Now requested for device:', deviceId)
    
    if (!deviceId) {
      console.log('❌ No device ID provided')
      return false
    }
    
    const message = {
      command: 'feed_now',
      deviceId: deviceId,
      timestamp: Date.now()
    }
    
    console.log('📤 Sending feed command:', message)
    const success = sendMessage(message)
    console.log('📤 Feed command sent successfully:', success)
    
    return success
  }

  const getStatus = (deviceId) => {
    if (!deviceId) {
      return false
    }
    return sendMessage({
      command: 'get_status',
      deviceId: deviceId,
      timestamp: Date.now()
    })
  }

  const stopFeed = (deviceId) => {
    if (!deviceId) {
      return false
    }
    return sendMessage({
      command: 'stop_feed',
      deviceId: deviceId,
      timestamp: Date.now()
    })
  }

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
  }
}

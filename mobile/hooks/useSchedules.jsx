import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import API_CONFIG from '../config/api'
import { useUserContext } from './useUserContext'
import { useDeviceControl } from './useWebSocket'

export const useSchedules = (deviceId) => {
    const { user, isAuthReady } = useUserContext()
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [selectedDeviceData, setSelectedDeviceData] = useState(null)
    
    // Get device data for WebSocket connection
    const deviceIp = selectedDeviceData?.ipAddress
    const { isConnected, feedNow: feedNowWebSocket, connectionError } = useDeviceControl(deviceIp, deviceId)

    const fetchDeviceData = async (deviceId) => {
        if (!deviceId || !user?.token) return
        
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/device/getDeviceById/${deviceId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                setSelectedDeviceData(data)
            }
        } catch (err) {
        }
    }

    useEffect(() => {
        if (deviceId) {
            fetchDeviceData(deviceId)
        }
    }, [deviceId, user?.token])

    const fetchSchedules = async (deviceId) => {
        if (!deviceId) return
        
        setLoading(true)
        setError(null)
        
        try {
            if (!isAuthReady) {
                setLoading(false)
                return
            }
            
            if (!user || !user.token) {
                throw new Error('No authentication token found')
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/device/schedules/${deviceId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            setSchedules(data || [])
        } catch (err) {
            setError(err.message)
            setSchedules([])
        } finally {
            setLoading(false)
        }
    }

    const toggleSchedule = async (scheduleId, enabled) => {
        try {
            if (!user || !user.token) {
                throw new Error('No authentication token found')
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/device/schedules/${scheduleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ enabled })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            setSchedules(prev => prev.map(schedule => 
                schedule.id === scheduleId 
                    ? { ...schedule, enabled }
                    : schedule
            ))
        } catch (err) {
            setError(err.message)
        }
    }

    const deleteSchedule = async (deviceId, scheduleIndex) => {
        try {
            if (!user || !user.token) {
                throw new Error('No authentication token found')
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/device/${deviceId}/deleteSchedule`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scheduleIndex })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            await fetchSchedules(deviceId)
            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }

    const updateAutoFeeding = async (deviceId, enabled) => {
        try {
            if (!user || !user.token) {
                throw new Error('No authentication token found')
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/device/${deviceId}/auto-feeding`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ autoFeeding: enabled })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }

    const addSchedule = async (deviceId, timeString) => {
        try {
            if (!user || !user.token) {
                throw new Error('No authentication token found')
            }

            const response = await fetch(`${API_CONFIG.BASE_URL}/api/device/${deviceId}/addSchedule`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ time: timeString })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            await fetchSchedules(deviceId)
            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }

    const feedNow = async (deviceId) => {
        try {
            if (!user || !user.token) {
                throw new Error('No authentication token found')
            }

            // Mobile app can't connect directly to device IP like the web frontend
            // Instead, we'll use the backend API to trigger the feed
            const response = await fetch(`${API_CONFIG.BASE_URL}/api/device/addFeedingToHistory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ deviceId })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return true
        } catch (err) {
            setError(err.message)
            return false
        }
    }

    useEffect(() => {
        if (deviceId) {
            fetchSchedules(deviceId)
        }
    }, [deviceId])

    return {
        schedules,
        loading,
        error,
        fetchSchedules,
        toggleSchedule,
        deleteSchedule,
        updateAutoFeeding,
        addSchedule,
        feedNow,
        refetch: () => fetchSchedules(deviceId),
        // Mobile apps can't directly connect to device WebSocket
        // Show as "connected" if device has an IP and status is online
        isWebSocketConnected: selectedDeviceData?.status === 'online' && selectedDeviceData?.ipAddress,
        webSocketError: selectedDeviceData?.status === 'offline' ? 'Device is offline' : null,
        deviceData: selectedDeviceData
    }
}

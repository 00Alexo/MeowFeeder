import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import API_CONFIG from '../config/api'
import { useUserContext } from './useUserContext'

export const useDashboardData = () => {
  const { user, isAuthReady } = useUserContext()
  const [devices, setDevices] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [stats, setStats] = useState({
    activeDevices: 0,
    todaysFeeds: 0,
    scheduledFeeds: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const fetchWithRetry = async (url, options, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        return response
      } catch (error) {
        if (i === maxRetries - 1) throw error
        
        const delay = Math.pow(2, i) * 1000
        await sleep(delay)
      }
    }
  }

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Wait for auth to be ready
      if (!isAuthReady) {
        setLoading(false)
        return
      }
      
      if (!user || !user.token) {
        throw new Error('No authentication token found')
      }

      // Use user.username instead of user.email since username contains the email
      const userEmail = user.username
      
      if (!userEmail) {
        throw new Error('No user email found')
      }

      const devicesResponse = await fetchWithRetry(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_DEVICES}/${userEmail}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        }
      })

      const devicesData = await devicesResponse.json()
      const userDevices = devicesData.devices || []
      setDevices(userDevices)

      const activeDevices = userDevices.filter(device => device.status === 'online').length
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      let todaysFeeds = 0
      let allRecentActivity = []

      for (const device of userDevices) {
        try {
          const historyResponse = await fetchWithRetry(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FEEDING_HISTORY}/${device._id}`, {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            }
          })

          const historyData = await historyResponse.json()
          const feedingHistory = historyData.feedingHistory || []
          
          const todaysFeedsForDevice = feedingHistory.filter(feedTime => {
            const feedDate = new Date(feedTime)
            return feedDate >= today
          }).length
          todaysFeeds += todaysFeedsForDevice

          const recentFeeds = feedingHistory
            .slice(-10)
            .reverse()
            .map(feedTime => ({
              id: `${device._id}-${feedTime}`,
              type: 'feed',
              device: device.name || 'MeowFeeder',
              status: 'success',
              time: formatRelativeTime(new Date(feedTime)),
              timestamp: new Date(feedTime)
            }))
          
          allRecentActivity = [...allRecentActivity, ...recentFeeds]
        } catch (historyError) {
          console.error(`Error fetching history for device ${device._id}:`, historyError)
        }
      }

      allRecentActivity.sort((a, b) => b.timestamp - a.timestamp)
      setRecentActivity(allRecentActivity.slice(0, 5))

      const scheduledFeeds = userDevices.reduce((total, device) => {
        return total + (device.feedingTime ? device.feedingTime.length : 0)
      }, 0)

      setStats({
        activeDevices,
        todaysFeeds,
        scheduledFeeds
      })

      setError(null)
      setRetryCount(0)
    } catch (err) {
      console.error('Dashboard data fetch error:', err)
      setError(`${err.message}${retryCount > 0 ? ` (retry ${retryCount}/3)` : ''}`)
      setRetryCount(prev => prev + 1)
    } finally {
      setLoading(false)
    }
  }

  const formatRelativeTime = (date) => {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
  }

  useEffect(() => {
    if (isAuthReady) {
      fetchDashboardData()
    }
  }, [isAuthReady, user])

  const refreshData = () => {
    setRetryCount(0)
    fetchDashboardData()
  }

  useEffect(() => {
    if (error && retryCount < 3) {
      const retryDelay = Math.pow(2, retryCount) * 2000
      const timeoutId = setTimeout(() => {
        fetchDashboardData()
      }, retryDelay)
      
      return () => clearTimeout(timeoutId)
    }
  }, [error, retryCount])

  return {
    devices,
    recentActivity,
    stats,
    loading,
    error,
    refreshData
  }
}

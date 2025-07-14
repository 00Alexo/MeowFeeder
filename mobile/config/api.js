const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000',
  ENDPOINTS: {
    SIGNIN: process.env.EXPO_PUBLIC_API_SIGNIN || '/api/user/signin',
    SIGNUP: process.env.EXPO_PUBLIC_API_SIGNUP || '/api/user/signup',
    DEVICES: process.env.EXPO_PUBLIC_API_DEVICES || '/api/devices',
    FEED: process.env.EXPO_PUBLIC_API_FEED || '/api/feed',
    USER_DEVICES: '/api/device/getUserDevicesWithDetails',
    FEEDING_HISTORY: '/api/device/getFeedingHistory',
  }
}

export default API_CONFIG

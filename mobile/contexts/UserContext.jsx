import { createContext, useReducer, useEffect, useState } from "react"
import AsyncStorage from '@react-native-async-storage/async-storage'

export const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, {
    user: null
  })
  
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('user')
        if (userData) {
          const user = JSON.parse(userData)
          dispatch({ type: 'LOGIN', payload: user })
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
      }
      setIsAuthReady(true)
    }

    checkAuthStatus()
  }, [])

  return (
    <UserContext.Provider value={{ 
      ...state, 
      dispatch, 
      isAuthReady 
    }}>
      {children}
    </UserContext.Provider>
  )
}
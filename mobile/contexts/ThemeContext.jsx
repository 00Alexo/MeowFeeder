import React, { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    return {
      theme: null,
      isDark: false,
      toggleTheme: () => {},
      setThemePreference: () => {},
      isLoading: false
    }
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [theme, setTheme] = useState(systemColorScheme || 'light')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themePreference')
        if (savedTheme) {
          setTheme(savedTheme)
        } else {
          setTheme(systemColorScheme || 'light')
        }
      } catch (error) {
        console.error('Error loading theme:', error)
        setTheme(systemColorScheme || 'light')
      } finally {
        setIsLoading(false)
      }
    }

    loadTheme()
  }, [systemColorScheme])

  const toggleTheme = async () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
      await AsyncStorage.setItem('themePreference', newTheme)
    } catch (error) {
      console.error('Error saving theme:', error)
    }
  }

  const setThemePreference = async (newTheme) => {
    try {
      setTheme(newTheme)
      await AsyncStorage.setItem('themePreference', newTheme)
    } catch (error) {
      console.error('Error saving theme preference:', error)
    }
  }

  const value = {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setThemePreference,
    isLoading
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}



import {StyleSheet, Text, useColorScheme, View } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'
import { Colors} from '../constants/Colors'
import { StatusBar } from "expo-status-bar"
import { UserProvider } from '../contexts/UserContext'
import { ThemeProvider, useTheme } from '../contexts/ThemeContext'

const AppContent = () => {
    const { theme, isDark } = useTheme()
    const themeColors = Colors[theme] ?? Colors.light

    return (
        <UserProvider>
            <StatusBar style={isDark ? "light" : "dark"}/>
            <Stack screenOptions={{
                headerShown: false
            }}>
                <Stack.Screen name = "index" options={{ title: 'Home' }} />

                <Stack.Screen name = "(auth)"/>
            </Stack>
        </UserProvider>
    )
}

const RootLayout = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    )
}

export default RootLayout

const styles = StyleSheet.create({})
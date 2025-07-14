import { useColorScheme, View } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext'

const ThemedView = ({ style, safe = false, transparent = false, ...props }) => {
    const { theme: currentTheme } = useTheme()
    const systemColorScheme = useColorScheme()
    const insets = useSafeAreaInsets()
    
    const themeKey = currentTheme || systemColorScheme || 'light'
    const theme = Colors[themeKey] ?? Colors.light

    const backgroundColor = transparent ? 'transparent' : theme.background

    if(!safe) {
        return (
            <View 
                style={[{backgroundColor}, style]}
                {...props}
            />
        )
    }

    return (
        <View
            style={[{
                backgroundColor,
                paddingTop: insets.top,
                paddingBottom: insets.bottom
            }, style]}
            {...props}
        />
    )
}

export default ThemedView
import { Text, View, StyleSheet, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'
import { useTheme } from '../contexts/ThemeContext'

const ThemedLogo = ({ style, ...props }) => {
  const { theme: currentTheme, isDark } = useTheme()
  const systemColorScheme = useColorScheme()
  const themeKey = currentTheme || systemColorScheme || 'light'
  const theme = Colors[themeKey] ?? Colors.light

  return (
    <View style={[styles.logoContainer, style]} {...props}>
      <View style={[
        styles.iconContainer,
        {
          backgroundColor: isDark ? '#F4B6C2' : Colors.primary,
          borderWidth: isDark ? 1 : 0,
          borderColor: isDark ? '#F4B6C2' : 'transparent',
        }
      ]}>
        <Text style={[
          styles.iconText,
          {
            color: isDark ? '#1a1a1a' : '#FFFFFF',
          }
        ]}>
          MF
        </Text>
      </View>
      <Text style={[
        styles.logoText, 
        { 
          color: theme.title,
          textShadowColor: isDark ? 'rgba(244, 182, 194, 0.3)' : 'transparent',
          textShadowOffset: isDark ? { width: 0, height: 1 } : { width: 0, height: 0 },
          textShadowRadius: isDark ? 2 : 0,
        }
      ]}>
        MeowFeeder
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  iconText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
})

export default ThemedLogo
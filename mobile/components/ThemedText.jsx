import { Text, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'
import { useTheme } from '../contexts/ThemeContext'

const ThemedText = ({ style, title = false, ...props }) => {
  const { theme: currentTheme } = useTheme()
  const systemColorScheme = useColorScheme()
  
  const themeKey = currentTheme || systemColorScheme || 'light'
  const theme = Colors[themeKey] ?? Colors.light

  const textColor = title ? theme.title : theme.text

  return (
    <Text 
      style={[{ color: textColor }, style]}
      {...props}
    />
  )
}

export default ThemedText
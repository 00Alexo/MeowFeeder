import { Text, View, StyleSheet, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'

const ThemedLogo = ({ style, ...props }) => {
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light

  return (
    <View style={[styles.logoContainer, style]} {...props}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>MF</Text>
      </View>
      <Text style={[styles.logoText, { color: theme.title }]}>MeowFeeder</Text>
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
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  iconText: {
    color: '#FFFFFF',
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
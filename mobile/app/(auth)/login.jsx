import { StyleSheet, Text, Keyboard, TouchableWithoutFeedback, Animated, useColorScheme, Alert } from 'react-native'
import { Link } from 'expo-router'
import { useState, useRef } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from "../../components/ThemedTextInput"
import ThemedLogo from '../../components/ThemedLogo'
import { Colors } from '../../constants/Colors'
import { useSignIn } from '../../hooks/useSignIn'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)

  const { signin, error, isLoading, errorFields } = useSignIn()
  
  const colorScheme = useColorScheme()
  const theme = Colors[colorScheme] ?? Colors.light
  
  const emailAnimation = useRef(new Animated.Value(0)).current
  const passwordAnimation = useRef(new Animated.Value(0)).current

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    await signin(email, password)
  }

  const handleEmailFocus = () => {
    setEmailFocused(true)
    Animated.timing(emailAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  const handleEmailBlur = () => {
    setEmailFocused(false)
    Animated.timing(emailAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  const handlePasswordFocus = () => {
    setPasswordFocused(true)
    Animated.timing(passwordAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  const handlePasswordBlur = () => {
    setPasswordFocused(false)
    Animated.timing(passwordAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={styles.container} safe={true}>
        
        <ThemedView style={styles.header}>
          <ThemedLogo style={styles.logo} />
          <ThemedText title={true} style={styles.title}>
            Welcome Back!
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Sign in to your MeowFeeder account
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          <Animated.View style={[
            styles.inputContainer,
            {
              backgroundColor: theme.cardBackground,
              borderColor: emailAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [theme.border, Colors.primary]
              }),
              borderWidth: emailAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 2]
              }),
              transform: [{
                scale: emailAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02]
                })
              }]
            }
          ]}>
            <ThemedTextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              onFocus={handleEmailFocus}
              onBlur={handleEmailBlur}
            />
          </Animated.View>

          <Animated.View style={[
            styles.inputContainer,
            {
              backgroundColor: theme.cardBackground,
              borderColor: passwordAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [theme.border, Colors.primary]
              }),
              borderWidth: passwordAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 2]
              }),
              transform: [{
                scale: passwordAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.02]
                })
              }]
            }
          ]}>
            <ThemedTextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              onFocus={handlePasswordFocus}
              onBlur={handlePasswordBlur}
            />
          </Animated.View>

          {error && (
            <ThemedView style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </ThemedView>
          )}

          <ThemedButton 
            style={[styles.button, { opacity: isLoading ? 0.7 : 1 }]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </ThemedButton>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <Link href="/register" replace>
            <ThemedText style={styles.linkText}>
              Don't have an account? <ThemedText style={styles.linkHighlight}>Create Account</ThemedText>
            </ThemedText>
          </Link>
        </ThemedView>

      </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  form: {
    width: '100%',
    marginBottom: 40,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  linkText: {
    textAlign: 'center',
    fontSize: 16,
  },
  linkHighlight: {
    fontWeight: '600',
  },
})
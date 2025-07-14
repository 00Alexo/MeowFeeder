import { StyleSheet, Text, TouchableWithoutFeedback, Keyboard, Animated, useColorScheme, Alert } from 'react-native'
import React, { useState, useRef } from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import { Link } from 'expo-router'
import ThemedButton from '../../components/ThemedButton'
import ThemedTextInput from '../../components/ThemedTextInput'
import ThemedLogo from '../../components/ThemedLogo'
import { Colors } from '../../constants/Colors'
import { useSignUp } from '../../hooks/useSignUp'

const register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);
    
    const { signup, error, isLoading, errorFields } = useSignUp()
    
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme] ?? Colors.light;
    
    const emailAnimation = useRef(new Animated.Value(0)).current;
    const passwordAnimation = useRef(new Animated.Value(0)).current;
    const confirmPasswordAnimation = useRef(new Animated.Value(0)).current;

    const handleSubmit = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields')
            return
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match')
            return
        }

        await signup(email, password, confirmPassword)
    }

    const createFocusHandler = (setFocused, animation) => () => {
        setFocused(true);
        Animated.timing(animation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const createBlurHandler = (setFocused, animation) => () => {
        setFocused(false);
        Animated.timing(animation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ThemedView style={styles.container} safe={true}>
            <ThemedView style={styles.header}>
                <ThemedLogo style={styles.logo} />
                <ThemedText title={true} style={styles.title}>
                    Join MeowFeeder
                </ThemedText>
                <ThemedText style={styles.subtitle}>
                    Create your account to get started
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
                        keyboardType="email-address"
                        placeholder="Email address"
                        onChangeText={setEmail}
                        value={email}
                        onFocus={createFocusHandler(setEmailFocused, emailAnimation)}
                        onBlur={createBlurHandler(setEmailFocused, emailAnimation)}
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
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                        onFocus={createFocusHandler(setPasswordFocused, passwordAnimation)}
                        onBlur={createBlurHandler(setPasswordFocused, passwordAnimation)}
                    />
                </Animated.View>

                <Animated.View style={[
                    styles.inputContainer,
                    {
                        backgroundColor: theme.cardBackground,
                        borderColor: confirmPasswordAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [theme.border, Colors.primary]
                        }),
                        borderWidth: confirmPasswordAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 2]
                        }),
                        transform: [{
                            scale: confirmPasswordAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 1.02]
                            })
                        }]
                    }
                ]}>
                    <ThemedTextInput 
                        style={styles.input}
                        placeholder="Confirm Password"
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                        secureTextEntry
                        onFocus={createFocusHandler(setConfirmPasswordFocused, confirmPasswordAnimation)}
                        onBlur={createBlurHandler(setConfirmPasswordFocused, confirmPasswordAnimation)}
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
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                </ThemedButton>
            </ThemedView>

            <ThemedView style={styles.footer}>
                <Link href="login"> 
                    <ThemedText style={styles.linkText}>
                        Already have an account? <ThemedText style={styles.linkHighlight}>Sign In</ThemedText>
                    </ThemedText>
                </Link>
            </ThemedView>
        </ThemedView>
    </TouchableWithoutFeedback>
  )
}

export default register


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
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
});
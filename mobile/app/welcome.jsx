import { StyleSheet, useColorScheme } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import ThemedView from '../components/ThemedView'
import ThemedLogo from '../components/ThemedLogo'
import ThemedText from '../components/ThemedText'
import ThemedButton from '../components/ThemedButton'
import Spacer from '../components/Spacer'
import { useUserContext } from '../hooks/useUserContext'
import { Colors } from '../constants/Colors'

const Welcome = () => {
    const { user, isAuthReady } = useUserContext()
    const router = useRouter()
    const colorScheme = useColorScheme()
    const theme = Colors[colorScheme] ?? Colors.light

    useEffect(() => {
        if (isAuthReady && user) {
            router.replace('/')
        }
    }, [user, isAuthReady, router])

    if (!isAuthReady) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ThemedText>Loading...</ThemedText>
            </ThemedView>
        )
    }

    if (user) {
        return null
    }

    return (
        <ThemedView style={styles.container} safe={true}>
            <ThemedView style={styles.header}>
                <ThemedLogo style={styles.logo} />
                <ThemedText style={styles.title}>Smart Pet Feeding</ThemedText>
                <Spacer height={10} />
                <ThemedText style={styles.subtitle}>Made Simple</ThemedText>
            </ThemedView>

            <Spacer height={60} />

            <ThemedView style={styles.content}>
                <ThemedText style={styles.description}>
                    Monitor and control your pet's feeding schedule from anywhere. 
                    Keep your furry friends happy and healthy with MeowFeeder.
                </ThemedText>

                <Spacer height={40} />

                <ThemedButton 
                    style={styles.loginButton}
                    onPress={() => router.push('/login')}
                >
                    <ThemedText style={styles.loginButtonText}>Sign In</ThemedText>
                </ThemedButton>

                <ThemedButton 
                    style={[styles.registerButton, { borderColor: theme.border }]}
                    onPress={() => router.push('/register')}
                >
                    <ThemedText style={[styles.registerButtonText, { color: Colors.primary }]}>
                        Create Account
                    </ThemedText>
                </ThemedButton>
            </ThemedView>
        </ThemedView>
    )
}

export default Welcome

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        opacity: 0.8,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        opacity: 0.8,
        marginBottom: 20,
    },
    loginButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    registerButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: 'transparent',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    registerButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
})

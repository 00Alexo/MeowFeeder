import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedLogo from '../../components/ThemedLogo'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import { Link } from 'expo-router'

const login = () => {
  return (
    <ThemedView style={styles.container}>
        <Spacer/>
        <ThemedText title={true} style={styles.title}>
            Login to your account
        </ThemedText>
        <Spacer height={100}/>
        <Link href="register"> 
            <ThemedText style={{textAlign: 'center'}}>
                Don't have an account? <ThemedText style={{color:'blue'}}> Register here </ThemedText>
            </ThemedText>
        </Link>
    </ThemedView>
  )
}

export default login

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
    },
    title:{
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 30
    }
});
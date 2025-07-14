import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ThemedView from '../../components/ThemedView'
import ThemedLogo from '../../components/ThemedLogo'
import ThemedText from '../../components/ThemedText'
import Spacer from '../../components/Spacer'
import { Link } from 'expo-router'

const register = () => {
  return (
    <ThemedView style={styles.container}>
        <Spacer/>
        <ThemedText title={true} style={styles.title}>
            Register to your account
        </ThemedText>
        <Spacer height={100}/>
        <Link href="login"> 
            <ThemedText style={{textAlign: 'center'}}>
                Already have an account? <ThemedText style={{color:'blue'}}> Login here </ThemedText>
            </ThemedText>
        </Link>
    </ThemedView>
  )
}

export default register


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
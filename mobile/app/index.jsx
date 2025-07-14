import { StyleSheet, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import ThemedView from '../components/ThemedView'
import ThemedLogo from '../components/ThemedLogo'
import ThemedText from '../components/ThemedText'
import Spacer from '../components/Spacer'

const Home = () => {
  return (
    <ThemedView style={styles.container}>
        <ThemedLogo/>

        <ThemedText style={styles.title} title={true}> The number 1 </ThemedText>
        <Spacer height={10}/>
        <ThemedText> Reading List App </ThemedText> 
        <Spacer/>

        <Link href="/login" style={styles.link}> <ThemedText> Sign-In </ThemedText> </Link>
        <Link href="/register" style={styles.link}> <ThemedText> Register </ThemedText> </Link>
    </ThemedView>
  )
}

export default Home

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    link:{
        marginVertical: 10,
        borderBottomWidth: 1
    }
})
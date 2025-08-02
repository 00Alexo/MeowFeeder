import { useState } from "react"
import { useRouter } from "expo-router"
import { useUserContext } from "./useUserContext"
import { Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import API_CONFIG from '../config/api'

export const useSignUp = () => {
    const [error, setError] = useState(null)
    const [errorFields, setErrorFields] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useUserContext()
    const router = useRouter()

    const signup = async (email, password, confirmPassword) => {
        setError(null)
        setErrorFields(null)
        setIsLoading(true)

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, confirmPassword, deviceType: 'mobile' })
            })

            Alert.alert(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`)
            const json = await response.json()

            if (!response.ok) {
                console.log(json.error)
                console.log(json.errorFields)
                setIsLoading(false)
                setError(json.error)
                setErrorFields(json.errorFields)
                return
            }

            if (response.ok) {
                await AsyncStorage.setItem('user', JSON.stringify({username: "alexsuciultc200@gmail.com", token: "testtoken"}))
                dispatch({ type: 'LOGIN', payload: {username: "alexsuciultc200@gmail.com", token: "testtoken"} })
                setIsLoading(false)
                router.replace('/')
            }
        } catch (error) {
            console.error('Network error:', error.message)
            setError(error.message)
            setIsLoading(false)
        }
    }

    return { signup, error, isLoading, errorFields }
}

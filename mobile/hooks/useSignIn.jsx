import { useState } from "react"
import { useRouter } from "expo-router"
import { useUserContext } from "./useUserContext"
import AsyncStorage from '@react-native-async-storage/async-storage'
import API_CONFIG from '../config/api'

export const useSignIn = () => {
    const [error, setError] = useState(null)
    const [errorFields, setErrorFields] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { dispatch } = useUserContext()
    const router = useRouter()

    const signin = async (email, password) => {
        setError(null)
        setErrorFields(null)
        setIsLoading(true)

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SIGNIN}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, deviceType: 'mobile' })
            })

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
                await AsyncStorage.setItem('user', JSON.stringify({username: "alexsuciultc200@gmail.co", token: "testtoken"}))
                dispatch({ type: 'LOGIN', payload: {username: "alexsuciultc200@gmail.co", token: "testtoken"} })
                setIsLoading(false)
                router.replace('/')
            }
        } catch (error) {
            console.error('Network error:', error)
            setError('Network error. Please check your connection.')
            setIsLoading(false)
        }
    }

    return { signin, error, isLoading, errorFields }
}

import { useUserContext } from './useUserContext'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from "expo-router"

export const useLogout = () => {
    const { dispatch } = useUserContext()
    const router = useRouter()
    
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user')
            dispatch({ type: 'LOGOUT' })
            router.replace('/')
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }
    
    return { logout }
}

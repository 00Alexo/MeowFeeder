import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useUserContext } from '../hooks/useUserContext'
import ThemedView from './ThemedView'
import ThemedText from './ThemedText'

const ProtectedRoute = ({ children }) => {
  const { user, isAuthReady } = useUserContext()
  const router = useRouter()

  useEffect(() => {
    if (isAuthReady && !user) {
      router.replace('/login')
    }
  }, [user, isAuthReady, router])

  if (!isAuthReady) {
    return (
      <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    )
  }

  if (!user) {
    return null
  }

  return children
}

export default ProtectedRoute

"use client"

import { useEffect } from 'react'
import { useUserStore } from '@/store/useUserStore'

interface AuthProviderProps {
  children: React.ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { isLoading, user, setUser, setLoading } = useUserStore()

  useEffect(() => {
    const initializeAuth = async () => {
      // Only initialize if we haven't already checked
      if (isLoading && !user) {
        try {
          const response = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include'
          })

          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error('Auth initialization failed:', error)
          setUser(null)
        } finally {
          setLoading(false)
        }
      }
    }

    initializeAuth()
  }, [isLoading, user, setUser, setLoading])

  return <>{children}</>
}

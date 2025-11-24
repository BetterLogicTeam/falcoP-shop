'use client'

import React, { createContext, useContext } from 'react'
import { useSession, signOut } from 'next-auth/react'

interface User {
  email: string
  name: string
  type?: string
}

interface AuthContextType {
  user: User | null
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  // Check if user is admin type
  const user = session?.user && (session.user as any).type === 'admin'
    ? {
        email: session.user.email || '',
        name: session.user.name || '',
        type: 'admin'
      }
    : null

  const logout = () => {
    signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <AuthContext.Provider value={{ user, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
    account_id: string
    username: string
    role: 'admin' | 'user'
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (userData: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Check for user data in localStorage on mount
        const storedUser = localStorage.getItem('ECC_user')
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser)
                setUser(parsedUser)
            } catch (error) {
                console.error('Error parsing user data:', error)
                localStorage.removeItem('ECC_user')
            }
        }
        setLoading(false)
    }, [])

    const login = (userData: User) => {
        setUser(userData)
        localStorage.setItem('ECC_user', JSON.stringify(userData))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('ECC_user')
        router.push('/auth')
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
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
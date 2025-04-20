"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type FinancialData = {
  creditScore?: number
  monthlyIncome?: number
  monthlyDebt?: number
  totalSavings?: number
  totalDebt?: number
  creditHistory?: Array<{ month: string; score: number }>
  savingsHistory?: Array<{ month: string; amount: number }>
  debtHistory?: Array<{ month: string; amount: number }>
  hasCompletedOnboarding: boolean
}

type User = {
  id: string
  name: string
  email: string
  financialData: FinancialData
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  updateFinancialData: (data: Partial<FinancialData>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("credwise_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // This is a mock implementation
    // In a real app, you would call your authentication API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (email === "demo@example.com" && password === "password") {
          const user = {
            id: "user_1",
            name: "Demo User",
            email: "demo@example.com",
            financialData: {
              hasCompletedOnboarding: false,
            },
          }
          setUser(user)
          localStorage.setItem("credwise_user", JSON.stringify(user))
          resolve()
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 1000)
    })
  }

  const register = async (name: string, email: string, password: string) => {
    // This is a mock implementation
    // In a real app, you would call your registration API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const user = {
          id: "user_" + Math.random().toString(36).substr(2, 9),
          name,
          email,
          financialData: {
            hasCompletedOnboarding: false,
          },
        }
        setUser(user)
        localStorage.setItem("credwise_user", JSON.stringify(user))
        resolve()
      }, 1000)
    })
  }

  const updateFinancialData = (data: Partial<FinancialData>) => {
    if (!user) return

    const updatedUser = {
      ...user,
      financialData: {
        ...user.financialData,
        ...data,
      },
    }

    setUser(updatedUser)
    localStorage.setItem("credwise_user", JSON.stringify(updatedUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("credwise_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateFinancialData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

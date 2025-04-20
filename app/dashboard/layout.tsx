"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { BarChart3, CreditCard, Home, LayoutDashboard, LogOut, PiggyBank, Settings, Shield, User } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Don't show the regular dashboard layout for the onboarding page
  if (pathname === "/dashboard/onboarding") {
    return children
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Credit Score", href: "/dashboard/credit-score", icon: BarChart3 },
    { name: "Debt-to-Income", href: "/dashboard/dti", icon: BarChart3 },
    { name: "Credit Card Payoff", href: "/dashboard/credit-card", icon: CreditCard },
    { name: "Savings Growth", href: "/dashboard/savings", icon: PiggyBank },
    { name: "Loan Calculator", href: "/dashboard/loan", icon: BarChart3 },
    { name: "Loan Eligibility", href: "/dashboard/eligibility", icon: Shield },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">Credwise</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-gray-50 dark:bg-gray-900 lg:block">
          <nav className="flex flex-col gap-2 p-4">
            <div className="py-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Main</div>
              <Link href="/">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn("w-full justify-start", pathname === item.href && "bg-gray-100 dark:bg-gray-800")}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </nav>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-6 px-4 md:px-6">{children}</div>
        </main>
      </div>
    </div>
  )
}

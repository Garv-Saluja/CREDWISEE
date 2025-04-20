"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { InfoIcon, ArrowRight, ArrowLeft } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function OnboardingPage() {
  const { user, updateFinancialData } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Financial information
  const [creditScore, setCreditScore] = useState<number | undefined>(undefined)
  const [monthlyIncome, setMonthlyIncome] = useState<number | undefined>(undefined)
  const [monthlyDebt, setMonthlyDebt] = useState<number | undefined>(undefined)
  const [totalSavings, setTotalSavings] = useState<number | undefined>(undefined)
  const [totalDebt, setTotalDebt] = useState<number | undefined>(undefined)

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleFinish = () => {
    setLoading(true)

    // Generate 6 months of history data for charts
    const now = new Date()
    const creditHistory = []
    const savingsHistory = []
    const debtHistory = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now)
      date.setMonth(now.getMonth() - i)
      const monthName = date.toLocaleString("default", { month: "short" })

      // For credit score, create a slightly increasing trend
      const baseScore = creditScore || 650
      const randomVariation = Math.floor(Math.random() * 10) - 5 // -5 to +5
      const monthScore = Math.max(300, Math.min(850, baseScore - i * 10 + randomVariation))
      creditHistory.push({ month: monthName, score: monthScore })

      // For savings, create an increasing trend
      const baseSavings = totalSavings || 2000
      const savingsGrowth = baseSavings * (1 - i * 0.1)
      savingsHistory.push({ month: monthName, amount: Math.round(savingsGrowth) })

      // For debt, create a decreasing trend
      const baseDebt = totalDebt || 5000
      const debtReduction = baseDebt * (1 - i * 0.05)
      debtHistory.push({ month: monthName, amount: Math.round(debtReduction) })
    }

    // Update user's financial data
    updateFinancialData({
      creditScore,
      monthlyIncome,
      monthlyDebt,
      totalSavings,
      totalDebt,
      creditHistory,
      savingsHistory,
      debtHistory,
      hasCompletedOnboarding: true,
    })

    // Redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  // If user has already completed onboarding, redirect to dashboard
  if (user?.financialData.hasCompletedOnboarding) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to Credwise</CardTitle>
          <CardDescription>Let's set up your financial profile to personalize your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                    currentStep >= step ? "border-green-600 bg-green-600 text-white" : "border-gray-300 text-gray-400"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="relative mb-4 h-2 w-full rounded-full bg-gray-200">
              <div
                className="absolute h-2 rounded-full bg-green-600 transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Basic Financial Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly-income">
                    Monthly Income (before taxes)
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Your gross monthly income before taxes and deductions.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹                    </span>
                    <Input
                      id="monthly-income"
                      type="number"
                      placeholder="5000"
                      className="pl-7"
                      value={monthlyIncome || ""}
                      onChange={(e) => setMonthlyIncome(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly-debt">
                    Monthly Debt Payments
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Total monthly payments for all debts (mortgage/rent, car loans, credit cards, etc.)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹
                    </span>
                    <Input
                      id="monthly-debt"
                      type="number"
                      placeholder="1500"
                      className="pl-7"
                      value={monthlyDebt || ""}
                      onChange={(e) => setMonthlyDebt(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Credit Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="credit-score">
                      Credit Score
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Your FICO or VantageScore credit score, typically between 300-850.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <span className="text-sm font-medium">{creditScore || "Not set"}</span>
                  </div>
                  <Slider
                    id="credit-score"
                    min={300}
                    max={850}
                    step={1}
                    value={creditScore ? [creditScore] : [650]}
                    onValueChange={(value) => setCreditScore(value[0])}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Poor (300)</span>
                    <span>Fair (580)</span>
                    <span>Good (670)</span>
                    <span>Excellent (800+)</span>
                  </div>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Don't know your credit score? You can estimate it based on your credit history:
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCreditScore(580)}>
                      I've missed payments
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCreditScore(650)}>
                      I pay on time
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCreditScore(720)}>
                      I have good credit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setCreditScore(780)}>
                      I have excellent credit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Savings & Debt</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="total-savings">
                    Total Savings
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Your total savings across all accounts (checking, savings, investments, etc.)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹                    </span>
                    <Input
                      id="total-savings"
                      type="number"
                      placeholder="10000"
                      className="pl-7"
                      value={totalSavings || ""}
                      onChange={(e) => setTotalSavings(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total-debt">
                    Total Debt
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Your total debt across all accounts (mortgage, car loans, credit cards, student loans, etc.)
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹
                    </span>
                    <Input
                      id="total-debt"
                      type="number"
                      placeholder="15000"
                      className="pl-7"
                      value={totalDebt || ""}
                      onChange={(e) => setTotalDebt(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Review Your Information</h3>
              <div className="rounded-lg border p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                    <p className="font-medium">
                      {monthlyIncome ? `₹${monthlyIncome.toLocaleString()}` : "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Debt Payments</p>
                    <p className="font-medium">{monthlyDebt ? `₹${monthlyDebt.toLocaleString()}` : "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Score</p>
                    <p className="font-medium">{creditScore || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">DTI Ratio</p>
                    <p className="font-medium">
                      {monthlyIncome && monthlyDebt
                        ? `${((monthlyDebt / monthlyIncome) * 100).toFixed(1)}%`
                        : "Not calculated"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Savings</p>
                    <p className="font-medium">{totalSavings ? `₹${totalSavings.toLocaleString()}` : "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Debt</p>
                    <p className="font-medium">{totalDebt ? `₹${totalDebt.toLocaleString()}` : "Not provided"}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    You can update this information anytime from your profile settings.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <div></div>
          )}
          {currentStep < 4 ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? "Setting up your dashboard..." : "Complete Setup"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

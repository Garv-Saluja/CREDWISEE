"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LineChart } from "@/components/ui/chart"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SavingsGrowthPage() {
  const [initialDeposit, setInitialDeposit] = useState(1000)
  const [monthlyContribution, setMonthlyContribution] = useState(200)
  const [interestRate, setInterestRate] = useState(5)
  const [years, setYears] = useState(10)
  const [savingsResults, setSavingsResults] = useState<{
    finalBalance: number
    totalContributions: number
    totalInterest: number
    growthData: Array<{ year: string; balance: number; contributions: number; interest: number }>
  }>({
    finalBalance: 0,
    totalContributions: 0,
    totalInterest: 0,
    growthData: [],
  })

  // Calculate savings growth when inputs change
  useEffect(() => {
    if (years <= 0) return

    let balance = initialDeposit
    let totalContributions = initialDeposit
    let totalInterest = 0
    const growthData = []

    // Calculate monthly interest rate
    const monthlyInterestRate = interestRate / 100 / 12

    // Add initial data point
    growthData.push({
      year: "Start",
      balance: Number.parseFloat(balance.toFixed(2)),
      contributions: Number.parseFloat(totalContributions.toFixed(2)),
      interest: 0,
    })

    // Calculate for each year
    for (let year = 1; year <= years; year++) {
      let yearlyInterest = 0

      // Calculate for each month in the year
      for (let month = 1; month <= 12; month++) {
        // Add monthly contribution
        balance += monthlyContribution
        totalContributions += monthlyContribution

        // Calculate interest for this month
        const interestThisMonth = balance * monthlyInterestRate
        balance += interestThisMonth
        yearlyInterest += interestThisMonth
        totalInterest += interestThisMonth
      }

      // Add data point for this year
      growthData.push({
        year: `Year ${year}`,
        balance: Number.parseFloat(balance.toFixed(2)),
        contributions: Number.parseFloat(totalContributions.toFixed(2)),
        interest: Number.parseFloat(totalInterest.toFixed(2)),
      })
    }

    setSavingsResults({
      finalBalance: Number.parseFloat(balance.toFixed(2)),
      totalContributions: Number.parseFloat(totalContributions.toFixed(2)),
      totalInterest: Number.parseFloat(totalInterest.toFixed(2)),
      growthData,
    })
  }, [initialDeposit, monthlyContribution, interestRate, years])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Savings Growth Planner</h1>
        <p className="text-muted-foreground">Calculate how your savings will grow over time with compound interest.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Savings Details</CardTitle>
            <CardDescription>Enter your savings plan information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="initial-deposit">
                Initial Deposit
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The amount you start with in your savings account.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹                </span>
                <Input
                  id="initial-deposit"
                  type="number"
                  min={0}
                  className="pl-7"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-contribution">
                Monthly Contribution
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The amount you plan to add to your savings each month.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹                </span>
                <Input
                  id="monthly-contribution"
                  type="number"
                  min={0}
                  className="pl-7"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-rate">
                Annual Interest Rate
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The annual percentage yield (APY) on your savings account.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <Input
                  id="interest-rate"
                  type="number"
                  min={0}
                  step={0.01}
                  className="pr-7"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="years">
                Time Period (Years)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The number of years you plan to save.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="years"
                type="number"
                min={1}
                max={50}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700">Save Calculation</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Growth Results</CardTitle>
            <CardDescription>Your projected savings growth over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Final Balance</div>
                <div className="mt-1 text-2xl font-bold">₹
                {savingsResults.finalBalance.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Total Contributions</div>
                <div className="mt-1 text-2xl font-bold">₹
                {savingsResults.totalContributions.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Total Interest Earned</div>
                <div className="mt-1 text-2xl font-bold">₹
                {savingsResults.totalInterest.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Interest % of Total</div>
                <div className="mt-1 text-2xl font-bold">
                  {savingsResults.finalBalance > 0
                    ? `${((savingsResults.totalInterest / savingsResults.finalBalance) * 100).toFixed(1)}%`
                    : "0%"}
                </div>
              </div>
            </div>

            <div className="h-[250px]">
              <LineChart
                data={savingsResults.growthData}
                categories={["balance", "contributions", "interest"]}
                index="year"
                colors={["green", "blue", "purple"]}
                valueFormatter={(value) => `₹${value.toLocaleString()}`}
                className="h-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="space-y-2 w-full">
              <h4 className="font-medium">Savings Growth Insights</h4>
              <ul className="space-y-2 text-sm">
                <li className="rounded-md border p-2">
                  Increasing your monthly contribution by just ₹
                  50 could add approximately ₹
                  {(50 * 12 * years * (1 + interestRate / 100 / 2)).toFixed(0)} to your final balance.
                </li>
                <li className="rounded-md border p-2">
                  The power of compound interest: ₹
                  {savingsResults.totalInterest.toLocaleString()} of your final balance
                  comes from interest earnings.
                </li>
                <li className="rounded-md border p-2">
                  Consider high-yield savings accounts or CDs to potentially earn higher interest rates.
                </li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

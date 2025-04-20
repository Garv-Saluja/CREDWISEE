"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PieChart } from "@/components/ui/chart"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function DTIPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(5000)
  const [monthlyDebt, setMonthlyDebt] = useState(1400)

  // Calculate DTI ratio
  const dtiRatio = (monthlyDebt / monthlyIncome) * 100
  const formattedDTI = dtiRatio.toFixed(1)

  // Determine DTI rating
  const getDTIRating = (ratio: number) => {
    if (ratio < 20)
      return { rating: "Excellent", color: "text-green-600", description: "Lenders view this as very low risk." }
    if (ratio < 36)
      return { rating: "Good", color: "text-green-500", description: "Most lenders consider this acceptable." }
    if (ratio < 43)
      return {
        rating: "Fair",
        color: "text-yellow-500",
        description: "This is the maximum for most mortgage approvals.",
      }
    if (ratio < 50)
      return { rating: "Poor", color: "text-orange-500", description: "May be difficult to qualify for new credit." }
    return {
      rating: "Very Poor",
      color: "text-red-500",
      description: "Significant financial stress, difficult to qualify for loans.",
    }
  }

  const rating = getDTIRating(dtiRatio)

  // Data for pie chart
  const pieData = [
    { name: "Debt Payments", value: monthlyDebt },
    { name: "Remaining Income", value: Math.max(0, monthlyIncome - monthlyDebt) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Debt-to-Income Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your debt-to-income ratio to understand how lenders view your financial health.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Calculate Your DTI Ratio</CardTitle>
            <CardDescription>Enter your monthly income and debt payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthly-income">
                Monthly Gross Income
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Your total monthly income before taxes and other deductions.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹
                </span>
                <Input
                  id="monthly-income"
                  type="number"
                  min={0}
                  className="pl-7"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthly-debt">
                Total Monthly Debt Payments
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Include mortgage/rent, car loans, student loans, credit cards (minimum payments), and other debt
                        obligations.
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
                  min={0}
                  className="pl-7"
                  value={monthlyDebt}
                  onChange={(e) => setMonthlyDebt(Number(e.target.value))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700">Save Calculation</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your DTI Ratio Result</CardTitle>
            <CardDescription>Based on your income and debt information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-8 border-gray-100 dark:border-gray-800">
              <div className="text-center">
                <div className="text-4xl font-bold">{formattedDTI}%</div>
                <div className={`text-lg ${rating.color}`}>{rating.rating}</div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className={`${rating.color}`}>{rating.description}</p>
              <p className="text-sm text-muted-foreground">
                Your monthly debt payments are ₹
                {monthlyDebt} out of ₹
                {monthlyIncome} income.
              </p>
            </div>

            <div className="h-[200px] w-full">
              <PieChart
                data={pieData}
                index="name"
                categories={["value"]}
                valueFormatter={(value) => `₹${value}`}
                colors={["#ef4444", "#10b981"]}
                className="h-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="space-y-2 w-full">
              <h4 className="font-medium">Tips to Improve Your DTI</h4>
              <ul className="space-y-2 text-sm">
                {dtiRatio > 36 && (
                  <li className="rounded-md border p-2">
                    Focus on paying down your highest-interest debt first to reduce your monthly obligations.
                  </li>
                )}
                {dtiRatio > 20 && (
                  <li className="rounded-md border p-2">
                    Look for ways to increase your income through side gigs, overtime, or asking for a raise.
                  </li>
                )}
                {dtiRatio > 43 && (
                  <li className="rounded-md border p-2">
                    Consider debt consolidation to potentially lower your monthly payments.
                  </li>
                )}
                <li className="rounded-md border p-2">
                  Avoid taking on new debt that will increase your monthly payment obligations.
                </li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

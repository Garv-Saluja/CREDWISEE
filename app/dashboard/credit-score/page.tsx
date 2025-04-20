"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PieChart } from "@/components/ui/chart"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreditScorePage() {
  // Initial values
  const [paymentHistory, setPaymentHistory] = useState(95)
  const [creditUtilization, setCreditUtilization] = useState(30)
  const [creditAge, setCreditAge] = useState(5)
  const [creditMix, setCreditMix] = useState(3)
  const [hardInquiries, setHardInquiries] = useState(2)

  // Calculate credit score based on factors
  const calculateCreditScore = () => {
    // This is a simplified model for demonstration
    const paymentHistoryScore = paymentHistory * 0.35
    const utilizationScore = (100 - creditUtilization) * 0.3
    const ageScore = Math.min(creditAge * 10, 100) * 0.15
    const mixScore = (creditMix / 5) * 100 * 0.1
    const inquiryScore = (10 - hardInquiries) * 10 * 0.1

    const totalScore = paymentHistoryScore + utilizationScore + ageScore + mixScore + inquiryScore
    return Math.round(300 + (totalScore / 100) * 550)
  }

  const creditScore = calculateCreditScore()

  // Determine credit score rating
  const getCreditRating = (score: number) => {
    if (score >= 800) return { rating: "Exceptional", color: "text-green-600" }
    if (score >= 740) return { rating: "Very Good", color: "text-green-500" }
    if (score >= 670) return { rating: "Good", color: "text-green-400" }
    if (score >= 580) return { rating: "Fair", color: "text-yellow-500" }
    return { rating: "Poor", color: "text-red-500" }
  }

  const rating = getCreditRating(creditScore)

  // Data for pie chart
  const pieData = [
    { name: "Payment History (35%)", value: 35 },
    { name: "Credit Utilization (30%)", value: 30 },
    { name: "Credit Age (15%)", value: 15 },
    { name: "Credit Mix (10%)", value: 10 },
    { name: "Hard Inquiries (10%)", value: 10 },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credit Score Simulator</h1>
        <p className="text-muted-foreground">Adjust the factors below to see how they affect your credit score.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Estimated Credit Score</CardTitle>
            <CardDescription>Based on the factors you've provided</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-8 border-gray-100 dark:border-gray-800">
              <div className="text-center">
                <div className="text-5xl font-bold">{creditScore}</div>
                <div className={`text-xl ${rating.color}`}>{rating.rating}</div>
              </div>
            </div>
            <div className="text-center text-sm text-muted-foreground">Credit score range: 300-850</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Score Factors</CardTitle>
            <CardDescription>Adjust these factors to see how they impact your score</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="payment-history">
                  Payment History
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Payment history accounts for 35% of your credit score. It tracks whether you've paid your
                          bills on time.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm">{paymentHistory}%</span>
              </div>
              <Slider
                id="payment-history"
                min={0}
                max={100}
                step={1}
                value={[paymentHistory]}
                onValueChange={(value) => setPaymentHistory(value[0])}
              />
              <p className="text-xs text-muted-foreground">Percentage of on-time payments</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="credit-utilization">
                  Credit Utilization
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Credit utilization accounts for 30% of your score. It's the percentage of your available
                          credit that you're using.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm">{creditUtilization}%</span>
              </div>
              <Slider
                id="credit-utilization"
                min={0}
                max={100}
                step={1}
                value={[creditUtilization]}
                onValueChange={(value) => setCreditUtilization(value[0])}
              />
              <p className="text-xs text-muted-foreground">Percentage of available credit used (lower is better)</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="credit-age">
                  Credit Age
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Credit age accounts for 15% of your score. It's the average age of all your credit accounts.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm">{creditAge} years</span>
              </div>
              <Slider
                id="credit-age"
                min={0}
                max={30}
                step={1}
                value={[creditAge]}
                onValueChange={(value) => setCreditAge(value[0])}
              />
              <p className="text-xs text-muted-foreground">Average age of your credit accounts</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="credit-mix">
                  Credit Mix
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Credit mix accounts for 10% of your score. It's the variety of credit accounts you have.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm">{creditMix} types</span>
              </div>
              <Slider
                id="credit-mix"
                min={1}
                max={5}
                step={1}
                value={[creditMix]}
                onValueChange={(value) => setCreditMix(value[0])}
              />
              <p className="text-xs text-muted-foreground">Number of different credit account types</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="hard-inquiries">
                  Hard Inquiries
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Hard inquiries account for 10% of your score. These occur when you apply for new credit.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="text-sm">{hardInquiries}</span>
              </div>
              <Slider
                id="hard-inquiries"
                min={0}
                max={10}
                step={1}
                value={[hardInquiries]}
                onValueChange={(value) => setHardInquiries(value[0])}
              />
              <p className="text-xs text-muted-foreground">Number of recent credit applications (lower is better)</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700">Save Simulation</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Score Breakdown</CardTitle>
            <CardDescription>How different factors contribute to your credit score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChart
                data={pieData}
                index="name"
                categories={["value"]}
                valueFormatter={(value) => `${value}%`}
                colors={["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"]}
                className="h-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="space-y-2 w-full">
              <h4 className="font-medium">Tips to Improve Your Score</h4>
              <ul className="space-y-2 text-sm">
                {creditUtilization > 30 && (
                  <li className="rounded-md border p-2">
                    Try to keep your credit utilization below 30% to improve your score.
                  </li>
                )}
                {paymentHistory < 100 && (
                  <li className="rounded-md border p-2">
                    Make all payments on time. Set up automatic payments to avoid missing due dates.
                  </li>
                )}
                {hardInquiries > 3 && (
                  <li className="rounded-md border p-2">
                    Limit new credit applications. Too many hard inquiries can lower your score.
                  </li>
                )}
                {creditAge < 2 && (
                  <li className="rounded-md border p-2">
                    Keep your oldest accounts open to increase your average credit age.
                  </li>
                )}
                {creditMix < 3 && (
                  <li className="rounded-md border p-2">
                    Consider diversifying your credit mix with different types of accounts.
                  </li>
                )}
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { LineChart } from "@/components/ui/chart"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CreditCardPayoffPage() {
  const [balance, setBalance] = useState(5000)
  const [interestRate, setInterestRate] = useState(18.99)
  const [monthlyPayment, setMonthlyPayment] = useState(200)
  const [payoffResults, setPayoffResults] = useState<{
    months: number
    totalInterest: number
    totalPaid: number
    payoffData: Array<{ month: string; balance: number; interest: number; principal: number }>
  }>({
    months: 0,
    totalInterest: 0,
    totalPaid: 0,
    payoffData: [],
  })

  // Calculate payoff timeline when inputs change
  useEffect(() => {
    if (balance <= 0 || monthlyPayment <= 0) return

    let remainingBalance = balance
    let month = 0
    let totalInterest = 0
    const payoffData = []

    // Calculate monthly interest rate
    const monthlyInterestRate = interestRate / 100 / 12

    while (remainingBalance > 0 && month < 600) {
      // Cap at 50 years to prevent infinite loops
      month++

      // Calculate interest for this month
      const interestThisMonth = remainingBalance * monthlyInterestRate

      // Calculate principal payment
      const principalThisMonth = Math.min(monthlyPayment - interestThisMonth, remainingBalance)

      // Update remaining balance
      remainingBalance = Math.max(0, remainingBalance - principalThisMonth)

      // Update total interest
      totalInterest += interestThisMonth

      // Add data point for chart
      payoffData.push({
        month: `Month ${month}`,
        balance: Number.parseFloat(remainingBalance.toFixed(2)),
        interest: Number.parseFloat(interestThisMonth.toFixed(2)),
        principal: Number.parseFloat(principalThisMonth.toFixed(2)),
      })

      // If payment is less than monthly interest, break the loop
      if (monthlyPayment <= interestThisMonth) {
        break
      }
    }

    setPayoffResults({
      months: month,
      totalInterest: Number.parseFloat(totalInterest.toFixed(2)),
      totalPaid: Number.parseFloat((balance + totalInterest).toFixed(2)),
      payoffData: payoffData.slice(0, Math.min(payoffData.length, 24)), // Limit data points for chart
    })
  }, [balance, interestRate, monthlyPayment])

  // Check if payment is too low
  const isPaymentTooLow = monthlyPayment <= balance * (interestRate / 100 / 12)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Credit Card Payoff Calculator</h1>
        <p className="text-muted-foreground">
          Calculate how long it will take to pay off your credit card and how much interest you'll pay.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Credit Card Details</CardTitle>
            <CardDescription>Enter your credit card information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="balance">
                Current Balance
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The total amount you currently owe on your credit card.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹
                </span>
                <Input
                  id="balance"
                  type="number"
                  min={0}
                  className="pl-7"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-rate">
                Annual Interest Rate (APR)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The annual percentage rate charged on your credit card balance.</p>
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
              <Label htmlFor="monthly-payment">
                Monthly Payment
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The amount you plan to pay each month toward your credit card balance.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹
                </span>
                <Input
                  id="monthly-payment"
                  type="number"
                  min={0}
                  className="pl-7"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                />
              </div>
              {isPaymentTooLow && (
                <p className="text-sm text-red-500">
                  Your payment is too low to pay off the balance. It must be higher than ₹
                  {(balance * (interestRate / 100 / 12)).toFixed(2)} to reduce the principal.
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700">Save Calculation</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payoff Results</CardTitle>
            <CardDescription>Your credit card payoff timeline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isPaymentTooLow ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-900/20">
                <h3 className="font-medium text-red-800 dark:text-red-200">Payment Too Low</h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  Your monthly payment is less than the monthly interest. You need to increase your payment to make
                  progress on paying off this debt.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Time to Pay Off</div>
                    <div className="mt-1 text-2xl font-bold">
                      {payoffResults.months} {payoffResults.months === 1 ? "month" : "months"}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Total Interest</div>
                    <div className="mt-1 text-2xl font-bold">₹{payoffResults.totalInterest.toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Total Payment</div>
                    <div className="mt-1 text-2xl font-bold">₹
                    {payoffResults.totalPaid.toLocaleString()}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Payoff Date</div>
                    <div className="mt-1 text-2xl font-bold">
                      {new Date(Date.now() + payoffResults.months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
                        undefined,
                        { year: "numeric", month: "short" },
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-[250px]">
                  <LineChart
                    data={payoffResults.payoffData}
                    categories={["balance", "interest", "principal"]}
                    index="month"
                    colors={["green", "red", "blue"]}
                    valueFormatter={(value) => `₹${value.toLocaleString()}`}
                    className="h-full"
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="space-y-2 w-full">
              <h4 className="font-medium">Tips to Pay Off Faster</h4>
              <ul className="space-y-2 text-sm">
                <li className="rounded-md border p-2">
                  Increasing your monthly payment by just ₹
                  50 can save you{" "}
                  {Math.round(payoffResults.totalInterest * 0.15)} in interest and pay off{" "}
                  {Math.round(payoffResults.months * 0.2)} months sooner.
                </li>
                <li className="rounded-md border p-2">
                  Consider transferring your balance to a card with a lower interest rate or 0% intro APR.
                </li>
                <li className="rounded-md border p-2">
                  Make bi-weekly payments instead of monthly to reduce interest and pay off faster.
                </li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

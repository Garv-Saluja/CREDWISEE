"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart } from "@/components/ui/chart"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(200000)
  const [interestRate, setInterestRate] = useState(5.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [termType, setTermType] = useState("years")
  const [loanResults, setLoanResults] = useState<{
    monthlyPayment: number
    totalPayment: number
    totalInterest: number
    amortizationSchedule: Array<{
      period: number
      payment: number
      principal: number
      interest: number
      balance: number
    }>
    paymentData: Array<{ year: string; principal: number; interest: number }>
  }>({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterest: 0,
    amortizationSchedule: [],
    paymentData: [],
  })

  // Calculate loan details when inputs change
  useEffect(() => {
    if (loanAmount <= 0 || interestRate <= 0) return

    // Convert term to months
    const termInMonths = termType === "years" ? loanTerm * 12 : loanTerm

    // Calculate monthly interest rate
    const monthlyInterestRate = interestRate / 100 / 12

    // Calculate monthly payment using the loan formula
    const monthlyPayment =
      (loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, termInMonths))) /
      (Math.pow(1 + monthlyInterestRate, termInMonths) - 1)

    // Calculate total payment and interest
    const totalPayment = monthlyPayment * termInMonths
    const totalInterest = totalPayment - loanAmount

    // Generate amortization schedule
    let remainingBalance = loanAmount
    const amortizationSchedule = []
    const paymentData = []
    let yearlyPrincipal = 0
    let yearlyInterest = 0
    let currentYear = 1

    for (let period = 1; period <= termInMonths; period++) {
      // Calculate interest for this period
      const interestPayment = remainingBalance * monthlyInterestRate

      // Calculate principal for this period
      const principalPayment = monthlyPayment - interestPayment

      // Update remaining balance
      remainingBalance = Math.max(0, remainingBalance - principalPayment)

      // Add to yearly totals
      yearlyPrincipal += principalPayment
      yearlyInterest += interestPayment

      // Add to amortization schedule (only store first 12 periods for UI)
      if (period <= 12) {
        amortizationSchedule.push({
          period,
          payment: Number.parseFloat(monthlyPayment.toFixed(2)),
          principal: Number.parseFloat(principalPayment.toFixed(2)),
          interest: Number.parseFloat(interestPayment.toFixed(2)),
          balance: Number.parseFloat(remainingBalance.toFixed(2)),
        })
      }

      // If end of year or last period, add to payment data
      if (period % 12 === 0 || period === termInMonths) {
        paymentData.push({
          year: `Year ${currentYear}`,
          principal: Number.parseFloat(yearlyPrincipal.toFixed(2)),
          interest: Number.parseFloat(yearlyInterest.toFixed(2)),
        })

        // Reset yearly totals and increment year
        yearlyPrincipal = 0
        yearlyInterest = 0
        currentYear++
      }
    }

    setLoanResults({
      monthlyPayment: Number.parseFloat(monthlyPayment.toFixed(2)),
      totalPayment: Number.parseFloat(totalPayment.toFixed(2)),
      totalInterest: Number.parseFloat(totalInterest.toFixed(2)),
      amortizationSchedule,
      paymentData: paymentData.slice(0, Math.min(paymentData.length, 10)), // Limit to first 10 years for chart
    })
  }, [loanAmount, interestRate, loanTerm, termType])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Loan Calculator</h1>
        <p className="text-muted-foreground">
          Calculate monthly payments, total interest, and amortization schedule for any loan.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
            <CardDescription>Enter your loan information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loan-amount">
                Loan Amount
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The total amount you're borrowing.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹                </span>
                <Input
                  id="loan-amount"
                  type="number"
                  min={0}
                  className="pl-7"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-rate">
                Interest Rate (APR)
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The annual percentage rate for your loan.</p>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loan-term">
                  Loan Term
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">The length of time to repay the loan.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="loan-term"
                  type="number"
                  min={1}
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="term-type">Term Type</Label>
                <Select value={termType} onValueChange={setTermType}>
                  <SelectTrigger id="term-type">
                    <SelectValue placeholder="Select term type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="years">Years</SelectItem>
                    <SelectItem value="months">Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700">Save Calculation</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Results</CardTitle>
            <CardDescription>Your loan payment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Monthly Payment</div>
                <div className="mt-1 text-2xl font-bold">₹{loanResults.monthlyPayment.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Total Payment</div>
                <div className="mt-1 text-2xl font-bold">₹{loanResults.totalPayment.toLocaleString()}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-muted-foreground">Total Interest</div>
                <div className="mt-1 text-2xl font-bold">₹{loanResults.totalInterest.toLocaleString()}</div>
              </div>
            </div>

            <div className="h-[250px]">
              <LineChart
                data={loanResults.paymentData}
                categories={["principal", "interest"]}
                index="year"
                colors={["green", "red"]}
                valueFormatter={(value) => `₹${value.toLocaleString()}`}
                className="h-full"
              />
            </div>

            <div>
              <h4 className="font-medium mb-2">Amortization Schedule (First Year)</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Principal</TableHead>
                      <TableHead>Interest</TableHead>
                      <TableHead>Remaining</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanResults.amortizationSchedule.map((row) => (
                      <TableRow key={row.period}>
                        <TableCell>{row.period}</TableCell>
                        <TableCell>₹
                        {row.payment.toLocaleString()}</TableCell>
                        <TableCell>₹
                        {row.principal.toLocaleString()}</TableCell>
                        <TableCell>₹
                        {row.interest.toLocaleString()}</TableCell>
                        <TableCell>₹
                        {row.balance.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="space-y-2 w-full">
              <h4 className="font-medium">Loan Insights</h4>
              <ul className="space-y-2 text-sm">
                <li className="rounded-md border p-2">
                  You'll pay ₹{loanResults.totalInterest.toLocaleString()} in interest over the life of this loan.
                </li>
                <li className="rounded-md border p-2">
                  Increasing your monthly payment by just ₹8000 could save you thousands in interest and pay off your
                  loan earlier.
                </li>
                <li className="rounded-md border p-2">
                  A 1% lower interest rate could save you approximately ₹
                  {(loanAmount * 0.01 * (termType === "years" ? loanTerm : loanTerm / 12)).toFixed(0)} over the life of
                  the loan.
                </li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

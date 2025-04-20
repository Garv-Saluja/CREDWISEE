"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function LoanEligibilityPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(5000)
  const [existingDebts, setExistingDebts] = useState(1500)
  const [employmentStatus, setEmploymentStatus] = useState("full-time")
  const [creditScore, setCreditScore] = useState(700)
  const [loanType, setLoanType] = useState("mortgage")
  const [eligibilityResults, setEligibilityResults] = useState<{
    eligibleAmount: number
    approvalChance: number
    maxDTI: number
    tips: string[]
  }>({
    eligibleAmount: 0,
    approvalChance: 0,
    maxDTI: 0,
    tips: [],
  })

  // Calculate loan eligibility when inputs change
  useEffect(() => {
    // Calculate current DTI ratio
    const currentDTI = (existingDebts / monthlyIncome) * 100

    // Set maximum DTI based on loan type
    let maxDTI = 0
    switch (loanType) {
      case "mortgage":
        maxDTI = 43 // Standard for qualified mortgages
        break
      case "auto":
        maxDTI = 50 // Common for auto loans
        break
      case "personal":
        maxDTI = 40 // Common for personal loans
        break
      case "student":
        maxDTI = 45 // Common for student loans
        break
      default:
        maxDTI = 43
    }

    // Calculate remaining DTI capacity
    const remainingDTICapacity = Math.max(0, maxDTI - currentDTI)

    // Calculate maximum monthly payment based on remaining DTI
    const maxMonthlyPayment = (remainingDTICapacity / 100) * monthlyIncome

    // Calculate eligible loan amount based on loan type
    let eligibleAmount = 0
    let interestRate = 0
    let loanTerm = 0

    switch (loanType) {
      case "mortgage":
        // Adjust interest rate based on credit score
        if (creditScore >= 760) interestRate = 5.5
        else if (creditScore >= 700) interestRate = 6.0
        else if (creditScore >= 660) interestRate = 6.5
        else if (creditScore >= 620) interestRate = 7.0
        else interestRate = 8.0

        loanTerm = 30 * 12 // 30 years in months
        break
      case "auto":
        if (creditScore >= 760) interestRate = 4.5
        else if (creditScore >= 700) interestRate = 5.0
        else if (creditScore >= 660) interestRate = 6.0
        else if (creditScore >= 620) interestRate = 7.5
        else interestRate = 10.0

        loanTerm = 5 * 12 // 5 years in months
        break
      case "personal":
        if (creditScore >= 760) interestRate = 7.0
        else if (creditScore >= 700) interestRate = 9.0
        else if (creditScore >= 660) interestRate = 12.0
        else if (creditScore >= 620) interestRate = 15.0
        else interestRate = 20.0

        loanTerm = 3 * 12 // 3 years in months
        break
      case "student":
        interestRate = 6.5 // Fixed for simplicity
        loanTerm = 10 * 12 // 10 years in months
        break
      default:
        interestRate = 7.0
        loanTerm = 5 * 12
    }

    // Convert annual interest rate to monthly
    const monthlyInterestRate = interestRate / 100 / 12

    // Calculate eligible loan amount using the loan formula
    if (maxMonthlyPayment > 0 && monthlyInterestRate > 0) {
      eligibleAmount = maxMonthlyPayment * ((1 - Math.pow(1 + monthlyInterestRate, -loanTerm)) / monthlyInterestRate)
    }

    // Calculate approval chance based on credit score, DTI, and employment
    let approvalChance = 0

    // Credit score component (0-40%)
    if (creditScore >= 760) approvalChance += 40
    else if (creditScore >= 700) approvalChance += 35
    else if (creditScore >= 660) approvalChance += 25
    else if (creditScore >= 620) approvalChance += 15
    else approvalChance += 5

    // DTI component (0-40%)
    if (currentDTI <= maxDTI * 0.5) approvalChance += 40
    else if (currentDTI <= maxDTI * 0.7) approvalChance += 30
    else if (currentDTI <= maxDTI * 0.9) approvalChance += 20
    else if (currentDTI <= maxDTI) approvalChance += 10

    // Employment component (0-20%)
    if (employmentStatus === "full-time") approvalChance += 20
    else if (employmentStatus === "part-time") approvalChance += 15
    else if (employmentStatus === "self-employed") approvalChance += 10
    else if (employmentStatus === "retired") approvalChance += 15
    else approvalChance += 5 // unemployed

    // Generate tips based on results
    const tips = []

    if (creditScore < 700) {
      tips.push("Improve your credit score to qualify for better interest rates and higher loan amounts.")
    }

    if (currentDTI > maxDTI * 0.8) {
      tips.push(
        "Your debt-to-income ratio is high. Consider paying down existing debts before applying for a new loan.",
      )
    }

    if (employmentStatus !== "full-time" && employmentStatus !== "retired") {
      tips.push(
        "Lenders prefer borrowers with stable, full-time employment. Consider applying after securing more stable income.",
      )
    }

    if (approvalChance < 50) {
      tips.push("Consider applying with a co-signer to improve your chances of approval.")
    }

    if (tips.length === 0) {
      tips.push("You have a strong application profile. Shop around for the best rates.")
    }

    setEligibilityResults({
      eligibleAmount: Math.round(eligibleAmount / 1000) * 1000, // Round to nearest thousand
      approvalChance,
      maxDTI,
      tips,
    })
  }, [monthlyIncome, existingDebts, employmentStatus, creditScore, loanType])

  // Get approval chance rating
  const getApprovalRating = (chance: number) => {
    if (chance >= 80) return { rating: "Excellent", color: "text-green-600" }
    if (chance >= 60) return { rating: "Good", color: "text-green-500" }
    if (chance >= 40) return { rating: "Fair", color: "text-yellow-500" }
    if (chance >= 20) return { rating: "Poor", color: "text-orange-500" }
    return { rating: "Very Poor", color: "text-red-500" }
  }

  const approvalRating = getApprovalRating(eligibilityResults.approvalChance)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Loan Eligibility Checker</h1>
        <p className="text-muted-foreground">Estimate your loan approval chances and maximum eligible amount.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Financial Profile</CardTitle>
            <CardDescription>Enter your financial information to check loan eligibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loan-type">
                Loan Type
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Different loan types have different eligibility criteria.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select value={loanType} onValueChange={setLoanType}>
                <SelectTrigger id="loan-type">
                  <SelectValue placeholder="Select loan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mortgage">Mortgage</SelectItem>
                  <SelectItem value="auto">Auto Loan</SelectItem>
                  <SelectItem value="personal">Personal Loan</SelectItem>
                  <SelectItem value="student">Student Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
              <Label htmlFor="existing-debts">
                Existing Monthly Debt Payments
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Include all current debt payments like mortgage/rent, car loans, credit cards, etc.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">₹                </span>
                <Input
                  id="existing-debts"
                  type="number"
                  min={0}
                  className="pl-7"
                  value={existingDebts}
                  onChange={(e) => setExistingDebts(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employment-status">
                Employment Status
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Your current employment situation affects loan eligibility.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                <SelectTrigger id="employment-status">
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credit-score">
                Credit Score
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="ml-1 h-4 w-4 inline-block text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">Your credit score is a key factor in loan approval and interest rates.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Label>
              <Input
                id="credit-score"
                type="number"
                min={300}
                max={850}
                value={creditScore}
                onChange={(e) => setCreditScore(Number(e.target.value))}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-green-600 hover:bg-green-700">Save Profile</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Eligibility Results</CardTitle>
            <CardDescription>Based on your financial profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg border p-6 text-center">
              <div className="text-sm text-muted-foreground">Estimated Eligible Loan Amount</div>
              <div className="mt-2 text-4xl font-bold text-green-600">
              ₹{eligibilityResults.eligibleAmount.toLocaleString()}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Based on your income, existing debts, and a maximum DTI of {eligibilityResults.maxDTI}%
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Approval Chance</div>
                <div className={`text-sm font-medium ${approvalRating.color}`}>
                  {approvalRating.rating} ({eligibilityResults.approvalChance}%)
                </div>
              </div>
              <Progress value={eligibilityResults.approvalChance} className="h-2" />
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Eligibility Factors</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 rounded-md border p-3">
                  <div className="text-sm">Current DTI Ratio:</div>
                  <div className="text-sm font-medium text-right">
                    {((existingDebts / monthlyIncome) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm">Maximum Allowed DTI:</div>
                  <div className="text-sm font-medium text-right">{eligibilityResults.maxDTI}%</div>
                  <div className="text-sm">Credit Score Impact:</div>
                  <div className="text-sm font-medium text-right">
                    {creditScore >= 740
                      ? "Excellent"
                      : creditScore >= 670
                        ? "Good"
                        : creditScore >= 580
                          ? "Fair"
                          : "Poor"}
                  </div>
                  <div className="text-sm">Employment Status:</div>
                  <div className="text-sm font-medium text-right capitalize">{employmentStatus.replace("-", " ")}</div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="space-y-2 w-full">
              <h4 className="font-medium">Tips to Improve Eligibility</h4>
              <ul className="space-y-2 text-sm">
                {eligibilityResults.tips.map((tip, index) => (
                  <li key={index} className="rounded-md border p-2">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

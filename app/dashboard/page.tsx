"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/chart"
import { BarChart3, CreditCard, PiggyBank, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Check if user has completed onboarding
  useEffect(() => {
    if (user && !user.financialData.hasCompletedOnboarding) {
      router.push("/dashboard/onboarding")
    }
  }, [user, router])

  // If user hasn't completed onboarding, don't render the dashboard
  if (!user?.financialData.hasCompletedOnboarding) {
    return null
  }

  // Calculate DTI ratio
  const dtiRatio =
    user.financialData.monthlyIncome && user.financialData.monthlyDebt
      ? ((user.financialData.monthlyDebt / user.financialData.monthlyIncome) * 100).toFixed(1)
      : "N/A"

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
        <div className="flex items-center gap-2">
          <Link href="/dashboard/profile">
            <Button variant="outline" size="sm">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credit">Credit</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="debt">Debt</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credit Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.financialData.creditScore || "Not set"}</div>
                {user.financialData.creditHistory && user.financialData.creditHistory.length > 1 && (
                  <p className="text-xs text-muted-foreground">
                    {user.financialData.creditHistory[user.financialData.creditHistory.length - 1].score >
                    user.financialData.creditHistory[user.financialData.creditHistory.length - 2].score
                      ? "+"
                      : ""}
                    {user.financialData.creditHistory[user.financialData.creditHistory.length - 1].score -
                      user.financialData.creditHistory[user.financialData.creditHistory.length - 2].score}{" "}
                    from last month
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">DTI Ratio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dtiRatio}%</div>
                <p className="text-xs text-muted-foreground">
                  {user.financialData.monthlyDebt && user.financialData.monthlyIncome
                    ? `₹${user.financialData.monthlyDebt.toLocaleString()} of ₹${user.financialData.monthlyIncome.toLocaleString()} income`
                    : "Not calculated"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Savings</CardTitle>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.financialData.totalSavings ? `₹${user.financialData.totalSavings.toLocaleString()}` : "Not set"}
                </div>
                {user.financialData.savingsHistory && user.financialData.savingsHistory.length > 1 && (
                  <p className="text-xs text-muted-foreground">
                    {user.financialData.savingsHistory[user.financialData.savingsHistory.length - 1].amount >
                    user.financialData.savingsHistory[user.financialData.savingsHistory.length - 2].amount
                      ? "+"
                      : ""}
                    ₹
                    {(
                      user.financialData.savingsHistory[user.financialData.savingsHistory.length - 1].amount -
                      user.financialData.savingsHistory[user.financialData.savingsHistory.length - 2].amount
                    ).toLocaleString()}{" "}
                    from last month
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user.financialData.totalDebt ? `₹${user.financialData.totalDebt.toLocaleString()}` : "Not set"}
                </div>
                {user.financialData.debtHistory && user.financialData.debtHistory.length > 1 && (
                  <p className="text-xs text-muted-foreground">
                    {user.financialData.debtHistory[user.financialData.debtHistory.length - 1].amount <
                    user.financialData.debtHistory[user.financialData.debtHistory.length - 2].amount
                      ? "-"
                      : "+"}
                    ₹
                    {Math.abs(
                      user.financialData.debtHistory[user.financialData.debtHistory.length - 1].amount -
                        user.financialData.debtHistory[user.financialData.debtHistory.length - 2].amount,
                    ).toLocaleString()}{" "}
                    from last month
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Credit Score Trend</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                {user.financialData.creditHistory ? (
                  <LineChart
                    data={user.financialData.creditHistory}
                    categories={["score"]}
                    index="month"
                    colors={["green"]}
                    valueFormatter={(value) => `${value}`}
                    className="h-[300px]"
                  />
                ) : (
                  <div className="flex h-[300px] items-center justify-center">
                    <p className="text-muted-foreground">No credit history data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Financial Tips</CardTitle>
                <CardDescription>Personalized advice based on your financial situation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.financialData.creditScore && user.financialData.creditScore < 670 && (
                    <div className="rounded-lg border p-3">
                      <h3 className="font-medium">Improve Credit Score</h3>
                      <p className="text-sm text-muted-foreground">
                        Consider paying down credit card balances to reduce your utilization ratio.
                      </p>
                    </div>
                  )}
                  {user.financialData.monthlyIncome &&
                    user.financialData.monthlyDebt &&
                    user.financialData.monthlyDebt / user.financialData.monthlyIncome > 0.36 && (
                      <div className="rounded-lg border p-3">
                        <h3 className="font-medium">Reduce Debt-to-Income Ratio</h3>
                        <p className="text-sm text-muted-foreground">
                          Your DTI ratio is high. Focus on paying down debt or increasing income.
                        </p>
                      </div>
                    )}
                  {user.financialData.totalSavings &&
                    user.financialData.monthlyIncome &&
                    user.financialData.totalSavings < user.financialData.monthlyIncome * 3 && (
                      <div className="rounded-lg border p-3">
                        <h3 className="font-medium">Build Emergency Fund</h3>
                        <p className="text-sm text-muted-foreground">
                          Aim to save 3-6 months of expenses for emergencies.
                        </p>
                      </div>
                    )}
                  {(!user.financialData.creditScore ||
                    !user.financialData.totalSavings ||
                    !user.financialData.totalDebt) && (
                    <div className="rounded-lg border p-3">
                      <h3 className="font-medium">Complete Your Profile</h3>
                      <p className="text-sm text-muted-foreground">
                        Add more financial details to get personalized recommendations.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="credit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit Score Factors</CardTitle>
              <CardDescription>Breakdown of factors affecting your credit score</CardDescription>
            </CardHeader>
            <CardContent>
              {user.financialData.creditScore ? (
                <>
                  <BarChart
                    data={[
                      { factor: "Payment History", value: 35 },
                      { factor: "Credit Utilization", value: 30 },
                      { factor: "Credit Age", value: 15 },
                      { factor: "Credit Mix", value: 10 },
                      { factor: "New Credit", value: 10 },
                    ]}
                    categories={["value"]}
                    index="factor"
                    colors={["green"]}
                    valueFormatter={(value) => `${value}%`}
                    className="h-[300px]"
                  />
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium">Your Credit Score: {user.financialData.creditScore}</h3>
                    <div className="relative h-4 w-full rounded-full bg-gray-200">
                      <div
                        className="absolute h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                        style={{ width: "100%" }}
                      ></div>
                      <div
                        className="absolute top-6 h-4 w-4 -translate-x-1/2"
                        style={{ left: `${((user.financialData.creditScore - 300) / 550) * 100}%` }}
                      >
                        <div className="h-4 w-4 rounded-full bg-white border-2 border-gray-800"></div>
                        <div className="mt-2 text-center text-xs font-medium">{user.financialData.creditScore}</div>
                      </div>
                      <div className="absolute top-0 left-0 text-xs">300</div>
                      <div className="absolute top-0 left-1/4 text-xs">450</div>
                      <div className="absolute top-0 left-1/2 text-xs">580</div>
                      <div className="absolute top-0 left-3/4 text-xs">720</div>
                      <div className="absolute top-0 right-0 text-xs">850</div>
                    </div>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium">Credit Score History</h4>
                        {user.financialData.creditHistory ? (
                          <LineChart
                            data={user.financialData.creditHistory}
                            categories={["score"]}
                            index="month"
                            colors={["green"]}
                            valueFormatter={(value) => `${value}`}
                            className="h-[200px] mt-2"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2">No history data available</p>
                        )}
                      </div>
                      <div className="rounded-lg border p-4">
                        <h4 className="font-medium">Tips to Improve</h4>
                        <ul className="mt-2 space-y-2 text-sm">
                          <li className="flex items-start">
                            <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                            Pay all bills on time
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                            Keep credit card balances below 30% of limits
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                            Don't close old credit accounts
                          </li>
                          <li className="flex items-start">
                            <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                            Limit applications for new credit
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No credit score information available</p>
                  <Link href="/dashboard/onboarding">
                    <Button>Add Credit Information</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="savings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Savings Growth</CardTitle>
              <CardDescription>Your savings growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              {user.financialData.totalSavings ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">Current Savings</div>
                      <div className="mt-1 text-2xl font-bold">₹                      {user.financialData.totalSavings.toLocaleString()}</div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">Monthly Income</div>
                      <div className="mt-1 text-2xl font-bold">
                        {user.financialData.monthlyIncome
                          ? `₹${user.financialData.monthlyIncome.toLocaleString()}`
                          : "Not set"}
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">Recommended Emergency Fund</div>
                      <div className="mt-1 text-2xl font-bold">
                        {user.financialData.monthlyIncome
                          ? `₹${(user.financialData.monthlyIncome * 6).toLocaleString()}`
                          : "Not calculated"}
                      </div>
                    </div>
                  </div>

                  {user.financialData.savingsHistory ? (
                    <LineChart
                      data={user.financialData.savingsHistory}
                      categories={["amount"]}
                      index="month"
                      colors={["green"]}
                      valueFormatter={(value) => `₹${value.toLocaleString()}`}
                      className="h-[300px]"
                    />
                  ) : (
                    <div className="flex h-[300px] items-center justify-center">
                      <p className="text-muted-foreground">No savings history data available</p>
                    </div>
                  )}

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium">Savings Goals</h4>
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Emergency Fund</span>
                            <span className="text-sm font-medium">
                              {user.financialData.monthlyIncome && user.financialData.totalSavings
                                ? `${Math.min(100, Math.round((user.financialData.totalSavings / (user.financialData.monthlyIncome * 6)) * 100))}%`
                                : "0%"}
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-green-600"
                              style={{
                                width:
                                  user.financialData.monthlyIncome && user.financialData.totalSavings
                                    ? `${Math.min(100, Math.round((user.financialData.totalSavings / (user.financialData.monthlyIncome * 6)) * 100))}%`
                                    : "0%",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium">Savings Tips</h4>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                          Aim to save at least 20% of your income
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                          Build an emergency fund of 3-6 months of expenses
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                          Consider high-yield savings accounts for better returns
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                          Set up automatic transfers to your savings account
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No savings information available</p>
                  <Link href="/dashboard/onboarding">
                    <Button>Add Savings Information</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="debt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Debt Reduction</CardTitle>
              <CardDescription>Your debt reduction progress</CardDescription>
            </CardHeader>
            <CardContent>
              {user.financialData.totalDebt ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">Total Debt</div>
                      <div className="mt-1 text-2xl font-bold">${user.financialData.totalDebt.toLocaleString()}</div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">Monthly Debt Payments</div>
                      <div className="mt-1 text-2xl font-bold">
                        {user.financialData.monthlyDebt
                          ? `$${user.financialData.monthlyDebt.toLocaleString()}`
                          : "Not set"}
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm text-muted-foreground">Debt-to-Income Ratio</div>
                      <div className="mt-1 text-2xl font-bold">{dtiRatio}%</div>
                    </div>
                  </div>

                  {user.financialData.debtHistory ? (
                    <LineChart
                      data={user.financialData.debtHistory}
                      categories={["amount"]}
                      index="month"
                      colors={["red"]}
                      valueFormatter={(value) => `₹
${value.toLocaleString()}`}
                      className="h-[300px]"
                    />
                  ) : (
                    <div className="flex h-[300px] items-center justify-center">
                      <p className="text-muted-foreground">No debt history data available</p>
                    </div>
                  )}

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium">Debt Breakdown</h4>
                      <div className="mt-4 space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Debt-to-Income Ratio</span>
                            <span className="text-sm font-medium">{dtiRatio}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className={`h-2 rounded-full ${
                                Number.parseFloat(dtiRatio) > 43
                                  ? "bg-red-500"
                                  : Number.parseFloat(dtiRatio) > 36
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(100, Number.parseFloat(dtiRatio) * 2)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Good (0-36%)</span>
                            <span>Fair (36-43%)</span>
                            <span>Poor (43%+)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h4 className="font-medium">Debt Reduction Tips</h4>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                          Focus on paying off high-interest debt first
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                          Consider debt consolidation for multiple high-interest debts
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                          Make more than minimum payments when possible
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2 mt-0.5 h-2 w-2 rounded-full bg-green-500"></span>
                          Avoid taking on new debt while paying off existing debt
                        </li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <p className="text-muted-foreground mb-4">No debt information available</p>
                  <Link href="/dashboard/onboarding">
                    <Button>Add Debt Information</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

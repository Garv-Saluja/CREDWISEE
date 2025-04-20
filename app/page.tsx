import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Calculator, CreditCard, PiggyBank, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">Credwise</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/tools" className="text-sm font-medium hover:underline underline-offset-4">
              Financial Tools
            </Link>
            <Link href="/education" className="text-sm font-medium hover:underline underline-offset-4">
              Education
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline underline-offset-4">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-green-50 dark:from-gray-950 dark:to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Build Credit. Grow Wealth. <span className="text-green-600">Master Your Finances.</span>
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Credwise provides the tools and knowledge you need to improve your credit score, manage debt, and
                  build a secure financial future.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="bg-green-600 hover:bg-green-700">
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/tools">
                    <Button size="lg" variant="outline">
                      Explore Tools
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-square">
                  <img
                    alt="Financial growth chart"
                    className="mx-auto rounded-lg object-cover"
                    src="/placeholder.svg?height=500&width=500"
                    width={500}
                    height={500}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Financial Tools That Make a Difference
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Our interactive calculators and simulators help you understand your finances and make informed
                  decisions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <BarChart3 className="h-12 w-12 text-green-600" />
                <h3 className="text-xl font-bold">Credit Score Simulator</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  See how different factors affect your credit score and get personalized tips.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Calculator className="h-12 w-12 text-green-600" />
                <h3 className="text-xl font-bold">Debt-to-Income Calculator</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Calculate your DTI ratio and understand how lenders view your financial health.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <CreditCard className="h-12 w-12 text-green-600" />
                <h3 className="text-xl font-bold">Credit Card Payoff</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Create a plan to pay off credit card debt and visualize your progress.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <PiggyBank className="h-12 w-12 text-green-600" />
                <h3 className="text-xl font-bold">Savings Growth Planner</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  See how your savings can grow over time with compound interest.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Calculator className="h-12 w-12 text-green-600" />
                <h3 className="text-xl font-bold">Loan Calculator</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Calculate monthly payments, total interest, and more for any loan.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <Shield className="h-12 w-12 text-green-600" />
                <h3 className="text-xl font-bold">Loan Eligibility Checker</h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  Estimate your loan approval chances and maximum eligible amount.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-gray-50 dark:bg-gray-900">
        <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8 px-4 md:px-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              <span className="text-xl font-bold">Credwise</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Building financial literacy and credit health, one step at a time.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            <div className="space-y-2">
              <h4 className="font-medium">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-500 hover:underline dark:text-gray-400">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-500 hover:underline dark:text-gray-400">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/tools" className="text-gray-500 hover:underline dark:text-gray-400">
                    Financial Tools
                  </Link>
                </li>
                <li>
                  <Link href="/education" className="text-gray-500 hover:underline dark:text-gray-400">
                    Education
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:underline dark:text-gray-400">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-500 hover:underline dark:text-gray-400">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Credwise. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

'use client'

import { useState, useEffect, Suspense, lazy } from "react"
import { debounce } from 'lodash'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from '@/components/layout/ThemeContext'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ChevronUp } from 'lucide-react'
import Navbar from "@/components/layout/navbar"
import Footer from '@/components/layout/footer'
import Hero from '@/components/layout/hero'
import How from '@/components/layout/how'
import { ErrorBoundary } from 'react-error-boundary'

const Dashboard = lazy(() => import("@/components/layout/dashboard"))
const KeyFeatures = lazy(() => import("@/components/layout/keyfeat"))
const FAQ = lazy(() => import("@/components/layout/faq"))

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert" className="p-4 bg-red-100 border border-red-400 rounded">
      <p className="text-red-700">Something went wrong:</p>
      <pre className="text-sm text-red-500">{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  )
}

export default function FraudScoutDashboard() {
  const [image, setImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState([])
  const [showData, setShowData] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight
        const scrollPosition = window.scrollY
        const progress = (scrollPosition / totalHeight) * 100
        setScrollProgress(progress)
        setShowBackToTop(scrollPosition > 300)
      })
    }

    const debouncedHandleScroll = debounce(handleScroll, 10)

    window.addEventListener('scroll', debouncedHandleScroll)
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll)
      debouncedHandleScroll.cancel()
    }
  }, [])

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!image) return

    setIsLoading(true)
    setUploadProgress(0)
    const formData = new FormData()
    formData.append('file', image)

    try {
      const response = await fetch("http://127.0.0.1:5000/predict_csv", {
        method: "POST",
        body: formData,
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setResponse(data)
      setShowData(true)
    } catch (error) {
      console.error("Error fetching data:", error)
      setShowData(false)
      alert("An error occurred while processing your request. Please try again.")
    } finally {
      setIsLoading(false)
      setUploadProgress(100)
    }
  }

  const dashboardData = {
    totalTransactions: 493,
    fraudulentTransactions: 33,
    alertsTriggered: 12,
    riskScore: 22,
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <ThemeProvider storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Progress 
          value={scrollProgress} 
          className="fixed top-0 left-0 right-0 z-50 h-1 w-full bg-secondary transition-all duration-300 ease-out"
          indicatorClassName="bg-primary transition-all duration-300 ease-out"
        />
        <main className="flex-grow">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <section id="hero" className="scroll-mt-16">
              <Hero />
            </section>
            <Divider />

            <How />
            <Divider />
            
            <Suspense fallback={<LoadingSpinner />}>
              <section id="dashboard" className="scroll-mt-16">
                <Dashboard 
                  dashboardData={dashboardData} 
                  onSubmit={onSubmit} 
                  handleImage={handleImage} 
                  isLoading={isLoading} 
                  image={image} 
                  uploadProgress={uploadProgress} 
                  showData={showData} 
                  response={response} 
                />
              </section>
            </Suspense>
            <Divider />
            
            <Suspense fallback={<LoadingSpinner />}>
              <section id="features" className="scroll-mt-16">
                <KeyFeatures />
              </section>
            </Suspense>
            <Divider />
            
            <Suspense fallback={<LoadingSpinner />}>
              <section id="faq" className="scroll-mt-16">
                <FAQ />
              </section>
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer />

        {showBackToTop && (
          <Button
            className="fixed bottom-4 right-4 rounded-full p-2"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <ChevronUp className="h-6 w-6" />
          </Button>
        )}
      </div>
    </ThemeProvider>
  )
}

function Divider() {
  return (
    <div className="w-full flex justify-center my-8">
      <div className="w-16 h-1 bg-primary rounded-full"></div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
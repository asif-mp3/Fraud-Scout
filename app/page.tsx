'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Shield, Upload, BarChart, Search, Bell, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from '@/components/layout/ThemeContext'
import Navbar from "@/components/layout/navbar"
import Footer from '@/components/layout/footer'
import Hero from '@/components/layout/hero'
import Dashboard from '@/components/layout/dashboard'
import KeyFeatures from '@/components/layout/keyfeat'
import FAQ from '@/components/layout/faq'
import { Progress } from "@/components/ui/progress"

export default function FraudScoutDashboard() {
  const [image, setImage] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState([])
  const [showData, setShowData] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  const router = useRouter()

  // Smooth scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const progress = (scrollPosition / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
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

  // Simulated data for the dashboard
  const dashboardData = {
    totalTransactions: 493,
    fraudulentTransactions: 33,
    alertsTriggered: 12,
    riskScore: 22,
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Navbar />
          <section id="hero" className="scroll-mt-16">
          <Progress 
          value={scrollProgress} 
          className="fixed top-0 left-0 right-0 z-50 h-1 w-full bg-secondary"
          indicatorClassName="bg-primary"
        />
            <Hero />
          </section>
          <div className="w-full flex justify-center my-8">
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </div>
          
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
          <div className="w-full flex justify-center my-8">
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </div>
          
          <section id="features" className="scroll-mt-16">
            <KeyFeatures />
          </section>
          <div className="w-full flex justify-center my-8">
            <div className="w-16 h-1 bg-primary rounded-full"></div>
          </div>
          
          <section id="faq" className="scroll-mt-16">
            <FAQ />
            
          </section>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
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
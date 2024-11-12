'use client'

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Upload, BarChart2, FileText, AlertTriangle, Search, ChevronRight, ChevronLeft, Check, HelpCircle, Play, Pause, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme, useThemeStyles } from "@/components/layout/ThemeContext"

const steps = [
  {
    title: "Upload CSV",
    description: "Start by uploading your transaction data in CSV format.",
    icon: Upload,
    color: "bg-blue-500",
    component: "CSVUpload"
  },
  {
    title: "Analyze Data",
    description: "Our system processes the data and identifies potential fraud indicators.",
    icon: Search,
    color: "bg-green-500",
    component: "Analyzer"
  },
  {
    title: "Monitor Transactions",
    description: "View live transaction feed and visualize trends in real-time.",
    icon: BarChart2,
    color: "bg-purple-500",
    component: "Monitor"
  },
  {
    title: "Generate Reports",
    description: "Create detailed fraud analysis reports for specific time periods.",
    icon: FileText,
    color: "bg-orange-500",
    component: "Reports"
  },
  {
    title: "Review Alerts",
    description: "Investigate flagged transactions and take appropriate action.",
    icon: AlertTriangle,
    color: "bg-red-500",
    component: "Alerts"
  }
]

const ProgressBar = ({ currentStep }: { currentStep: number }) => {
  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <div className="w-full mt-6">
      <Progress value={progress} className="w-full h-2" />
      <div className="flex justify-between mt-2">
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              index <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const StepContent = ({ step, isActive }: { step: typeof steps[0], isActive: boolean }) => {
  const { theme } = useTheme()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`bg-card p-6 rounded-xl shadow-lg ${isActive ? 'ring-2 ring-primary ring-opacity-50' : ''}`}
    >
      <motion.div
        className={`p-3 rounded-full ${step.color} inline-block mb-4`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <step.icon className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{step.title}</h3>
      <p className="text-muted-foreground mb-6 text-base">{step.description}</p>
      <div className="space-y-4">
        {step.title === "Upload CSV" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="instructions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="demo">Interactive Demo</TabsTrigger>
              </TabsList>
              <TabsContent value="instructions">
                <p className="mb-3">To upload your CSV file:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li className="text-base">Navigate to the CSV Upload page</li>
                  <li className="text-base">Drag and drop your CSV file or click to select</li>
                  <li className="text-base">Review the file preview to ensure correct data</li>
                  <li className="text-base">Click "Analyze Data" to proceed</li>
                </ol>
                <div className="mt-4 flex space-x-3">
                  <Badge variant="outline" className="text-sm py-1 px-2">Supported formats: CSV</Badge>
                  <Badge variant="outline" className="text-sm py-1 px-2">Max file size: 10MB</Badge>
                </div>
              </TabsContent>
              <TabsContent value="demo">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg mb-2">Drag and drop your CSV file here</p>
                  <p className="text-sm text-gray-500 mb-4">or</p>
                  <Button>Select File</Button>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
        {step.title === "Analyze Data" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p className="mb-3">During the analysis process:</p>
            <ul className="list-disc list-inside space-y-2">
              <li className="text-base">Our AI algorithms process your transaction data</li>
              <li className="text-base">The system identifies patterns and anomalies</li>
              <li className="text-base">Potential fraud indicators are flagged</li>
              <li className="text-base">A risk score is assigned to each transaction</li>
            </ul>
            <Card className="mt-6 bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-lg">Analysis Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Transactions Analyzed</p>
                    <p className="text-xl font-bold">10,000+</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Accuracy Rate</p>
                    <p className="text-xl font-bold">99.7%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Processing Time</p>
                    <p className="text-xl font-bold">&lt; 5 seconds</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Fraud Detection Rate</p>
                    <p className="text-xl font-bold">95%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {step.title === "Monitor Transactions" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p className="mb-3">In the Monitor section, you can:</p>
            <ul className="list-disc list-inside space-y-2">
              <li className="text-base">View a live feed of incoming transactions</li>
              <li className="text-base">See real-time charts of transaction trends</li>
              <li className="text-base">Toggle between different chart types for visualization</li>
              <li className="text-base">Analyze the distribution of risk scores</li>
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 text-lg">Live Feed</h4>
                  <p className="text-muted-foreground text-sm">Real-time transaction updates</p>
                  <div className="mt-4 space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-sm">Transaction #{1000 + i}</span>
                        <Badge variant={i === 0 ? "destructive" : "secondary"}>
                          {i === 0 ? "High Risk" : "Low Risk"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500/10 to-yellow-500/10">
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-2 text-lg">Trend Analysis</h4>
                  <p className="text-muted-foreground text-sm">Interactive charts and graphs</p>
                  <div className="mt-4 h-32 flex items-end justify-between">
                    {[40, 60, 30, 70, 50].map((height, i) => (
                      <div key={i} className="w-1/6 bg-primary" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
        {step.title === "Generate Reports" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p className="mb-3">To generate a report:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li className="text-base">Go to the Reports section</li>
              <li className="text-base">Select the report type (daily, weekly, monthly, or custom)</li>
              <li className="text-base">Choose the date range for your report</li>
              <li className="text-base">Click "Generate Report" to create your analysis</li>
            </ol>
            <Card className="mt-6 bg-gradient-to-br from-orange-500/10 to-red-500/10">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-lg">Available Report Types</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li className="text-base">Transaction Summary</li>
                  <li className="text-base">Fraud Detection Analysis</li>
                  <li className="text-base">Risk Score Distribution</li>
                  <li className="text-base">Trend Comparison</li>
                </ul>
                <Button className="mt-4 w-full">Generate Sample Report</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {step.title === "Review Alerts" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <p className="mb-3">When reviewing alerts:</p>
            <ul className="list-disc list-inside space-y-2">
              <li className="text-base">Access the list of flagged transactions</li>
              <li className="text-base">Review details of each suspicious activity</li>
              <li className="text-base">Investigate using provided risk factors and scores</li>
              <li className="text-base">Take appropriate action (e.g., block transaction, contact customer)</li>
            </ul>
            <div className="mt-6 bg-gradient-to-br from-yellow-500/20 to-red-500/20 p-4 rounded-xl">
              <h4 className="font-semibold mb-3 text-lg flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                Alert Priority Levels
              </h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Badge variant="destructive" className="mr-2 px-2 py-0.5">High</Badge>
                  <span className="text-base">Immediate action required</span>
                </li>
                <li className="flex items-center">
                  <Badge variant="warning" className="mr-2 px-2 py-0.5">Medium</Badge>
                  <span className="text-base">Investigate within 24 hours</span>
                </li>
                <li className="flex items-center">
                  <Badge variant="secondary" className="mr-2 px-2 py-0.5">Low</Badge>
                  <span className="text-base">Review when possible</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
      <div className="mt-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="group transition-all duration-300 ease-in-out 
                  hover:bg-primary hover:text-primary-foreground 
                  dark:hover:bg-primary dark:hover:text-primary-foreground
                  active:bg-primary/90 text-base py-4 px-6"
              >
                <span className="mr-2 group-hover:mr-3 transition-all duration-300 ease-in-out">Go to {step.component}</span>
                <ChevronRight className="w-4 h-4 transition-all duration-300 ease-in-out transform group-hover:translate-x-1" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-primary text-primary-foreground p-3 text-base">
              <p>Navigate to the {step.component} section to start using this feature</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  )
}

export default function HowToUse() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(false)
  const { theme } = useTheme()
  const { backgroundColor, color } = useThemeStyles()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isAutoPlay) {
      timer = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % steps.length)
      }, 8000)
    }
    return () => clearInterval(timer)
  }, [isAutoPlay])

  const handlePrevStep = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length)
  }

  const handleNextStep = () => {
    setActiveStep((prev) => (prev + 1) % steps.length)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-10" style={{ backgroundColor }}>
      <Card className="w-full max-w-10xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <section id="how-to-use" className="relative py-16 overflow-hidden transition-colors duration-300" style={{ color }}>
            <div className="relative z-10">
              <motion.h2 
                className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                How to Use FraudScout
              </motion.h2>
              <div className="flex flex-col lg:flex-row items-start gap-8">
                <div className="w-full lg:w-1/3">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      className={`mb-4 p-4 rounded-xl cursor-pointer transition-all duration-300 ease-in-out ${
                        activeStep === index
                          ? 'bg-gradient-to-r from-purple-600 to-black text-white shadow-lg'
                          : 'bg-card hover:bg-primary/10 hover:shadow-md'
                      }`}
                      onClick={() => setActiveStep(index)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-full ${step.color} mr-3`}>
                          <step.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-base">{step.title}</h3>
                      </div>
                    </motion.div>
                  ))}
                  <div className="mt-6 flex justify-between items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAutoPlay(!isAutoPlay)}
                      className="transition-all duration-300 ease-in-out 
                        hover:bg-primary hover:text-primary-foreground 
                        dark:hover:bg-primary dark:hover:text-primary-foreground
                        active:bg-primary/90"
                    > 
                      {isAutoPlay ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      {isAutoPlay ? 'Pause' : 'Auto Play'}
                    </Button>
                    <div className="flex space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePrevStep}
                        className="transition-all duration-300 ease-in-out 
                          hover:bg-primary hover:text-primary-foreground 
                          dark:hover:bg-primary dark:hover:text-primary-foreground
                          active:bg-primary/90 w-10 h-10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleNextStep}
                        className="transition-all duration-300 ease-in-out 
                          hover:bg-primary hover:text-primary-foreground 
                          dark:hover:bg-primary dark:hover:text-primary-foreground
                          active:bg-primary/90 w-10 h-10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-2/3">
                  <AnimatePresence mode="wait">
                    <StepContent key={activeStep} step={steps[activeStep]} isActive={true} />
                  </AnimatePresence>
                  <ProgressBar currentStep={activeStep} />
                </div>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, Bell, TrendingUp, AlertTriangle, Upload, Activity, FileText, CreditCard, Lock, Shield, Eye, FileSearch, BarChart2, Fingerprint, Wifi, Settings, ShieldOff, Database, Globe, UserCheck, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import CSVUpload from '../dashboard/csvupload'
import Monitor from '../dashboard/monitor'
import Reports from '../dashboard/reports'
import { useTheme, useThemeStyles } from '../layout/ThemeContext'

interface DashboardProps {
  dashboardData: {
    totalTransactions: number
    fraudulentTransactions: number
    alertsTriggered: number
    riskScore: number
  }
}

const floatingIcons = [
  { Icon: CreditCard, size: 34, top: '2%', left: '2%', rotation: '8deg' },
  { Icon: Lock, size: 46, top: '5%', right: '2%', rotation: '-5deg' },
  { Icon: Shield, size: 38, top: '40%', left: '1%', rotation: '4deg' },
  { Icon: AlertTriangle, size: 30, top: '60%', right: '1%', rotation: '15deg' },
  { Icon: Eye, size: 26, bottom: '5%', left: '5%', rotation: '-10deg' },
  { Icon: FileSearch, size: 34, bottom: '10%', right: '3%', rotation: '12deg' },
  { Icon: BarChart2, size: 38, top: '15%', left: '30%', rotation: '-7deg' },
  { Icon: Fingerprint, size: 42, bottom: '20%', left: '2%', rotation: '5deg' },
  { Icon: Wifi, size: 30, top: '80%', right: '15%', rotation: '-4deg' },
  { Icon: Settings, size: 28, bottom: '2%', right: '40%', rotation: '11deg' },
  { Icon: ShieldOff, size: 36, top: '25%', right: '5%', rotation: '-12deg' },
  { Icon: Database, size: 40, bottom: '35%', left: '3%', rotation: '3deg' },
  { Icon: Globe, size: 32, top: '50%', right: '2%', rotation: '-6deg' },
  { Icon: UserCheck, size: 34, bottom: '8%', left: '25%', rotation: '9deg' },
  { Icon: Key, size: 48, top: '5%', left: '70%', rotation: '-10deg' },
  { Icon: CreditCard, size: 34, top: '70%', right: '30%', rotation: '8deg' },
]

export default function Component({ dashboardData }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('upload')
  const [liveTransactions, setLiveTransactions] = useState<{ id: number; amount: number; status: 'Normal' | 'Suspicious' }[]>([])
  const [transactionHistory, setTransactionHistory] = useState<{ time: string; normal: number; suspicious: number }[]>([])
  const { theme } = useTheme()
  const themeStyles = useThemeStyles()

  // Simulated data for CSV upload
  const [isLoading, setIsLoading] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showData, setShowData] = useState(false)
  const [response, setResponse] = useState(null)

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0])
    }
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          setIsLoading(false)
          setShowData(true)
          
          setResponse({ fraudDetected: 15, totalTransactions: 1000, riskScore: 35 })
          return 100
        }
        return prevProgress + 10
      })
    }, 500)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const newTransaction = {
        id: Math.floor(Math.random() * 100000),
        amount: Math.floor(Math.random() * 10000),
        status: Math.random() > 0.8 ? 'Suspicious' : 'Normal'
      }
      setLiveTransactions(prev => [newTransaction, ...prev.slice(0, 4)])
      
      setTransactionHistory(prev => {
        const now = new Date()
        const time = now.toLocaleTimeString()
        const lastEntry = prev[prev.length - 1] || { normal: 0, suspicious: 0 }
        return [...prev.slice(-19), {
          time,
          normal: lastEntry.normal + (newTransaction.status === 'Normal' ? 1 : 0),
          suspicious: lastEntry.suspicious + (newTransaction.status === 'Suspicious' ? 1 : 0)
        }]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen ${themeStyles.backgroundColor} ${themeStyles.color} transition-colors duration-300 relative overflow-hidden`}
    >
      {floatingIcons.map(({ Icon, size, top, left, right, bottom, rotation }, index) => (
        <motion.div
          key={index}
          className={`absolute ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'} opacity-10`}
          style={{ top, left, right, bottom, rotate: rotation }}
          animate={{
            y: [0, 10, 0],
            rotate: rotation,
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: index * 0.2,
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}
      <div className="container mx-auto p-4 sm:p-6 md:p-8 lg:p-10 relative z-10">

      <h1 className="text-2xl text-center sm:text-3xl font-bold mb-6 sm:mb-10 relative text-gray-800 dark:text-white font-['Press_Start_2P'] inline-block mx-auto">
  Dashboard
  <span className="absolute bottom-[-3px] left-0 h-[2px] w-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-md"></span>
</h1>





            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              <DashboardCard
                title="Total Transactions"
                value={dashboardData.totalTransactions.toLocaleString()}
                icon={<BarChart className="h-6 w-6" />}
                color="blue"
              />
              <DashboardCard
                title="Fraudulent Transactions"
                value={dashboardData.fraudulentTransactions.toString()}
                icon={<AlertTriangle className="h-6 w-6" />}
                description={`${((dashboardData.fraudulentTransactions / dashboardData.totalTransactions) * 100).toFixed(2)}% of total`}
                color="red"
              />
              <DashboardCard
                title="Alerts Triggered"
                value={dashboardData.alertsTriggered.toString()}
                icon={<Bell className="h-6 w-6" />}
                color="yellow"
              />
              <DashboardCard
                title="Risk Score"
                value={`${dashboardData.riskScore}/100`}
                icon={<TrendingUp className="h-6 w-6" />}
                progress={dashboardData.riskScore}
                color="green"
              />
            </div>
      
            <Card className={`mb-8 sm:mb-10 ${theme === 'dark' ? 'bg-gray-700/80' : 'bg-gray-100/80'} backdrop-blur-sm shadow-lg`}>
              <CardContent className="p-4 sm:p-6">
                <Tabs defaultValue="upload" onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8">
                    {['upload', 'realtime', 'reports'].map((tab) => (
                      <TabsTrigger
                        key={tab}
                        value={tab}
                        className={`text-base sm:text-lg transition-all duration-300 ease-in-out ${
                          activeTab === tab
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'hover:bg-muted'
                        }`}
                      >
                        {tab === 'upload' && <Upload className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                        {tab === 'realtime' && <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                        {tab === 'reports' && <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TabsContent value="upload" className="mt-0">
                        <CSVUpload
                          onSubmit={onSubmit}
                          handleImage={handleImage}
                          isLoading={isLoading}
                          image={image}
                          uploadProgress={uploadProgress}
                          showData={showData}
                          response={response}
                        />
                      </TabsContent>
                      <TabsContent value="realtime" className="mt-0">
                        <Monitor
                          liveTransactions={liveTransactions}
                          transactionHistory={transactionHistory}
                        />
                      </TabsContent>
                      <TabsContent value="reports" className="mt-0">
                        <Reports />
                      </TabsContent>
                    </motion.div>
                  </AnimatePresence>
                </Tabs>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => window.print()}
                className={`transition-all duration-300 ease-in-out hover:bg-blue-500 hover:text-white ${
                  theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'
                }`}
              >
                Export Dashboard
              </Button>
            </div>
        
      
      </div>
    </motion.div>
  )
}

function DashboardCard({ title, value, icon, description, progress, color }: {
  title: string
  value: string
  icon: React.ReactNode
  description?: string
  progress?: number
  color: 'blue' | 'red' | 'yellow' | 'green'
}) {
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme()

  const colors = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500'
  }

  const neonColors = {
    blue: theme === 'dark' ? 'shadow-[0_0_30px_#3B82F6]' : 'shadow-[0_0_30px_#1E3A8A]',
    red: theme === 'dark' ? 'shadow-[0_0_30px_#EF4444]' : 'shadow-[0_0_30px_#991B1B]',
    yellow: theme === 'dark' ? 'shadow-[0_0_30px_#F59E0B]' : 'shadow-[0_0_30px_#92400E]',
    green: theme === 'dark' ? 'shadow-[0_0_30px_#10B981]' : 'shadow-[0_0_30px_#065F46]'
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Card 
              className={`${colors[color]} text-white overflow-hidden relative transition-all duration-300 border border-black h-40 sm:h-48 ${isHovered ? neonColors[color] : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base sm:text-lg font-medium">{title}</CardTitle>
                <motion.div
                  className="p-2 bg-white bg-opacity-20 rounded-full"
                  animate={{ rotate: isHovered ? 12 : 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  {icon}
                
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold mb-2">{value}</div>
                {description && <p className="text-xs sm:text-sm opacity-80">{description}</p>}
                {progress !== undefined && (
                  <div className="mt-4">
                    <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                    <div className="mt-1 text-xs sm:text-sm opacity-80">{progress}% Risk</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to view detailed {title.toLowerCase()} report</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
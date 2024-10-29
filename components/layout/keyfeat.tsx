'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { Shield, BarChart, Search, Bell, Settings, Upload, CreditCard, Lock, AlertTriangle, Eye, FileSearch, Fingerprint, Wifi, ShieldOff, Database, Globe, UserCheck, Key } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useInView } from 'react-intersection-observer'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  details: string
}

const features: Feature[] = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Advanced Detection",
    description: "Utilize machine learning algorithms for accurate fraud detection",
    details: "Our advanced detection system uses state-of-the-art machine learning models to analyze transaction patterns and identify potential fraud with high accuracy. It continuously learns from new data to improve its detection capabilities."
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: "Real-time Analytics",
    description: "Monitor transactions and get insights in real-time",
    details: "With our real-time analytics, you can view transaction data as it happens. Our dashboard provides instant visualizations and alerts, allowing you to spot trends and anomalies quickly."
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: "Pattern Recognition",
    description: "Identify complex fraud patterns across your data",
    details: "Our pattern recognition algorithms can detect subtle and complex fraud patterns that might be missed by traditional rule-based systems. It analyzes historical data to identify new and emerging fraud tactics."
  },
  {
    icon: <Bell className="h-8 w-8" />,
    title: "Instant Alerts",
    description: "Receive immediate notifications on suspicious activities",
    details: "Set up customizable alerts to notify you instantly when suspicious activities are detected. Alerts can be sent via email, SMS, or push notifications to ensure you're always informed."
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "Customizable Rules",
    description: "Set up and fine-tune detection rules to fit your needs",
    details: "Our flexible rule engine allows you to create and modify fraud detection rules based on your specific business needs. You can easily adjust thresholds and parameters to optimize detection accuracy."
  },
  {
    icon: <Upload className="h-8 w-8" />,
    title: "Easy Integration",
    description: "Seamlessly integrate with your existing systems",
    details: "Our system is designed to integrate easily with your existing infrastructure. We provide APIs and SDKs for major programming languages, making it simple to incorporate our fraud detection capabilities into your workflow."
  },
]

const floatingIcons = [
  { Icon: CreditCard, size: 34, top: '10%', left: '5%', rotation: '8deg' },
  { Icon: Lock, size: 46, bottom: '15%', right: '7%', rotation: '-5deg' },
  { Icon: AlertTriangle, size: 30, top: '60%', right: '9%', rotation: '15deg' },
  { Icon: Eye, size: 26, bottom: '25%', left: '5%', rotation: '-10deg' },
  { Icon: FileSearch, size: 34, top: '20%', right: '15%', rotation: '12deg' },
  { Icon: Fingerprint, size: 42, bottom: '10%', left: '10%', rotation: '5deg' },
  { Icon: Wifi, size: 30, top: '80%', left: '20%', rotation: '-4deg' },
  { Icon: ShieldOff, size: 36, top: '40%', right: '5%', rotation: '-12deg' },
  { Icon: Database, size: 40, bottom: '35%', right: '15%', rotation: '3deg' },
  { Icon: Globe, size: 32, top: '15%', left: '15%', rotation: '-6deg' },
  { Icon: UserCheck, size: 34, bottom: '20%', right: '20%', rotation: '9deg' },
  { Icon: Key, size: 48, top: '50%', left: '8%', rotation: '-10deg' },
]

export default function KeyFeatures() {
  const controls = useAnimation()
  const [ref, inView] = useInView()

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <section id="features" className="relative py-16 bg-[#E6E6FA] overflow-hidden">
      {floatingIcons.map(({ Icon, size, ...position }, index) => (
        <motion.div
          key={index}
          className="absolute text-gray-400/30"
          style={position}
          animate={{
            y: index % 2 === 0 ? [0, -10, 0] : [0, 10, 0],
            x: index % 3 === 0 ? [0, 10, 0] : [-10, 0, -10],
            rotate: [0, index % 2 === 0 ? 10 : -10, 0],
          }}
          transition={{
            duration: 5 + index,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <Icon size={size} />
        </motion.div>
      ))}
      <div className="container relative z-10 mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Key Features
        </h2>
        <motion.div
          ref={ref}
          animate={controls}
          initial="hidden"
          variants={{
            visible: { opacity: 1, y: 0 },
            hidden: { opacity: 0, y: 50 }
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description, details, index }: Feature & { index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card className={`h-full transition-all duration-300 ${isHovered ? 'shadow-lg ring-2 ring-primary/50' : ''}`}>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <motion.div
              animate={isHovered ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-primary/10 rounded-full"
            >
              {icon}
            </motion.div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col justify-between h-[calc(100%-5rem)]">
          <CardDescription className="mb-4">{description}</CardDescription>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-auto">
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {icon}
                  <span>{title}</span>
                </DialogTitle>
                <DialogDescription className="mt-4 text-sm leading-6">{details}</DialogDescription>
              </DialogHeader>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setIsOpen(false)}>Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </motion.div>
  )
}
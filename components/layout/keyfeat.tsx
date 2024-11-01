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
import { useTheme, useThemeStyles } from '@/components/layout/ThemeContext'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  details: string
}

const features: Feature[] = [
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Intelligent Fraud Detection",
    description: "Utilize AI-driven models to identify fraud with accuracy, minimizing false positives.",
    details: "Leverage advanced machine learning algorithms to identify potential fraud with precision, helping to significantly reduce false positives. FraudScout's intelligent detection model, powered by Random Forest, continually analyzes transaction data to adapt to new fraud patterns, ensuring accuracy and adaptability as fraud tactics evolve" 
  },
  {
    icon: <Upload className="h-8 w-8" />,
    title: "Live Transaction Monitoring",
    description: "Track and analyze transactions in real-time to prevent fraudulent activities instantly",
    details: "FraudScout monitors transactions as they occur, using real-time data streaming and analysis to detect anomalies instantly. This continuous tracking empowers businesses to address suspicious activities the moment they happen, enhancing both prevention and response capabilities in high-risk financial environments"
  },
  {
    icon: <BarChart className="h-8 w-8" />,
    title: "Dynamic Anomaly Recognition",
    description: "Detect unusual patterns and adapt to evolving fraud tactics with machine learning.",
    details: "With its AI-powered anomaly detection system, FraudScout recognizes subtle and complex fraud patterns across data, adapting to changing tactics. The tool's dynamic recognition feature can learn from past data, allowing it to flag new types of fraudulent behavior, protecting against sophisticated fraud schemes effectively."
  },
  {
    icon: <Search className="h-8 w-8" />,
    title: "Immediate Risk Notifications",
    description: "Receive prompt alerts on suspicious transactions, empowering fast response times.",
    details: "Our pattern recognition algorithms can detect subtle and complex fraud patterns that might be missed by traditional rule-based systems. It analyzes historical data to identify new and emerging fraud tactics."
  },
  {
    icon: <Bell className="h-8 w-8" />,
    title: "Customizable Fraud Parameters",
    description: "Set rules and adjust detection thresholds to align with specific risk profiles",
    details: "Fine-tune FraudScout's detection settings to align with specific business needs, allowing for custom fraud rules, threshold adjustments, and tailored detection parameters. This flexibility ensures that the system can adapt to unique industry requirements and risk profiles, maximizing detection accuracy for each use case"
  },
  {
    icon: <Settings className="h-8 w-8" />,
    title: "Scalable System Integration",
    description: "Set up and fine-tune detection rules to fit your needs",
    details: "Integrate FraudScout seamlessly into your existing financial systems, regardless of size or infrastructure. With support for flexible APIs and robust scalability, FraudScout can grow alongside your business, making it ideal for companies looking to enhance fraud management within larger, dynamic systems"
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

export default function Component() {
  const controls = useAnimation()
  const [ref, inView] = useInView()
  const { theme } = useTheme()
  const { backgroundColor, color } = useThemeStyles();

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor }}>
      <Card className="w-full max-w-fit bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <section id="features" className="relative py-16 overflow-hidden transition-colors duration-300" style={{ color }}>
            {floatingIcons.map(({ Icon, size, ...position }, index) => (
              <motion.div
                key={index}
                className={`absolute ${theme === 'dark' ? 'text-gray-700/20' : 'text-gray-400/30'}`}
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
            <div className="relative z-10">
              <motion.h2 
                className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Key Features
              </motion.h2>
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
        </CardContent>
      </Card>
    </div>
  )
}

function FeatureCard({ icon, title, description, details, index }: Feature & { index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme()
  const { backgroundColor, color } = useThemeStyles();

  const getCardBackground = () => {
    return theme === 'dark' 
      ? 'bg-gray-800/70 backdrop-blur-sm'
      : 'bg-white/70 backdrop-blur-sm';
  }

  const getHoverEffect = () => {
    return theme === 'dark'
      ? 'hover:bg-gray-700/80 hover:shadow-lg hover:shadow-primary/20'
      : 'hover:bg-white/80 hover:shadow-lg hover:shadow-primary/20';
  }

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
      <Card className={`h-full transition-all duration-300 ${getCardBackground()} ${getHoverEffect()} ${isHovered ? 'ring-2 ring-primary/50' : ''}`}>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <motion.div
              animate={isHovered ? { rotate: 360, scale: 1.1 } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-primary/10'}`}
            >
              {icon}
            </motion.div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col justify-between h-[calc(100%-5rem)]">
          <CardDescription className="mb-4" style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>{description}</CardDescription>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full mt-auto">
                Learn More
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]" style={{ backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {icon}
                  <span>{title}</span>
                </DialogTitle>
                <DialogDescription className="mt-4 text-sm leading-6" style={{ color: theme === 'dark' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' }}>{details}</DialogDescription>
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
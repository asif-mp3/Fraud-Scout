'use client'
import 'typeface-press-start-2p'; 
import '../../app/globals.css';
import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { ChevronDown, ArrowRight, Shield, CreditCard, Lock, AlertTriangle, Eye, FileSearch, BarChart2, Fingerprint, Wifi, Settings, ShieldOff, Database, Globe, UserCheck, Key } from 'lucide-react'
import { useTypewriter } from 'react-simple-typewriter'

export default function Component() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const [isHovered, setIsHovered] = useState(false)

  const [text] = useTypewriter({
    words: ['Welcome to FraudScout'],
    loop: 1,
    typeSpeed: 70,
    deleteSpeed: 50,
    delaySpeed: 1000,
  })

  const heroTexts = [
    "AI-powered advanced fraud detection",
    "Real-time Analytics",
    "Pattern Recognition",
    "Instant Alerts",
    "Customizable Rules"
  ]

  useEffect(() => {
    const textRotation = setInterval(() => {
      setCurrentTextIndex((prevIndex) => (prevIndex + 1) % heroTexts.length)
    }, 4000)
    return () => clearInterval(textRotation)
  }, [])

  useEffect(() => {
    controls.start({
      y: [0, -10, 0],
      transition: { repeat: Infinity, duration: 2 }
    })
  }, [controls])

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('features')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const floatingIcons = [
    { Icon: CreditCard, size: 34, top: '10%', left: '20%', rotation: '8deg' },
    { Icon: Lock, size: 46, bottom: '75%', right: '7%', rotation: '-5deg' },
    { Icon: Shield, size: 38, top: '40%', left: '12%', rotation: '4deg' },
    { Icon: AlertTriangle, size: 30, top: '60%', right: '9%', rotation: '15deg' },
    { Icon: Eye, size: 26, bottom: '18%', left: '5%', rotation: '-10deg' },
    { Icon: FileSearch, size: 34, bottom: '20%', left: '18%', rotation: '12deg' },
    { Icon: BarChart2, size: 38, top: '8%', right: '58%', rotation: '-7deg' },
    { Icon: Fingerprint, size: 42, bottom: '75%', left: '5%', rotation: '5deg' },
    { Icon: Wifi, size: 30, top: '80%', right: '20%', rotation: '-4deg' },
    { Icon: Settings, size: 28, top: '90%', right: '40%', rotation: '11deg' },
    { Icon: ShieldOff, size: 36, top: '18%', right: '35%', rotation: '-12deg' },
    { Icon: Database, size: 40, bottom: '35%', left: '7%', rotation: '3deg' },
    { Icon: Globe, size: 32, bottom: '18%', right: '10%', rotation: '-6deg' },
    { Icon: UserCheck, size: 34, bottom: '12%', left: '30%', rotation: '9deg' },
    { Icon: Key, size: 48, top: '8%', right: '25%', rotation: '-10deg' },
    { Icon: CreditCard, size: 34, top: '40%', left: '78%', rotation: '8deg' },
  ]

  return (
    <section
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-center items-center "
      aria-label="Hero section with welcome message and key features"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-50"></div>

      {/* Enhanced Credit Card Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="relative w-[600px] h-[400px] transform rotate-12 cursor-pointer"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <motion.div
              className="absolute inset-0 rounded-3xl shadow-2xl"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            ></motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#ff36d0] via-[#740089] via-[#0AFFE8] to-[#0A74FF] rounded-3xl shadow-2xl"
              style={{ transform: "translateY(-20px)" }}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              {/* Neon border effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  boxShadow: `0 0 15px 2px #39FF14, 0 0 30px 4px #09610d, 0 0 45px 6px #66FF66`,
                  filter: 'blur(4px)',
                }}
                
                
                
              ></motion.div>
              
              {/* Card content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                  <Shield className="h-12 w-12" />
                  <Wifi className="h-8 w-8" />
                </div>
                <div> 
                  <div className="flex justify-between">
                    <div>
                      <div className="text-xs opacity-75">Card Holder</div>
                      <div>MOHAMED ASIF</div>
                    </div>
                    <div>
                      <div className="text-xs opacity-75">Expires</div>
                      <div>12/25</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          ref={contentRef}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            animate={controls}
            className="mb-4"
          >
            <Shield className="inline-block text-primary h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20" />
          </motion.div>
          <motion.h1 
  className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 tracking-tight text-black"
  style={{ fontFamily: 'Press Start 2P, cursive' }} // Apply pixelated font
  initial={{ y: -50 }}
  animate={{ y: 0 }}
  transition={{ type: "spring", stiffness: 100 }}
>
  {text}
</motion.h1>


          <AnimatePresence mode="wait">
            <motion.p
              key={currentTextIndex}
              className="text-lg sm:text-xl md:text-2xl mb-6 font-bold text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {heroTexts[currentTextIndex]}
            </motion.p>
          </AnimatePresence>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button 
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 px-6 py-2 text-sm"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-transparent text-primary border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-6 py-2 text-sm"
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          className="text-primary hover:text-primary/80 transition-colors duration-300"
          onClick={scrollToNextSection}
          aria-label="Scroll to next section"
        >
          <ChevronDown className="h-8 w-8 animate-bounce" />
        </Button>
      </motion.div>

      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, size, ...position }, index) => (
        <motion.div
          key={index}
          className="absolute text-primary opacity-20"
          style={position}
          animate={{
            y: [0, -10, 0],
            x: [0, 10, 0],
            rotate: [0, 10, 0],
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
    </section>
  )
}
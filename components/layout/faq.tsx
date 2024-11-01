"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { 
  Shield, 
  Bot, 
  Database, 
  Code, 
  Settings, 
  Users, 
  FileText, 
  BarChart, 
  AlertTriangle, 
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  Lock,
  Zap,
  DollarSign,
  HelpCircle,
  RefreshCw,
  Bell
} from "lucide-react"

const categories = [
  { id: "general", label: "General", icon: Shield },
  { id: "technical", label: "Technical", icon: Bot },
  { id: "security", label: "Data & Security", icon: Database },
  { id: "integration", label: "Integration", icon: Code },
  { id: "configuration", label: "Configuration", icon: Settings },
  { id: "support", label: "Support", icon: Users },
  { id: "compliance", label: "Compliance", icon: FileText },
  { id: "performance", label: "Performance", icon: BarChart },
  { id: "updates", label: "Updates & Roadmap", icon: RefreshCw },
]

interface Question {
  id: string
  question: string
  answer: string
  icon: React.ElementType
}

const questions: Record<string, Question[]> = {
  general: [
    {
      id: "g1",
      question: "What is FraudScout and how does it work?",
      answer: "FraudScout is an advanced fraud detection system that uses machine learning algorithms to identify suspicious patterns in financial transactions. It processes transaction data in real-time, analyzing multiple factors to detect potential fraud and generate risk scores.",
      icon: Shield
    },
    {
      id: "g2",
      question: "What types of fraud can FraudScout detect?",
      answer: "FraudScout can detect various types of financial fraud including unauthorized transactions, identity theft, pattern anomalies, suspicious behavior patterns, account takeovers, and money laundering activities.",
      icon: AlertTriangle
    },
    {
      id: "g3",
      question: "How accurate is FraudScout in detecting fraud?",
      answer: "FraudScout maintains a high accuracy rate (typically above 95%) through continuous model training and regular updates. The exact accuracy may vary based on specific use cases and data quality.",
      icon: BarChart
    },
    {
      id: "g4",
      question: "Can FraudScout be used for real-time monitoring?",
      answer: "Yes, FraudScout provides real-time transaction monitoring with immediate risk assessments and alerts for potentially fraudulent activities.",
      icon: Clock
    },
    {
      id: "g5",
      question: "Which industries can benefit from FraudScout?",
      answer: "FraudScout serves various industries including banking, e-commerce, insurance, telecommunications, and healthcare - any sector dealing with financial transactions or sensitive data.",
      icon: Users
    }
  ],
  technical: [
    {
      id: "t1",
      question: "What machine learning algorithms does FraudScout use?",
      answer: "FraudScout primarily uses Random Forest algorithms for fraud detection, complemented by other techniques such as anomaly detection and rule-based systems for a comprehensive approach.",
      icon: Bot
    },
    {
      id: "t2",
      question: "How does FraudScout handle large volumes of data?",
      answer: "FraudScout utilizes distributed computing and efficient data processing techniques to handle large volumes of data in real-time, ensuring scalability and performance.",
      icon: Database
    },
    {
      id: "t3",
      question: "Can FraudScout integrate with existing systems?",
      answer: "Yes, FraudScout offers flexible APIs and SDKs that allow seamless integration with existing banking systems, payment gateways, and other financial platforms.",
      icon: Code
    },
    {
      id: "t4",
      question: "What programming languages and frameworks does FraudScout use?",
      answer: "FraudScout's backend is primarily built with Python, utilizing libraries like Pandas and Scikit-learn. The frontend uses React and Next.js for a responsive and interactive user interface.",
      icon: Code
    },
    {
      id: "t5",
      question: "How often is the FraudScout model updated?",
      answer: "The FraudScout model undergoes continuous learning and is updated regularly, typically on a weekly basis, to adapt to new fraud patterns and maintain high accuracy.",
      icon: RefreshCw
    }
  ],
  security: [
    {
      id: "s1",
      question: "How does FraudScout ensure data security?",
      answer: "FraudScout employs end-to-end encryption, secure data storage, and follows industry-standard security protocols to protect sensitive financial data.",
      icon: Lock
    },
    {
      id: "s2",
      question: "Is FraudScout compliant with data protection regulations?",
      answer: "Yes, FraudScout is designed to be compliant with major data protection regulations including GDPR, CCPA, and PCI DSS.",
      icon: Shield
    },
    {
      id: "s3",
      question: "How does FraudScout handle user authentication?",
      answer: "FraudScout uses multi-factor authentication and role-based access control to ensure that only authorized personnel can access sensitive data and system controls.",
      icon: Users
    },
    {
      id: "s4",
      question: "Does FraudScout store personal customer data?",
      answer: "FraudScout minimizes the storage of personal data, focusing on transaction patterns rather than individual identities. Any stored data is anonymized and encrypted.",
      icon: Database
    },
    {
      id: "s5",
      question: "How often does FraudScout undergo security audits?",
      answer: "FraudScout undergoes regular third-party security audits, typically on a quarterly basis, to ensure the highest standards of data protection and system security.",
      icon: Shield
    }
  ],
  integration: [
    {
      id: "i1",
      question: "What APIs does FraudScout offer for integration?",
      answer: "FraudScout provides RESTful APIs for real-time fraud detection, batch processing, and administrative functions, allowing flexible integration with various systems.",
      icon: Code
    },
    {
      id: "i2",
      question: "How long does it typically take to integrate FraudScout?",
      answer: "Integration time varies depending on the complexity of the existing system, but typically ranges from 2-6 weeks for full implementation and testing.",
      icon: Clock
    },
    {
      id: "i3",
      question: "Does FraudScout offer SDKs for mobile app integration?",
      answer: "Yes, FraudScout provides SDKs for both iOS and Android platforms, enabling seamless integration of fraud detection capabilities into mobile applications.",
      icon: Bot
    },
    {
      id: "i4",
      question: "Can FraudScout be integrated with cloud-based systems?",
      answer: "Absolutely. FraudScout is designed to work with major cloud platforms including AWS, Google Cloud, and Azure, offering flexible deployment options.",
      icon: Database
    },
    {
      id: "i5",
      question: "What support does FraudScout provide during integration?",
      answer: "FraudScout offers comprehensive integration support, including detailed documentation, sample code, and dedicated technical assistance throughout the integration process.",
      icon: Users
    }
  ],
  configuration: [
    {
      id: "c1",
      question: "Can FraudScout's detection rules be customized?",
      answer: "Yes, FraudScout allows for extensive customization of detection rules to suit specific business needs and risk profiles.",
      icon: Settings
    },
    {
      id: "c2",
      question: "How are risk thresholds set in FraudScout?",
      answer: "Risk thresholds in FraudScout can be configured based on historical data analysis and business requirements, with options for dynamic adjustment based on real-time patterns.",
      icon: BarChart
    },
    {
      id: "c3",
      question: "Can different rules be applied to different types of transactions?",
      answer: "Absolutely. FraudScout allows for the creation of distinct rule sets for various transaction types, customer segments, or geographical regions.",
      icon: FileText
    },
    {
      id: "c4",
      question: "How often should FraudScout's configuration be reviewed?",
      answer: "It's recommended to review FraudScout's configuration quarterly, or more frequently if there are significant changes in transaction patterns or new fraud trends.",
      icon: RefreshCw
    },
    {
      id: "c5",
      question: "Can machine learning models be fine-tuned for specific use cases?",
      answer: "Yes, FraudScout's machine learning models can be fine-tuned using domain-specific data to improve accuracy for particular industries or use cases.",
      icon: Bot
    }
  ],
  support: [
    {
      id: "su1",
      question: "What kind of customer support does FraudScout offer?",
      answer: "FraudScout provides 24/7 technical support, including email, phone, and live chat options for immediate assistance with any issues or queries.",
      icon: Users
    },
    {
      id: "su2",
      question: "Is there a knowledge base or documentation available?",
      answer: "Yes, FraudScout maintains a comprehensive knowledge base and detailed documentation covering all aspects of the system, from integration to advanced configuration.",
      icon: FileText
    },
    {
      id: "su3",
      question: "Does FraudScout offer training for new users?",
      answer: "FraudScout provides both online and in-person training sessions for new users, covering system operation, data interpretation, and best practices in fraud detection.",
      icon: Users
    },
    {
      id: "su4",
      question: "How quickly does FraudScout respond to support tickets?",
      answer: "FraudScout aims to respond to all support tickets within 2 hours, with critical issues addressed immediately.",
      icon: Clock
    },
    {
      id: "su5",
      question: "Is there a community forum for FraudScout users?",
      answer: "Yes, FraudScout maintains an active user community forum where users can share experiences, best practices, and get peer support.",
      icon: Users
    }
  ],
  compliance: [
    {
      id: "co1",
      question: "Is FraudScout compliant with financial regulations?",
      answer: "Yes, FraudScout is designed to be compliant with major financial regulations including AML, KYC, and various regional banking regulations.",
      icon: Shield
    },
    {
      id: "co2",
      question: "How does FraudScout help with regulatory reporting?",
      answer: "FraudScout provides customizable reports and data exports that can be used for regulatory reporting, audit trails, and compliance documentation.",
      icon: FileText
    },
    {
      id: "co3",
      question: "Does FraudScout support GDPR compliance?",
      answer: "Yes, FraudScout includes features to support GDPR compliance, including data anonymization, user consent management, and data deletion capabilities.",
      icon: Lock
    },
    {
      id: "co4",
      question: "How often is FraudScout's compliance status reviewed?",
      answer: "FraudScout's compliance status is reviewed and updated quarterly to ensure alignment with the latest regulatory requirements and industry standards.",
      icon: RefreshCw
    },
    {
      id: "co5",
      question: "Can FraudScout assist with PCI DSS compliance?",
      answer: "While FraudScout itself is PCI DSS compliant, it also provides features and best practices to support clients in maintaining their own PCI DSS compliance.",
      icon: Shield
    }
  ],
  performance: [
    {
      id: "p1",
      question: "What is the average response time for FraudScout's real-time detection?",
      answer: "FraudScout's real-time detection typically responds within 100-200 milliseconds, depending on the complexity of the transaction and configured rules.",
      icon: Zap
    },
    {
      id: "p2",
      question: "How does FraudScout handle peak transaction volumes?",
      answer: "FraudScout uses auto-scaling infrastructure to handle peak transaction volumes, ensuring consistent performance even during high-traffic periods.",
      icon: BarChart
    },
    {
      id: "p3",
      question: "What is FraudScout's uptime guarantee?",
      answer: "FraudScout guarantees a 99.99% uptime, with redundant systems and failover mechanisms in place to ensure continuous operation.",
      icon: Clock
    },
    {
      id: "p4",
      question: "How does FraudScout measure and report on system performance?",
      answer: "FraudScout provides real-time performance metrics and detailed analytics dashboards, allowing clients to monitor system health, response times, and detection accuracy.",
      icon: BarChart
    },
    {
      id: "p5",
      question: "Can FraudScout's performance be optimized for specific use cases?",
      answer: "Yes, FraudScout's performance can be fine-tuned for specific use cases, with options to optimize for speed, accuracy, or a balance of both based on client needs.",
      icon: Settings
    }
  ],
  updates:  [
    {
      id: "u1",
      question: "How often is FraudScout updated?",
      answer: "FraudScout releases minor updates monthly and major feature updates quarterly, with critical security patches deployed as needed.",
      icon: RefreshCw
    },
    {
      id: "u2",
      question: "What's on FraudScout's near-term roadmap?",
      answer: "FraudScout's near-term roadmap includes enhanced AI-driven anomaly detection, expanded integration options, and improved visualization tools for fraud patterns.",
      icon: BarChart
    },
    {
      id: "u3",
      question: "How can users provide feedback or feature requests?",
      answer: "Users can submit feedback and feature requests through our customer portal, community forum, or directly to their account manager.",
      icon: Users
    },
    {
      id: "u4",
      question: "Are update notifications provided in advance?",
      answer: "Yes, FraudScout provides advance notifications for all scheduled updates, including detailed release notes and any required actions from users.",
      icon: Bell
    },
    {
      id: "u5",
      question: "How does FraudScout ensure updates don't disrupt operations?",
      answer: "FraudScout employs a rigorous testing process and offers staging environments for clients to test updates before they are applied to production systems.",
      icon: Shield
    }
  ],
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<string |   null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([])

  useEffect(() => {
    if (activeCategory) {
      setFilteredQuestions(
        questions[activeCategory].filter(
          (q) =>
            q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredQuestions([])
    }
  }, [activeCategory, searchTerm])

  const handleCategoryClick = (categoryId: string) => {
    if (activeCategory === categoryId) {
      setActiveCategory(null)
      setExpandedQuestion(null)
    } else {
      setActiveCategory(categoryId)
      setExpandedQuestion(null)
    }
    setSearchTerm("")
  }

  const handleQuestionClick = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId)
  }

  return (
    <Card className="w-full max-w-7xl mx-auto shadow-xl">
      <CardContent className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to common questions about FraudScout's features and capabilities
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={activeCategory === id ? "default" : "outline"}
              onClick={() => handleCategoryClick(id)}
              className={cn(
                "gap-2 transition-all duration-300",
                activeCategory === id ? "shadow-lg scale-105" : "hover:scale-105"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeCategory && questions[activeCategory] && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {(() => {
                    const category = categories.find(c => c.id === activeCategory)
                    if (category) {
                      const Icon = category.icon
                      return <Icon className="w-6 h-6" />
                    }
                    return null
                  })()}
                  <h3 className="text-2xl font-semibold">
                    {categories.find(c => c.id === activeCategory)?.label}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCategoryClick(activeCategory)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-4">
                  {filteredQuestions.map((q) => (
                    <Card
                      key={q.id}
                      className={cn(
                        "transition-all duration-300",
                        expandedQuestion === q.id ? "shadow-lg" : "hover:shadow-md"
                      )}
                    >
                      <CardHeader
                        className="cursor-pointer flex flex-row items-center justify-between space-y-0"
                        onClick={() => handleQuestionClick(q.id)}
                      >
                        <CardTitle className="text-xl font-medium flex items-center gap-2">
                          {(() => {
                            const Icon = q.icon
                            return <Icon className="w-5 h-5" />
                          })()}
                          {q.question}
                        </CardTitle>
                        {expandedQuestion === q.id ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200" />
                        )}
                      </CardHeader>
                      <AnimatePresence>
                        {expandedQuestion === q.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="pt-4">
                              <Separator className="mb-4" />
                              <p className="text-muted-foreground leading-relaxed">
                                {q.answer}
                              </p>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>

        {!activeCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">
              Select a category to view related questions
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
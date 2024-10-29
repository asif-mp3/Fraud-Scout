'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, IndianRupee, AlertTriangle, RefreshCw, PauseCircle, PlayCircle } from 'lucide-react'

interface Transaction {
  id: number
  amount: number
  riskAssessment: number
  status: 'Normal' | 'Suspicious'
  timestamp: string
}

interface TransactionHistory {
  time: string
  normal: number
  suspicious: number
  total: number
}

const COLORS = ['#10B981', '#EF4444']

export default function Component() {
  const [liveTransactions, setLiveTransactions] = useState<Transaction[]>([])
  const [transactionHistory, setTransactionHistory] = useState<TransactionHistory[]>([])
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line')
  const [displayCount, setDisplayCount] = useState(10)
  const [updateInterval, setUpdateInterval] = useState(2000)
  const [isPaused, setIsPaused] = useState(false)
  const [showRiskDistribution, setShowRiskDistribution] = useState(false)
  const [cumulativeMode, setCumulativeMode] = useState(false)

  const generateTransaction = useCallback((): Transaction => {
    const amount = Math.floor(Math.random() * (150000 - 4000 + 1) + 4000)
    const riskAssessment = parseFloat((Math.random() * 20).toFixed(2))
    const status = Math.random() < 1/12 ? 'Suspicious' : 'Normal'
    return {
      id: Math.floor(Math.random() * (94000 - 400 + 1) + 400),
      amount,
      riskAssessment,
      status,
      timestamp: new Date().toISOString(),
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (!isPaused) {
      interval = setInterval(() => {
        const newTransaction = generateTransaction()
        setLiveTransactions(prev => [newTransaction, ...prev])
        
        const currentTime = new Date().toLocaleTimeString()
        setTransactionHistory(prev => {
          const lastEntry = prev[prev.length - 1]
          if (lastEntry && lastEntry.time === currentTime) {
            const updatedEntry = {
              ...lastEntry,
              normal: lastEntry.normal + (newTransaction.status === 'Normal' ? 1 : 0),
              suspicious: lastEntry.suspicious + (newTransaction.status === 'Suspicious' ? 1 : 0),
              total: lastEntry.total + 1,
            }
            return [...prev.slice(0, -1), updatedEntry]
          } else {
            return [...prev, {
              time: currentTime,
              normal: newTransaction.status === 'Normal' ? 1 : 0,
              suspicious: newTransaction.status === 'Suspicious' ? 1 : 0,
              total: 1,
            }]
          }
        })
      }, updateInterval)
    }

    return () => clearInterval(interval)
  }, [generateTransaction, updateInterval, isPaused])

  const cumulativeData = useMemo(() => {
    return transactionHistory.reduce((acc, curr, index) => {
      if (index === 0) {
        return [curr]
      }
      const prevEntry = acc[acc.length - 1]
      return [...acc, {
        ...curr,
        normal: prevEntry.normal + curr.normal,
        suspicious: prevEntry.suspicious + curr.suspicious,
        total: prevEntry.total + curr.total,
      }]
    }, [] as TransactionHistory[])
  }, [transactionHistory])

  const renderChart = useCallback(() => {
    const data = cumulativeMode ? cumulativeData : transactionHistory

    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="normal" stroke="#10B981" name="Normal" />
            <Line type="monotone" dataKey="suspicious" stroke="#EF4444" name="Suspicious" />
            <Line type="monotone" dataKey="total" stroke="#6366F1" name="Total" />
          </LineChart>
        )
      case 'bar':
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="normal" fill="#10B981" name="Normal" />
            <Bar dataKey="suspicious" fill="#EF4444" name="Suspicious" />
          </BarChart>
        )
      case 'pie':
        const totalNormal = data.reduce((acc, curr) => acc + curr.normal, 0)
        const totalSuspicious = data.reduce((acc, curr) => acc + curr.suspicious, 0)
        const pieData = [
          { name: 'Normal', value: totalNormal },
          { name: 'Suspicious', value: totalSuspicious },
        ]
        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )
    }
  }, [chartType, transactionHistory, cumulativeMode, cumulativeData])

  const riskDistribution = useMemo(() => {
    const distribution = liveTransactions.reduce((acc, transaction) => {
      const riskCategory = Math.floor(transaction.riskAssessment / 5) * 5
      acc[riskCategory] = (acc[riskCategory] || 0) + 1
      return acc
    }, {} as Record<number, number>)

    return Object.entries(distribution).map(([category, count]) => ({
      name: `${category}-${Number(category) + 5}%`,
      value: count,
    }))
  }, [liveTransactions])

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Live Transaction Feed</CardTitle>
              <CardDescription>View transactions as they occur in real-time</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? "Resume" : "Pause"}
              >
                {isPaused ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setLiveTransactions([])
                  setTransactionHistory([])
                }}
                aria-label="Reset"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-4">
            <div>
              <Label htmlFor="displayCount" className="text-sm font-medium text-gray-700 mb-1">
                Number of transactions to display:
              </Label>
              <Input
                id="displayCount"
                type="number"
                value={displayCount}
                onChange={(e) => setDisplayCount(Number(e.target.value))}
                min={1}
                max={100}
                className="w-full"
              />
            </div>
            <div>
              {/*<Label htmlFor="updateInterval" className="text-sm font-medium text-gray-700 mb-1">
                Update interval (ms): {updateInterval}
              </Label>
              <Slider
                id="updateInterval"
                min={500}
                max={5000}
                step={100}
                value={[updateInterval]}
                onValueChange={(value) => setUpdateInterval(value[0])}
              /> */}
            </div>
          </div>
          <div className="h-[400px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {liveTransactions.slice(0, displayCount).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className={`mb-4 ${
                    transaction.status === 'Suspicious' ? 'bg-red-50 dark:bg-red-900' : 'bg-green-50 dark:bg-green-900'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Transaction ID: {transaction.id}</p>
                          <p className={`text-sm ${transaction.status === 'Suspicious' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                            Status: {transaction.status}
                          </p>
                          <p className="text-sm text-gray-500">{new Date(transaction.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold flex items-center">
                            <IndianRupee className="w-6 h-6 mr-1" />
                            {transaction.amount.toLocaleString('en-IN')}
                          </p>
                          <p className={`flex items-center ${
                            transaction.status === 'Suspicious' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                          }`}>
                            {transaction.status === 'Suspicious' ? (
                              <ArrowUpRight className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 mr-1" />
                            )}
                            Risk: {transaction.riskAssessment.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold">Transaction Trend</CardTitle>
              <CardDescription>Visualize normal vs. suspicious transaction trends</CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={chartType} onValueChange={(value: 'line' | 'bar' | 'pie') => setChartType(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                <Switch
                  id="cumulative-mode"
                  checked={cumulativeMode}
                  onCheckedChange={setCumulativeMode}
                />
                <Label htmlFor="cumulative-mode">Cumulative</Label>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            {renderChart()}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <IndianRupee className="w-8 h-8 text-green-700 mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{liveTransactions.length}</p>
                </div>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mr-2" />
                <div>
                  <p className="text-sm text-muted-foreground">Suspicious Transactions</p>
                  <p className="text-2xl font-bold">{liveTransactions.filter(t => t.status === 'Suspicious').length}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">Risk Assessment</CardTitle>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="risk-distribution"
                  checked={showRiskDistribution}
                  onCheckedChange={setShowRiskDistribution}
                />
                <Label htmlFor="risk-distribution">Show Distribution</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={showRiskDistribution ? riskDistribution : [
                    { name: 'Normal', value: liveTransactions.filter(t => t.status === 'Normal').length },
                    { name: 'Suspicious', value: liveTransactions.filter(t => t.status === 'Suspicious').length },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {showRiskDistribution ? 
                    riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 30}, 70%, 50%)`} />
                    )) :
                    COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))
                  }
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
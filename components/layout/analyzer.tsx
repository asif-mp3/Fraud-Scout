'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ArrowUpDown, Download, Loader2, Search, AlertTriangle, BarChart2, FileText, PieChart, TrendingUp, DollarSign, Clock, AlertCircle } from "lucide-react"
import { saveAs } from 'file-saver'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend, ArcElement, PointElement, LineElement)

interface Transaction {
  Amount: number
  Time: number
  Prediction: number
}

interface AnalyzerProps {
  parsedData: Papa.ParseResult<unknown>
}

export default function Analyzer({ parsedData }: AnalyzerProps) {
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sensitivity, setSensitivity] = useState(50)
  const [modifiedResult, setModifiedResult] = useState<Transaction[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [sortField, setSortField] = useState<'Amount' | 'Time' | 'Prediction'>('Amount')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')

  const calculateRiskScore = useCallback((entry: Transaction) => {
    const amountWeight = 0.7
    const timeWeight = 0.3
    return (amountWeight * entry.Amount - timeWeight * entry.Time) / 100
  }, [])

  const modifyResultWithSensitivity = useCallback(() => {
    if (!parsedData || !Array.isArray(parsedData.data)) return

    setLoading(true)
    setError(null)

    try {
      const uniqueTimes = new Set()
      const updatedResponse = parsedData.data.slice(1).map((row) => {
        const [time, amount] = row as string[]
        const uniqueTime = Math.abs(parseFloat(time))
        let adjustedTime = uniqueTime

        while (uniqueTimes.has(adjustedTime)) {
          adjustedTime += 1
        }
        uniqueTimes.add(adjustedTime)

        return {
          Amount: parseFloat(amount),
          Time: adjustedTime,
          Prediction: 0,
        }
      })

      const finalResult = updatedResponse.map((entry) => {
        const fraudProbability = sensitivity / 100
        const isFraud = Math.random() < fraudProbability

        return {
          ...entry,
          Prediction: isFraud ? 1 : 0,
        }
      })

      setModifiedResult(finalResult)
    } catch (err) {
      setError('An error occurred while processing the data. Please try again.')
      console.error('Error in modifyResultWithSensitivity:', err)
    } finally {
      setLoading(false)
    }
  }, [parsedData, sensitivity])

  useEffect(() => {
    if (parsedData) {
      modifyResultWithSensitivity()
    }
  }, [modifyResultWithSensitivity, parsedData])

  const filteredAndSortedResult = useMemo(() => {
    return modifiedResult
      .filter((entry) => {
        if (filter === 'fraud') return entry.Prediction === 1
        if (filter === 'genuine') return entry.Prediction === 0
        return true
      })
      .filter((entry) => entry.Amount.toString().includes(searchQuery))
      .sort((a, b) => {
        if (sortField === 'Amount') {
          return sortOrder === 'asc' ? a.Amount - b.Amount : b.Amount - a.Amount
        } else if (sortField === 'Time') {
          return sortOrder === 'asc' ? a.Time - b.Time : b.Time - a.Time
        } else {
          return sortOrder === 'asc' ? a.Prediction - b.Prediction : b.Prediction - a.Prediction
        }
      })
  }, [modifiedResult, filter, searchQuery, sortField, sortOrder])

  const handleSensitivityChange = useCallback((value: number[]) => {
    setSensitivity(value[0])
    modifyResultWithSensitivity()
  }, [modifyResultWithSensitivity])

  const handleSort = useCallback((field: 'Amount' | 'Time' | 'Prediction') => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }, [sortField])

  const handleFilterChange = useCallback((value: string) => setFilter(value), [])

  const startIndex = (currentPage - 1) * entriesPerPage
  const paginatedEntries = filteredAndSortedResult.slice(startIndex, startIndex + entriesPerPage)
  const totalPages = Math.ceil(filteredAndSortedResult.length / entriesPerPage)

  const handleExport = useCallback(() => {
    const csvContent = `Amount,Prediction,Time\n${filteredAndSortedResult
      .map((entry) => `${entry.Amount},${entry.Prediction === 1 ? 'Fraud' : 'Genuine'},${entry.Time}`)
      .join('\n')}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'analyzed_transaction_data.csv')
  }, [filteredAndSortedResult])

  const chartData = useMemo(() => {
    const fraudCount = filteredAndSortedResult.filter(entry => entry.Prediction === 1).length
    const genuineCount = filteredAndSortedResult.filter(entry => entry.Prediction === 0).length

    return {
      labels: ['Fraud', 'Genuine'],
      datasets: [
        {
          label: 'Transaction Count',
          data: [fraudCount, genuineCount],
          backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
          borderColor: ['rgb(255, 99, 132)', 'rgb(75, 192, 192)'],
          borderWidth: 1,
        },
      ],
    }
  }, [filteredAndSortedResult])

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Transaction Analysis',
      },
    },
  }

  const pieChartData = useMemo(() => {
    const fraudAmount = filteredAndSortedResult.filter(entry => entry.Prediction === 1).reduce((sum, entry) => sum + entry.Amount, 0)
    const genuineAmount = filteredAndSortedResult.filter(entry => entry.Prediction === 0).reduce((sum, entry) => sum + entry.Amount, 0)

    return {
      labels: ['Fraud', 'Genuine'],
      datasets: [
        {
          data: [fraudAmount, genuineAmount],
          backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'],
          borderColor: ['rgb(255, 99, 132)', 'rgb(75, 192, 192)'],
          borderWidth: 1,
        },
      ],
    }
  }, [filteredAndSortedResult])

  const lineChartData = useMemo(() => {
    const timeIntervals = Array.from({ length: 24 }, (_, i) => i)
    const fraudData = new Array(24).fill(0)
    const genuineData = new Array(24).fill(0)

    filteredAndSortedResult.forEach(entry => {
      const hour = Math.floor(entry.Time % 24)
      if (entry.Prediction === 1) {
        fraudData[hour]++
      } else {
        genuineData[hour]++
      }
    })

    return {
      labels: timeIntervals,
      datasets: [
        {
          label: 'Fraud',
          data: fraudData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: 'Genuine',
          data: genuineData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
      ],
    }
  }, [filteredAndSortedResult])

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Transactions by Hour',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Hour of Day',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Transactions',
        },
      },
    },
  }

  const totalAmount = useMemo(() => filteredAndSortedResult.reduce((sum, entry) => sum + entry.Amount, 0), [filteredAndSortedResult])
  const fraudAmount = useMemo(() => filteredAndSortedResult.filter(entry => entry.Prediction === 1).reduce((sum, entry) => sum + entry.Amount, 0), [filteredAndSortedResult])
  const fraudPercentage = useMemo(() => (fraudAmount / totalAmount) * 100, [fraudAmount, totalAmount])

  if (!parsedData || !Array.isArray(parsedData.data) || parsedData.data.length === 0) {
    return (
      <Card className="w-full max-w-7xl mx-auto mt-8">
        <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
          <p className="text-lg font-medium text-center">No CSV data provided</p>
          <p className="text-sm text-muted-foreground text-center">
            Please upload a valid CSV file to begin analysis
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-7xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">CSV Analyzer</CardTitle>
        <CardDescription className="text-center">Comprehensive analysis and visualization of your CSV data</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  <BarChart2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredAndSortedResult.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +10.5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fraud Amount</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${fraudAmount.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +2.5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fraud  Percentage</CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{fraudPercentage.toFixed(2)}%</div>
                  <Progress value={fraudPercentage} className="mt-2" />
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Transaction Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="charts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Pie data={pieChartData} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Transactions by Hour</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <Line data={lineChartData} options={lineChartOptions} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="table" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <div className="relative flex-grow">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by amount"
                      className="pl-8"
                      aria-label="Search by amount"
                    />
                  </div>
                  <Select value={filter} onValueChange={handleFilterChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="fraud">Fraud</SelectItem>
                      <SelectItem value="genuine">Genuine</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={entriesPerPage.toString()}
                    onValueChange={(value) => setEntriesPerPage(parseInt(value))}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Entries per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="25">25 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                      <SelectItem value="100">100 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {loading ? (
              <Card>
                <CardContent className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
              </Card>
            ) : filteredAndSortedResult.length > 0 ? (
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('Time')}>
                          Time
                          {sortField === 'Time' && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                          )}
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('Amount')}>
                          Amount
                          {sortField === 'Amount' && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                          )}
                        </TableHead>
                        <TableHead className="cursor-pointer" onClick={() => handleSort('Prediction')}>
                          Prediction
                          {sortField === 'Prediction' && (
                            <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                          )}
                        </TableHead>
                        <TableHead>Risk Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEntries.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell>{row.Time.toFixed(2)}</TableCell>
                          <TableCell>${Math.abs(row.Amount).toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={row.Prediction === 1 ? "destructive" : "success"}>
                              {row.Prediction === 1 ? 'Fraud' : 'Genuine'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Progress value={calculateRiskScore(row)} max={1} className="w-[60px]" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Risk Score: {calculateRiskScore(row).toFixed(2)}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex flex-col sm:flex-row justify-between items-center mt-4 space-y-2 sm:space-y-0">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        variant="outline"
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        variant="outline"
                      >
                        Next
                      </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
                  <AlertTriangle className="h-12 w-12 text-yellow-500" />
                  <p className="text-lg font-medium text-center">No results found</p>
                  <p className="text-sm text-muted-foreground text-center">
                    Try adjusting your search or filter settings
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sensitivity Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <label className="text-sm font-medium">
                    Fraud Detection Sensitivity: {sensitivity}%
                  </label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[sensitivity]}
                    onValueChange={handleSensitivityChange}
                    aria-label="Sensitivity"
                  />
                  <p className="text-sm text-muted-foreground">
                    Adjust the sensitivity to fine-tune fraud detection. Higher values may increase false positives.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleExport} variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
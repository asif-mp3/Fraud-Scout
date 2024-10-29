'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, FileText, BarChart2, AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Reports() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportType, setReportType] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showHistorical, setShowHistorical] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false)
      alert('Report generated successfully!')
    }, 3000)
  }

  const historicalData = [
    { id: 1, date: '2023-01-15', type: 'Daily Summary', fraudCases: 12, amount: '$5,230' },
    { id: 2, date: '2023-02-01', type: 'Weekly Analysis', fraudCases: 37, amount: '$18,650' },
    { id: 3, date: '2023-03-10', type: 'Monthly Trends', fraudCases: 156, amount: '$72,400' },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Fraud Detection Reports</CardTitle>
        <CardDescription>Generate and view detailed fraud analysis reports</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="report-type" className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <Select onValueChange={setReportType} value={reportType}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Summary</SelectItem>
                <SelectItem value="weekly">Weekly Analysis</SelectItem>
                <SelectItem value="monthly">Monthly Trends</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <Input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <Input
                type="date"
                id="end-date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
              Generating reports for extended periods may take longer to process.
            </AlertDescription>
          </Alert>
          <div className="flex space-x-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isGenerating || !reportType || !startDate || !endDate}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowHistorical(true)}
                >
                  <BarChart2 className="mr-2 h-4 w-4" />
                  View Historical Analysis
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Historical Fraud Analysis</DialogTitle>
                  <DialogDescription>
                    Review past fraud detection reports and trends
                  </DialogDescription>
                </DialogHeader>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Report Type</TableHead>
                      <TableHead>Fraud Cases</TableHead>
                      <TableHead>Total Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historicalData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.fraudCases}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
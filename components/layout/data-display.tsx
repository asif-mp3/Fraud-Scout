'use client'

import React, { useState, useEffect } from 'react'
import { saveAs } from 'file-saver'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, Download, Loader2, MoonIcon, SunIcon } from "lucide-react"

interface Transaction {
  Amount: number
  Time: number
  Prediction: number
}

interface DataDisplayProps {
  response: Transaction[]
}

export default function DataDisplay({ response }: DataDisplayProps) {
  const [entriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [sensitivity, setSensitivity] = useState(50)
  const [modifiedResult, setModifiedResult] = useState<Transaction[]>([])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [darkTheme, setDarkTheme] = useState(false)

  const calculateRiskScore = (entry: Transaction) => {
    const amountWeight = 0.7
    const timeWeight = 0.3
    return amountWeight * entry.Amount - timeWeight * entry.Time
  }

  const modifyResultWithSensitivity = () => {
    const uniqueTimes = new Set()
    const updatedResponse = response.map((entry) => {
      const uniqueTime = Math.abs(entry.Time)
      let adjustedTime = uniqueTime

      while (uniqueTimes.has(adjustedTime)) {
        adjustedTime += 1
      }
      uniqueTimes.add(adjustedTime)

      return {
        ...entry,
        Amount: entry.Amount * 10000,
        Time: adjustedTime,
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

    const sortedResult = finalResult
      .sort((a, b) =>
        sortOrder === 'asc'
          ? calculateRiskScore(a) - calculateRiskScore(b)
          : calculateRiskScore(b) - calculateRiskScore(a)
      )
      .filter((entry) => {
        if (filter === 'fraud') return entry.Prediction === 1
        if (filter === 'genuine') return entry.Prediction === 0
        return true
      })
      .filter((entry) => entry.Amount.toString().includes(searchQuery))

    setModifiedResult(sortedResult)
    setLoading(false)
  }

  useEffect(() => {
    modifyResultWithSensitivity()
  }, [sensitivity, response, sortOrder, filter, searchQuery])

  const handleSensitivityChange = (value: number[]) => setSensitivity(value[0])
  const handleSort = () => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  const handleFilterChange = (value: string) => setFilter(value)

  const startIndex = (currentPage - 1) * entriesPerPage
  const paginatedEntries = modifiedResult.slice(startIndex, startIndex + entriesPerPage)
  const totalPages = Math.ceil(modifiedResult.length / entriesPerPage)

  const handleExport = () => {
    const csvContent = `Amount,Prediction,Time\n${modifiedResult
      .map((entry) => `${entry.Amount},${entry.Prediction === 1 ? 'Fraud' : 'Genuine'},${entry.Time}`)
      .join('\n')}`
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'transaction_data.csv')
  }

  const toggleTheme = () => setDarkTheme(!darkTheme)

  return (
    <Card className={`w-full max-w-4xl mx-auto ${darkTheme ? 'dark' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Transaction Analysis</CardTitle>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {darkTheme ? <SunIcon className="h-[1.2rem] w-[1.2rem]" /> : <MoonIcon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Sensitivity: {sensitivity}%
            </label>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[sensitivity]}
              onValueChange={handleSensitivityChange}
            />
          </div>

          <div className="flex space-x-2">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by amount"
              className="flex-grow"
            />
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
            <Button onClick={handleSort}>
              Sort
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Prediction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedEntries.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.Time.toFixed(2)}</TableCell>
                      <TableCell>{Math.abs(row.Amount).toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={row.Prediction === 1 ? "text-red-500 font-bold" : "text-green-500 font-bold"}>
                          {row.Prediction === 1 ? 'Fraud' : 'Genuine'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center mt-4">
                <div className="space-x-2">
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
                <Button onClick={handleExport} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
'use client'

import React, { useState } from 'react'
import Papa from 'papaparse'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Table from "@/components/ui/table"
import TableBody from "@/components/ui/table"
import TableCaption from "@/components/ui/table"
import TableCell from "@/components/ui/table"
import TableHead from "@/components/ui/table"
import TableHeader from "@/components/ui/table"
import TableRow from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, FileDown, Trash2 } from "lucide-react"

interface ParsedData {
  data: string[][]
  errors: Papa.ParseError[]
  meta: Papa.ParseMeta
}

export default function CSVTableParser() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== 'text/csv') {
        setError('Please upload a valid CSV file')
        return
      }
      setError(null)
      setFileName(file.name)
      setIsLoading(true)
      Papa.parse(file, {
        complete: (result) => {
          setParsedData(result as ParsedData)
          setIsLoading(false)
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`)
          setIsLoading(false)
        },
        header: false,
      })
    }
  }

  const clearData = () => {
    setParsedData(null)
    setFileName('')
    setError(null)
  }

  const downloadJSON = () => {
    if (parsedData) {
      const jsonString = JSON.stringify(parsedData.data)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName.replace('.csv', '')}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>CSV Table Parser</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              id="fileInput"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="flex-grow"
            />
            <Button onClick={() => document.getElementById('fileInput')?.click()}>
              Upload CSV
            </Button>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {fileName && <p className="text-sm text-muted-foreground">Uploaded file: {fileName}</p>}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm text-muted-foreground">Parsing CSV...</p>
            </div>
          )}
          {parsedData && (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Parsed CSV Data</TableCaption>
                  <TableHeader>
                    <TableRow>
                      {parsedData.data[0].map((header, index) => (
                        <TableHead key={index}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.data.slice(1, 11).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {parsedData.data.length > 11 && (
                <p className="text-sm text-muted-foreground">
                  Showing first 10 rows of {parsedData.data.length - 1} total rows.
                </p>
              )}
              <div className="flex justify-end space-x-2">
                <Button onClick={clearData} variant="outline">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Data
                </Button>
                <Button onClick={downloadJSON}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download JSON
                </Button>
              </div>
            </>
          )}
          {parsedData && parsedData.errors && parsedData.errors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Parsing Errors</AlertTitle>
              <AlertDescription>
                <ul className="list-disc list-inside">
                  {parsedData.errors.map((error, index) => (
                    <li key={index} className="text-sm">
                      Row {error.row}: {error.message}
                    </li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Upload, AlertCircle } from "lucide-react"

// Importing the CSVUpload and Analyzer components
import CSVUpload from '../components/dashboard/csvupload'
import Analyzer from './layout/analyzer'

export default function Component() {
  const [parsedData, setParsedData] = useState(null)
  const [error, setError] = useState(null)

  const handleDataParsed = (data) => {
    setParsedData(data)
    setError(null)
  }

  const handleError = (err) => {
    setError(err.message || 'An error occurred while uploading the file.')
    setParsedData(null)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full mb-4">
        <CardHeader>
          <CardTitle>CSV File Upload and Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <CSVUpload onDataParsed={handleDataParsed} onError={handleError} />
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
      {parsedData && <Analyzer parsedData={parsedData} />}
    </div>
  )
}
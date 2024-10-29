'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, AlertCircle, FileText, Search } from 'lucide-react'
import Papa from 'papaparse'
import Analyzer from '../layout/analyzer'
import { useDropzone } from 'react-dropzone'
import { Progress } from '@/components/ui/progress'

const progressSteps = [0, 13, 21, 38, 41, 61, 73, 89, 96, 100]

export default function CSVUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<Papa.ParseResult<unknown> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [previewData, setPreviewData] = useState<Array<unknown>>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile)
      setError(null)
      setUploadProgress(0)
      setIsAnalyzing(false)
    } else {
      setError('Please select a valid CSV file.')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    onDrop,
    multiple: false
  })

  const simulateProgress = () => {
    let step = 0
    const interval = setInterval(() => {
      if (step < progressSteps.length) {
        setUploadProgress(progressSteps[step])
        step++
      } else {
        clearInterval(interval)
        setIsAnalyzing(false)
      }
    }, 750) // 6000ms / 8 steps ≈ 750ms per step
  }

  const handleUpload = () => {
    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    setIsAnalyzing(true)
    setUploadProgress(0)
    simulateProgress()

    Papa.parse(file, {
      complete: (result) => {
        setParsedData(result)
        setPreviewData(result.data.slice(0, 5) as Array<unknown>)
      },
      error: (error) => {
        setError(`Error parsing CSV: ${error.message}`)
        setIsAnalyzing(false)
      },
    })
  }

  useEffect(() => {
    if (uploadProgress === 100 && parsedData) {
      // Simulating a delay before showing the Analyzer component
      const timer = setTimeout(() => setIsAnalyzing(false), 500)
      return () => clearTimeout(timer)
    }
  }, [uploadProgress, parsedData])

  if (!isAnalyzing && parsedData) {
    return <Analyzer parsedData={parsedData} />
  }

  return (
    <Card className="w-full max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">CSV Upload</CardTitle>
        <CardDescription>Upload your CSV file for analysis</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            {file ? (
              <>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm">Drag and drop a CSV file here, or click to select</p>
                <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB</p>
              </>
            )}
          </div>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {(uploadProgress > 0 || isAnalyzing) && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-xs text-muted-foreground">
              {uploadProgress < 100 ? `Analyzing: ${uploadProgress.toFixed(0)}%` : 'Analysis complete'}
            </p>
          </div>
        )}
        {previewData.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-2">CSV Preview</h3>
            <div className="max-h-48 overflow-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr>
                    {Object.keys(previewData[0] as object).map((header, idx) => (
                      <th key={idx} className="border-b p-1 font-medium text-left text-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, idx) => (
                    <tr key={idx}>
                      {Object.values(row as object).map((cell, cellIdx) => (
                        <td key={cellIdx} className="border-b p-1 text-gray-600">
                          {cell as React.ReactNode}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-xs text-muted-foreground">
          {file ? `${file.name} selected` : 'No file selected'}
        </p>
        <Button 
          onClick={handleUpload} 
          disabled={!file || isAnalyzing} 
          size="sm" 
          className="flex items-center gap-2"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Data'}
          {!isAnalyzing && <Search className="w-4 h-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
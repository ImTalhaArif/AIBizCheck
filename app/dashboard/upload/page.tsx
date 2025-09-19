"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { apiRequest } from "@/lib/queryClient"
import { insertEmployeeSchema } from "@shared/schema"
import { Upload, FileSpreadsheet, User, CheckCircle } from "lucide-react"
import { z } from "zod"

const singleEmployeeSchema = insertEmployeeSchema.extend({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
})

export default function UploadPage() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadResults, setUploadResults] = useState<any[]>([])
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof singleEmployeeSchema>>({
    resolver: zodResolver(singleEmployeeSchema),
    defaultValues: {
      name: "",
      email: "",
      dateOfBirth: "",
      ssn: "",
      address: "",
      phone: "",
    },
  })

  const singleUploadMutation = useMutation({
    mutationFn: async (data: z.infer<typeof singleEmployeeSchema>) => {
      return apiRequest("POST", "/api/upload", { employees: [data] })
    },
    onSuccess: (response) => {
      toast({
        title: "Employee uploaded successfully",
        description: "Background check has been queued.",
      })
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] })
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] })
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const bulkUploadMutation = useMutation({
    mutationFn: async (employees: any[]) => {
      // Simulate progress
      setUploadProgress(0)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await apiRequest("POST", "/api/upload", { employees })
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      return response
    },
    onSuccess: (response) => {
      const data = response.json()
      setUploadResults(data.results || [])
      toast({
        title: "Bulk upload completed",
        description: `${data.results?.length || 0} employees uploaded successfully.`,
      })
      setBulkFile(null)
      queryClient.invalidateQueries({ queryKey: ['/api/employees'] })
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] })
    },
    onError: (error) => {
      toast({
        title: "Bulk upload failed",
        description: error.message,
        variant: "destructive",
      })
      setUploadProgress(0)
    },
  })

  const handleSingleSubmit = (data: z.infer<typeof singleEmployeeSchema>) => {
    singleUploadMutation.mutate(data)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setBulkFile(file)
      setUploadResults([])
      setUploadProgress(0)
    }
  }

  const handleBulkUpload = async () => {
    if (!bulkFile) return

    // In a real app, you'd parse the CSV/Excel file here
    // For now, simulate with mock data
    const mockEmployees = [
      {
        name: "John Smith",
        email: "john.smith@example.com",
        dateOfBirth: "1990-01-15",
        phone: "+1-555-0101",
        address: "123 Main St, Anytown, NY 10001"
      },
      {
        name: "Jane Doe", 
        email: "jane.doe@example.com",
        dateOfBirth: "1985-05-20",
        phone: "+1-555-0102",
        address: "456 Oak Ave, Somewhere, CA 90210"
      },
    ]

    bulkUploadMutation.mutate(mockEmployees)
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold" data-testid="page-title">Upload Employees</h2>
        <p className="text-muted-foreground">Add employees individually or upload in bulk</p>
      </div>

      <Tabs defaultValue="single" className="space-y-6">
        <TabsList>
          <TabsTrigger value="single" data-testid="tab-single">Single Upload</TabsTrigger>
          <TabsTrigger value="bulk" data-testid="tab-bulk">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Add Single Employee
              </CardTitle>
              <CardDescription>
                Enter employee information to start background check process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSingleSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter full name" 
                              {...field} 
                              data-testid="input-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Enter email address" 
                              {...field} 
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field} 
                              data-testid="input-dob"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter phone number" 
                              {...field} 
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ssn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SSN (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="XXX-XX-XXXX" 
                              {...field} 
                              data-testid="input-ssn"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter full address" 
                            {...field} 
                            data-testid="textarea-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={singleUploadMutation.isPending}
                    data-testid="button-submit-single"
                  >
                    {singleUploadMutation.isPending ? "Uploading..." : "Upload Employee"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileSpreadsheet className="w-5 h-5 mr-2" />
                  Bulk Upload
                </CardTitle>
                <CardDescription>
                  Upload multiple employees using CSV or Excel files
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Drop files here or click to upload</h3>
                    <p className="text-sm text-muted-foreground">
                      CSV, Excel files up to 10MB
                    </p>
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('bulk-file-input')?.click()}
                        data-testid="button-browse-files"
                      >
                        Browse Files
                      </Button>
                      <input
                        id="bulk-file-input"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileSelect}
                        className="hidden"
                        data-testid="input-file-bulk"
                      />
                    </div>
                  </div>
                </div>

                {bulkFile && (
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileSpreadsheet className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium" data-testid="text-filename">{bulkFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(bulkFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleBulkUpload}
                      disabled={bulkUploadMutation.isPending}
                      data-testid="button-upload-bulk"
                    >
                      {bulkUploadMutation.isPending ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                )}

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Upload Progress</span>
                      <span data-testid="text-progress">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadResults.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center text-accent">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Upload Complete
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Successfully uploaded {uploadResults.length} employees:
                        </p>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {uploadResults.map((result, index) => (
                            <div 
                              key={index} 
                              className="flex items-center justify-between p-2 bg-muted rounded text-sm"
                              data-testid={`result-employee-${index}`}
                            >
                              <span>{result.employee?.name}</span>
                              <Badge variant="secondary">Queued</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

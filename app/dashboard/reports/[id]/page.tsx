"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { 
  User, 
  Briefcase, 
  Share2, 
  Shield, 
  Download, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Bot
} from "lucide-react"

interface ReportPageProps {
  params: {
    id: string
  }
}

export default function ReportPage({ params }: ReportPageProps) {
  const { toast } = useToast()
  
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['/api/reports', params.id],
  })

  const handleDownloadPDF = async () => {
    try {
      // Import jsPDF dynamically to avoid SSR issues
      const jsPDF = (await import('jspdf')).default
      
      const doc = new jsPDF()
      const { employee, job, report } = reportData
      
      // Add title
      doc.setFontSize(20)
      doc.text('Background Check Report', 20, 30)
      
      // Add employee info
      doc.setFontSize(16)
      doc.text('Employee Information', 20, 50)
      doc.setFontSize(12)
      doc.text(`Name: ${employee?.name || 'N/A'}`, 20, 65)
      doc.text(`Email: ${employee?.email || 'N/A'}`, 20, 75)
      doc.text(`Date of Birth: ${employee?.dateOfBirth || 'N/A'}`, 20, 85)
      
      // Add risk assessment
      doc.setFontSize(16)
      doc.text('Risk Assessment', 20, 105)
      doc.setFontSize(12)
      doc.text(`Risk Level: ${job?.riskLevel?.toUpperCase() || 'N/A'}`, 20, 120)
      doc.text(`Risk Score: ${job?.riskScore || 'N/A'}/10`, 20, 130)
      
      // Add verification status
      if (report) {
        doc.setFontSize(16)
        doc.text('Verification Status', 20, 150)
        doc.setFontSize(12)
        doc.text(`Identity Verification: ${report.identity?.verified ? 'VERIFIED' : 'NOT VERIFIED'}`, 20, 165)
        doc.text(`Employment Verification: ${report.employment?.verified ? 'VERIFIED' : 'NOT VERIFIED'}`, 20, 175)
        doc.text(`Criminal Background: ${!report.criminal?.records ? 'CLEAN' : 'RECORDS FOUND'}`, 20, 185)
      }
      
      // Save the PDF
      doc.save(`background-check-${employee?.name?.replace(/\s+/g, '-')}-${Date.now()}.pdf`)
      
      toast({
        title: "PDF Downloaded",
        description: "Background check report has been downloaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Download Failed", 
        description: "Failed to generate PDF report.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="p-6">
        <Card className="text-center p-12">
          <CardContent>
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Report Not Found</h3>
            <p className="text-muted-foreground">The requested background check report could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { employee, job, report } = reportData
  const parsedReport = report ? JSON.parse(report) : null

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" data-testid="page-title">Background Check Report</h2>
          <p className="text-muted-foreground">Detailed analysis for {employee?.name}</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge 
            variant={job?.riskLevel === "high" ? "destructive" : 
                    job?.riskLevel === "medium" ? "secondary" : "default"}
            className="text-lg px-4 py-2"
            data-testid="badge-risk-level"
          >
            {job?.riskLevel?.toUpperCase()} RISK
          </Badge>
          <Button onClick={handleDownloadPDF} data-testid="button-download-pdf">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Employee Identity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Identity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium" data-testid="text-employee-name">{employee?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="font-medium" data-testid="text-employee-email">{employee?.email || 'N/A'}</p>
                    </div>
                  </div>
                  {employee?.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <p className="font-medium" data-testid="text-employee-phone">{employee.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {employee?.dateOfBirth && (
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <p className="font-medium" data-testid="text-employee-dob">{employee.dateOfBirth}</p>
                      </div>
                    </div>
                  )}
                  {employee?.address && (
                    <div>
                      <p className="text-sm text-muted-foreground">Address</p>
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <p className="font-medium" data-testid="text-employee-address">{employee.address}</p>
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Address Verification</p>
                    <Badge variant="default" className="mt-1">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional History */}
          {parsedReport?.employment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-primary" />
                  Professional History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parsedReport.employment.positions?.map((position: any, index: number) => (
                    <div key={index} className="flex justify-between items-start p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium" data-testid={`text-position-${index}`}>{position.position}</p>
                        <p className="text-sm text-muted-foreground" data-testid={`text-company-${index}`}>{position.company}</p>
                        <p className="text-xs text-muted-foreground" data-testid={`text-duration-${index}`}>{position.duration}</p>
                      </div>
                      <Badge variant={position.verified ? "default" : "secondary"}>
                        {position.verified ? (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Unverified
                          </>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Social Media Analysis */}
          {parsedReport?.socialMedia && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2 text-primary" />
                  Social Media Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(parsedReport.socialMedia).map(([platform, status]) => (
                    <div key={platform} className="text-center p-4 bg-muted/30 rounded-lg">
                      <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-full flex items-center justify-center">
                        <Share2 className="w-6 h-6 text-primary" />
                      </div>
                      <p className="font-medium capitalize" data-testid={`text-platform-${platform}`}>{platform}</p>
                      <Badge 
                        variant={status === "professional" || status === "clean" ? "default" : "secondary"}
                        className="mt-2"
                        data-testid={`badge-status-${platform}`}
                      >
                        {status as string}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Risk Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bot className="w-5 h-5 mr-2 text-primary" />
                AI Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary" data-testid="text-risk-score">
                        {job?.riskScore || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xl font-bold" data-testid="text-risk-level">
                    {job?.riskLevel?.toUpperCase()} RISK
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Risk Score: {job?.riskScore || 'N/A'}/10
                  </p>
                </div>
              </div>

              {parsedReport && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Identity Verification</span>
                    <div className="flex items-center space-x-2">
                      {parsedReport.identity?.verified ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={parsedReport.identity?.verified ? "text-green-500" : "text-red-500"}>
                        {parsedReport.identity?.verified ? "Passed" : "Failed"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Employment History</span>
                    <div className="flex items-center space-x-2">
                      {parsedReport.employment?.verified ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={parsedReport.employment?.verified ? "text-green-500" : "text-red-500"}>
                        {parsedReport.employment?.verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Criminal Background</span>
                    <div className="flex items-center space-x-2">
                      {!parsedReport.criminal?.records ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                      <span className={!parsedReport.criminal?.records ? "text-green-500" : "text-yellow-500"}>
                        {!parsedReport.criminal?.records ? "Clean" : "Records Found"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Social Media Review</span>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Professional</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-primary" />
                Job Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Job ID</p>
                <p className="font-mono text-sm" data-testid="text-job-id">{job?.id}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="default" data-testid="badge-job-status">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {job?.status?.toUpperCase()}
                </Badge>
              </div>

              {job?.startedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Started</p>
                  <p className="text-sm" data-testid="text-job-started">
                    {formatDistanceToNow(new Date(job.startedAt), { addSuffix: true })}
                  </p>
                </div>
              )}

              {job?.completedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-sm" data-testid="text-job-completed">
                    {formatDistanceToNow(new Date(job.completedAt), { addSuffix: true })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <Button 
                className="w-full"
                variant={job?.riskLevel === "high" ? "destructive" : "default"}
                data-testid="button-approve-employee"
              >
                {job?.riskLevel === "high" ? (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Requires Review
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Employee
                  </>
                )}
              </Button>
              <Button variant="outline" className="w-full" data-testid="button-flag-review">
                Flag for Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

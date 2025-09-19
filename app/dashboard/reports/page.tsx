"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { FileText, Download, Eye, Filter } from "lucide-react"
import Link from "next/link"

export default function ReportsPage() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['/api/jobs'],
  })

  // Filter only completed jobs that have reports
  const completedJobs = jobs?.jobs?.filter((job: any) => job.status === "complete" && job.report) || []

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-16 rounded mb-4" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold" data-testid="page-title">Background Check Reports</h2>
          <p className="text-muted-foreground">View and download completed background check reports</p>
        </div>
        <Button variant="outline" data-testid="button-filter">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Reports Grid */}
      {completedJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedJobs.map((job: any) => {
            const report = job.report ? JSON.parse(job.report) : null
            
            return (
              <Card key={job.id} className="hover:shadow-lg transition-shadow" data-testid={`card-report-${job.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <Badge 
                      variant={job.riskLevel === "high" ? "destructive" : 
                              job.riskLevel === "medium" ? "secondary" : "default"}
                      data-testid={`badge-risk-${job.id}`}
                    >
                      {job.riskLevel} Risk
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg" data-testid={`text-employee-name-${job.id}`}>
                        {job.employee?.name || 'Unknown Employee'}
                      </h3>
                      <p className="text-sm text-muted-foreground" data-testid={`text-employee-email-${job.id}`}>
                        {job.employee?.email || 'No email'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Risk Score:</span>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          job.riskLevel === "high" ? "bg-destructive" : 
                          job.riskLevel === "medium" ? "bg-yellow-500" : "bg-green-500"
                        }`} />
                        <span className="font-medium" data-testid={`text-risk-score-${job.id}`}>
                          {job.riskScore}/10
                        </span>
                      </div>
                    </div>

                    <div className="text-sm">
                      <span className="text-muted-foreground">Completed: </span>
                      <span data-testid={`text-completed-date-${job.id}`}>
                        {job.completedAt ? formatDistanceToNow(new Date(job.completedAt), { addSuffix: true }) : 'Recently'}
                      </span>
                    </div>

                    {report && (
                      <div className="pt-2 border-t border-border">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span>Identity:</span>
                            <span className={report.identity?.verified ? "text-green-500" : "text-red-500"}>
                              {report.identity?.verified ? "✓" : "✗"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Employment:</span>
                            <span className={report.employment?.verified ? "text-green-500" : "text-red-500"}>
                              {report.employment?.verified ? "✓" : "✗"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Criminal:</span>
                            <span className={!report.criminal?.records ? "text-green-500" : "text-red-500"}>
                              {!report.criminal?.records ? "Clean" : "Records"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Social:</span>
                            <span className="text-green-500">Good</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 mt-4 pt-4 border-t border-border">
                    <Link href={`/dashboard/reports/${job.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-${job.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" data-testid={`button-download-${job.id}`}>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="text-center p-12">
          <CardContent>
            <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports available</h3>
            <p className="text-muted-foreground mb-4">
              Reports will appear here once background checks are completed.
            </p>
            <Link href="/dashboard/jobs">
              <Button data-testid="button-view-jobs">
                View Background Check Jobs
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

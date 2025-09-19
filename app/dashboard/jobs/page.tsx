"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { Clock, CheckCircle, AlertTriangle, XCircle, Eye } from "lucide-react"
import Link from "next/link"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "complete":
      return <CheckCircle className="w-4 h-4" />
    case "processing":
      return <Clock className="w-4 h-4 animate-spin" />
    case "failed":
      return <XCircle className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "complete":
      return "default"
    case "processing":
      return "secondary"
    case "failed":
      return "destructive"
    default:
      return "outline"
  }
}

const getRiskBadge = (riskLevel: string | null, riskScore: number | null) => {
  if (!riskLevel || !riskScore) {
    return <span className="text-muted-foreground">Pending</span>
  }

  const variant = riskLevel === "high" ? "destructive" : 
                  riskLevel === "medium" ? "secondary" : "default"
  
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${
        riskLevel === "high" ? "bg-destructive" : 
        riskLevel === "medium" ? "bg-yellow-500" : "bg-green-500"
      }`} />
      <Badge variant={variant}>
        {riskLevel} ({riskScore})
      </Badge>
    </div>
  )
}

export default function JobsPage() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['/api/jobs'],
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  })

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold" data-testid="page-title">Background Check Jobs</h2>
        <p className="text-muted-foreground">Monitor the status of all background check processes</p>
      </div>

      {/* Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Background Checks</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs?.jobs && jobs.jobs.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>Started</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.jobs.map((job: any) => (
                    <TableRow key={job.id} data-testid={`row-job-${job.id}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {job.employee?.name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium" data-testid={`text-employee-name-${job.id}`}>
                              {job.employee?.name || 'Unknown Employee'}
                            </p>
                            <p className="text-sm text-muted-foreground" data-testid={`text-employee-email-${job.id}`}>
                              {job.employee?.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusVariant(job.status)} 
                          className="flex items-center space-x-1 w-fit"
                          data-testid={`badge-status-${job.id}`}
                        >
                          {getStatusIcon(job.status)}
                          <span className="capitalize">{job.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell data-testid={`cell-risk-${job.id}`}>
                        {getRiskBadge(job.riskLevel, job.riskScore)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground" data-testid={`text-started-${job.id}`}>
                        {job.startedAt ? formatDistanceToNow(new Date(job.startedAt), { addSuffix: true }) : 'Not started'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground" data-testid={`text-completed-${job.id}`}>
                        {job.completedAt ? formatDistanceToNow(new Date(job.completedAt), { addSuffix: true }) : '-'}
                      </TableCell>
                      <TableCell>
                        {job.status === "complete" ? (
                          <Link href={`/dashboard/reports/${job.id}`}>
                            <Button variant="outline" size="sm" data-testid={`button-view-report-${job.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Report
                            </Button>
                          </Link>
                        ) : job.riskLevel === "high" ? (
                          <Button variant="destructive" size="sm" data-testid={`button-review-${job.id}`}>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Review
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {job.status === "processing" ? "In Progress" : "Waiting"}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No background checks found</h3>
              <p className="text-muted-foreground mb-4">
                Background check jobs will appear here once employees are uploaded.
              </p>
              <Link href="/dashboard/upload">
                <Button data-testid="button-upload-employees">
                  Upload Employees
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

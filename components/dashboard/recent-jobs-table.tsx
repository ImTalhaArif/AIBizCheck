"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { CheckCircle, Clock, XCircle, AlertTriangle, Eye } from "lucide-react"
import Link from "next/link"

const getStatusIcon = (status: string) => {
  switch (status) {
    case "complete":
      return <CheckCircle className="w-3 h-3" />
    case "processing":
      return (
        <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )
    case "failed":
      return <XCircle className="w-3 h-3" />
    default:
      return <Clock className="w-3 h-3" />
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

export function RecentJobsTable() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['/api/jobs'],
    refetchInterval: 5000,
  })

  const recentJobs = jobs?.jobs?.slice(0, 5) || []

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>
        <CardContent>
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
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle data-testid="title-recent-jobs">Recent Background Checks</CardTitle>
          <Link href="/dashboard/jobs">
            <Button variant="ghost" size="sm" data-testid="button-view-all-jobs">
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {recentJobs.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentJobs.map((job: any) => (
                  <TableRow key={job.id} className="hover:bg-muted/20" data-testid={`row-recent-job-${job.id}`}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
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
                    <TableCell data-testid={`cell-risk-score-${job.id}`}>
                      {job.riskScore ? (
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            job.riskLevel === "high" ? "bg-red-500" :
                            job.riskLevel === "medium" ? "bg-yellow-500" : "bg-green-500"
                          }`} />
                          <span className="font-medium">
                            {job.riskLevel} ({job.riskScore})
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground" data-testid={`text-date-${job.id}`}>
                      {job.createdAt ? formatDistanceToNow(new Date(job.createdAt), { addSuffix: true }) : 'Recently'}
                    </TableCell>
                    <TableCell>
                      {job.status === "complete" ? (
                        <Link href={`/dashboard/reports/${job.id}`}>
                          <Button variant="ghost" size="sm" data-testid={`button-view-report-${job.id}`}>
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
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No background checks yet</p>
            <Link href="/dashboard/upload">
              <Button className="mt-2" size="sm" data-testid="button-start-first-check">
                Start First Check
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

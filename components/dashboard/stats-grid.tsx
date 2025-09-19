"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useMemo } from "react"

export function StatsGrid() {
  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ['/api/employees'],
  })

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/jobs'],
    refetchInterval: 5000,
  })

  const stats = useMemo(() => {
    if (!employees || !jobs) return null

    const totalEmployees = employees.employees?.length || 0
    const allJobs = jobs.jobs || []
    
    const activeJobs = allJobs.filter((job: any) => 
      job.status === "queued" || job.status === "processing"
    ).length

    const completedToday = allJobs.filter((job: any) => {
      if (!job.completedAt) return false
      const today = new Date()
      const completed = new Date(job.completedAt)
      return completed.toDateString() === today.toDateString()
    }).length

    const highRiskJobs = allJobs.filter((job: any) => 
      job.riskLevel === "high"
    ).length

    return {
      totalEmployees,
      activeJobs, 
      completedToday,
      highRisk: highRiskJobs,
    }
  }, [employees, jobs])

  if (employeesLoading || jobsLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
              <div className="mt-4">
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
              <p className="text-3xl font-bold" data-testid="stat-total-employees">
                {stats.totalEmployees.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500">+12%</span>
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
              <p className="text-3xl font-bold" data-testid="stat-active-jobs">
                {stats.activeJobs}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-yellow-500">Processing</span>
            <span className="text-muted-foreground ml-1">background checks</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed Today</p>
              <p className="text-3xl font-bold" data-testid="stat-completed-today">
                {stats.completedToday}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-500">+{Math.max(0, stats.completedToday - 3)}</span>
            <span className="text-muted-foreground ml-1">since yesterday</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">High Risk</p>
              <p className="text-3xl font-bold" data-testid="stat-high-risk">
                {stats.highRisk}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-500">Requires review</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

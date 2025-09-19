"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query" 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CloudUpload, Activity } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

export function QuickActionsPanel() {
  const [dragOver, setDragOver] = useState(false)
  
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['/api/jobs'],
    refetchInterval: 5000,
  })

  const recentActivity = jobs?.jobs
    ?.slice(0, 4)
    ?.map((job: any) => ({
      id: job.id,
      type: job.status === "complete" ? "completed" : 
            job.status === "processing" ? "processing" : "started",
      message: job.status === "complete" 
        ? `Background check completed for ${job.employee?.name}`
        : job.status === "processing"
        ? `Background check started for ${job.employee?.name}`
        : `New background check queued for ${job.employee?.name}`,
      time: job.completedAt || job.startedAt || job.createdAt,
      riskLevel: job.riskLevel,
    })) || []

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    // Handle file drop - would integrate with upload logic
    console.log('Files dropped:', e.dataTransfer.files)
  }

  return (
    <div className="space-y-6">
      {/* Quick Upload */}
      <Card>
        <CardHeader>
          <CardTitle data-testid="title-quick-upload">Quick Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
              dragOver 
                ? "border-primary/50 bg-primary/5" 
                : "border-border hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            data-testid="dropzone-quick-upload"
          >
            <CloudUpload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-medium">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">CSV, Excel files up to 10MB</p>
          </div>
          
          <Link href="/dashboard/upload">
            <Button className="w-full" data-testid="button-browse-files">
              Browse Files
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center" data-testid="title-recent-activity">
            <Activity className="w-5 h-5 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start space-x-3">
                  <Skeleton className="w-2 h-2 rounded-full mt-2" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-3" data-testid={`activity-item-${index}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.type === "completed" ? "bg-green-500" :
                    activity.type === "processing" ? "bg-blue-500" :
                    activity.riskLevel === "high" ? "bg-red-500" : "bg-yellow-500"
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm" data-testid={`activity-message-${index}`}>
                      {activity.message}
                      {activity.riskLevel === "high" && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          High Risk
                        </Badge>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground" data-testid={`activity-time-${index}`}>
                      {activity.time ? formatDistanceToNow(new Date(activity.time), { addSuffix: true }) : 'Recently'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { StatsGrid } from "@/components/dashboard/stats-grid"
import { RecentJobsTable } from "@/components/dashboard/recent-jobs-table"
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Plus } from "lucide-react"

export default function DashboardPage() {
  return (
    <div>
      {/* Header */}
      <header className="bg-card border-b border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold" data-testid="page-title">Dashboard</h2>
            <p className="text-muted-foreground">Monitor background check jobs and employee data</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search employees..." 
                className="w-64 pl-10 pr-4"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            </div>
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full"></span>
            </Button>
            {/* Upload Button */}
            <Button data-testid="button-new-upload">
              <Plus className="w-4 h-4 mr-2" />
              New Upload
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        <StatsGrid />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentJobsTable />
          </div>
          <div>
            <QuickActionsPanel />
          </div>
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Dashboard - AI Employee Background Checker',
  description: 'Monitor background check jobs and employee data',
}

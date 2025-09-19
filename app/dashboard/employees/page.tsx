"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Mail, Calendar, Phone, MapPin } from "lucide-react"

export default function EmployeesPage() {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['/api/employees'],
  })

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
                <Skeleton className="h-16 w-16 rounded-full mb-4" />
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-48 mb-4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-36" />
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
          <h2 className="text-2xl font-bold" data-testid="page-title">Employees</h2>
          <p className="text-muted-foreground">Manage employee records and background checks</p>
        </div>
        <Button data-testid="button-add-employee">
          <User className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees?.employees?.map((employee: any) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow" data-testid={`card-employee-${employee.id}`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-medium">
                    {employee.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg" data-testid={`text-name-${employee.id}`}>{employee.name}</h3>
                  <Badge variant="secondary" className="text-xs">Active</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 mr-2" />
                  <span data-testid={`text-email-${employee.id}`}>{employee.email}</span>
                </div>
                
                {employee.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    <span data-testid={`text-phone-${employee.id}`}>{employee.phone}</span>
                  </div>
                )}
                
                {employee.dateOfBirth && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span data-testid={`text-dob-${employee.id}`}>{employee.dateOfBirth}</span>
                  </div>
                )}
                
                {employee.address && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span data-testid={`text-address-${employee.id}`} className="truncate">{employee.address}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-profile-${employee.id}`}>
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!employees?.employees || employees.employees.length === 0) && !isLoading && (
        <Card className="text-center p-12">
          <CardContent>
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No employees found</h3>
            <p className="text-muted-foreground mb-4">Start by adding your first employee to the system.</p>
            <Button data-testid="button-add-first-employee">
              <User className="w-4 h-4 mr-2" />
              Add First Employee
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

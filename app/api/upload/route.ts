import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/server/storage'
import { insertEmployeeSchema } from '@shared/schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employees: employeeList } = body
    
    if (!Array.isArray(employeeList)) {
      return NextResponse.json(
        { message: "Expected array of employees" },
        { status: 400 }
      )
    }

    const results = []
    for (const employeeData of employeeList) {
      try {
        const validatedEmployee = insertEmployeeSchema.parse(employeeData)
        const employee = await storage.createEmployee({
          ...validatedEmployee,
          uploadedBy: "admin-id", // Mock user ID - in real app get from session
        })
        
        // Create background job for each employee
        const job = await storage.createBackgroundJob({
          employeeId: employee.id,
          status: "queued",
        })
        
        results.push({ employee, job })
      } catch (error) {
        console.error("Error processing employee:", error)
      }
    }

    return NextResponse.json({
      message: `Successfully queued ${results.length} background checks`,
      results
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Upload failed" },
      { status: 400 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/server/storage'

export async function GET(request: NextRequest) {
  try {
    const jobs = await storage.getBackgroundJobs()
    const jobsWithEmployees = []
    
    for (const job of jobs) {
      const employee = await storage.getEmployee(job.employeeId)
      jobsWithEmployees.push({
        ...job,
        employee,
      })
    }
    
    return NextResponse.json({ jobs: jobsWithEmployees })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch jobs" },
      { status: 500 }
    )
  }
}

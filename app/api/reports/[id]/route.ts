import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/server/storage'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params
    const job = await storage.getBackgroundJob(id)
    
    if (!job) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      )
    }
    
    const employee = await storage.getEmployee(job.employeeId)
    
    return NextResponse.json({
      job,
      employee,
      report: job.report,
    })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch report" },
      { status: 500 }
    )
  }
}

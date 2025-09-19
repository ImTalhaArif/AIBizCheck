import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/server/storage'

export async function GET(request: NextRequest) {
  try {
    const employees = await storage.getEmployees()
    return NextResponse.json({ employees })
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch employees" },
      { status: 500 }
    )
  }
}

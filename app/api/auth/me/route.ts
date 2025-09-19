import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/server/storage'

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get('session')?.value
  
  if (!sessionId) {
    return NextResponse.json(
      { message: "Not authenticated" },
      { status: 401 }
    )
  }

  const user = await storage.getUser(sessionId)
  if (!user) {
    return NextResponse.json(
      { message: "User not found" },
      { status: 401 }
    )
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  })
}

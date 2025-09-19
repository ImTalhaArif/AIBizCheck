import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/server/storage'
import { loginSchema } from '@shared/schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)
    
    const user = await storage.getUserByEmail(email)
    if (!user || user.password !== password) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // In a real app, you'd set a session or JWT here
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
    
    // Set a simple session cookie for demo purposes
    response.cookies.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    })
    
    return response
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 }
    )
  }
}

import { NextRequest } from 'next/server'
import { storage } from '@/server/storage'

export async function getCurrentUser(request: NextRequest) {
  const sessionId = request.cookies.get('session')?.value
  
  if (!sessionId) {
    return null
  }

  const user = await storage.getUser(sessionId)
  return user
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return handler(request, ...args, { user })
  }
}

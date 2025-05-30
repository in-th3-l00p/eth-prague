import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase-server'

export async function middleware(request: NextRequest) {
  // Update the session and get the response with refreshed auth tokens
  const response = await updateSession(request)

  const { pathname } = request.nextUrl

  // Define protected routes
  const protectedRoutes = ['/dashboard']
  const authRoutes = ['/login', '/register']

  // Check if user is authenticated by examining the cookies
  // Note: We're using a simple check here. In a production app, you might want to 
  // verify the JWT token more thoroughly
  const authCookie = request.cookies.get('sb-access-token') || 
                    request.cookies.get('supabase-auth-token') ||
                    request.cookies.getAll().find(cookie => 
                      cookie.name.includes('supabase') && cookie.name.includes('auth')
                    )

  const isAuthenticated = !!authCookie?.value

  // Redirect to login if trying to access protected routes without authentication
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Redirect to dashboard if already authenticated and trying to access auth routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 
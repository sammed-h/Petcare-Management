import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  if (!process.env.JWT_SECRET) {
    console.warn('MIDDLEWARE ALERT: JWT_SECRET is not defined in the Edge environment!');
  }

  // Protected routes
  const isDashboard = pathname.startsWith('/dashboard')

  if (isDashboard) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      // No token, redirect to login
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    try {
      // Verify token
      const { payload } = await jwtVerify(token, JWT_SECRET)

      // Check role-based access
      const userRole = payload.role as string

      if (pathname.startsWith('/dashboard/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      if (
        pathname.startsWith('/dashboard/zoo-manager') &&
        userRole !== 'zoo_manager'
      ) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      if (pathname.startsWith('/dashboard/user') && userRole !== 'user') {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // Token is valid, allow access
      return NextResponse.next()
    } catch (error) {
      // Invalid token, redirect to login
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

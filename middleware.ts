import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const secretStr = process.env.JWT_SECRET;
  if (!secretStr) {
    console.error(`MIDDLEWARE CRITICAL ERROR: JWT_SECRET is not defined! Path: ${pathname}`);
    // If it's a dashboard route, we MUST have a secret to verify access
    if (pathname.startsWith('/dashboard')) {
       return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next();
  }

  const JWT_SECRET = new TextEncoder().encode(secretStr);

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

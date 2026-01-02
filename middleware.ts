import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const secretStr = process.env.JWT_SECRET;
  const isDashboard = pathname.startsWith('/dashboard')

  if (!secretStr) {
    if (isDashboard) {
      console.error(`[MIDDLEWARE] CRITICAL ERROR: JWT_SECRET is not defined! Access denied to ${pathname}`);
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next();
  }

  const JWT_SECRET = new TextEncoder().encode(secretStr);

  if (isDashboard) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      console.log(`[MIDDLEWARE] No token found for dashboard route: ${pathname}`);
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    try {
      // Verify token with explicit HS256 algorithm
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        algorithms: ['HS256']
      })

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

      return NextResponse.next()
    } catch (error: any) {
      console.error(`[MIDDLEWARE] Token verification failed for ${pathname}:`, error.message);
      // Clean up invalid cookie by redirecting with a fresh start
      const url = new URL('/login', request.url)
      url.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(url)
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isDashboard = pathname.startsWith('/dashboard')

  if (isDashboard) {
    try {
      const payload = await verifyToken(request);

      if (!payload) {
        console.log(`[MIDDLEWARE] No valid token for ${pathname}, redirecting to login`);
        const url = new URL('/login', request.url)
        url.searchParams.set('redirect', pathname)
        const response = NextResponse.redirect(url)
        // Clear potential stale cookie
        response.cookies.delete('token')
        return response
      }

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
      console.error(`[MIDDLEWARE] Fatal error check for ${pathname}:`, error.message);
      const url = new URL('/login', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

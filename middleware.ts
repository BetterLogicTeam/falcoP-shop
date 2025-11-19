import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin routes protection
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
      if (!token || token.type !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    }

    // Customer account routes protection
    if (path.startsWith('/account')) {
      if (!token || token.type !== 'customer') {
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Admin routes require admin token
        if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
          return !!token && token.type === 'admin'
        }

        // Account routes require customer token
        if (path.startsWith('/account')) {
          return !!token && token.type === 'customer'
        }

        // All other routes are public
        return true
      }
    }
  }
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/account/:path*'
  ]
}

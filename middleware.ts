import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
    const isAuthRoute = req.nextUrl.pathname.startsWith('/auth')
    const isLoginRoute = req.nextUrl.pathname === '/auth/login' || req.nextUrl.pathname === '/admin/login'

    // Security Headers
    const requestHeaders = new Headers(req.headers)
    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https:; font-src 'self' data:; frame-src 'self' https://js.stripe.com;"
    )

    // Auth Protection
    if (isAdminRoute && !isLoginRoute) {
        if (!token || token.role !== 'ADMIN') {
            const url = new URL('/admin/login', req.url)
            url.searchParams.set('callbackUrl', req.nextUrl.pathname)
            return NextResponse.redirect(url)
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images (public images)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
    ],
}

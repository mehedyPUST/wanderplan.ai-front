import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPaths = ['/profile', '/itineraries', '/wishlist'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('returnUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*', '/itineraries/:path*', '/wishlist/:path*'],
};
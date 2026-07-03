import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your_super_secret_jwt_key');

export async function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('session_token');

  if (!sessionToken?.value) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(sessionToken.value, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/feed/:path*', '/feed'],
};

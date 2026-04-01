import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

import { ENV_SERVER } from '@/config/server.config';
import { AUTH_TOKEN_KEY } from '@/constants/auth.constanst';
import { APP_ROUTES, CALLBACK_URL_KEY } from '@/constants/routes';

const JWT_SECRET = new TextEncoder().encode(ENV_SERVER.JWT_SECRET);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

  // 1. Verify token once at the beginning
  let isValid = false;
  try {
    if (token) {
      await jwtVerify(token, JWT_SECRET);
      isValid = true;
    }
  } catch {
    isValid = false;
  }

  // 2. Protect Private Routes (Profile, Todo, etc.)
  const privateRoutes = [APP_ROUTES.PROFILE, APP_ROUTES.TODO];
  const isPrivate = privateRoutes.some((p) => pathname.startsWith(p));
  if (isPrivate && !isValid) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = APP_ROUTES.SIGN_IN;
    loginUrl.searchParams.set(CALLBACK_URL_KEY, pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_TOKEN_KEY);
    return response;
  }

  // 3. Redirect Logged-In Users away from Auth Pages (Login, Register)
  const authRoutes = [APP_ROUTES.SIGN_IN, APP_ROUTES.SIGN_UP];
  const isAuthPage = authRoutes.some((p) => pathname === p);

  if (isAuthPage && isValid) {
    return NextResponse.redirect(new URL(APP_ROUTES.HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

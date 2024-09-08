import { updateSession } from '@/utils/supabase/middleware';
import type { User } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  // Check if the request is for a public asset
  if (isPublicAsset(request)) {
    return NextResponse.next();
  }

  const { user, res } = await updateSession(request);

  const { res: newRes, redirect } = handleRedirect({
    req: request,
    res,
    user,
  });

  if (redirect) {
    return newRes;
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};

const isPublicAsset = (request: NextRequest): boolean => {
  const publicPaths = [
    '/assets/',
    '/pwa/',
    '/images/',
    '/icon/',
    '/media/',
    '/favicon.ico',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/apple-touch-icon.png',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/robots.txt',
    '/sitemap.xml',
    '/manifest.webmanifest',
    '/sw.js',
  ];

  return publicPaths.some((path) => request.nextUrl.pathname.startsWith(path));
};

const handleRedirect = ({
  req,
  res,
  user,
}: {
  req: NextRequest;
  res: NextResponse;
  user: User | null;
}): {
  res: NextResponse;
  redirect: boolean;
} => {
  if (user) {
    const hasRedirected = req.cookies.get('hasRedirected');

    if (req.nextUrl.pathname.includes('/signin') && !hasRedirected) {
      const nextRes = NextResponse.redirect(new URL('/my-learning', req.url));
      nextRes.cookies.set('hasRedirected', 'true', { maxAge: 60 * 60 * 24 * 30 });
      return { res: nextRes, redirect: true };
    }
  }

  const publicRoutes = [
    '/signin/password_signin',
    '/auth/error',
    '/auth/callback',
    '/auth/reset_password',
    '/',
    '/legal/privacy',
    '/legal/terms',
    '/legal/cookies',
    '/support'
  ];

  if (!user && !publicRoutes.includes(req.nextUrl.pathname)) {
    const nextRes = NextResponse.redirect(new URL('/signin/password_signin', req.url));
    return { res: nextRes, redirect: true };
  }

  return { res, redirect: false };
};

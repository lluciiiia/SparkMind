import { updateSession } from '@/utils/supabase/middleware';
import type { User } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
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
  matcher: [
    '/((?!api|_next/static|_next/image|media|favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png|robots.txt|sitemap.xml|site.webmanifest|monitoring|auth|signin|public|scrape).*)',
  ],
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
      nextRes.cookies.set('hasRedirected', 'true', { maxAge: 60 * 60 * 24 }); // 24 hours
      return { res: nextRes, redirect: true };
    }
  }

  if (
    !user &&
    req.nextUrl.pathname !== '/signin/password_signin' &&
    req.nextUrl.pathname !== '/auth/error' &&
    req.nextUrl.pathname !== '/auth/callback' &&
    req.nextUrl.pathname !== '/auth/reset_password' &&
    req.nextUrl.pathname !== '/'
  ) {
    const nextRes = NextResponse.redirect(new URL('/signin/password_signin', req.url));
    return { res: nextRes, redirect: true };
  }

  return { res, redirect: false };
};

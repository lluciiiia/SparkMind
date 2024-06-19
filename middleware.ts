import { updateSession } from '@/utils/supabase/middleware';
import type { User } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { user } = await updateSession(request);

  const { res, redirect } = handleRedirect({
    req: request,
    res: NextResponse.next({ request }),
    user,
  });

  if (redirect) {
    return res;
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - media (media files)
     * - favicon.ico (favicon file)
     * - favicon-16x16.png (favicon file)
     * - favicon-32x32.png (favicon file)
     * - apple-touch-icon.png (favicon file)
     * - android-chrome-192x192.png (favicon file)
     * - android-chrome-512x512.png (favicon file)
     * - robots.txt (SEO)
     * - sitemap.xml (SEO)
     * - site.webmanifest (SEO)
     * - monitoring (analytics)
     */
    '/((?!api|_next/static|_next/image|media|favicon.ico|favicon-16x16.png|favicon-32x32.png|apple-touch-icon.png|android-chrome-192x192.png|android-chrome-512x512.png|robots.txt|sitemap.xml|site.webmanifest|monitoring).*)',
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
  // If current path ends with /login and user is logged in, redirect to onboarding page
  if (req.nextUrl.pathname.endsWith('/login') && user) {
    const nextRes = NextResponse.redirect(req.nextUrl.href.replace('/login', '/dashboard'));

    return { res: nextRes, redirect: true };
  }

  // If current path ends with /onboarding and user is not logged in, redirect to login page
  if (req.nextUrl.pathname.endsWith('/dashboard') && !user) {
    const nextRes = NextResponse.redirect(req.nextUrl.href.replace('/dashboard', '/login'));

    return { res: nextRes, redirect: true };
  }

  return { res, redirect: false };
};

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

  if (user) {
    return { res, redirect: false };
  }

  if (req.nextUrl.pathname.includes('/signin') && user) {
    const nextRes = NextResponse.redirect(req.nextUrl.href.replace('/signin', '/my-learning'));
    return { res: nextRes, redirect: true };
  }

  if (req.nextUrl.pathname.includes('/my-learning') && !user) {
    const nextRes = NextResponse.redirect(req.nextUrl.href.replace('/my-learning', '/signin'));
    return { res: nextRes, redirect: true };
  }

  return { res, redirect: false };
};

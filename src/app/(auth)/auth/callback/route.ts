import { createClient } from '@/utils/supabase/client';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';
  const supabaseClient = createClient();

  if (code) {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options });
          },
        },
      },
    );

    const { error: sessionError, data } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Error exchanging code for session:', sessionError.message);
      return NextResponse.redirect(`${origin}/auth/error`);
    }

    if (!sessionError) {
      try {
        const token = data.session;
        if (!data.user.id) {
          console.error('User ID is undefined:', data.user.id);
          return NextResponse.json({ error: 'User ID is undefined' }, { status: 400 });
        }

        const tokenInsertOrUpdateRes = await supabaseClient.from('googleauthtokens').upsert(
          {
            user_uuid: data.user.id,
            access_token: token.provider_token,
            refresh_token: token.provider_refresh_token,
            expires_at: new Date(Date.now() + token.expires_in! * 1000).toISOString(),
          },
          { onConflict: 'user_uuid' },
        );

        // console.log('Token insert or update response:', tokenInsertOrUpdateRes);
      } catch (error) {
        throw new Error('Google Auth Token not inserted into database -> Token Table : ' + error);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/auth/error`);
}

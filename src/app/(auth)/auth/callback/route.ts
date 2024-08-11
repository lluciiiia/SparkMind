import { createClient } from '@/utils/supabase/client';
import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const supabaseClient = createClient();

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

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

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      try {
        //check user exit or not
        const userRes = await supabaseClient
          .from('users')
          .select('*')
          .eq('user_uuid', data.user.id);

        if (userRes.data?.length === 0) {
          // Insert new user
          await supabaseClient.from('users').insert({
            user_uuid: data.user.id,
            user_email: data.user.email,
          });

          // Insert new tokens
          const token = data.session;
          await supabaseClient.from('googleauthtokens').insert({
            user_uuid: data.user.id,
            access_token: token.provider_token,
            refresh_token: token.provider_refresh_token,
            expires_at: new Date(Date.now() + token.expires_in! * 1000).toISOString(),
          });
        } else {
          const token = data.session;
          await supabaseClient
            .from('googleauthtokens')
            .update({
              access_token: token.provider_token,
              refresh_token: token.provider_refresh_token,
              expires_at: new Date(Date.now() + token.expires_in! * 1000).toISOString(),
            })
            .eq('user_uuid', data.user.id);
        }
      } catch (error) {
        console.log('Google Auth Toke not insert into database -> Token Table : ' + error);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`);
}

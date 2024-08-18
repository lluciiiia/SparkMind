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

    const { error: sessionError, data } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError) {
      console.error('Error exchanging code for session:', sessionError.message);
      return NextResponse.redirect(`${origin}/auth/error`);
    }

    if (!sessionError) {
      try {
        //check user exit or not
        const userRes = await supabaseClient
          .from('users')
          .select('*')
          .eq('user_uuid', data.user.id);

        if (userRes.error) {
          throw new Error(`Error fetching user: ${userRes.error.message}`);
        }

        const token = data.session;
        console.log('this is token : ' + token);

        if (userRes.data?.length === 0) {
          // Insert new user
          const insertUserRes = await supabaseClient.from('users').insert({
            user_uuid: data.user.id,
            user_email: data.user.email,
          });

          if (insertUserRes.error) {
            throw new Error(`Error inserting user: ${insertUserRes.error.message}`);
          }

          // Insert new tokens
          const insertTokenRes = await supabaseClient.from('googleauthtokens').insert({
            user_uuid: data.user.id,
            access_token: token.provider_token,
            refresh_token: token.provider_refresh_token,
            expires_at: new Date(Date.now() + token.expires_in! * 1000).toISOString(),
          });

          if (insertTokenRes.error) {
            throw new Error(`Error inserting token: ${insertTokenRes.error.message}`);
          }

        } else {
          const updateTokenRes = await supabaseClient
            .from('googleauthtokens')
            .update({
              access_token: token.provider_token,
              refresh_token: token.provider_refresh_token,
              expires_at: new Date(Date.now() + token.expires_in! * 1000).toISOString(),
            })
            .eq('user_uuid', data.user.id);

          if (updateTokenRes.error) {
            throw new Error(`Error updating token: ${updateTokenRes.error.message}`);
          }
        }
      } catch (error) {
        console.log('Google Auth Toke not insert into database -> Token Table : ' + error);
        return NextResponse.redirect(`${origin}/auth/error`);
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`);
}

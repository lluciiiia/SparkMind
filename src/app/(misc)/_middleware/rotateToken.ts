import { google } from 'googleapis';

import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';
import { toast } from 'sonner';

const supabaseClient = createClient();

export default async function rotateToken(req: any, res: NextResponse, next: any) {
  try {
    const user_uuid = req.uuid;

    if (!user_uuid) {
      console.error('User UUID is undefined:', user_uuid);
      return NextResponse.json({ status: 400, error: 'User UUID is undefined' });
    }

    const { data: tokens, error } = await supabaseClient
      .from('googleauthtokens')
      .select('*')
      .eq('user_uuid', user_uuid)
      .single();

    if (error) {
      return NextResponse.json({
        status: 404,
        error: 'No tokens found for Refrashing :' + error.message,
      });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.Google_OAuth_secret,
      process.env.Google_OAuth_redirect,
    );

    if (new Date(tokens.expires_at) <= new Date()) {
      // Refresh the token

      try {
        oauth2Client.setCredentials({ refresh_token: tokens.refresh_token });
        const newTokens = await oauth2Client.refreshAccessToken();
        const { access_token, refresh_token, expiry_date } = newTokens.credentials;

        // Update tokens in Supabase
        await supabaseClient
          .from('tokens')
          .update({
            access_token,
            refresh_token: refresh_token, // Only update if a new refresh token is provided
            expires_at: new Date(Date.now() + expiry_date! * 1000).toISOString(),
          })
          .eq('user_id', user_uuid);

        req.accessToken = access_token;
      } catch (err) {
        toast.error('🔃 Google RefeshToken Error : ' + err);
      }
    } else {
      req.accessToken = await tokens.access_token;
    }
  } catch (err) {
    toast.error('Server Side error : ' + err);
  }
  next();
}

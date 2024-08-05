import { google } from 'googleapis';

import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';

const supabaseClient = createClient();

export default async function rotateToken(req: any, res: NextResponse, next: any) {
  try {
    const user_uuid = req.uuid;

    console.log("user_uuid : 🪪 " + user_uuid);

    if (user_uuid === undefined) {
      console.log('User not authenticated');
      return NextResponse.json({ status: 400, error: 'User not authenticated' });
    }

    const { data: tokens, error } = await supabaseClient
      .from('googleauthtokens')
      .select('*')
      .eq('user_uuid', user_uuid)
      .single();

    if (error) {
      console.log('No tokens found for Refrashing :' + error.message);
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

        console.log(refresh_token);

        // Update tokens in Supabase
        await supabaseClient
          .from('tokens')
          .update({
            access_token,
            refresh_token: refresh_token, // Only update if a new refresh token is provided
            expires_at: new Date(Date.now() + expiry_date! * 1000).toISOString(),
          })
          .eq('user_id', user_uuid);

        console.log('this new 👶🏻 access token : ' + req.accessToken);

        req.accessToken = access_token;
      } catch (err) {
        console.log('🔃 Google RefeshToken Error : ' + err);
      }
    } else {
      req.accessToken = await tokens.access_token;
      console.log('this token is expire date ⌚⌚ : ' + new Date(tokens.expires_at));
      console.log('this old 👴🏻 access tocken : ' + req.accessToken);
    }
  } catch (err) {
    console.log('Server Side error : ' + err);
  }

  next();
}

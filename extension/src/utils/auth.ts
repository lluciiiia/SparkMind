import supabase from '@src/supabase/supabase';
import type { User } from '@supabase/supabase-js';
import Browser from 'webextension-polyfill';

const chromeStorageKeys = {
  gauthAccessToken: 'gauthAccessToken',
  gauthRefreshToken: 'gauthRefreshToken',
};

export async function getCurrentUser(): Promise<null | { user: User; accessToken: string }> {
  const gauthAccessToken = (await Browser.storage.sync.get(chromeStorageKeys.gauthAccessToken))[
    chromeStorageKeys.gauthAccessToken
  ];
  const gauthRefreshToken = (await Browser.storage.sync.get(chromeStorageKeys.gauthRefreshToken))[
    chromeStorageKeys.gauthRefreshToken
  ];

  if (gauthAccessToken && gauthRefreshToken) {
    try {
      const resp = await supabase.auth.setSession({
        access_token: gauthAccessToken,
        refresh_token: gauthRefreshToken,
      });

      const user = resp.data?.user;
      const supabaseAccessToken = resp.data.session?.access_token;

      if (user && supabaseAccessToken) {
        return { user, accessToken: supabaseAccessToken };
      }
    } catch (e: any) {
      console.error('Error: ', e);
    }
  }

  return null;
}

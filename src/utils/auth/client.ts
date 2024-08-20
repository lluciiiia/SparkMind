'use client';

import { getURL } from '@/utils/helpers';
import { createClient } from '@/utils/supabase/client';
import type { Provider } from '@supabase/supabase-js';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';
import { redirectToPath } from './server';

export async function handleRequest(
  e: React.FormEvent<HTMLFormElement>,
  requestFunc: (formData: FormData) => Promise<{
    redirectPath: string;
    toastMessage: { type: 'success' | 'error'; message: string };
  }>,
  router: AppRouterInstance | null = null,
): Promise<boolean | void> {
  // Prevent default form submission refresh
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const { redirectPath, toastMessage } = await requestFunc(formData);

  if (toastMessage.type === 'success') {
    toast.success(toastMessage.message, {
      duration: 5000,
      className: 'bg-green-300 text-white',
    });
  } else if (toastMessage.type === 'error') {
    toast.error(toastMessage.message, {
      duration: 5000,
      className: 'bg-red-300 text-white',
    });
  }

  if (router) {
    // If client-side router is provided, use it to redirect
    return router.push(redirectPath);
  } else {
    // Otherwise, redirect server-side
    return await redirectToPath(redirectPath);
  }
}

export async function signInWithOAuth() {
  // Prevent default form submission refresh
  const provider = 'google';

  // Create client-side supabase client and call signInWithOAuth
  const supabase = createClient();
  const redirectURL = getURL('/auth/callback');
  await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
      queryParams: { access_type: 'offline', prompt: 'consent' },
      scopes:
        'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
      redirectTo: redirectURL,
    },
  });
}

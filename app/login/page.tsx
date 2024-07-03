'use client'

import { createClient } from "@/utils/supabase/client";

export default function page() {

  const handleLoginWithOAuth = async (provider: "google") => {
    const supabase = createClient();

    const res = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        queryParams: { access_type: "offline", prompt: 'consent' },
        scopes: 'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
        redirectTo: location.origin + '/auth/callback',
      },
    });

  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="px-6 sm:px-0 max-w-sm">
        <button
          onClick={() => handleLoginWithOAuth("google")}
          type="button"
          className="text-slate-900 w-full  bg-slate-100 hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-slate-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mb-2">
          <img src="/icon/search.png" alt="Google Icon" className="w-5 h-5 mr-3 p-0" />
          Sign up with Google
        </button>
      </div>
    </div>
  )
}
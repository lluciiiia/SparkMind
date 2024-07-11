'use client'

import { createClient } from "@/utils/supabase/client";
import { BackgroundBeams } from "@/components/ui/background-beams";

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
        <div className="h-full w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
            <div className="min-h-screen w-full flex flex-col items-center justify-center">
                <h1 className="relative z-10 text-lg md:text-4xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  mb-4 text-center font-sans font-bold">
                    New Here? Join Us
                </h1>
                <div className="px-6 sm:px-0 max-w-sm">
                    <button
                        onClick={() => handleLoginWithOAuth("google")}
                        type="button"
                        className="text-slate-900 w-full  bg-slate-100 hover:bg-slate-200 focus:ring-4 focus:outline-none focus:ring-slate-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between mb-2 z-10 relative">
                        <img src="/icon/search.png" alt="Google Icon" className="w-5 h-5 mr-3 p-0" />
                        Sign up with Google
                    </button>
                </div>
                <div>
                    <p className="mt-2 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 relative z-10">
                            Login
                        </a>
                    </p>
                </div>
            </div>
            <BackgroundBeams />
        </div>
    )
}
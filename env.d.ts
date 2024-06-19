declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      NEXT_PUBLIC_SITE_URL: string;
      NEXT_PUBLIC_SUPABASE_URL: string;
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      SUPABASE_SERVICE_ROLE_KEY: string;
      GOOGLE_YOUTUBE_API_KEY: string;
      GOOGLE_AI_API_KEY: string;
      GOOGLE_SEARCH_API_KEY: string;
      GOOGLE_SEARCH_ENGINE_ID: string;
      GOOGLE_DRIVE_API_KEY: string;
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
      STRIPE_SECRET_KEY: string;
      STRIPE_WEBHOOK_SECRET: string;
    }
  }
}

export type {};

'use client';

import { Button } from '@/components/custom';
import { signInWithOAuth } from '@/utils/auth/client';
import type { Provider } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { FaGoogle } from 'react-icons/fa';

type OAuthProviders = {
  name: Provider;
  displayName: string;
  icon: JSX.Element;
};

export const OauthSignIn = () => {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: 'google',
      displayName: 'Google',
      icon: <FaGoogle className="h-5 w-5" />,
    },
    /* Add desired OAuth providers here */
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const initiateOAuth = async () => {
      setIsSubmitting(true);
      await signInWithOAuth(); // Automatically use the first provider or select one as needed
      setIsSubmitting(false);
    };

    initiateOAuth();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="w-full flex justify-center items-center">
      <div className="text-lg font-bold">Connecting with Google ...</div>
    </div>
  );
};

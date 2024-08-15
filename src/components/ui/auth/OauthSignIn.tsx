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

  // useEffect(() => {
  //   const initiateOAuth = async () => {
  //     setIsSubmitting(true);
  //     await signInWithOAuth(); // Automatically use the first provider or select one as needed
  //     setIsSubmitting(false);
  //   };

  //   initiateOAuth();
  // }, []); // Empty dependency array ensures this runs only once on mount

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await signInWithOAuth();
    setIsSubmitting(false);
  };

  return (
    <div className="mt-8">
      {oAuthProviders.map((provider) => (
        <form key={provider.name} className="pb-2" onSubmit={(e) => handleSubmit(e)}>
          <input type="hidden" name="provider" value={provider.name} />
          <Button variant="slim" type="submit" className="w-full" loading={isSubmitting}>
            <span className="mr-2">{provider.icon}</span>
            <span>{provider.displayName}</span>
          </Button>
        </form>
      ))}
    </div>
  );
};

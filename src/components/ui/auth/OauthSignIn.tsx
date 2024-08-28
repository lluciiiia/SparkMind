'use client';

import { Button } from '@/components/custom';
import { signInWithOAuth } from '@/utils/auth/client';
import type { Provider } from '@supabase/supabase-js';
import { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { toast } from 'sonner';
import { Input } from '../input';

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    try {
      await signInWithOAuth();
      toast.success('Sign in successful');
    } catch (err) {
      toast.error("Sign in with your Google account, or if you don't have one, try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      {oAuthProviders.map((provider) => (
        <form key={provider.name} className="pb-2" onSubmit={(e) => handleSubmit(e)}>
          <Input type="hidden" name="provider" value={provider.name} />
          <Button variant="slim" type="submit" className="w-full" loading={isSubmitting}>
            <span className="mr-2">{provider.icon}</span>
            <span>{provider.displayName}</span>
          </Button>
        </form>
      ))}
    </div>
  );
};

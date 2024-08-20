'use client';

import { Button } from '@/components/custom';
import { handleRequest } from '@/utils/auth/client';
import { signInWithPassword } from '@/utils/auth/server';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { memo } from 'react';
import { toast } from 'sonner';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export const PasswordSignIn = memo(({ allowEmail, redirectMethod }: PasswordSignInProps) => {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    try {
      await handleRequest(e, signInWithPassword, router);
    } catch (err) {
      toast.error("Sign in with your Google account, or if you don't have one, try again later.");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form noValidate={true} className="mb-4" onSubmit={(e) => handleSubmit(e)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-md"
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-md"
            />
          </div>
          <Button variant="slim" type="submit" className="mt-1" loading={isSubmitting}>
            Sign in
          </Button>
        </div>
      </form>
      <p>
        <Link href="/signin/forgot_password" className="font-light text-sm">
          Forgot your password?
        </Link>
      </p>
      {allowEmail && (
        <p>
          <Link href="/signin/email_signin" className="font-light text-sm">
            Sign in via magic link
          </Link>
        </p>
      )}
      <p>
        <Link href="/signin/signup" className="font-light text-sm">
          Don't have an account? Sign up
        </Link>
      </p>
    </div>
  );
});

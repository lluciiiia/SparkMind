'use client';

import { Button } from '@/components/custom';
import { handleRequest } from '@/utils/auth/client';
import { signInWithEmail } from '@/utils/auth/server';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

// Define prop type with allowPassword boolean
interface EmailSignInProps {
  allowPassword: boolean;
  redirectMethod: string;
  disableButton?: boolean;
}

export const EmailSignIn = ({ allowPassword, redirectMethod, disableButton }: EmailSignInProps) => {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsSubmitting(true); // Disable the button while the request is being handled
      await handleRequest(e, signInWithEmail, router);
    } catch (err) {
      toast.error("Sign in with your Google account, or if you don't have one, try again later.");
    } finally {
      setIsSubmitting(false);
    }
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
          </div>
          <Button
            variant="slim"
            type="submit"
            className="mt-1"
            loading={isSubmitting}
            disabled={disableButton}
          >
            Sign in
          </Button>
        </div>
      </form>
      {allowPassword && (
        <>
          <p>
            <Link href="/signin/password_signin" className="font-light text-sm">
              Sign in with email and password
            </Link>
          </p>
          <p>
            <Link href="/signin/signup" className="font-light text-sm">
              Don't have an account? Sign up
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

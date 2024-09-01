'use client';

import { Button } from '@/components/custom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { handleRequest } from '@/utils/auth/client';
import { signInWithEmail } from '@/utils/auth/server';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Options } from '.';
import { Input } from '../input';
import { Label } from '../label';

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
      await handleRequest(
        e,
        async (formData) => {
          const result = await signInWithEmail(formData);
          return {
            redirectPath: result,
            toastMessage: { type: 'success', message: 'Sign in successful' },
          };
        },
        router,
      );
      toast.success('Sign in successful');
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
            <Label
              htmlFor="email"
              className={`
                font-semibold
              `}
            >
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              name="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              className="w-full p-3 rounded-md bg-[#fafafa] mb-2"
            />
          </div>
          <Button
            variant="default"
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
        <Options allowPassword={allowPassword} allowEmail={true} allowSignup={true} />
      )}
    </div>
  );
};

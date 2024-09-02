'use client';

import { Button } from '@/components/custom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { handleRequest } from '@/utils/auth/client';
import { signInWithPassword } from '@/utils/auth/server';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { memo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Input } from '../input';
import { Label } from '../label';
import { Options } from './Options';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export const PasswordSignIn = memo(({ allowEmail, redirectMethod }: PasswordSignInProps) => {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsSubmitting(true);
      await handleRequest(
        e,
        async (formData) => {
          const result = await signInWithPassword(formData);
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
    <div className="my-4">
      <form noValidate={true} className="mb-4" onSubmit={(e) => handleSubmit(e)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label
              className={`
                font-semibold text-navy
              `}
              htmlFor="email"
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
            <Label
              className={`
                font-semibold text-navy
              `}
              htmlFor="password"
            >
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-md bg-[#fafafa] mb-2"
            />
          </div>
          <Button variant="default" type="submit" className="mt-1 bg-navy" loading={isSubmitting}>
            Sign in
          </Button>
        </div>
      </form>
      <Options
        allowPassword={true}
        allowMagicLink={allowEmail}
        allowForgotPassword={true}
        allowSignup={true}
      />
    </div>
  );
});

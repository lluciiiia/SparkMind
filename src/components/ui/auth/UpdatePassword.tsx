'use client';

import { Button } from '@/components/custom';
import { handleRequest } from '@/utils/auth/client';
import { updatePassword } from '@/utils/auth/server';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';

interface UpdatePasswordProps {
  redirectMethod: string;
}

export const UpdatePassword = ({ redirectMethod }: UpdatePasswordProps) => {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsSubmitting(true); // Disable the button while the request is being handled
      await handleRequest(e, updatePassword, router);
    } catch {
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
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-md"
            />
            <label htmlFor="passwordConfirm">Confirm New Password</label>
            <input
              id="passwordConfirm"
              placeholder="Password"
              type="password"
              name="passwordConfirm"
              autoComplete="current-password"
              className="w-full p-3 rounded-md"
            />
          </div>
          <Button variant="slim" type="submit" className="mt-1" loading={isSubmitting}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
};

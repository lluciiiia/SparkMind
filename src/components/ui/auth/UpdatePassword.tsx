'use client';

import { Button } from '@/components/custom';
import { handleRequest } from '@/utils/auth/client';
import { updatePassword } from '@/utils/auth/server';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '../input';
import { Label } from '../label';

interface UpdatePasswordProps {
  redirectMethod: string;
}

export const UpdatePassword = ({ redirectMethod }: UpdatePasswordProps) => {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setIsSubmitting(true);
      const result = await handleRequest(
        e,
        async (formData) => {
          const result = await updatePassword(formData);
          return {
            redirectPath: result,
            toastMessage: { type: 'success', message: 'Password updated successfully' },
          };
        },
        router,
      );
      if (result && typeof result === 'object' && 'toastMessage' in result) {
        toast.success(
          (result as unknown as { toastMessage: { message: string } }).toastMessage.message,
        );
      }
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
              className={`
                font-semibold
              `}
              htmlFor="password"
            >
              New Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              className="w-full p-3 rounded-md bg-[#fafafa] mb-2"
            />
            <Label
              className={`
                font-semibold
              `}
              htmlFor="passwordConfirm"
            >
              Confirm New Password
            </Label>
            <Input
              id="passwordConfirm"
              placeholder="Password"
              type="password"
              name="passwordConfirm"
              autoComplete="current-password"
              className="w-full p-3 rounded-md bg-[#fafafa] mb-2"
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

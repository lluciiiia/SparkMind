'use client';

import { Button } from '@/components/custom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { handleRequest } from '@/utils/auth/client';
import { requestPasswordUpdate } from '@/utils/auth/server';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Options } from '.';
import { Input } from '../input';
import { Label } from '../label';

// Define prop type with allowEmail boolean
interface ForgotPasswordProps {
  allowEmail: boolean;
  redirectMethod: string;
  disableButton?: boolean;
}

export const ForgotPassword = ({
  allowEmail,
  redirectMethod,
  disableButton,
}: ForgotPasswordProps) => {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    try {
      await handleRequest(
        e,
        async (formData) => {
          const result = await requestPasswordUpdate(formData);
          return {
            redirectPath: result,
            toastMessage: { type: 'success', message: 'Email updated successfully' },
          };
        },
        router,
      );
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
          </div>
          <Button
            variant="default"
            type="submit"
            className="mt-1"
            loading={isSubmitting}
            disabled={disableButton}
          >
            Send Email
          </Button>
        </div>
      </form>
      <Options
        allowEmail={allowEmail}
        allowPassword={true}
        allowMagicLink={true}
        allowSignup={true}
      />
    </div>
  );
};

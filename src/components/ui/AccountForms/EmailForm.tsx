'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { handleRequest } from '@/utils/auth/client';
import { updateEmail } from '@/utils/auth/server';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function EmailForm({ userEmail }: { userEmail: string | undefined }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(userEmail || '');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === userEmail) return;
    setIsSubmitting(true);
    await handleRequest(
      e,
      async (formData) => {
        const result = await updateEmail(formData);
        return {
          redirectPath: result,
          toastMessage: { type: 'success', message: 'Email updated successfully' },
        };
      },
      router,
    );
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Your Email
        </CardTitle>
        <CardDescription>Please enter the email address you want to use to login.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="emailForm" onSubmit={handleSubmit}>
          <Input
            type="email"
            name="newEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            maxLength={64}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">We will email you to verify the change.</p>
        <Button type="submit" form="emailForm" disabled={isSubmitting || email === userEmail}>
          {isSubmitting ? 'Updating...' : 'Update Email'}
        </Button>
      </CardFooter>
    </Card>
  );
}

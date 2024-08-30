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
import { updateName } from '@/utils/auth/server';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NameForm({ userName }: { userName: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(userName);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name === userName) return;
    setIsSubmitting(true);
    await handleRequest(
      e,
      async (formData) => {
        const result = await updateName(formData);
        return {
          redirectPath: result,
          toastMessage: { type: 'success', message: 'Name updated successfully' },
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
          <User className="h-5 w-5" />
          Your Name
        </CardTitle>
        <CardDescription>
          Please enter your full name, or a display name you are comfortable with.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="nameForm" onSubmit={handleSubmit}>
          <Input
            type="text"
            name="fullName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={64}
          />
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">64 characters maximum</p>
        <Button type="submit" form="nameForm" disabled={isSubmitting || name === userName}>
          {isSubmitting ? 'Updating...' : 'Update Name'}
        </Button>
      </CardFooter>
    </Card>
  );
}

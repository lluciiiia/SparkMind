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
import type { Tables } from '@/types/supabase';
import { createStripePortal } from '@/utils/stripe/server';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

type Subscription = Tables<'subscriptions'>;
type Price = Tables<'prices'>;
type Product = Tables<'products'>;

type SubscriptionWithPriceAndProduct = Subscription & {
  prices: (Price & { products: Product | null }) | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export default function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0,
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setIsSubmitting(true);
    const redirectUrl = await createStripePortal(currentPath);
    setIsSubmitting(false);
    router.push(redirectUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Your Plan
        </CardTitle>
        <CardDescription>
          {subscription
            ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
            : 'You are not currently subscribed to any plan.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          {subscription ? (
            `${subscriptionPrice}/${subscription?.prices?.interval}`
          ) : (
            <Link href="/" className="text-primary hover:underline">
              Choose your plan
            </Link>
          )}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-sm text-muted-foreground">Manage your subscription on Stripe.</p>
        <Button onClick={handleStripePortalRequest} disabled={isSubmitting}>
          {isSubmitting ? 'Opening...' : 'Open customer portal'}
        </Button>
      </CardFooter>
    </Card>
  );
}

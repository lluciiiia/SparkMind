'use client';

import type { User } from '@supabase/supabase-js';
import { Check, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { Tables } from '@/types/supabase';
import { getErrorRedirect } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;

interface ProductWithPrices extends Product {
  prices: Price[];
}

interface PriceWithProduct extends Price {
  products: Product | null;
}

interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const intervals = Array.from(
    new Set(products.flatMap((product) => product?.prices?.map((price) => price?.interval))),
  );

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(price, currentPath);

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.',
        ),
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    return (
      <section className="bg-background py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              No subscription pricing plans found
            </h1>
            <p className="max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
              Create them in your{' '}
              <Link
                className="text-primary underline underline-offset-4"
                href="https://dashboard.stripe.com/products"
                rel="noopener noreferrer"
                target="_blank"
              >
                Stripe Dashboard
              </Link>
              .
            </p>
            <Image src="/images/pricing.png" alt="Pricing" width={500} height={500} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
            Pricing Plans
          </h1>
          <p className="max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
            Start building for free, then add a site plan to go live. Account plans unlock
            additional features.
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <Tabs
            value={billingInterval}
            onValueChange={(value) => setBillingInterval(value as BillingInterval)}
          >
            <TabsList>
              {intervals.includes('month') && (
                <TabsTrigger value="month">Monthly billing</TabsTrigger>
              )}
              {intervals.includes('year') && <TabsTrigger value="year">Yearly billing</TabsTrigger>}
            </TabsList>
          </Tabs>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {products.map((product) => {
            const price = product?.prices?.find((price) => price.interval === billingInterval);
            if (!price) return null;
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency!,
              minimumFractionDigits: 0,
            }).format((price?.unit_amount || 0) / 100);
            const isCurrentPlan = subscription
              ? product.name === subscription?.prices?.products?.name
              : product.name === 'Freelancer';

            return (
              <Card key={product.id} className={isCurrentPlan ? 'border-primary' : ''}>
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">{priceString}</span>
                    <span className="ml-1 text-sm text-muted-foreground">/{billingInterval}</span>
                  </div>
                  <ul className="mt-6 space-y-2">
                    {['Feature 1', 'Feature 2', 'Feature 3'].map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    variant={isCurrentPlan ? 'outline' : 'default'}
                    className="w-full"
                    onClick={() => handleStripeCheckout(price)}
                    disabled={priceIdLoading === price.id}
                  >
                    {priceIdLoading === price.id ? (
                      'Loading...'
                    ) : isCurrentPlan ? (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Manage Subscription
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </Button>
                </CardFooter>
                {isCurrentPlan && (
                  <Badge className="absolute top-4 right-4" variant="secondary">
                    Current Plan
                  </Badge>
                )}
              </Card>
            );
          })}
        </div>
        <div className="mt-12 flex justify-center">
          <Image src="/assets/svs/logo.svg" alt="Pricing" width={500} height={500} />
        </div>
      </div>
    </section>
  );
}

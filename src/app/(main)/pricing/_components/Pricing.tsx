'use client';

import type { User } from '@supabase/supabase-js';
import { motion } from 'framer-motion';
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

type BillingInterval = 'month' | 'year';

export default function Pricing({ user, products, subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

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
      <section className="bg-white py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-[#003366]">
              No subscription pricing plans found
            </h1>
            <p className="max-w-[700px] text-zinc-500 md:text-xl">
              Create them in your{' '}
              <Link
                className="text-[#003366] underline underline-offset-4"
                href="https://dashboard.stripe.com/products"
                rel="noopener noreferrer"
                target="_blank"
              >
                Stripe Dashboard
              </Link>
              .
            </p>
            <Image
              src="/assets/images/logo.png"
              alt="Pricing"
              width={500}
              height={500}
              className="mt-5"
            />
          </div>
        </div>
      </section>
    );
  }

  const basicPlan = products.find((p) => p.name === 'Basic AI Learning');
  const proPlan = products.find((p) => p.name === 'Pro AI Learning');

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-[#003366]">
            Pricing Plans
          </h1>
          <p className="max-w-[700px] text-zinc-500 md:text-xl">
            Choose the plan that best fits your AI learning needs.
          </p>
        </motion.div>
        {proPlan && (
          <motion.div
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs
              value={billingInterval}
              onValueChange={(value) => setBillingInterval(value as BillingInterval)}
              className="bg-[#f0f0f0] p-1 rounded-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="month" className="rounded-full">
                  Monthly billing
                </TabsTrigger>
                <TabsTrigger value="year" className="rounded-full">
                  Yearly billing
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
        )}
        <motion.div
          className="mt-12 grid gap-8 lg:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[basicPlan, proPlan].map((product, index) => {
            if (!product) return null;
            const price =
              product.name === 'Pro AI Learning'
                ? product.prices.find((price) => price.interval === billingInterval)
                : product.prices[0]; // For Basic plan, use the only price (which should be free)
            if (!price) return null;
            const priceString =
              price.unit_amount === 0
                ? 'Free'
                : new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: price.currency!,
                    minimumFractionDigits: 0,
                  }).format((price.unit_amount || 0) / 100);
            const isCurrentPlan = subscription
              ? product.name === subscription?.prices?.products?.name
              : product.name === 'Basic AI Learning';

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
              >
                <Card
                  className={`overflow-hidden ${isCurrentPlan ? 'border-[#003366] border-2' : 'border-gray-200'}`}
                >
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#003366]">
                      {product.name}
                    </CardTitle>
                    <CardDescription className="text-zinc-500">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-[#003366]">{priceString}</span>
                      {price.unit_amount !== 0 && (
                        <span className="ml-1 text-xl text-zinc-500">/{billingInterval}</span>
                      )}
                    </div>
                    <ul className="mt-6 space-y-4 text-left">
                      {product.name === 'Basic AI Learning' ? (
                        <>
                          <li className="flex items-center">
                            <Check className="mr-2 h-5 w-5 text-[#003366]" />
                            <span>Access to core AI-powered learning features</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-5 w-5 text-[#003366]" />
                            <span>Basic learning analytics</span>
                          </li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-center">
                            <Check className="mr-2 h-5 w-5 text-[#003366]" />
                            <span>All features from Basic plan</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-5 w-5 text-[#003366]" />
                            <span>Advanced AI-powered learning</span>
                          </li>
                          <li className="flex items-center">
                            <Check className="mr-2 h-5 w-5 text-[#003366]" />
                            <span>Personalized insights</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant={isCurrentPlan ? 'outline' : 'default'}
                      className={`w-full ${isCurrentPlan ? 'bg-white text-[#003366] border-[#003366]' : 'bg-[#003366] text-white'} hover:opacity-90`}
                      onClick={() =>
                        product.name === 'Basic AI Learning'
                          ? router.push('/dashboard')
                          : handleStripeCheckout(price)
                      }
                      disabled={priceIdLoading === price.id}
                    >
                      {priceIdLoading === price.id ? (
                        'Loading...'
                      ) : isCurrentPlan ? (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          Manage Subscription
                        </>
                      ) : product.name === 'Basic AI Learning' ? (
                        'Get Started'
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </CardFooter>
                  {isCurrentPlan && (
                    <Badge className="absolute top-4 right-4 bg-[#003366] text-white">
                      Current Plan
                    </Badge>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

import { getProducts, getSubscription, getUser } from '@/utils/supabase/queries';
import { createClient } from '@/utils/supabase/server';
import React from 'react';

import Pricing from './_components/Pricing';
export default async function PricingPage() {
  const supabase = createClient();
  const [user, products, subscription] = await Promise.all([
    getUser(supabase),
    getProducts(supabase),
    getSubscription(supabase),
  ]);

  return <Pricing user={user} products={products ?? []} subscription={subscription} />;
}

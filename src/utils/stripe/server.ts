'use server';

import type { Tables } from '@/types/supabase';
import { calculateTrialEndUnixTimestamp, getErrorRedirect, getURL } from '@/utils/helpers';
import { stripe } from '@/utils/stripe/config';
import { createOrRetrieveCustomer } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

type Price = Tables<'prices'>;

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

export async function checkoutWithStripe(
  price: Price,
  currentPath: string,
): Promise<CheckoutResponse> {
  try {
    const productId = price.product_id;

    if (!productId) {
      throw new Error('No product ID found');
    }

    const stripePrices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 1,
    });

    if (stripePrices.data.length === 0) {
      throw new Error('No active price found for the product');
    }

    const stripePrice = stripePrices.data[0];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePrice.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      cancel_url: getURL(),
      success_url: getURL('/account'),
    });

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    return {
      errorRedirect: getErrorRedirect(
        currentPath,
        'Unable to create checkout session.',
        'Please try again later or contact support.',
      ),
    };
  }
}

export async function createStripePortal(currentPath: string) {
  try {
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error('Could not get user session.');
    }

    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || '',
        email: user.email || '',
      });
    } catch (err) {
      console.error(err);
      throw new Error('Unable to access customer record.');
    }

    if (!customer) {
      throw new Error('Could not get customer.');
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL('/account'),
      });
      if (!url) {
        throw new Error('Could not create billing portal');
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error('Could not create billing portal');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        currentPath,
        error.message,
        'Please try again later or contact a system administrator.',
      );
    } else {
      return getErrorRedirect(
        currentPath,
        'An unknown error occurred.',
        'Please try again later or contact a system administrator.',
      );
    }
  }
}

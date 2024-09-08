import { type Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE;
    if (!key) {
      console.error('Stripe publishable key is not set');
      return null;
    }

    stripePromise = loadStripe(key);
  }

  return stripePromise;
};

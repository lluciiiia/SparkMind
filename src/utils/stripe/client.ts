import { type Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      process.env.STRIPE_PUBLISHABLE_KEY_LIVE ??
        process.env.STRIPE_PUBLISHABLE_KEY ??
        '',
    );
  }

  return stripePromise;
};

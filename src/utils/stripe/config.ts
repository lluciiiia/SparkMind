import Stripe from 'stripe';

const stripeSecretKey =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY_LIVE
    : process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY_TEST;

if (!stripeSecretKey) {
  throw new Error('Stripe secret key is not set');
}

export const stripe = new Stripe(stripeSecretKey, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2024-06-20', // Use the latest API version or the one you prefer
  // Register this as an official Stripe plugin.
  // https://stripe.com/docs/building-plugins#setappinfo
  appInfo: {
    name: 'SparkMind',
    version: '1.0.0',
    url: 'https://sparkmind.vercel.app',
  },
});

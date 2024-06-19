import Stripe from 'stripe';

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? '',
  {
    // https://github.com/stripe/stripe-node#configuration
    // https://stripe.com/docs/api/versioning
    // @ts-ignore
    apiVersion: null,
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: 'SparkMind',
      version: '0.0.0',
<<<<<<< HEAD
      url: 'https://google-gemini-competition.vercel.app',
    },
  },
=======
      url: 'https://github.com/vercel/nextjs-subscription-payments',
    },
  }
>>>>>>> 54091cb (chore: linting, and slight modifications)
);

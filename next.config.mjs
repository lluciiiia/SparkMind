import pwa from '@ducanh2912/next-pwa';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const withPwa = pwa({
  dest: 'public',
  disable: false, // Change this to false to enable PWA in all environments
  register: true,
  skipWaiting: true,
  sw: '/sw.js',
  publicExcludes: ['!noprecache/**/*'],
  buildExcludes: [/middleware-manifest\.json$/],
});
/**
 * @type {import("next/dist/server/config").NextConfig}
 */
const config = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'sparkmind.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
    ]
  },
  experimental: {
    esmExternals: 'loose',
    optimizeCss: {
      preload: true,
    },
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  async headers() {
    return [
      {
        source: '/api/v1/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'https://sparkmind.vercel.app' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,DELETE,PATCH,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
      {
        source: '/(.*).png',
        headers: [
          {
            key: 'Content-Type',
            value: 'image/png',
          },
        ],
      },
    ];
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /node_modules\/fluent-ffmpeg/,
      use: 'null-loader',
    });
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            name: 'static/media/[name].[hash].[ext]',
          },
        },
      ],
    });
    return config;
  },
  publicRuntimeConfig: {
    basePath: '',
  },
};

const millionConfig = {
  auto: true,
};

const finalConfig = withPwa(config);

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withSentryConfig(withBundleAnalyzerConfig(finalConfig), {
  org: 'womb0comb0',
  project: 'spark-mind',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});

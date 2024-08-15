import pwa from '@ducanh2912/next-pwa';
import { withSentryConfig } from '@sentry/nextjs';
import webpack from 'webpack';
import withBundleAnalyzer from '@next/bundle-analyzer';

const withPwa = pwa({
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  dest: 'public',
  register: true,
  sw: 'service-worker.js',
  workboxOptions: {
    disableDevLogs: true,
  },
});

/**
 * @type {import("next/dist/server/config").NextConfig}
 */
const config = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        worker_threads: false,
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
          Buffer: ["buffer", "Buffer"],
        }),
        new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
          const mod = resource.request.replace(/^node:/, "");
          switch (mod) {
            case "buffer":
              resource.request = "buffer";
              break;
            case "stream":
              resource.request = "readable-stream";
              break;
            default:
              throw new Error(`Module not found: ${mod}`);
          }
        })
      );
    }

    return config;
  },
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
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
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
          { key: 'Access-Control-Allow-Origin', value: '*' },
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
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        source: "/static/:all*",
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=9999999999, must-revalidate',
          }
        ],
      },
    ];
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
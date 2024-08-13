import pwa from '@ducanh2912/next-pwa';
import { withSentryConfig } from '@sentry/nextjs';
import webpack from "webpack";
// import MillionLint from "@million/lint";
// import million from "million/compiler";

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
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        os: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        'diagnostics_channel': false,
        'async_hooks': false,
      };
    }

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
            throw new Error(`Not found ${mod}`);
        }
      })
    );
    return config;
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
    ];
  },
};

const millionConfig = {
  auto: true,
};

const finalConfig = withPwa(config);

export default withSentryConfig(finalConfig, {
  org: 'womb0comb0',
  project: 'spark-mind',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
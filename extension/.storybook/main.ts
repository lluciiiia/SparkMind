import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  docs: {
    autodocs: true,
  },
  viteFinal: (config) => {
    config.optimizeDeps = {
      ...config.optimizeDeps,
      exclude: ['webextension-polyfill'],
    };
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'webextension-polyfill': require.resolve('../src/__mocks__/webextension-polyfill.ts'),
      };
    }
    return config;
  },
};
export default config;

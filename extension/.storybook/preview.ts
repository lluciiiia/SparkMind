import type { Preview } from '@storybook/react';
import { setProjectAnnotations } from '@storybook/react';
import config from './main.ts';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

setProjectAnnotations(config as any);

export default preview;

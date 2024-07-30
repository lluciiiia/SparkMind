import type { Meta } from '@storybook/react';
import * as React from 'react';
import { Hello } from '../component';

// // // //

export default {
  title: 'Components/Hello',
  component: Hello,
} as Meta<typeof Hello>;

export const Render = () => <Hello />;

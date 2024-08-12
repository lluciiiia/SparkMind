import type { Meta } from '@storybook/react';
import * as React from 'react';
import { Popup } from '../component';

// // // //

export default {
  title: 'Components/Popup',
  component: Popup,
} as Meta<typeof Popup>;

export const Render = () => <Popup />;

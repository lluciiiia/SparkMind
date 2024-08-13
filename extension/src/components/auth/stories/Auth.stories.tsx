import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import Auth from '../component';

const meta: Meta<typeof Auth> = {
  title: 'Components/Auth',
  component: Auth,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSignIn: { action: 'onSignIn' },
    onScreenChange: { action: 'onScreenChange' },
    title: { control: 'text' },
    helpText: { control: 'text' },
    error: { control: 'text' },
  },
  args: {
    title: 'Sign In',
    helpText: 'Please enter your credentials',
    error: '',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSignIn: (email: string, password: string): void => {},
    onScreenChange: () => {
      console.log('Screen Change');
    },
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    error: 'Invalid credentials',
  },
};

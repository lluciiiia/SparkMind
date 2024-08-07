import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Scraper } from '../component';

const meta = {
  title: 'Components/Scraper',
  component: Scraper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    //
  },
  args: {
    scraper: {
      id: '1',
      url: 'https://example.com',
      startedAt: new Date(),
      finishedAt: new Date(),
      status: 'pending',
    },
  },
} satisfies Meta<typeof Scraper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    scraper: {
      id: '1',
      url: 'https://example.com',
      startedAt: new Date(),
      finishedAt: new Date(),
      status: 'pending',
    },
  },
};

export const Secondary: Story = {
  args: {
    scraper: {
      id: '2',
      url: 'https://example.com',
      startedAt: new Date(),
      finishedAt: new Date(),
      status: 'done',
    },
  },
};

export const Large: Story = {
  args: {
    scraper: {
      id: '3',
      url: 'https://example.com',
      startedAt: new Date(),
      finishedAt: new Date(),
      status: 'error',
    },
  },
};

export const Small: Story = {
  args: {
    scraper: {
      id: '4',
      url: 'https://example.com',
      startedAt: new Date(),
      finishedAt: new Date(),
      status: 'pending',
    },
  },
};

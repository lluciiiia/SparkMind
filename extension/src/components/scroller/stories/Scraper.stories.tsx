import { action } from '@storybook/addon-actions';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/test';
import * as React from 'react';
import { Scraper } from '../component';

// // // //

export default {
  title: 'Components/Scraper',
  component: Scraper,
  args: {
    onClickScrollTop: action('click-scroll-top'),
    onClickScrollBottom: action('click-scroll-bottom'),
  },
} as ComponentMeta<typeof Scraper>;

const Template: ComponentStory<typeof Scraper> = (args) => <Scraper {...args} />;

// // // //

export const Render = Template.bind({});

export const ScrollTop = Template.bind({});
ScrollTop.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByTestId('scroll-to-top'));
};

export const ScrollBottom = Template.bind({});
ScrollBottom.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByTestId('scroll-to-bottom'));
};

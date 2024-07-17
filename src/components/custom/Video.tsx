'use client';

import { cn } from '@/lib';
import { cva } from 'class-variance-authority';
import * as React from 'react';

type VideoProps = React.ComponentPropsWithoutRef<'video'> & {
  variant?: 'primary' | 'secondary';
};

export const CustomVideo = React.forwardRef<HTMLElement, VideoProps>(
  ({ className, children, style, variant, ...props }, ref) => {
    const srcSet = getSrcFromChildImage(children);
    return (
      <video
        className={cn(VideoVariants({ variant }), className)}
        ref={ref as React.LegacyRef<HTMLVideoElement>}
        style={style}
        {...props}
      >
        {children}
        <source srcSet={srcSet} type="video/mp4" />
      </video>
    );
  },
);

const VideoVariants = cva('overflow-hidden', {
  variants: {
    variant: {
      primary: 'rounded-lg overflow-hidden',
      secondary: 'rounded-md overflow-hidden',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

CustomVideo.displayName = 'Video';

const getSrcFromChildImage = (children: React.ReactNode): string | undefined => {
  let src: string | undefined;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === 'video' && child.props.src) {
      src = child.props.src;
    }
  });

  return src;
};

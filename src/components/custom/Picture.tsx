'use client';

import { cn } from '@/lib';
import { cva } from 'class-variance-authority';
import * as React from 'react';

type PictureProps = React.ComponentPropsWithoutRef<'picture'> & {
  variant?: 'primary' | 'secondary';
};

export const CustomPicture = React.forwardRef<HTMLElement, PictureProps>(
  ({ className, children, style, variant, ...props }, ref) => {
    const srcSet = getSrcFromChildImage(children);
    return (
      <picture
        className={cn(PictureVariants({ variant }), className)}
        ref={ref as React.LegacyRef<HTMLElement>}
        style={style}
        {...props}
      >
        {children}
        <source srcSet={srcSet} type="image/png" />
      </picture>
    );
  },
);

const PictureVariants = cva('overflow-hidden', {
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

CustomPicture.displayName = 'Picture';

const getSrcFromChildImage = (children: React.ReactNode): string | undefined => {
  let src: string | undefined;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === 'img' && child.props.src) {
      src = child.props.src;
    }
  });

  return src;
};

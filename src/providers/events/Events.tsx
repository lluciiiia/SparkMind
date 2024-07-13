'use client';

import { Toaster } from '@/components/ui/sonner';
import type React from 'react';

export const Events: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
};

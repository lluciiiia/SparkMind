'use client';
import type React from 'react';
import { Toaster } from 'sonner';

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

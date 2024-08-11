'use client';
import { Toaster } from 'sonner';
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

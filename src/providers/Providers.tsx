'use client';
// import { TRPCReactProvider } from '@/trpc/react';
import type { JSXElementConstructor, ReactNode } from 'react';
import { Events, ThemeProvider } from '.';

export const Providers: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  return (
    <>
      <ProviderStack
        providers={[
          [
            ThemeProvider,
            {
              attribute: 'class',
              defaultTheme: 'light',
              enableSystem: true,
            },
          ],
          // [TRPCReactProvider, {}],
          [Events, {}],
        ]}
      >
        {children}
      </ProviderStack>
    </>
  );
};

type NoInfer<T> = [T][T extends any ? 0 : 1];

type ContainsChildren = {
  children?: React.ReactNode;
};

function ProviderStack<Providers extends [ContainsChildren, ...ContainsChildren[]]>({
  providers,
  children,
}: {
  providers: {
    [k in keyof Providers]: [
      JSXElementConstructor<Providers[k]>,
      Omit<NoInfer<Providers[k]>, 'children'>,
    ];
  };
  children: ReactNode;
}) {
  let node = children;

  for (const [Provider, props] of providers) {
    node = <Provider {...props}>{node}</Provider>;
  }

  return node;
}

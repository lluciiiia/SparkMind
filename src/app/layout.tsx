import '@/styles/css/globals.css';
import { Providers } from '@/providers';
import { constructMetadata, constructViewport } from '@/utils';
import { Poppins } from '@next/font/google';
import type { NextWebVitalsMetric } from 'next/app';

const poppins = Poppins({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-poppins',
});

export const metadata = constructMetadata();
export const viewport = constructViewport();
export const reportWebVitals = (metric: NextWebVitalsMetric) => {
  if (metric.label === 'web-vital') {
    console.log(metric);
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-a11y-animated-images="system"
      data-a11y-link-underlines="false"
      data-turbo-loaded
    >
      <body className={`${poppins.variable} font-sans bg-background overflow-hidden`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

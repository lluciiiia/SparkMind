import '@/styles/css/globals.css';
import { Providers } from '@/providers';
import { constructMetadata, constructViewport } from '@/utils';
import type { NextWebVitalsMetric } from 'next/app';
import Script from "next/script";

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
      <head>
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=G-M4JFD2DM29`}
        />

        <Script strategy="lazyOnload" id="ga">
          {`
            window.ga_user_id = window.localStorage.getItem('ga_user_id') || '' + Date.now() + Math.floor(Math.random()*1e4);
          window.localStorage.setItem('ga_user_id', window.ga_user_id);
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-M4JFD2DM29', {
            page_path: window.location.pathname,
            user_id: window.ga_user_id
          });
        `}
        </Script>
        <Script> 
          {`
            if (!crossOriginIsolated) {
              SharedArrayBuffer = ArrayBuffer
            } 
          `}
        </Script>
      </head>
      <body className={`bg-background overflow-hidden`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

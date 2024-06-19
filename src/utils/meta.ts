import { app } from '@/constants';
import type { Metadata, Viewport } from 'next';

export function constructMetadata({
<<<<<<< HEAD
  title = `${app.name}`,
  description = `${app.description}`,
=======
  title = 'SparkMind',
  description = `Hello, I am a description.`,
>>>>>>> 54091cb (chore: linting, and slight modifications)
  image = '/opengraph-image.png',
  icons = '/assets/svgs/logo.svg',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `${title} - %s`,
    },
    description: description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@SparkMind',
    },
    icons: [
      {
        url: icons,
        href: icons,
      },
    ],
    manifest: '/manifest.webmanifest',
    metadataBase: new URL(app.url),
    other: {
      currentYear: new Date().getFullYear(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export function constructViewport(): Viewport {
  return {
    width: 'device-width',
    height: 'device-height',
    initialScale: 1,
    minimumScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
    interactiveWidget: 'resizes-visual',
    themeColor: [
<<<<<<< HEAD
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#0257AC' },
=======
      { media: '(prefers-color-scheme: light)', color: '#f5f5f5' },
      { media: '(prefers-color-scheme: dark)', color: '#313131' },
>>>>>>> 54091cb (chore: linting, and slight modifications)
    ],
    colorScheme: 'dark light',
  };
}

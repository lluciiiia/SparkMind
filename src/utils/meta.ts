import { app } from '@/constants';
import type { Metadata, Viewport } from 'next';

export function constructMetadata({
  title = 'WaffleHacks',
  description = `WaffleHacks is a 48-hour student-organized hackathon working to bring technical solutions to your local communities and small businesses.We welcome all students, of high school level and beyond, and of all technical proficiency levels, to join us on June 21th - 23th, 2023.`,
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
      creator: '@WaffleHacks',
    },
    icons: [
      {
        url: icons,
        href: icons,
      },
    ],
    manifest: '/manifest.webmanifest',
    metadataBase: new URL(`${app.url}`),
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
      { media: '(prefers-color-scheme: light)', color: '#fafafa' },
      { media: '(prefers-color-scheme: dark)', color: '#3c2415' },
    ],
    colorScheme: 'dark light',
  };
}

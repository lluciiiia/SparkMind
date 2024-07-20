if (!self.define) {
  let e,
    s = {};
  const a = (a, i) => (
    (a = new URL(a + '.js', i).href),
    s[a] ||
      new Promise((s) => {
        if ('document' in self) {
          const e = document.createElement('script');
          (e.src = a), (e.onload = s), document.head.appendChild(e);
        } else (e = a), importScripts(a), s();
      }).then(() => {
        let e = s[a];
        if (!e) throw new Error(`Module ${a} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, n) => {
    const t = e || ('document' in self ? document.currentScript.src : '') || location.href;
    if (s[t]) return;
    let c = {};
    const r = (e) => a(e, t),
      u = { module: { uri: t }, exports: c, require: r };
    s[t] = Promise.all(i.map((e) => u[e] || r(e))).then((e) => (n(...e), c));
  };
}
define(['./workbox-f1770938'], function (e) {
  'use strict';
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: '/_next/static/chunks/0e5ce63c-8c3e4735681630dc.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        { url: '/_next/static/chunks/120-bfb583813d187b62.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/178-74c47d308a7de59e.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/183-f915159576b79a7c.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/25-646b92244a9b09b3.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/252-0c4bedce2df1a843.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/35.03ae917f238a8966.js', revision: '03ae917f238a8966' },
        { url: '/_next/static/chunks/370-7826fb7d651b10ad.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/376-436590f9fe4baa80.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/382-af21ed8249e24cc5.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/433-b0c945ce89e9bb3f.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/457-e73b847459f2d40f.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/498-ff541c9c59da0968.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/510-1070299dcd3b7484.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/630-b599dfb3bf896a7e.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/713-694a8df39f2983f6.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        {
          url: '/_next/static/chunks/8e1d74a4-b9e24d51ce69d762.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        { url: '/_next/static/chunks/968-c8025405b73e0207.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        { url: '/_next/static/chunks/976-a7a5e5bb1c10e7b0.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        {
          url: '/_next/static/chunks/app/(auth)/auth/error/page-01db2b07073d081a.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/(auth)/signin/%5Bid%5D/page-63e8b3787f07944c.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/(auth)/signin/page-2a4914229d2f9956.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/(dashboard)/account/page-18ca4396dbb25646.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/(dashboard)/createmeet/page-091ebe94a2df674b.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/(dashboard)/dashboard/page-7337e1ce8aea2372.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/(dashboard)/layout-a3a78bc04fde999c.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/(dashboard)/myresources/page-7886ad912ae2896a.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/(dashboard)/uploadscreen/page-a368bee3e40a2b2e.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/(dashboard)/users/page-b72d1c3b3aa95e7a.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/(main)/pricing/page-dc3e3e5c09ddd0e9.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/_not-found/page-c986386c6fcfa35d.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/error-b0c4debe84b80560.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/global-error-cfc40818a9cb68ad.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/layout-92e2328b044be82e.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/loading-67cd9990a08a5598.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/not-found-74dff60a36becfd6.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/app/page-85e4dbbe313efaf4.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/f97e080b-1d32bcfae77fd0aa.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/fd9d1056-575a4769a7d03dba.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/framework-f66176bb897dc684.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        { url: '/_next/static/chunks/main-56a9b247cea10ddf.js', revision: 'iHXg8VevGyZv0SlKYMxxu' },
        {
          url: '/_next/static/chunks/main-app-d67cc69240b7592f.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/pages/_app-6a626577ffa902a4.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/pages/_error-1be831200e60c5c0.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        {
          url: '/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js',
          revision: '79330112775102f91e1010318bae2bd3',
        },
        {
          url: '/_next/static/chunks/webpack-6ae6533ca4912458.js',
          revision: 'iHXg8VevGyZv0SlKYMxxu',
        },
        { url: '/_next/static/css/2aae553dba08cf97.css', revision: '2aae553dba08cf97' },
        { url: '/_next/static/css/751c7278d9c0520a.css', revision: '751c7278d9c0520a' },
        {
          url: '/_next/static/iHXg8VevGyZv0SlKYMxxu/_buildManifest.js',
          revision: '2ec694eb52ae4f523f265a46bae4d768',
        },
        {
          url: '/_next/static/iHXg8VevGyZv0SlKYMxxu/_ssgManifest.js',
          revision: 'b6652df95db52feb4daf4eca35380933',
        },
        {
          url: '/_next/static/media/e11418ac562b8ac1-s.p.woff2',
          revision: '0e46e732cced180e3a2c7285100f27d4',
        },
        { url: '/assets/videos/videoplayback.mp4', revision: '6c8c7aa1ddea97bea9e4b96d0c57e076' },
        { url: '/icon/search.png', revision: 'e9612850a6cb55eb547266043e1eef86' },
        { url: '/swe-worker-5c72df51bb1f6ee0.js', revision: '5a47d90db13bb1309b25bdf7b363570e' },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      '/',
      new e.NetworkFirst({
        cacheName: 'start-url',
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && 'opaqueredirect' === e.type
                ? new Response(e.body, { status: 200, statusText: 'OK', headers: e.headers })
                : e,
          },
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: 'google-fonts-webfonts',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: 'google-fonts-stylesheets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: 'next-static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-image',
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: 'static-audio-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: 'static-video-assets',
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: 'next-data',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith('/api/auth/callback') || !s.startsWith('/api/')),
      new e.NetworkFirst({
        cacheName: 'apis',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        '1' === e.headers.get('RSC') &&
        '1' === e.headers.get('Next-Router-Prefetch') &&
        a &&
        !s.startsWith('/api/'),
      new e.NetworkFirst({
        cacheName: 'pages-rsc-prefetch',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: a }) =>
        '1' === e.headers.get('RSC') && a && !s.startsWith('/api/'),
      new e.NetworkFirst({
        cacheName: 'pages-rsc',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith('/api/'),
      new e.NetworkFirst({
        cacheName: 'pages',
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      'GET',
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: 'cross-origin',
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      'GET',
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0);
});

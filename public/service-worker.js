if (!self.define) {
  let e,
    s = {};
  const t = (t, i) => (
    (t = new URL(t + ".js", i).href),
    s[t] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = t), (e.onload = s), document.head.appendChild(e);
        } else (e = t), importScripts(t), s();
      }).then(() => {
        let e = s[t];
        if (!e) throw new Error(`Module ${t} didn’t register its module`);
        return e;
      })
  );
  self.define = (i, a) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[n]) return;
    let c = {};
    const r = (e) => t(e, n),
      o = { module: { uri: n }, exports: c, require: r };
    s[n] = Promise.all(i.map((e) => o[e] || r(e))).then((e) => (a(...e), c));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/chunks/0e5ce63c-8c3e4735681630dc.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/149-1def318ea83960b0.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/178-c9334d758ea08b17.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/25-307a309143cf0f87.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/252-0c4bedce2df1a843.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/35.03ae917f238a8966.js",
          revision: "03ae917f238a8966",
        },
        {
          url: "/_next/static/chunks/370-7826fb7d651b10ad.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/376-436590f9fe4baa80.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/382-af21ed8249e24cc5.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/419-955191e170fc7e9e.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/433-b0c945ce89e9bb3f.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/437-73b5e9b9083d67be.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/457-e73b847459f2d40f.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/510-1070299dcd3b7484.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/630-a6f78809fd4269e9.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/811-fa6bd50ee21b39e8.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/8e1d74a4-b9e24d51ce69d762.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/968-c8025405b73e0207.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/976-eb3bd7b623ff9718.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(auth)/auth/error/page-01db2b07073d081a.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(auth)/signin/%5Bid%5D/page-89e544dd0bf30e92.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(auth)/signin/page-2a4914229d2f9956.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/account/page-360d037bc8610ada.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/createmeet/page-34b5ec6dacb4d21b.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/dashboard/page-d948e7d4925634ec.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/layout-54447817bae9b162.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/myresources/page-20637ab5cf9e9e17.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/new/page-7e448e563359b4d8.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/uploadscreen/page-c2909e140f7a58b8.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(dashboard)/users/page-978d76becb783a6c.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/(main)/pricing/page-59bc565cfe7219a9.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-c986386c6fcfa35d.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/error-ca7be43c949e74d9.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/global-error-d804889e7406d3b9.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/layout-4457b79baa0e319c.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/loading-97abb82cc89d8292.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/not-found-d9b02dc3bd4094fd.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/app/page-4bd1bb7155399387.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/f97e080b-1d32bcfae77fd0aa.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/fd9d1056-575a4769a7d03dba.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/framework-f66176bb897dc684.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/main-app-b50c5ab760e728f1.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/main-f73477c2c85c202b.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/pages/_app-6a626577ffa902a4.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/pages/_error-1be831200e60c5c0.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",
          revision: "79330112775102f91e1010318bae2bd3",
        },
        {
          url: "/_next/static/chunks/webpack-27e3672aaac61b09.js",
          revision: "imHUT2et71xwbgopNHQ94",
        },
        {
          url: "/_next/static/css/54b98176df9d8cc0.css",
          revision: "54b98176df9d8cc0",
        },
        {
          url: "/_next/static/css/55d9bb8f2358f2be.css",
          revision: "55d9bb8f2358f2be",
        },
        {
          url: "/_next/static/css/60c319a0d346621e.css",
          revision: "60c319a0d346621e",
        },
        {
          url: "/_next/static/css/751c7278d9c0520a.css",
          revision: "751c7278d9c0520a",
        },
        {
          url: "/_next/static/imHUT2et71xwbgopNHQ94/_buildManifest.js",
          revision: "2ec694eb52ae4f523f265a46bae4d768",
        },
        {
          url: "/_next/static/imHUT2et71xwbgopNHQ94/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/media/e11418ac562b8ac1-s.p.woff2",
          revision: "0e46e732cced180e3a2c7285100f27d4",
        },
        {
          url: "/assets/svgs/new-input-icon.jsx",
          revision: "82941b8e076a640286aa51ffefc40821",
        },
        {
          url: "/assets/videos/videoplayback.mp4",
          revision: "6c8c7aa1ddea97bea9e4b96d0c57e076",
        },
        {
          url: "/icon/search.png",
          revision: "e9612850a6cb55eb547266043e1eef86",
        },
        {
          url: "/swe-worker-5c72df51bb1f6ee0.js",
          revision: "5a47d90db13bb1309b25bdf7b363570e",
        },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] },
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ response: e }) =>
              e && "opaqueredirect" === e.type
                ? new Response(e.body, {
                    status: 200,
                    statusText: "OK",
                    headers: e.headers,
                  })
                : e,
          },
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e, url: { pathname: s } }) =>
        !(!e || s.startsWith("/api/auth/callback") || !s.startsWith("/api/")),
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: t }) =>
        "1" === e.headers.get("RSC") &&
        "1" === e.headers.get("Next-Router-Prefetch") &&
        t &&
        !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ request: e, url: { pathname: s }, sameOrigin: t }) =>
        "1" === e.headers.get("RSC") && t && !s.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ url: { pathname: e }, sameOrigin: s }) => s && !e.startsWith("/api/"),
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET",
    ),
    e.registerRoute(
      ({ sameOrigin: e }) => !e,
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET",
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0);
});

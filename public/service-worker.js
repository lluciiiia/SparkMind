if(!self.define){let e,s={};const i=(i,a)=>(i=new URL(i+".js",a).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(a,n)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>i(e,t),u={module:{uri:t},exports:c,require:r};s[t]=Promise.all(a.map((e=>u[e]||r(e)))).then((e=>(n(...e),c)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/9NDTukGYGPi9B35_QSRA8/_buildManifest.js",revision:"cca026661e41be30cd398761aac4466b"},{url:"/_next/static/9NDTukGYGPi9B35_QSRA8/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0e5ce63c-e395be7a436d41dc.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/178-01418f5f61d8853b.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/183-720becff0db98f1f.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/212-7787f434ec8640c3.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/35.0f9cef94d996633e.js",revision:"0f9cef94d996633e"},{url:"/_next/static/chunks/379-a6a7df8a0cc783ef.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/483-a4b30bb35958c48c.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/498-e3b65ba76735ab0f.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/510-a60550a5427cde4f.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/52774a7f-5c261ea03df3630b.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/561-0ed14623995b59e4.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/630-ad098b2f2ae86619.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/631-5acd79a5a6f1bcb5.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/715-b320949e143bf3de.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/8e1d74a4-c94736fe5475f261.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/976-69ca9d92be7d87cb.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/(auth)/auth/error/page-87d1534e0b33a154.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/(auth)/signin/%5Bid%5D/page-9604f9d579a0d411.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/(auth)/signin/page-c654e0f6d5b66db4.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/(dashboard)/account/page-b89eda7f891c0c33.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/(dashboard)/createmeet/page-149a10c2b9dab1de.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/page-3dc231e5da5fee91.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/(dashboard)/layout-2664fdea40171033.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/(dashboard)/uploadscreen/page-5d0cc48cc9b41395.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/(dashboard)/users/page-b63fdf7de8736630.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/(main)/pricing/page-042860c51863d40b.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/_not-found/page-cf0fab8bde144fea.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/global-error-3f9cb612c3aa1d3c.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/layout-00950622644f47ec.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/loading-5e38ac9e8f3c9643.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/not-found-8525bce02f876947.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/app/page-e9f667ef332012f2.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/f97e080b-df463778d64acc98.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/fd9d1056-1f687727aadb0f2f.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/framework-332f134768e2321c.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/main-2accc860cc93d980.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/main-app-6705fcadbebca560.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/pages/_app-9b22569c75569e7b.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/pages/_error-4e67edb43300d372.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-b2c7fb8746e548e7.js",revision:"9NDTukGYGPi9B35_QSRA8"},{url:"/_next/static/css/728a50219c496ab6.css",revision:"728a50219c496ab6"},{url:"/_next/static/css/b0a40a8b6ff71752.css",revision:"b0a40a8b6ff71752"},{url:"/_next/static/media/e11418ac562b8ac1-s.p.woff2",revision:"0e46e732cced180e3a2c7285100f27d4"},{url:"/assets/videos/videoplayback.mp4",revision:"6c8c7aa1ddea97bea9e4b96d0c57e076"},{url:"/icon/search.png",revision:"e9612850a6cb55eb547266043e1eef86"},{url:"/swe-worker-5c72df51bb1f6ee0.js",revision:"62f420591f4a7095e1401afe4a9b3895"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:i})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&i&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:i})=>"1"===e.headers.get("RSC")&&i&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));
//# sourceMappingURL=service-worker.js.map

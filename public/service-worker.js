if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,t)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let c={};const r=e=>n(e,i),d={module:{uri:i},exports:c,require:r};s[i]=Promise.all(a.map((e=>d[e]||r(e)))).then((e=>(t(...e),c)))}}define(["./workbox-f1770938"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/0e5ce63c-115b64a197701e41.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/1976-267b3c7616519731.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/2149-59216f175825e074.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/2183-eaeb4e460c4824c3.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/4025-b657ddfe193ceea7.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/5178-81eab37da90c1e66.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/5543-a767cd063d0f5530.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/6210-20a074d3551050fc.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/6433-2a24e583e1eef903.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/6630-c034ce57e1892b41.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/6648-72ee93e03f825604.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/7035.cb726032edead13d.js",revision:"cb726032edead13d"},{url:"/_next/static/chunks/750-aa14b367455607e5.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/7510-b7d0d6c7db81f454.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/7776-c0b791ded4b7bec8.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/8472-e4561d44a3fc0674.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/8e1d74a4-c339a204db0dd155.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/9003-58f55d22e1b06ed2.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/9126-4393b925b53aaecb.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/9376-a32533ee50a97c70.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/9865-8d10d154939c2823.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/aaea2bcf-c7ee2359f9f99c29.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(auth)/auth/error/page-80776b284a127995.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(auth)/signin/%5Bid%5D/page-f85229dfb6737703.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(auth)/signin/page-760e4fa74cd963b8.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(dashboard)/(reupload)/allresources/page-f377feb1fc7daad6.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(dashboard)/(reupload)/keywordsupload/page-10194db62f0006d8.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(dashboard)/(reupload)/textupload/page-a3496a59ce886018.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(dashboard)/(reupload)/videoupload/page-9372188a98dd06fd.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(dashboard)/account/page-08e7c29f6ccc4d4e.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(dashboard)/createmeet/page-362a165c51a79625.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(dashboard)/dashboard/page-a74604d6bf9e4747.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(dashboard)/layout-931b9f3c4b186cbe.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(dashboard)/new/page-198e93208b9f6665.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(dashboard)/uploadscreen/page-7b8cb5f17246bb80.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(dashboard)/users/page-1a7a5d5d399db52f.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/(main)/pricing/page-787396b77c28cf26.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/_not-found/page-62689f2160d991bc.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/error-a13265f95be56fa0.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/global-error-f2aed23a38f68182.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/layout-600bec20e9ef1c57.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/loading-da9be060ed2fefad.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/my-learning/page-6d2b346f5728f5bb.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/not-found-b6bfa830cb61f3d6.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/app/page-867376925a3bdfab.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/f97e080b-8c99325617fad9b9.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/fd9d1056-ae6cc08493a2f148.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/framework-a63c59c368572696.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/main-7f5add217d46d597.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/main-app-65b453fb51548f2a.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/pages/_app-00b74eae5e8dab51.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/pages/_error-c72a1f77a3c0be1b.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-2cda939fd45c2bc2.js",revision:"dtYFinRtFn_W6YCNnvfxZ"},{url:"/_next/static/css/3d1e4e7e1ca8f9a8.css",revision:"3d1e4e7e1ca8f9a8"},{url:"/_next/static/css/6cc6147359a993c3.css",revision:"6cc6147359a993c3"},{url:"/_next/static/css/751c7278d9c0520a.css",revision:"751c7278d9c0520a"},{url:"/_next/static/css/787dfcde1e6dba33.css",revision:"787dfcde1e6dba33"},{url:"/_next/static/css/878521540ff24559.css",revision:"878521540ff24559"},{url:"/_next/static/css/e400c581c98a58f9.css",revision:"e400c581c98a58f9"},{url:"/_next/static/dtYFinRtFn_W6YCNnvfxZ/_buildManifest.js",revision:"b222cbf4d8e1f47e27a8925222733e53"},{url:"/_next/static/dtYFinRtFn_W6YCNnvfxZ/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/46c21389e888bf13-s.woff2",revision:"272930c09ba14c81bb294be1fe18b049"},{url:"/_next/static/media/Logowithtext.b7c1c245.png",revision:"be4bd9a674809a701cc1ff64e18c1a5d"},{url:"/_next/static/media/e11418ac562b8ac1-s.p.woff2",revision:"0e46e732cced180e3a2c7285100f27d4"},{url:"/_next/static/media/eafabf029ad39a43-s.p.woff2",revision:"43751174b6b810eb169101a20d8c26f8"},{url:"/_next/static/media/feature-03.72c18e1a.png",revision:"ea4ce5f299de5079bc7b8400de8aa7e7"},{url:"/_next/static/media/features1.d245d8d4.png",revision:"9d8773356c2107b3562debd69c5c5c46"},{url:"/_next/static/media/home-feat-1.0e4f85ee.png",revision:"5dd4078d006248adf6395d9f4c85ec45"},{url:"/_next/static/media/home-feat-2.cb84230c.png",revision:"84b8ebc67c860f57ee51cf8b74a0de09"},{url:"/_next/static/media/home-feat-3.066928c6.png",revision:"350d10d063d499421aa9657d69e8d89c"},{url:"/_next/static/media/main-logo.27ba889b.svg",revision:"70beb2dd9073f55d17449bdd6c77a475"},{url:"/_next/static/media/title 02.0400b481.png",revision:"05d2a039986fde49594082ce347383e8"},{url:"/assets/fonts/Miller text font.css",revision:"59968aa30a36a021153a13eccb443d70"},{url:"/assets/images/SparkMind_homepage.png",revision:"95e3f326a134e6af6b8b82e915435b68"},{url:"/assets/images/feature/card01.png",revision:"aae692c4af9fd7d82609ae5dc5433cd5"},{url:"/assets/images/feature/card02.png",revision:"0c03dc969327113d9e0968efbb776e33"},{url:"/assets/images/feature/card03.png",revision:"bd703a9165a435b931cf741c264d4099"},{url:"/assets/images/feature/card04.png",revision:"52be861813bec4ec4d711f56c2b05d65"},{url:"/assets/images/feature/card05.png",revision:"333355f9587d47e5cace3b2a04345bfe"},{url:"/assets/images/feature/card06.png",revision:"5d01d7ca28b3dc971cd5b5424db6f323"},{url:"/assets/images/feature/feature01.png",revision:"5a8af786dc4dce53f8add241ab32d296"},{url:"/assets/images/feature/feature02.png",revision:"4316fe6f3b8897aa88dd023308087374"},{url:"/assets/images/feature/title.png",revision:"900243d3c29d6d973a6690844dad45df"},{url:"/assets/images/home/Logo only.png",revision:"a7cc828cf24ebda88126a10a76901975"},{url:"/assets/images/home/Logowithtext.png",revision:"be4bd9a674809a701cc1ff64e18c1a5d"},{url:"/assets/images/home/card 01.png",revision:"0d2923431c0428c41657a231b6b3d0d5"},{url:"/assets/images/home/card 02.png",revision:"9ced0f53fea88b1baa31f3541076ad9d"},{url:"/assets/images/home/card 03.png",revision:"01fbe1385fdc82c7c2f1d5c87cc92812"},{url:"/assets/images/home/feature-03.png",revision:"ea4ce5f299de5079bc7b8400de8aa7e7"},{url:"/assets/images/home/features1.png",revision:"9d8773356c2107b3562debd69c5c5c46"},{url:"/assets/images/home/home-feat-1.png",revision:"5dd4078d006248adf6395d9f4c85ec45"},{url:"/assets/images/home/home-feat-2.png",revision:"84b8ebc67c860f57ee51cf8b74a0de09"},{url:"/assets/images/home/home-feat-3.png",revision:"350d10d063d499421aa9657d69e8d89c"},{url:"/assets/images/home/home-logo.png",revision:"c1fe46d7a101f9f2af1ad1c61c56ae14"},{url:"/assets/images/home/home-title.png",revision:"fa424f1e24f3e0ec9abe2e7d5f16b4d7"},{url:"/assets/images/home/title 02.png",revision:"05d2a039986fde49594082ce347383e8"},{url:"/assets/images/logo.png",revision:"75093b763aa0ad4277f1f45345b71197"},{url:"/assets/svgs/home/arrow.svg",revision:"8646d2fcf860cd2249bb7955d3863f8a"},{url:"/assets/svgs/home/logo.svg",revision:"83ea3490a159546b96e332c1475d8031"},{url:"/assets/svgs/home/main-logo.svg",revision:"70beb2dd9073f55d17449bdd6c77a475"},{url:"/assets/svgs/loading.svg",revision:"a7a3faf6e3039ed50a48185ef122a8b9"},{url:"/assets/svgs/new-input-icon.jsx",revision:"6b236e1f8fec9f4972b71e058bb9e867"},{url:"/assets/svgs/x_icon.svg",revision:"460a3f0adb19bcdd79543dd80a761efe"},{url:"/assets/videos/videoplayback.mp4",revision:"6c8c7aa1ddea97bea9e4b96d0c57e076"},{url:"/icon/search.png",revision:"e9612850a6cb55eb547266043e1eef86"},{url:"/swe-worker-5c72df51bb1f6ee0.js",revision:"5a47d90db13bb1309b25bdf7b363570e"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:s}})=>!(!e||s.startsWith("/api/auth/callback")||!s.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:n})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&n&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:s},sameOrigin:n})=>"1"===e.headers.get("RSC")&&n&&!s.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:s})=>s&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET"),self.__WB_DISABLE_DEV_LOGS=!0}));

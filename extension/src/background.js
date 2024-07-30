import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener((request) => {
  if (request.popupMounted) {
    console.log('background notified that Popup.tsx has mounted.');
  }
});

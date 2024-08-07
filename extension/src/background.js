import Browser from 'webextension-polyfill';

const chromeStorageKeys = {
  gauthAccessToken: 'gauthAccessToken',
  gauthRefreshToken: 'gauthRefreshToken',
};

const setTokens = async (tabId, changeInfo, tab) => {
  if (tab.status === 'complete' && tab.url) {
    const url = new URL(tab.url);
    if (url.origin === 'https://my.webapp.com') {
      const params = new URLSearchParams(url.hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        if (tab.id) await Browser.tabs.remove(tab.id);

        await Browser.storage.sync.set({
          [chromeStorageKeys.gauthAccessToken]: accessToken,
          [chromeStorageKeys.gauthRefreshToken]: refreshToken,
        });

        Browser.tabs.onUpdated.removeListener(setTokens);
      }
    }
  }
};

try {
  Browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('request', request);
    console.log('sender', sender);
    sendResponse({ error: 'Unknown action' });
    return true; // Indicate that the response is asynchronous
  });
} catch (error) {
  console.error('Error in background.js:', error);
  throw new Error('Error in background.js:', error);
}
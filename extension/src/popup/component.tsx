import { Hello } from '@src/components/hello';
import { Scroller } from '@src/components/scroller';
import React from 'react';
import browser, { type Tabs } from 'webextension-polyfill';
import css from './styles.module.css';

const scrollToTopPosition = 0;
const scrollToBottomPosition = 9999999;

function scrollWindow(position: number) {
  window.scroll(0, position);
}

function executeScript(position: number): void {
  browser.tabs.query({ active: true, currentWindow: true }).then((tabs: Tabs.Tab[]) => {
    const currentTab: Tabs.Tab | number = tabs[0];

    if (!currentTab) {
      return;
    }
    const currentTabId: number = currentTab.id as number;

    browser.scripting
      .executeScript({
        target: {
          tabId: currentTabId,
        },
        func: scrollWindow,
        args: [position],
      })
      .then(() => {
        console.log('Done Scrolling');
      });
  });
}

// // // //

export function Popup() {
  React.useEffect(() => {
    browser.runtime.sendMessage({ popupMounted: true });
  }, []);

  return (
    <div className={css.popupContainer}>
      <div className="mx-4 my-4">
        <Hello />
        <hr />
        <Scroller
          onClickScrollTop={() => {
            executeScript(scrollToTopPosition);
          }}
          onClickScrollBottom={() => {
            executeScript(scrollToBottomPosition);
          }}
        />
      </div>
    </div>
  );
}

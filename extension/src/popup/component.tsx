import { Hello } from '@src/components/hello';
import React from 'react';
import Browser from 'webextension-polyfill';
import css from './styles.module.css';

export function Popup() {
  React.useEffect(() => {
    Browser.runtime.sendMessage({ popupMounted: true });
  }, []);

  return (
    <div className={css.popupContainer}>
      <div className="mx-4 my-4">
        <Hello />
        <hr />
      </div>
    </div>
  );
}
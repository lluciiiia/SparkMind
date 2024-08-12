import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Popup } from './component';
import '../css/app.css';
import '@src/styles/css/globals.css';

// // // //

ReactDOM.createRoot(document.getElementById('root')! as HTMLElement).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);

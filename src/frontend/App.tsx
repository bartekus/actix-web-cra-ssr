import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './Routes';
import './App.css';

import * as serviceWorker from './serviceWorker';

export default function App() {
  React.useEffect(() => {
    const cssStyles = document.querySelector('#ssr-css');
    if (document.querySelector('#ssr-css')) {
      cssStyles?.parentNode?.removeChild(cssStyles);
    }
  }, []);

  return (
  <BrowserRouter>
    <Routes />
  </BrowserRouter>
  );
}

serviceWorker.register();

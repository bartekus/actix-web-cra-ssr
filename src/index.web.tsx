import React from 'react';
import { hydrate } from 'react-dom'
import { loadableReady } from '@loadable/component';

import App from './frontend/App';

loadableReady(() => {
  const root = document.getElementById('root');

  hydrate(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    root
  );
});

import React from 'react';
import ReactDOM from 'react-dom';
import { loadableReady } from '@loadable/component';

import './frontend/index.css';
import App from './frontend/App';

loadableReady(() => {
  const root = document.getElementById('root');
  ReactDOM.hydrate(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    root
  );
});

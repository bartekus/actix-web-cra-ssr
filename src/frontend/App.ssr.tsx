import React from 'react';
import { StaticRouter } from 'react-router-dom';

import Routes from './Routes';
import './App.css';

export default function App({ route='/' }) {
  return (
  <StaticRouter location={route}>
    <Routes />
  </StaticRouter>
  );
}

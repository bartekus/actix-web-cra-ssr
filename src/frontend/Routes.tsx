import React from 'react';
import loadable from '@loadable/component';
import { Route, Switch } from 'react-router';

import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Loading from './components/Loading';

const AboutPage = loadable(
() => import('./pages/AboutPage'),
{ fallback: <Loading /> }
);

const DashboardPage = loadable(
() => import('./pages/DashboardPage'),
{ fallback: <Loading /> }
);

const HomePage = loadable(
() => import('./pages/HomePage'),
{ fallback: <Loading /> }
);

export default function Routes() {
  return (
    <ErrorBoundary>
      <Layout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/dashboard" component={DashboardPage} />
        </Switch>
      </Layout>
    </ErrorBoundary>
  );
};

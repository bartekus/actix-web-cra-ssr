#!/usr/bin/env node
'use strict';

const path = require('path');
const util = require('util');
const fs = require('fs-extra');
const React = require('react');
const { minify } = require('html-minifier');
const ReactDOMServer = require('react-dom/server');
const paths = require('react-scripts/config/paths');
const { ChunkExtractor } = require('@loadable/server');
const exec = util.promisify(require('child_process').exec);
const renderFile = util.promisify(require('ejs').renderFile);

const routePaths = require('../src/frontend/RoutePaths');
const nodeStats = path.resolve(__dirname, '../build/node/loadable-stats.json');
const webStats = path.resolve(__dirname, '../build/web/loadable-stats.json');

async function cleanStaticFolder() {
  const { stdout, stderr } = await exec(`rm -rf static && mkdir static`);
  if (stderr) throw stderr;
  return stdout;
}

async function copyWebArtifactsIntoStaticFolder() {
  const { stdout, stderr } = await exec(`cp -a build/web/. static/`);
  if (stderr) throw stderr;
  return stdout;
}

async function readPackageJSON() {
  const packageJSON = await JSON.parse(fs.readFileSync(`${paths.appPath}/package.json`, 'utf8'));
  return packageJSON;
}

async function readManifest() {
  const manifest = await JSON.parse(fs.readFileSync(`${paths.appPublic}/manifest.json`, 'utf8'));
  return manifest;
}

async function createRoutesJSON(routes) {
  await fs.writeFileSync(`static/routes.json`, JSON.stringify(routes, null, 2));
  return null;
}

async function createSSRHtmlByRoute(route, fileName) {
  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
  const { default: App } = nodeExtractor.requireEntrypoint();

  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const jsx = webExtractor.collectChunks(React.createElement(App, { route }));

  const innerHtml = ReactDOMServer.renderToString(jsx);
  const css = await webExtractor.getCssString();

  const manifest = await readManifest();
  const packageJSON = await readPackageJSON();

  const data = {
    css,
    innerHtml,
    linkTags: webExtractor.getLinkTags(),
    styleTags: webExtractor.getStyleTags(),
    scriptTags: webExtractor.getScriptTags(),
    htmlTitle: `${manifest.short_name} - ${packageJSON.version}`,
    htmlDescription: `${manifest.name}`,
  };

  const templateFile = path.resolve(__dirname, './index.ssr.ejs');

  const renderedHTML = await renderFile(templateFile, data, {});

  const htmlMini = minify(renderedHTML, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    decodeEntities: true,
    minifyCSS: true,
    minifyJS: true,
    processConditionalComments: true,
    removeAttributeQuotes: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
  });

  await fs.writeFileSync(`static/${fileName}.html`, htmlMini, 'utf8');

  console.log(`  👍 route: %s as %s.html`,  route.padEnd(11), fileName);

  return null;
}

const run = async () => {
  process.env.NODE_ENV = 'production';
  const routes = [];

  try {
    console.log('\nCreating SSR static content...\n');

    await cleanStaticFolder();
    console.log('✅️ Wiped static folder');

    console.log('⚠️  Now rendering:');
    for (const path in routePaths) {
      const pathRoute = routePaths[path];
      const pathName = path.toLowerCase();

      await createSSRHtmlByRoute(pathRoute, pathName);

      routes.push([pathRoute.substr(1), pathName]);
    }
    console.log('✅ Finish generating SSR html files');

    await copyWebArtifactsIntoStaticFolder();
    console.log('✅️ Copied CRA build web artifacts');

    await createRoutesJSON(routes);
    console.log('✅️ Created static/routes.json');
  } catch (err) {
    console.log('Something went wrong:');
    console.error(err.message);
    process.exit(1);
  }
};

run();

const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin');
const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

function getConfig(cfg, env, target) {
  const config = Object.assign({}, cfg);

  config.name = target;
  config.target = target;
  config.entry = `./src/index.${target}.tsx`;

  config.optimization.splitChunks = {
    chunks: 'all',
    name: true,
    cacheGroups: {
      // default: false,
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
    },
  };

  config.optimization.runtimeChunk = false;

  config.output.filename = '[name].[contenthash].js';
  config.output.chunkFilename = '[name].[contenthash].js';
  config.plugins[5].options.filename = 'css/[name].[contenthash].css';
  config.plugins[5].options.chunkFilename = 'css/[name].[contenthash].css';

  config.module.rules[2].oneOf[0].options.name = 'media/[name].[contenthash].[ext]';
  config.module.rules[2].oneOf[2].options.caller = { target };
  config.module.rules[2].oneOf[7].options.name = 'media/[name].[contenthash].[ext]';

  config.externals = target === 'node' ? ['@loadable/component', nodeExternals()] : undefined;
  config.output.path = config.output.path + `/${target}`;
  config.output.libraryTarget = target === 'node' ? 'commonjs2' : undefined;

  config.plugins.splice(8, 1); //removes WorkboxWebpackPlugin
  config.plugins.push(new ScriptExtHtmlWebpackPlugin());
  config.plugins.push(new ResourceHintWebpackPlugin());
  config.plugins.push(new LoadablePlugin());

  return config;
}

function getPaths(paths, env, target) {
  paths.appBuildSubdir = paths.appBuild + `/${target}`;

  return paths;
}

const isWeb = process.argv.includes('--web');
const isNode = process.argv.includes('--node');

module.exports = {
  webpack: function(config, env) {
    const production = env === 'production';

    if (production) {
      if (isWeb) {
        return getConfig(config, env,'web');
      }
      if (isNode) {
        return getConfig(config, env,'node');
      }
    } else {
      return config;
    }
  },

  paths: function(paths, env) {
    const production = env === 'production';

    if (production) {
      if (isWeb) {
        return getPaths(paths, env,'web');
      }
      if (isNode) {
        return getPaths(paths, env,'node');
      }
    } else {
      return paths;
    }
  },
}

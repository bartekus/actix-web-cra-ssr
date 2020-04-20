const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin');

function getConfig(config, env, target) {
  config.name = target;
  config.target = target;
  config.entry = `./src/index.${target}.tsx`;
  config.module.rules[2].oneOf[2].options.caller = { target };
  config.externals = target === 'node' ? ['@loadable/component', nodeExternals()] : undefined;
  config.output.path = config.output.path + `/${target}`;
  config.output.libraryTarget = target === 'node' ? 'commonjs2' : undefined;
  config.plugins.unshift(new LoadablePlugin());

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

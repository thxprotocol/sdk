// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require('path');
const webpack = require('webpack');
const TypescriptDeclarationPlugin = require('typescript-declaration-webpack-plugin');

const isProduction = process.env.NODE_ENV == 'production';

const config = {
  entry: {
    '@thxprotocol/sdk': path.resolve(__dirname, 'src/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: '$',
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new TypescriptDeclarationPlugin({
      // Options for TypescriptDeclarationPlugin (see below)
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@toruslabs/customauth': path.resolve(
        './node_modules/@toruslabs/customauth/dist/customauth.cjs.js'
      ),
      buffer: path.resolve('./node_modules/buffer/index.js'),
    },
    fallback: {
      url: require.resolve('url/'),
      https: require.resolve('https-browserify'),
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      http: require.resolve('stream-http'),
      assert: require.resolve('assert/'),
    },
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
    config.devtool = 'source-map';
  }
  return config;
};

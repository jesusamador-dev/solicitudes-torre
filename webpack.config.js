const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const Dotenv = require('dotenv-webpack');
const path = require('path');
const deps = require('./package.json').dependencies;
require('dotenv').config({path: `./.env.devlocal`});

const remoteCore = process.env.REACT_APP_CORE_REMOTE ?? 'https://portal.kairosportaldev.com.mx/';
const remoteCommon = process.env.REACT_APP_DASHBOARDS_COMMON_REMOTE ?? 'https://portal.kairosportaldev.com.mx/';
const remoteSolicitudes = process.env.REACT_APP_DASHBOARDS_SOLICITUDES_REMOTE ?? 'https://solicitudes-torre.vercel.app/';

const reactCoreRemoteEntryPath = `mf_react_core@${remoteCore}core/v1`;
const dashboardsCommonEntryPath = `mf_mesacyc_dashboards_common@${remoteCommon}dashboards/common/v1`;
const reactCoreRemoteEntryFileName = 'reactCoreRemoteEntry.js';
const selfRemoteEntryFileName = 'dashboardsEntry.js';
const contextOutputPath = 'dashboards/solicitudes/v1/';

module.exports = {
  output: {
    publicPath: `${remoteSolicitudes}${contextOutputPath}`,
    path: path.resolve(__dirname, `dist/${contextOutputPath}`),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  performance: {
    hints: false,
  },
  devServer: {
    port: 8082,
    historyApiFallback: {
      index: `/${contextOutputPath}index.html`,
    },
    allowedHosts: 'all',
    hot: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {loader: 'sass-loader', options: {api: 'modern'}},
        ],
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: `./.env.devlocal`,
    }),
    new ModuleFederationPlugin({
      name: 'mf_mesacyc_dashboards_solicitudes',
      filename: `${selfRemoteEntryFileName}`,
      remotes: {
        mf_react_core: `${reactCoreRemoteEntryPath}/${reactCoreRemoteEntryFileName}`,
        mf_mesacyc_dashboards_common: `${dashboardsCommonEntryPath}/${selfRemoteEntryFileName}`,
      },
      exposes: {
        './RouterSolicitudes': "./src/router/router.tsx",
        './RouterReencauces': "./src/router/RouterReencauces.tsx",
      },
      shared: {
        ...deps,
        'react-router-dom': {
          singleton: true,
          eager: true,
          requiredVersion: deps['react-router-dom'],
        },
        react: {
          eager: true,
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: deps['react-dom'],
        },
        'react-intl': {eager: true},
      },
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      favicon: './src/assets/img/favicon.ico',
    }),
  ],
};

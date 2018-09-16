const path = require('path');

const ZipPlugin = require('zip-webpack-plugin');

module.exports = {
  devtool: 'sourcemap',
  mode: 'production',
  target: 'node',
  entry: './src/app.js',
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [new ZipPlugin()],
};

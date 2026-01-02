const path = require('path');
const fs = require('fs');
const CopyPlugin = require('copy-webpack-plugin');

// Plugin to generate a manifest of CSV files in the data directory
class GenerateDataManifestPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('GenerateDataManifestPlugin', (compilation, callback) => {
      const dataDir = path.resolve(__dirname, 'src/data');
      let csvFiles = [];

      if (fs.existsSync(dataDir)) {
        csvFiles = fs.readdirSync(dataDir)
          .filter(file => file.endsWith('.csv'))
          .sort();
      }

      const manifest = JSON.stringify({ files: csvFiles }, null, 2);
      compilation.assets['data/manifest.json'] = {
        source: () => manifest,
        size: () => manifest.length,
      };

      console.log(`[DataManifest] Found ${csvFiles.length} CSV files:`, csvFiles);
      callback();
    });
  }
}

module.exports = {
  entry: {
    background: './src/background/index.ts',
    content: './src/content/index.ts',
    popup: './src/popup/index.ts',
    options: './src/options/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/popup/popup.html', to: 'popup.html' },
        { from: 'src/options/options.html', to: 'options.html' },
        { from: 'src/icons', to: 'icons', noErrorOnMissing: true },
        { from: 'src/data', to: 'data', noErrorOnMissing: true },
      ],
    }),
    new GenerateDataManifestPlugin(),
  ],
  optimization: {
    splitChunks: false,
  },
};

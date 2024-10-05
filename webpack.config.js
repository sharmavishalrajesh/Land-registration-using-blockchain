const path = require('path');

module.exports = {
  entry: './src/index.js', // Adjust according to your entry point
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Adjust according to your output directory
  },
  resolve: {
    fallback: {
      os: require.resolve("os-browserify/browser"),
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 3000,
  },
};

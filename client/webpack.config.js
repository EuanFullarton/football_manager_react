var config = {
  entry: __dirname + '/src/index.js',
  output: {
    filename: "bundle.js",
    path: __dirname + '/build'
  },
  devtool: "source-map",
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['react']
        }
      }
    ]
  }
}

module.exports = config;

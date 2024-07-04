const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: ["./src/js/index.js", "./src/css/style.css"],
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "OneArmedBanditTWA"),
  },
  performance: {
    hints: false,
  },
  devServer: {
    headers: {
      "Cache-Control": "no-store",
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "main.[contenthash].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: "asset/resource",
        generator: {
          filename: 'assets/[hash][ext][query]'
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
};

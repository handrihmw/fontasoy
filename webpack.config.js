const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const PurgeCSSPlugin = require('purgecss-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  src: path.join(__dirname, 'src')
}

module.exports = {
    mode: 'production',
    entry: [
      './src/sass/app.scss',
      './src/js/app.js',
    ],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/app.js'
    },
    module: {
      rules: [{
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [{
              loader: MiniCssExtractPlugin.loader
            }, {
              loader: "css-loader?-url",
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true
              },
              options: {
                implementation: require("sass")
              }
            }
          ]
        },
        {
          test: /\.(ttf|eot|svg|gif|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: [{
            loader: 'file-loader',
          }]
        },
      ]
    },
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: true,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessorPluginOptions: {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true
                }
              }
            ],
          }
        })
      ],
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.css$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        title: 'Font loading test',
        template: 'index.html',
        filename: 'index.html' //relative to root of the application
      }),
      new MiniCssExtractPlugin({
        filename: 'css/app.css',
        chunkFilename: 'css/app.css'
      }),
      new webpack.ProvidePlugin({
        "$": "jquery",
        "jQuery": "jquery",
        "window.jQuery": "jquery"
      }),
      new PurgeCSSPlugin({
        paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
        only: ['bundle', 'vendor']
      })
    ]
  }
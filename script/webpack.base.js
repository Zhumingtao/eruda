const autoprefixer = require('autoprefixer')
const classPrefix = require('postcss-class-prefix')
const webpack = require('webpack')
const pkg = require('../package.json')
const path = require('path')

process.traceDeprecation = true

const nodeModDir = path.resolve('./node_modules/') + '/'
const srcDir = path.resolve('./src') + '/'
const banner = pkg.name + ' v' + pkg.version + ' ' + pkg.homepage

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: [classPrefix('eruda-'), autoprefixer]
  }
}

module.exports = {
  entry: './src/index',
  devServer: {
    contentBase: './test',
    port: 3000
  },
  output: {
    path: path.resolve(__dirname, '../'),
    publicPath: '/assets/',
    library: ['eruda'],
    libraryTarget: 'umd'
  },
  module: {
    loaders: [
      {
        test: /Worker\.js$/,
        use: {
          loader: 'worker-loader',
          options: {
            inline: true,
            fallback: false,
            name: '[name].js'
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env'],
              plugins: ['transform-runtime']
            }
          },
          'eslint-loader'
        ]
      },
      {
        test: /\.scss$/,
        loaders: ['css-loader', postcssLoader, 'sass-loader']
      },
      {
        test: /\.css$/,
        loaders: ['css-loader', postcssLoader]
      },
      // https://github.com/wycats/handlebars.js/issues/1134
      {
        test: /\.hbs$/,
        loader: nodeModDir + 'handlebars-loader/index.js',
        options: {
          runtime: srcDir + 'lib/handlebars.js'
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new webpack.DefinePlugin({
      VERSION: '"' + pkg.version + '"'
    })
  ]
}

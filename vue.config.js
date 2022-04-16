
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const CompressionWebpackPlugin = require('compression-webpack-plugin')

// const isProduction = process.env.NODE_ENV !== 'development'

const Timestamp = (new Date().getTime()).toString()
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  productionSourceMap: false,
  css: {
    requireModuleExtension: true,
    extract: false,
    sourceMap: false
  },

  chainWebpack: config => {
    config.plugins.delete('prefetch')
    config.output.filename('js/[name]' + Timestamp.substr(-4) + '.js').end()
    config.output.chunkFilename('js/[name]' + Timestamp.substr(-4) + '.js').end()
    // config.output.filename('js/[name]' + '.js').end()
    // config.output.chunkFilename('js/[name]' + '.js').end()
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === process.env.VUE_APP_CURRENTMODE) {
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            compress: {
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        })
      )

      const productionGzipExtensions = ['html', 'js', 'css']
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 1024,
          minRatio: 0.8,
          deleteOriginalAssets: false
        })
      )
      config.performance = {
        hints: 'warning',
        maxEntrypointSize: 50000000,
        maxAssetSize: 30000000,
        assetFilter: function (assetFilename) {
          return assetFilename.endsWith('.js')
        }
      }
    }
  },
  devServer: {
    port: 8080,
    open: true,
    hotOnly: true,
    proxy: {
      '/api': {
        target: 'https://developers.realsee.com',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}

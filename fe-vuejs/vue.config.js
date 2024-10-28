const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  devServer: {
    open: true, 
  },
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // Alias '@' cho thư mục 'src'
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? 'public'
    : '/'
})

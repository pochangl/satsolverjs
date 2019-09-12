module.exports = {
  chainWebpack: config => {
    console.log('hihi')
    config.module
      .rule('pegjs')
      .test(/\.pegjs$/)
      .use('url-loader')
      .loader('url-loader')
  }
}

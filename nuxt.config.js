export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  ssr: false,
  head: {
    htmlAttrs: {
      lang: 'zh',
    },
    title: '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    script: [{ src: '/js/config.js' }],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        types: 'text/css',
        href: '/iconfont-third/self/iconfont.css',
      },
    ],
    // link: [{ rel: 'icon', type: 'image/x-icon', href: '/biaoji.ico' }],
  },
  server: {
    port: '8080',
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['element-ui/lib/theme-chalk/index.css'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/element-ui'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    '@nuxt/postcss8',
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/],
  },
  proxy: [
    [
      '/library',
      {
        target: 'http://202.109.255.147:8020/',
        changeOrigin: true,
        pathRewrite: {
          '^/library': '/library',
        },
      },
    ],
    [
      '/userAPI',
      {
        target: 'http://192.9.200.25:51511',
        changeOrigin: true,
        pathRewrite: {
          '^/userAPI': '',
        },
      },
    ],
    [
      '/devapi',
      {
        target: 'http://192.9.200.25:52522',
        changeOrigin: true,
        pathRewrite: {
          '^/devapi': '',
        },
      },
    ],
    [
      '/serverFile',
      {
        target: 'http://192.9.200.25:52536',
        changeOrigin: true,
        pathRewrite: {
          '^/serverFile': '',
        },
      },
    ],
    [
      '/addressRes',
      {
        target: 'http://124.72.48.24:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/addressRes': '',
        },
      },
    ],
  ],
}

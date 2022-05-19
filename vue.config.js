const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
    transpileDependencies: true,

    devServer: {
        proxy: {
            '^/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
            '^/odata': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            },
        },
    },

    pluginOptions: {
        i18n: {
            locale: 'cs',
            fallbackLocale: 'en',
            localeDir: 'locales',
            enableLegacy: false,
            runtimeOnly: false,
            compositionOnly: false,
            fullInstall: true,
        },
    },
})

import '@/plugins/font-awesome'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import AppWrapper from './AppWrapper.vue'
import router from './router'

import i18n from './plugins/i18n'
import { enablePrimeVue } from './plugins/primevue.plugin'

import CountryFlag from '@/components/CountryFlag.vue'

const app = createApp(AppWrapper).use(createPinia()).use(i18n)

enablePrimeVue(app)

app.component('CountryFlag', CountryFlag)

app.use(router).mount('#app')

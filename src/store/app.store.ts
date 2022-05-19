import { primeEn } from './../locales/prime.en'
import { readonly, reactive } from 'vue'
import { defineStore } from 'pinia'

import { changeTheme, darkModePreference } from '@/helpers/dark-mode'
import { useI18n } from 'vue-i18n'
import { usePrimeVue } from 'primevue/config'

import { primeCs } from '@/locales/prime.cs'

type AppState = {
    darkTheme: boolean
    locale: string
}

export const useAppStore = defineStore('app', () => {
    const { locale: i18nLocale } = useI18n()
    const p$ = usePrimeVue()

    const state = reactive<AppState>({
        darkTheme: localStorage.getItem('darkTheme') === null ? darkModePreference() : localStorage.getItem('darkTheme') === 'true',
        locale: localStorage.getItem('locale') ?? 'cs',
    })

    const toggleDarkTheme = () => {
        state.darkTheme = !state.darkTheme

        localStorage.setItem('darkTheme', state.darkTheme.toString())

        changeTheme(state.darkTheme)
    }

    const setLocale = (locale: string) => {
        state.locale = locale
        i18nLocale.value = locale

        localStorage.setItem('locale', locale)

        switch (locale) {
            case 'en':
                p$.config.locale = primeEn
                break
            case 'cs':
            default:
                p$.config.locale = primeCs
                break
        }
    }

    const initDarkTheme = () => {
        changeTheme(state.darkTheme)
    }

    const initLocale = () => {
        setLocale(state.locale)
    }

    initDarkTheme()
    initLocale()

    return {
        state: readonly(state),

        toggleDarkTheme,
        setLocale,
    }
})

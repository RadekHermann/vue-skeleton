import { readonly, reactive } from 'vue'
import { get, set, useNavigatorLanguage, useWindowSize } from '@vueuse/core'
import { defineStore } from 'pinia'

import { changeTheme, darkModePreference } from '@/helpers/dark-mode'
import { useI18n } from 'vue-i18n'
import { usePrimeVue } from 'primevue/config'

import { primeCs } from '@/locales/prime.cs'
import { primeEn } from '@/locales/prime.en'

type AppState = {
    darkTheme: boolean
    locale: string

    menuInactive: boolean
    mobileMenuActive: boolean
}

export const useAppStore = defineStore('app', () => {
    const { locale: i18nLocale } = useI18n()
    const { language } = useNavigatorLanguage()
    const p$ = usePrimeVue()

    const { width } = useWindowSize()

    const state = reactive<AppState>({
        darkTheme: localStorage.getItem('darkTheme') === null ? darkModePreference() : localStorage.getItem('darkTheme') === 'true',
        locale: localStorage.getItem('locale') ?? get(language)?.split('-')[0] ?? 'cs',
        menuInactive: false,
        mobileMenuActive: false,
    })

    const toggleDarkTheme = () => {
        state.darkTheme = !state.darkTheme

        localStorage.setItem('darkTheme', state.darkTheme.toString())

        changeTheme(state.darkTheme)
    }

    const setLocale = (locale: string) => {
        state.locale = locale
        set(i18nLocale, locale)

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

    const isDesktop = () => get(width) >= 992

    const setMenuInactive = (val: boolean) => (state.menuInactive = val)
    const setMobileMenuActive = (val: boolean) => (state.mobileMenuActive = val)

    const initDarkTheme = () => changeTheme(state.darkTheme)
    const initLocale = () => setLocale(state.locale)

    initDarkTheme()
    initLocale()

    return {
        state: readonly(state),

        toggleDarkTheme,
        setLocale,

        isDesktop,
        setMenuInactive,
        setMobileMenuActive,
    }
})

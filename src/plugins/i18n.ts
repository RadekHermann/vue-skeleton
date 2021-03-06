import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n'

import { dateFormatCs } from '@/locales/date-format.cs'
import { dateFormatEn } from '@/locales/date-format.en'
import { numberFormatCs } from '@/locales/number-format.cs'
import { numberFormatEn } from '@/locales/number-format.en'
import { pluralizationRuleCs } from '@/locales/pluralization-rules.cs'

function loadLocaleMessages(): LocaleMessages<VueMessageType> {
    const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
    const messages: LocaleMessages<VueMessageType> = {}
    locales.keys().forEach((key) => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i)
        if (matched && matched.length > 1) {
            const locale = matched[1]
            messages[locale] = locales(key).default
        }
    })
    return messages
}

export default createI18n({
    legacy: false,
    locale: process.env.VUE_APP_I18N_LOCALE || 'cs',
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
    messages: loadLocaleMessages(),
    numberFormats: {
        ...numberFormatCs,
        ...numberFormatEn,
    },
    datetimeFormats: {
        ...dateFormatCs,
        ...dateFormatEn,
    },
    pluralRules: {
        ...pluralizationRuleCs,
    },
})

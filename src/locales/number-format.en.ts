import { IntlNumberFormats } from 'vue-i18n'

export const numberFormatEn: IntlNumberFormats = {
    en: {
        currency: {
            style: 'currency',
            currency: 'USD',
            notation: 'standard',
        },
        decimal: {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        },
        percent: {
            style: 'percent',
            useGrouping: false,
        },
    },
}
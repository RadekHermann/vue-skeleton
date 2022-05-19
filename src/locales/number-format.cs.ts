import { IntlNumberFormats } from 'vue-i18n'

export const numberFormatCs: IntlNumberFormats = {
    cs: {
        currency: {
            style: 'currency',
            currency: 'CZK',
            notation: 'standard',
        },
        decimal: {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        },
        int: {
            style: 'decimal',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        },
        percent: {
            style: 'percent',
            useGrouping: false,
        },
    },
}

import * as validators from '@vuelidate/validators'
import i18n from '@/plugins/i18n'

const { createI18nMessage } = validators

const withI18nMessage = createI18nMessage({ t: i18n.global.t.bind(i18n) })

// wrap each validator.
export const required = withI18nMessage(validators.required)
export const minLength = withI18nMessage(validators.minLength, { withArguments: true })
export const maxLength = withI18nMessage(validators.maxLength, { withArguments: true })

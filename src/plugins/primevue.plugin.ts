import 'primevue/resources/primevue.min.css'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

import '../assets/flags/flags.css'
import '../assets/styles/layout.scss'

import { App } from 'vue'

import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'

import Tooltip from 'primevue/tooltip'
import Ripple from 'primevue/ripple'
import BadgeDirective from 'primevue/badgedirective'
import StyleClass from 'primevue/styleclass'

import Badge from 'primevue/badge'
import Breadcrumb from 'primevue/breadcrumb'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'

import BlockUI from 'primevue/blockui'

import Menu from 'primevue/menu'
import Toolbar from 'primevue/toolbar'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export const enablePrimeVue = (app: App<Element>) => {
    app.use(PrimeVue, { ripple: true, inputStyle: 'outlined' })
    app.use(ConfirmationService)
    app.use(ToastService)

    app.directive('tooltip', Tooltip)
    app.directive('ripple', Ripple)
    app.directive('badge', BadgeDirective)
    app.directive('styleclass', StyleClass)

    app.component('PBadge', Badge)
    app.component('PBreadcrumb', Breadcrumb)
    app.component('PButton', Button)
    app.component('PDivider', Divider)

    app.component('PMessage', Message)

    app.component('PInputText', InputText)
    app.component('PPassword', Password)
    app.component('PCheckbox', Checkbox)

    app.component('PMenu', Menu)
    app.component('BlockUI', BlockUI)

    app.component('PToolbar', Toolbar)

    app.component('PDataTable', DataTable)
    app.component('PColumn', Column)

    return app
}

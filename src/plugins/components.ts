import { App } from 'vue'

import RhInputText from '@/components/RhInputText.vue'

export const enableComponents = (app: App<Element>) => {
    app.component('RhInputText', RhInputText)
}

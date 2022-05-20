import { App } from 'vue'

import RhInputText from '@/components/RhInputText.vue'
import RhDataTable from '@/components/RhDataTable.vue'

export const enableComponents = (app: App<Element>) => {
    app.component('RhInputText', RhInputText)
    app.component('RhDataTable', RhDataTable)
}

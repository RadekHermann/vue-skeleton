import { App } from 'vue'

import RhInputText from '@/components/RhInputText.vue'
import RhDataTable from '@/components/RhDataTable.vue'
import RhMultiSelectFilter from '@/components/RhMultiSelectFilter.vue'

export const enableComponents = (app: App<Element>) => {
    app.component('RhInputText', RhInputText)
    app.component('RhDataTable', RhDataTable)
    app.component('RhMultiSelectFilter', RhMultiSelectFilter)
}

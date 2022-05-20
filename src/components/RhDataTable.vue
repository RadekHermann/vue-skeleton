<template>
    <PDataTable
        ref="dt"
        v-bind="$attrs"
        :class="tableClass"
        :dataKey="dataKey"
        :paginator="paginator"
        :filterDisplay="filterDisplay"
        :value="result"
        :loading="isLoading"
        :totalRecords="totalRecords"
        :lazy="true"
        v-model:filters="filters"
        v-model:first="first"
        v-model:rows="rows"
        :stateKey="getStateKey"
        stateStorage="local"
        sortMode="multiple"
        showGridlines
        stripedRows
        removableSort
        :rowsPerPageOptions="[10, 20, 50, 100]"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="{first} - {last} / {totalRecords}"
        @page="onRequest($event)"
        @filter="onRequest($event)"
        @sort="onRequest($event)"
        @state-restore="onRequest($event)"
        @row-click="$emit('row-click', $event)"
    >
        <template #header>
            <slot name="header" />
        </template>

        <template #default>
            <slot name="default" />
        </template>

        <template #paginatorstart>
            <slot name="paginatorstart" />
        </template>
        <template #paginatorend>
            <slot name="paginatorend" />
        </template>
    </PDataTable>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { get } from '@vueuse/core'
import { useODataList } from '@/core/composable/odata.composable'
import { DTEvent } from '@/core/types/datatable'
import { toQuery } from '@/helpers/to-query'
import { useRoute } from 'vue-router'

export default defineComponent({
    props: {
        controller: {
            type: String,
            required: true,
        },
        dataKey: {
            type: [String, Number, Object],
            default: 'id',
        },
        size: {
            type: String,
            default: 'sm',
        },
        paginator: {
            type: Boolean,
            default: true,
        },
        filterDisplay: {
            type: String,
            default: 'menu',
        },
        stateKey: String,
    },

    setup(props, { slots }) {
        const dt = ref()
        const rows = ref(20)
        const first = ref(0)
        const filters = ref({})
        const multiSortMeta = ref([])

        const route = useRoute()

        const { isLoading, result, totalRecords, fetchData } = useODataList(props.controller)

        const tableClass = computed(() => {
            const result: any[] = [`p-datatable-${props.size}`]

            return result
        })

        const getStateKey = computed(() => (props.stateKey ? props.stateKey : `dt-state-${props.controller}-${route.name?.toString() || 'default'}`))

        const onRequest = (e: DTEvent) => {
            fetchData(toQuery(e))
        }

        onMounted(() => {
            if (!localStorage.getItem(get(getStateKey))) {
                refresh()
            }
        })

        const refresh = () => onRequest({ first: get(first), rows: get(rows), filters: ref(filters), multiSortMeta: get(multiSortMeta) } as any)

        return {
            rows,
            first,
            filters,
            multiSortMeta,

            dt,
            totalRecords,
            isLoading,
            result,

            tableClass,
            slots,

            getStateKey,

            onRequest,
        }
    },
})
</script>

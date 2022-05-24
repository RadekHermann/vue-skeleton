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
        :selection="selection"
        :selectionMode="selectionMode"
        :filters="filters"
        :first="first"
        :rows="rows"
        showGridlines
        stripedRows
        :sortMode="sortMode"
        removableSort
        :rowsPerPageOptions="[10, 20, 50, 100]"
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="{first} - {last} / {totalRecords}"
        @update:selection="$emit('@update:selection', $event)"
        @page="onRequest($event)"
        @filter="onRequest($event)"
        @sort="onRequest($event)"
        @state-restore="onRequest($event)"
        @row-click="$emit('row-click', $event)"
    >
        <template #header>
            <slot name="header" :refresh="refresh" />
        </template>

        <template #default>
            <slot name="default" :refresh="refresh" />

            <PColumn v-if="columns.length && selectionMode" :selectionMode="selectionMode"></PColumn>
            <template v-for="col in columns" :key="col.field">
                <PColumn
                    :field="col.field"
                    :header="col.header"
                    :sortable="col.sortable"
                    :ref="col.field"
                    :class="col.itemClass"
                    :style="col.itemStyle"
                    :dataType="col.type ?? 'text'"
                >
                    <template #body="slotProps" v-if="$slots[col.field]">
                        <slot :name="col.field" :data="slotProps.data" />
                    </template>
                    <template #body="slotProps" v-else-if="col.data">
                        {{ col.data ? col.data(slotProps.data) : slotProps.data[col.field] }}
                    </template>
                    <template v-if="col.filterable" #filter="{ filterModel, filterCallback }">
                        <PInputText
                            v-if="(col.type ?? 'text') === 'text'"
                            type="text"
                            v-model="filterModel.value"
                            @keypress.enter="filterCallback()"
                            class="p-column-filter"
                        />
                        <PInputNumber v-if="col.type === 'numeric'" v-model="filterModel.value" @keypress.enter="filterCallback()" class="p-column-filter" />
                        <PCalendar v-if="col.type === 'date'" v-model="filterModel.value" dateFormat="dd.MM.yyyy" placeholder="dd.MM.yyyy" />
                        <PTriStateCheckbox v-if="col.type === 'boolean'" v-model="filterModel.value" @change="filterCallback()" />
                    </template>
                </PColumn>
            </template>
        </template>

        <template #paginatorstart>
            <slot name="paginatorstart" :refresh="refresh" />
        </template>
        <template #paginatorend>
            <slot name="paginatorend" :refresh="refresh" />
        </template>
    </PDataTable>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref, watchEffect } from 'vue'
import { get, set } from '@vueuse/core'
import { useODataList } from '@/core/composable/odata.composable'
import { DTEvent, DataTableColumn, DataTableFilter, FilterMatchMode, OperatorMode } from '@/core/types/datatable'
import { toQuery, toSelectQuery } from '@/helpers/to-query'
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
        sortMode: {
            type: String,
            default: 'multiple',
        },
        selectionMode: {
            type: String,
            default: null,
        },
        stateKey: String,
        columns: {
            type: Array as () => DataTableColumn[],
            default: () => [],
        },
        selection: {
            type: Array,
            default: () => [],
        },
        selectQuery: {
            type: Array as () => string[],
            default: () => [],
        },
    },

    setup(props, { slots }) {
        const dt = ref()
        const rows = ref(20)
        const first = ref(0)
        const filters = reactive<DataTableFilter>({})

        const multiSortMeta = ref([])

        const route = useRoute()

        const { isLoading, result, totalRecords, fetchData } = useODataList(props.controller)

        const tableClass = computed(() => {
            const result: any[] = [`p-datatable-${props.size}`]

            return result
        })

        // ToDo: Do nazvu pridat verzi aplikace
        const getStateKey = computed(() => (props.stateKey ? props.stateKey : `dt-state-${props.controller}-${route.name?.toString() || 'default'}`))

        const onRequest = (e: DTEvent) => {
            set(rows, e.rows)
            set(first, e.first)
            set(multiSortMeta, e.multiSortMeta)
            Object.assign(filters, e.filters)

            fetchData({ ...toSelectQuery(props.columns, props.selectQuery), ...toQuery(e, props.columns) })
        }

        watchEffect(() => {
            if (props.columns.length) {
                props.columns.forEach((col) => {
                    if (col.filterable) {
                        if (col.type === 'boolean') {
                            Object.assign(filters, { [col.field]: { value: null, matchMode: FilterMatchMode.EQUALS } })
                        } else if (col.type === 'numeric') {
                            if (props.filterDisplay === 'menu') {
                                Object.assign(filters, {
                                    [col.field]: { operator: OperatorMode.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
                                })
                            } else {
                                Object.assign(filters, { [col.field]: { value: null, matchMode: FilterMatchMode.EQUALS } })
                            }
                        } else if (col.type === 'date') {
                            if (props.filterDisplay === 'menu') {
                                Object.assign(filters, {
                                    [col.field]: { operator: OperatorMode.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
                                })
                            } else {
                                Object.assign(filters, { [col.field]: { value: null, matchMode: FilterMatchMode.DATE_IS } })
                            }
                        } else if (col.type === 'array') {
                            if (props.filterDisplay === 'menu') {
                                Object.assign(filters, {
                                    [col.field]: { operator: OperatorMode.AND, constraints: [{ value: null, matchMode: FilterMatchMode.IN }] },
                                })
                            } else {
                                Object.assign(filters, { [col.field]: { value: null, matchMode: FilterMatchMode.IN } })
                            }
                        } else {
                            if (props.filterDisplay === 'menu') {
                                Object.assign(filters, {
                                    [col.field]: (filters[col.field] = {
                                        operator: OperatorMode.AND,
                                        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
                                    }),
                                })
                            } else {
                                Object.assign(filters, { [col.field]: { value: null, matchMode: FilterMatchMode.STARTS_WITH } })
                            }
                        }
                    }
                })
            }
        })

        onMounted(() => {
            refresh()
        })

        const refresh = () => onRequest({ first: get(first), rows: get(rows), filters: filters, multiSortMeta: get(multiSortMeta) } as any)

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
            refresh,
        }
    },
})
</script>

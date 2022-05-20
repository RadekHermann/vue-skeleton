<template>
    <div class="grid">
        <div class="col-12">
            <div class="card mb-0 p-3" style="max-height: calc(100vh - 160px)">
                <rh-data-table controller="material">
                    <template #header>
                        <div class="table-header">
                            Products
                            <PButton icon="pi pi-refresh" />
                        </div>
                    </template>

                    <PColumn selectionMode="multiple" class="align-center"></PColumn>
                    <PColumn field="id" header="ID" sortable ref="id" class="column-size-300">
                        <template #filter="{ filterModel, filterCallback }">
                            <PInputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" />
                        </template>
                    </PColumn>
                    <PColumn field="nazev" header="Název" ref="nazev" :sortable="true">
                        <template #filter="{ filterModel, filterCallback }">
                            <PInputText
                                type="text"
                                v-model="filterModel.value"
                                @keydown.enter="filterCallback()"
                                class="p-column-filter"
                                placeholder="Search by name"
                            />
                        </template>
                    </PColumn>

                    <template #paginatorstart>
                        <PButton type="button" icon="pi pi-refresh" class="p-button-text" />
                    </template>
                    <template #paginatorend>
                        <PButton type="button" icon="pi pi-cloud" class="p-button-text" />
                    </template>
                </rh-data-table>

                <DataTable
                    class="p-datatable-sm"
                    :lazy="true"
                    :paginator="true"
                    v-model:rows="lazyParams.rows"
                    v-model:filters="filters"
                    :value="result"
                    ref="dt"
                    dataKey="id"
                    :totalRecords="totalRecords"
                    :loading="loading"
                    @page="onPage($event)"
                    @sort="onSort($event)"
                    @filter="onFilter($event)"
                    @state-restore="onStateRestore($event)"
                    filterDisplay="menu"
                    :selectAll="selectAll"
                    sortMode="multiple"
                    removableSort
                    :scrollable="true"
                    :scrollHeight="scrollHeight"
                    showGridlines
                    stripedRows
                    @row-click="onRowClick($event)"
                    paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                    :rowsPerPageOptions="[10, 20, 50]"
                    currentPageReportTemplate="{first} - {last} / {totalRecords}"
                    stateStorage="session"
                    stateKey="dt-state-demo-session"
                >
                    <template #header>
                        <div class="table-header">
                            Products
                            <PButton icon="pi pi-refresh" />
                        </div>
                    </template>

                    <Column selectionMode="multiple" class="column-size-50 justify-content-center"></Column>
                    <Column field="id" header="ID" :sortable="false" ref="id" class="column-size-300"> </Column>
                    <Column field="nazev" header="Název" ref="nazev" :sortable="true">
                        <template #filter="{ filterModel, filterCallback }">
                            <PInputText
                                type="text"
                                v-model="filterModel.value"
                                @keydown.enter="filterCallback()"
                                class="p-column-filter"
                                placeholder="Search by name"
                            />
                        </template>
                    </Column>

                    <template #paginatorstart>
                        <PButton type="button" icon="pi pi-refresh" class="p-button-text" />
                    </template>
                    <template #paginatorend>
                        <PButton type="button" icon="pi pi-cloud" class="p-button-text" />
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref, computed, onUnmounted } from 'vue'

import { get, set } from '@vueuse/core'

import { toQuery } from '@/helpers/to-query'
import { useODataList } from '@/core/composable/odata.composable'

import DataTable, { DataTableStateEvent } from 'primevue/datatable'
import Column from 'primevue/column'

import { DataTablePageEvent, DataTableSortEvent, DataTableFilterEvent, DataTableFilter, FilterMatchMode, OperatorMode } from '@/core/types/datatable'
import RhDataTable from '@/components/RhDataTable.vue'

export default defineComponent({
    components: {
        DataTable,
        Column,
        RhDataTable,
    },
    setup() {
        const windowHeight = ref(window.innerHeight)

        onMounted(() => {
            window.addEventListener('resize', handleResize)

            if (!sessionStorage.getItem('dt-state-demo-session')) {
                loadLazyData()
            }
        })

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize)
        })

        const handleResize = () => set(windowHeight, window.innerHeight)

        const { isLoading: loading, fetchData, result, totalRecords } = useODataList<any>('material')

        const dt = ref()
        const selectAll = ref(false)
        const filters = ref<DataTableFilter>({
            jeSmazano: { value: false, matchMode: FilterMatchMode.EQUALS },
            nazev: { operator: OperatorMode.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        })
        const lazyParams = ref({ first: 0, rows: 20, filters: get(filters) }) as Ref<DataTableSortEvent>

        const scrollHeight = computed(() => get(windowHeight) - 230 + 'px')

        const loadLazyData = () => {
            fetchData(toQuery(get(lazyParams)))
        }
        const onPage = (event: DataTablePageEvent) => {
            console.log('page: ', event)
            set(lazyParams, event)
            loadLazyData()
        }
        const onSort = (event: DataTableSortEvent) => {
            console.log('sort: ', event)
            set(lazyParams, event)
            loadLazyData()
        }
        const onFilter = (event: DataTableFilterEvent) => {
            console.log('filter: ', event)
            set(lazyParams, event)
            loadLazyData()
        }

        const onStateRestore = (event: DataTableStateEvent) => {
            console.log('state: ', event)

            get(lazyParams).rows = event.rows
            get(lazyParams).first = event.first
            get(lazyParams).sortField = event.sortField
            get(lazyParams).sortOrder = event.sortOrder
            get(lazyParams).filters = event.filters
            get(lazyParams).multiSortMeta = event.multiSortMeta

            loadLazyData()
        }

        const onRowClick = (e: any) => {
            console.log(e)
        }

        return {
            dt,
            loading,
            totalRecords,
            filters,
            lazyParams,
            selectAll,
            result,

            loadLazyData,
            onPage,
            onSort,
            onFilter,
            onStateRestore,
            onRowClick,

            scrollHeight,
        }
    },
})
</script>

<style scoped>
.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>

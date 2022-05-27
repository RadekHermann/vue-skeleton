<template>
    <div class="grid">
        <div class="col-12">
            <div class="card mb-0 p-3" style="max-height: calc(100vh - 160px)">
                <rh-data-table controller="zavoz" :columns="columns" filter-display="menu">
                    <template #[`auto.spz`]="slotProps">
                        {{ slotProps.data.auto.spz.toLowerCase() }}
                    </template>

                    <template #paginatorstart>
                        <PButton type="button" icon="pi pi-refresh" class="p-button-text" />
                    </template>
                    <template #paginatorend>
                        <PButton type="button" icon="pi pi-cloud" class="p-button-text" />
                    </template>
                </rh-data-table>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { DataTableColumn } from '@/core/types/datatable'
import RhDataTable from '@/components/RhDataTable.vue'

export default defineComponent({
    components: {
        RhDataTable,
    },
    setup() {
        const onRowClick = (e: any) => {
            console.log(e)
        }

        const columns: DataTableColumn[] = [
            { field: 'pocetJizd', header: 'Počet jízd', sortable: true, type: 'numeric', filterable: true },
            { field: 'material.nazev', header: 'Materiál', filterable: true, sortable: true, type: 'array', controller: 'material' },
            { field: 'auto.spz', header: 'SPZ', filterable: true, filterField: 'auto.normalizedSpz' },
            {
                field: 'auto.spolecnost.nazev',
                header: 'Společnost',
                filterable: true,
                sortable: true,
                filterUnaccent: true,
                filterField: 'auto.spolecnost.normalizedNazev',
            },
            {
                field: 'auto.spolecnost.normalizedNazev',
                header: 'Společnost',
                filterable: true,
                sortable: true,
                controller: 'spolecnost',
                type: 'array',
                optionLabel: 'nazev',
                optionValue: 'id',
                filterField: 'auto.spolecnost.id',
            },
        ]

        return {
            columns,
            onRowClick,
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

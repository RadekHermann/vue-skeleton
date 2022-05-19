import { DataTableFilterMetaData, DataTableOperatorFilterMetaData } from 'primevue/datatable'
import { Filter, QueryOptions } from 'odata-query'

import { FilterMatchMode } from '@/core/types/datatable'

import { DataTableSortEvent } from './../core/types/datatable'

const mapper: { [key: string]: string } = {
    [FilterMatchMode.STARTS_WITH]: 'startswith',
    [FilterMatchMode.CONTAINS]: 'contains',
    [FilterMatchMode.NOT_CONTAINS]: 'contains',
    [FilterMatchMode.ENDS_WITH]: 'endswith',
    [FilterMatchMode.EQUALS]: 'eq',
    [FilterMatchMode.NOT_EQUALS]: 'ne',
    [FilterMatchMode.IN]: 'in',
    [FilterMatchMode.LESS_THAN]: 'lt',
    [FilterMatchMode.LESS_THAN_OR_EQUAL_TO]: 'le',
    [FilterMatchMode.GREATER_THAN]: 'gt',
    [FilterMatchMode.GREATER_THAN_OR_EQUAL_TO]: 'ge',
    [FilterMatchMode.BETWEEN]: 'between',
    [FilterMatchMode.DATE_IS]: 'eq',
    [FilterMatchMode.DATE_IS_NOT]: 'ne',
    [FilterMatchMode.DATE_BEFORE]: 'lt',
    [FilterMatchMode.DATE_AFTER]: 'gt',
}

export function toQuery<T>(e: DataTableSortEvent): Partial<QueryOptions<T>> {
    const skip = e.first
    const top = e.rows

    const orderBy = (
        e.multiSortMeta
            ? e.multiSortMeta.map((m) => m.field + ' ' + (m.order === 1 ? 'asc' : 'desc'))
            : e.sortField
            ? e.sortField + ' ' + (e.sortOrder === 1 ? 'asc' : 'desc')
            : null
    ) as any

    const filter: Filter[] = []

    if (e.filters) {
        Object.keys(e.filters).forEach((key: string) => {
            const f = e.filters[key] as any as DataTableFilterMetaData
            if (f.value !== null && f.value !== undefined) {
                filter.push({ [key]: { [mapper[f.matchMode]]: f.value } })
            } else if ((f as any as DataTableOperatorFilterMetaData).constraints) {
                const o = f as any as DataTableOperatorFilterMetaData
                const op: any = { [o.operator]: [] }
                o.constraints.forEach((cons) => {
                    if (cons.value !== null) {
                        if (cons.matchMode === FilterMatchMode.NOT_CONTAINS) {
                            op[o.operator].push({ not: { [key]: { [mapper[cons.matchMode]]: cons.value } } })
                        } else {
                            op[o.operator].push({ [key]: { [mapper[cons.matchMode]]: cons.value } })
                        }
                    }
                })

                if (op[o.operator].length) {
                    filter.push(op)
                }
            }
        })
    }

    return {
        orderBy,
        skip,
        top,
        filter,
    }
}

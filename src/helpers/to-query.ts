import { DataTableFilterMetaData, DataTableOperatorFilterMetaData } from 'primevue/datatable'
import { Filter, QueryOptions } from 'odata-query'
import { get } from '@vueuse/core'
import { uniq, deburr } from 'lodash'

import { FilterMatchMode, DataTableColumn } from '@/core/types/datatable'

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

type ExpandType = { [key: string]: { select?: string[]; expand?: ExpandType } }

function createExpand(expand: ExpandType, field: string) {
    if (!field) return
    const fields = field.split('.')
    if (fields.length > 1) {
        const f = fields[0]
        const s = fields[1]

        if (!expand[f]) {
            expand[f] = { select: ['id', s], expand: {} }
        } else {
            if (expand[f].select?.indexOf(s) === -1) {
                expand[f].select?.push(s)
            }
        }

        createExpand(expand[f].expand ?? {}, fields.slice(1).join('.'))
    }
}

export function toSelectQuery(columns: DataTableColumn[], selectQuery?: string[]) {
    if (!columns.length) {
        return {}
    }

    const cols = columns.filter((c) => c.field && !c.ignoreQuery)

    const select: string[] = uniq(['id', ...cols.map((m) => m.field.split('.')[0]), ...(selectQuery ?? [])])

    const expand: ExpandType = {}

    cols.filter((f) => f.field.indexOf('.') > 0).forEach((m) => {
        createExpand(expand, m.field)
    })

    if (selectQuery) {
        selectQuery
            .filter((f) => f.indexOf('.') > 0)
            .forEach((m) => {
                createExpand(expand, m)
            })
    }

    return {
        select,
        expand,
    } as any
}

export function toQuery<T>(e: DataTableSortEvent, columns?: DataTableColumn[]): Partial<QueryOptions<T>> {
    const orderBy = (
        (e.multiSortMeta
            ? e.multiSortMeta.map((m) => m.field + ' ' + (m.order === 1 ? 'asc' : 'desc'))
            : e.sortField
            ? e.sortField + ' ' + (e.sortOrder === 1 ? 'asc' : 'desc')
            : null) as string
    )
        .toString()
        .replaceAll('.', '/')

    const filter: Filter[] = []

    if (e.filters) {
        Object.keys(get(e.filters)).forEach((key: string) => {
            const f = get(e.filters)[key] as any as DataTableFilterMetaData
            const col = columns?.find((c) => c.field === key)
            const filterKey = (columns?.find((f) => f.field === key)?.filterField ?? key).replaceAll('.', '/')

            if (f.value !== null && f.value !== undefined && (!Array.isArray(f.value) || f.value.length)) {
                filter.push({ [filterKey]: { [mapper[f.matchMode]]: col?.filterUnaccent ? deburr(f.value) : f.value } })
            } else if ((f as any as DataTableOperatorFilterMetaData).constraints) {
                const o = f as any as DataTableOperatorFilterMetaData
                const op: any = { [o.operator]: [] }

                o.constraints.forEach((cons) => {
                    if (cons.value !== null && cons.value !== undefined && (!Array.isArray(cons.value) || cons.value.length)) {
                        if (cons.matchMode === FilterMatchMode.NOT_CONTAINS) {
                            op[o.operator].push({ not: { [filterKey]: { [mapper[cons.matchMode]]: col?.filterUnaccent ? deburr(cons.value) : cons.value } } })
                        } else {
                            op[o.operator].push({ [filterKey]: { [mapper[cons.matchMode]]: col?.filterUnaccent ? deburr(cons.value) : cons.value } })
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
        filter,
    }
}

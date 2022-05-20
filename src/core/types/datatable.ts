import { DataTableFilterMeta, DataTablePageEvent as DTPE, DataTableSortEvent as DTSE, DataTableFilterEvent as DTFE } from 'primevue/datatable'

export enum FilterMatchMode {
    STARTS_WITH = 'startsWith',
    CONTAINS = 'contains',
    NOT_CONTAINS = 'notContains',
    ENDS_WITH = 'endsWith',
    EQUALS = 'equals',
    NOT_EQUALS = 'notEquals',
    IN = 'in',
    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUAL_TO = 'lte',
    GREATER_THAN = 'gt',
    GREATER_THAN_OR_EQUAL_TO = 'gte',
    BETWEEN = 'between',
    DATE_IS = 'dateIs',
    DATE_IS_NOT = 'dateIsNot',
    DATE_BEFORE = 'dateBefore',
    DATE_AFTER = 'dateAfter',
}

export enum OperatorMode {
    AND = 'and',
    OR = 'or',
}

export type DataTableFilter = DataTableFilterMeta

export type DataTablePageEvent = DTPE
export type DataTableSortEvent = DTSE
export type DataTableFilterEvent = DTFE

export type DTEvent = DataTablePageEvent | DataTableSortEvent | DataTableFilterEvent

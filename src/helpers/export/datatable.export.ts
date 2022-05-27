import { DataTableColumn } from '@/core/types/datatable'
import { useI18n } from 'vue-i18n'

import { exportExcel, ISettings } from '../export-excel'

export function generateExcel(name: string, headers: DataTableColumn[], data: any[]) {
    const exportData = [
        {
            sheet: name,
            columns: [
                ...headers.map((m: DataTableColumn) => {
                    return { label: m.header, value: (row: any) => getData(m, row) }
                }),
            ],
            content: [...data],
        },
    ]

    const settings: ISettings = {
        fileName: name,
        writeOptions: {},
    }

    exportExcel(exportData as any, settings)
}

function getData(header: DataTableColumn, row: any) {
    const { d } = useI18n()

    const properies = header.field.split('.')
    let result: any = row

    if (header.data) {
        return header.data(row)
    }

    properies.forEach((prop) => {
        if (result && result[prop]) {
            result = result[prop]
        } else {
            result = null
        }
    })

    if (result && header.type === 'date') {
        d(result, header.dateFormat ?? 'short')
    }

    return result
}

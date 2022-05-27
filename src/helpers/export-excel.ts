import { utils, write, writeFile } from 'xlsx'

export interface IColumn {
    label: string
    value: any
}

export interface IData {
    sheet: string
    columns: IColumn[]
    content: any[]
}

export interface ISettings {
    extreLength?: number
    fileName?: string
    writeOptions?: any
}

export function exportExcel(data: IData[], settings: ISettings = {}) {
    const extreLength = settings.extreLength === undefined ? 1 : settings.extreLength
    const writeOptions = settings.writeOptions === undefined ? {} : settings.writeOptions

    const wb = utils.book_new()

    data.forEach((actualSheet, actualIndex) => {
        const excelContent: any[] = []
        const excelIndexed: string[] = []

        actualSheet.content.forEach((el1: any) => {
            const obj: any = {}

            actualSheet.columns.forEach((el2: IColumn) => {
                const val = typeof el2.value === 'function' ? el2.value(el1) : el1[el2.value]
                obj[el2.label] = val
            })
            excelContent.push(obj)
        })

        const newSheet = utils.json_to_sheet(excelContent)

        const rangeOfColumns = utils.decode_range(newSheet['!ref'] ?? '')
        for (let c = rangeOfColumns.s.c; c <= rangeOfColumns.e.c; c++) {
            const address = utils.encode_col(c) + '1'
            excelIndexed.push(address)
        }

        newSheet['!cols'] = []
        excelIndexed.forEach((xx: string) => {
            const size = { width: (newSheet[xx].v.length as number) + extreLength }

            for (const keyIndex in newSheet) {
                if (Object.prototype.hasOwnProperty.call(newSheet, keyIndex) && xx.charAt(0) === keyIndex.charAt(0) && keyIndex.length === xx.length) {
                    let consideredElement = newSheet[keyIndex].v
                    if (typeof consideredElement === 'number') consideredElement = `${consideredElement}`
                    if (typeof consideredElement === 'string' && consideredElement.length >= size.width) size.width = consideredElement.length + extreLength
                }
            }

            newSheet['!cols']?.push(size)
        })

        utils.book_append_sheet(wb, newSheet, `${actualSheet.sheet ?? `Sheet ${actualIndex + 1}`}`)
    })

    return writeOptions.type === 'buffer' ? write(wb, writeOptions) : writeFile(wb, `${settings.fileName ?? 'Spreadsheet'}.xlsx`, writeOptions)
}

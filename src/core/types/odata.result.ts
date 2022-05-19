export type ODataResult<T> = {
    value: T[]
    '@odata.count': number
}

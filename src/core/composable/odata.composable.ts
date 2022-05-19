import { ODataResult } from '@/core/types/odata.result'
import { Ref, ref } from 'vue'

import buildQuery, { QueryOptions } from 'odata-query'
import axios, { AxiosError } from 'axios'

// export function useODataListTable<T>(controller: string) {
//     const { count, error, fetchData: fetch, isLoading, result } = useODataList<T>(controller)

//     const fetchData = (query?: Partial<QueryOptions<T>>) => {
//         const { page, rowsPerPage, sortBy, descending } = {pagination}

//         const top = !!rowsPerPage ? rowsPerPage : undefined
//         const skip = !!top ? (page - 1) * top : undefined
//         const orderBy = !!sortBy ? (descending ? `${sortBy.replace('.', '/')} desc` : sortBy.replace('.', '/')) : undefined

//         const queryOptions: Partial<QueryOptions<T>> = { ...query, top, skip, orderBy, count: true }

//         fetch(queryOptions)
//     }

//     return {
//         isLoading,
//         result,
//         count,
//         error,

//         fetchData,
//     }
// }

export function useODataList<T>(controller: string) {
    const isLoading = ref(false)
    const result = ref([]) as Ref<T[]>
    const count = ref(0)
    const error = ref<AxiosError | null>(null)

    const fetchData = (query?: Partial<QueryOptions<T>>) => {
        isLoading.value = true
        error.value = null

        const queryOptions = { ...query, count: true }

        return axios
            .get<ODataResult<T>>(`/odata/${controller}${buildQuery(queryOptions)}`)
            .then(({ data }) => {
                result.value = data.value
                count.value = data['@odata.count']
            })
            .catch((err: AxiosError) => (error.value = err))
            .finally(() => (isLoading.value = false))
    }

    return {
        isLoading,
        result,
        count,
        error,

        fetchData,
    }
}

export function useODataGet<T>(controller: string) {
    const isLoading = ref(false)
    const result = ref(null) as Ref<T | null>
    const error = ref<AxiosError | null>(null)

    const fetchData = (id: string, query?: Partial<QueryOptions<T>>) => {
        isLoading.value = true

        const queryOptions = { ...query, key: { type: 'guid', value: id } }

        axios
            .get<T>(`/odata/${controller}${buildQuery(queryOptions)}`)
            .then(({ data }) => (result.value = data))
            .catch((err: AxiosError) => (error.value = err))
            .finally(() => (isLoading.value = false))
    }

    return {
        isLoading,
        result,
        error,

        fetchData,
    }
}

export function useODataPost<T>(controller: string) {
    const isPosting = ref(false)
    const result = ref(null) as Ref<T | null>
    const error = ref<AxiosError | null>(null)

    const postData = (data: Partial<T>) => {
        isPosting.value = true
        error.value = null

        return axios
            .post<T>(`/odata/${controller}`, data)
            .then(({ data }) => (result.value = data))
            .catch((err: AxiosError) => (error.value = err))
            .finally(() => (isPosting.value = false))
    }

    return {
        isPosting,
        result,
        error,

        postData,
    }
}

export function useODataPatch<T>(controller: string) {
    const isPatching = ref(false)
    const result = ref(null) as Ref<T | null>
    const error = ref<AxiosError | null>(null)

    const patchData = (id: string, data: Partial<T>) => {
        isPatching.value = true
        error.value = null

        return axios
            .patch<T>(`/odata/${controller}${buildQuery({ key: { value: id, type: 'guid' } })}`, data)
            .then(({ data }) => (result.value = data))
            .catch((err: AxiosError) => (error.value = err))
            .finally(() => (isPatching.value = false))
    }

    return {
        isPatching,
        result,
        error,

        patchData,
    }
}

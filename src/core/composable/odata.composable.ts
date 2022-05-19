import { Ref, ref } from 'vue'

import { set } from '@vueuse/core'

import buildQuery, { QueryOptions } from 'odata-query'
import axios, { AxiosError } from 'axios'

import { ODataResult } from '@/core/types/odata.result'
import { ODataKey } from '@/core/types/odata.key'

const baseURL = '/odata/'

export function useODataList<T>(controller: string) {
    const isLoading = ref(false)
    const result = ref([]) as Ref<T[]>
    const count = ref(0)
    const error = ref<AxiosError | null>(null)

    const fetchData = (query?: Partial<QueryOptions<T>>) => {
        set(isLoading, true)
        set(error, null)

        const queryOptions = { ...query, count: true }

        return axios
            .get<ODataResult<T>>(baseURL + `${controller}${buildQuery(queryOptions)}`)
            .then(({ data }) => {
                set(result, data.value)
                set(count, data['@odata.count'])
            })
            .catch((err: AxiosError) => set(error, err))
            .finally(() => set(isLoading, false))
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

    const fetchData = (id: ODataKey, query?: Partial<QueryOptions<T>>) => {
        set(isLoading, true)
        set(error, null)

        const queryOptions = { ...query, key: id }

        axios
            .get<T>(baseURL + `${controller}${buildQuery(queryOptions)}`)
            .then(({ data }) => set(result, data))
            .catch((err: AxiosError) => set(error, err))
            .finally(() => set(isLoading, false))
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
        set(isPosting, true)
        set(error, null)

        return axios
            .post<T>(baseURL + `${controller}`, data)
            .then(({ data }) => set(result, data))
            .catch((err: AxiosError) => set(error, err))
            .finally(() => set(isPosting, false))
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

    const patchData = (id: ODataKey, data: Partial<T>) => {
        set(isPatching, true)
        set(error, null)

        return axios
            .patch<T>(baseURL + `${controller}${buildQuery({ key: { value: id, type: 'guid' } })}`, data)
            .then(({ data }) => set(result, data))
            .catch((err: AxiosError) => set(error, err))
            .finally(() => set(isPatching, false))
    }

    return {
        isPatching,
        result,
        error,

        patchData,
    }
}

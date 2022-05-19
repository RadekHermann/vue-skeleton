import { computed, reactive, readonly } from 'vue'
import { useRouter } from 'vue-router'
import { defineStore } from 'pinia'

import axios, { AxiosError } from 'axios'
import { User } from '@/models/user'

type AuthState = {
    user: User | null

    isLoginLoading: boolean
    isInitLoading: boolean

    loginError: AxiosError | null
}

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()

    const state = reactive<AuthState>({
        user: null,
        isInitLoading: false,
        isLoginLoading: false,

        loginError: null,
    })

    const isLoggedIn = computed(() => !!state.user)

    const logIn = (userName: string, password: string, rememberMe: boolean) => {
        state.isLoginLoading = true
        state.loginError = null
        axios
            .post('/api/auth/login', { userName, password, rememberMe })
            .then(
                () =>
                    initUser().then(() => {
                        router.push(router.currentRoute.value.query['redirect']?.toString() ?? '/')
                    }),
                (e: AxiosError) => (state.loginError = e)
            )
            .finally(() => (state.isLoginLoading = false))
    }

    const logOut = () => {
        axios.get('/api/auth/logout').finally(() => {
            window.location.reload()
        })
    }

    const initUser = () => {
        state.isInitLoading = false

        return axios
            .get<User>('/api/auth/user')
            .then(({ data }) => (state.user = data))
            .catch(() => {
                if (router.currentRoute.value.meta.auth && router.currentRoute.value.name !== 'auth.login.page') {
                    router.push({ name: 'auth.login.page', query: { redirect: router.currentRoute.value.path } })
                }
            })
            .finally(() => (state.isInitLoading = false))
    }

    initUser().then()

    return {
        state: readonly(state),

        isLoggedIn,

        logIn,
        logOut,
    }
})

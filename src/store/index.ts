import { computed, reactive, readonly } from 'vue'
import { defineStore } from 'pinia'

type AuthState = {
    user: any
}

export const useAppStore = defineStore('auth', () => {
    const state = reactive<AuthState>({
        user: null,
    })

    const setUser = (user: any) => {
        state.user = user
    }

    const getUser = computed(() => state.user)
    const userUpper = computed(() => state.user?.name?.toUpperCase())
    const isLoggedIn = computed(() => !!state.user)

    return {
        state: readonly<AuthState>(state),
        userUpper,
        isLoggedIn,
        getUser,

        setUser,
    }
})

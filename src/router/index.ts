import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { get } from '@vueuse/core'

import { storeToRefs } from 'pinia'

import { useAuthStore } from './../store/auth.store'

import AppLayout from '../layouts/app/AppLayout.vue'
import EmptyLayout from '../layouts/EmptyLayout.vue'

import EmptyPage from '../pages/EmptyPage.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '',
                component: EmptyPage,
            },
            {
                path: 'empty',
                meta: {
                    breadcrumb: {
                        labelKey: 'empty',
                        href: true,
                    },
                },
                component: EmptyPage,
            },
            {
                path: 'web-rtc',
                component: EmptyLayout,
                children: [
                    {
                        path: 'video',
                        component: () => import('../pages/web-rtc/share-video.vue'),
                    },
                ],
            },
        ],
    },
    {
        path: '/auth',
        component: EmptyLayout,
        children: [
            {
                path: '',
                redirect: { name: 'auth.login.page' },
            },
            {
                path: 'login',
                name: 'auth.login.page',
                component: () => import('../pages/auth/LoginPage.vue'),
            },
        ],
    },
    {
        path: '/error',
        name: 'error.page',
        component: () => import('../pages/ErrorPage.vue'),
    },
    {
        path: '/access-denied',
        name: 'access-denied.page',
        component: () => import('../pages/AccessDeniedPage.vue'),
    },
    {
        path: '/not-found',
        name: 'not-found.page',
        component: () => import('../pages/NotFoundPage.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'not-found.page' },
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

router.beforeEach((to, _from, next) => {
    window.scrollTo(0, 0)

    const { isLoggedIn } = storeToRefs(useAuthStore())

    if (to.matched.some((m) => m.meta.auth) && !get(isLoggedIn)) {
        next({ name: 'auth.login.page' })
        return
    }

    next()
})

export default router

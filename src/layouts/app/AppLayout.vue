<template>
    <div :class="containerClass" @click="onWrapperClick">
        <AppTopbar @menu-toggle="onMenuToggle" />
        <div class="layout-sidebar" @click="onSidebarClick">
            <AppMenu @menuitem-click="onMenuItemClick" />
        </div>

        <div class="layout-main-container">
            <div class="layout-main">
                <AppBreadcrumb />

                <router-view />
            </div>
            <AppFooter />
        </div>

        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeUpdate } from 'vue'
import { get, set } from '@vueuse/core'

import { MenuItem } from '@/core/types/menu-item'

import AppBreadcrumb from './AppBreadcrumb.vue'
import AppTopbar from './AppTopbar.vue'
import AppMenu from './AppMenu.vue'
import AppFooter from './AppFooter.vue'

export default defineComponent({
    components: {
        AppBreadcrumb: AppBreadcrumb,
        AppTopbar: AppTopbar,
        AppMenu: AppMenu,
        AppFooter: AppFooter,
    },
    setup() {
        const menuClick = ref(false)
        const menuInactive = ref(false)
        const mobileMenuActive = ref(false)

        const isDesktop = () => {
            return window.innerWidth >= 992
        }

        const onWrapperClick = () => {
            if (!get(menuClick)) {
                set(mobileMenuActive, false)
            }

            set(menuClick, false)
        }

        const onMenuToggle = () => {
            set(menuClick, true)
            if (isDesktop()) {
                set(menuInactive, !get(menuInactive))
            } else {
                set(mobileMenuActive, !get(mobileMenuActive))
            }
        }

        const onSidebarClick = () => {
            set(menuClick, true)
        }

        const onMenuItemClick = (e: { item: MenuItem }) => {
            if (e.item && !e.item.items) {
                set(mobileMenuActive, false)
            }
        }

        const addClass = (element: HTMLElement, className: string) => {
            if (element.classList) element.classList.add(className)
            else element.className += ' ' + className
        }

        const removeClass = (element: HTMLElement, className: string) => {
            if (element.classList) element.classList.remove(className)
            else element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
        }

        const isSidebarVisible = () => {
            if (isDesktop()) {
                return !get(menuInactive)
            }
            return true
        }

        const containerClass = computed(() => {
            return [
                'layout-wrapper',
                'layout-static',
                {
                    'layout-static-sidebar-inactive': get(menuInactive),
                    'layout-mobile-sidebar-active': get(mobileMenuActive),
                },
            ]
        })

        onBeforeUpdate(() => {
            if (get(mobileMenuActive)) addClass(document.body, 'body-overflow-hidden')
            else removeClass(document.body, 'body-overflow-hidden')
        })

        return {
            containerClass,
            menuClick,
            menuInactive,
            mobileMenuActive,

            isDesktop,
            isSidebarVisible,

            onWrapperClick,
            onMenuToggle,
            onSidebarClick,
            onMenuItemClick,
        }
    },
})
</script>

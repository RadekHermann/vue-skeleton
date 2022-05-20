<template>
    <div :class="containerClass" @click="onWrapperClick">
        <AppTopbar @menu-toggle="onMenuToggle" />
        <div class="layout-sidebar" @click="onSidebarClick">
            <AppMenu @menuitem-click="onMenuItemClick" />
        </div>

        <div class="layout-main-container">
            <div class="layout-main-breadcrumb">
                <div class="layout-breadcrumb flex gap-1">
                    <AppBreadcrumb class="flex-1" />
                    <div class="flex-none flex align-items-center">
                        <PButton icon="pi pi-sign-in" class="p-button-rounded p-button-text mx-1" />
                        <PButton icon="pi pi-sign-in" class="p-button-rounded p-button-text mx-1" />
                        <PButton icon="pi pi-sign-in" class="p-button-rounded p-button-text mx-1" />
                    </div>
                </div>
            </div>
            <div class="layout-main">
                <router-view />
            </div>
            <AppFooter />
        </div>

        <transition name="layout-mask">
            <div class="layout-mask p-component-overlay" v-if="appState.mobileMenuActive"></div>
        </transition>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeUpdate } from 'vue'
import { get, set } from '@vueuse/core'

import { MenuItem } from '@/core/types/menu-item'

import AppTopbar from './AppTopbar.vue'
import AppMenu from './AppMenu.vue'
import AppFooter from './AppFooter.vue'
import { useAppStore } from '@/store/app.store'
import AppBreadcrumb from './AppBreadcrumb.vue'

export default defineComponent({
    components: {
        AppTopbar: AppTopbar,
        AppMenu: AppMenu,
        AppFooter: AppFooter,
        AppBreadcrumb,
    },
    setup() {
        const menuClick = ref(false)

        const { state: appState, isDesktop, setMenuInactive, setMobileMenuActive } = useAppStore()

        const onWrapperClick = () => {
            if (!get(menuClick)) {
                setMobileMenuActive(false)
            }

            set(menuClick, false)
        }

        const onMenuToggle = () => {
            set(menuClick, true)
            if (isDesktop()) {
                setMenuInactive(!appState.menuInactive)
            } else {
                setMobileMenuActive(!appState.mobileMenuActive)
            }
        }

        const onSidebarClick = () => {
            set(menuClick, true)
        }

        const onMenuItemClick = (e: { item: MenuItem }) => {
            if (e.item && !e.item.items) {
                setMobileMenuActive(false)
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
                return !get(appState.menuInactive)
            }
            return true
        }

        const containerClass = computed(() => {
            return [
                'layout-wrapper',
                'layout-static',
                {
                    'layout-static-sidebar-inactive': appState.menuInactive,
                    'layout-mobile-sidebar-active': appState.mobileMenuActive,
                },
            ]
        })

        onBeforeUpdate(() => {
            if (get(appState.mobileMenuActive)) addClass(document.body, 'body-overflow-hidden')
            else removeClass(document.body, 'body-overflow-hidden')
        })

        return {
            appState,

            containerClass,
            menuClick,

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

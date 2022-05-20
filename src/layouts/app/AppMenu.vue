<template>
    <PToolbar class="p-toolbar-header">
        <template #start>
            <span class="text-2xl">RH Skeleton APP</span>
        </template>
    </PToolbar>
    <div class="layout-sidebar-content">
        <div class="layout-menu-container">
            <AppSubMenu :items="menu" class="layout-menu" :root="true" @menuitem-click="$emit('menuitem-click', $event)" @keydown="onKeyDown" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { MenuItem } from '@/core/types/menu-item'

import AppSubMenu from './AppSubMenu.vue'

export default defineComponent({
    components: {
        AppSubMenu: AppSubMenu,
    },
    emits: ['menuitem-click'],
    setup() {
        const menu: MenuItem[] = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        to: '/',
                    },
                ],
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-clone',
                items: [
                    { label: 'Crud', icon: 'pi pi-fw pi-user-edit', to: '/crud' },
                    { label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/timeline' },
                    { label: 'Landing', icon: 'pi pi-fw pi-globe', to: '/landing' },
                    { label: 'Login', icon: 'pi pi-fw pi-sign-in', to: '/login' },
                    { label: 'Error', icon: 'pi pi-fw pi-times-circle', to: '/error' },
                    { label: 'Not Found', icon: 'pi pi-fw pi-exclamation-circle', to: '/notfound' },
                    { label: 'Access Denied', icon: 'pi pi-fw pi-lock', to: '/access' },
                    { label: 'Empty', icon: 'pi pi-fw pi-circle-off', to: '/empty' },
                ],
            },
            {
                label: 'Menu Hierarchy',
                icon: 'pi pi-fw pi-search',
                items: [
                    {
                        label: 'Submenu 1',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 1.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ],
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark', to: '/empty' },
                                    { label: 'Submenu 1.2.2', icon: 'pi pi-fw pi-bookmark' },
                                ],
                            },
                        ],
                    },
                    {
                        label: 'Submenu 2',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Submenu 2.1',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.1.3', icon: 'pi pi-fw pi-bookmark' },
                                ],
                            },
                            {
                                label: 'Submenu 2.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [
                                    { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 2.2.2', icon: 'pi pi-fw pi-bookmark' },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                label: 'Get Started',
                items: [
                    {
                        label: 'Documentation',
                        icon: 'pi pi-fw pi-question',
                        command: () => {
                            window.location.href = '#/documentation'
                        },
                    },
                    {
                        label: 'View Source',
                        icon: 'pi pi-fw pi-search',
                        command: () => {
                            window.location.href = 'https://github.com/primefaces/sakai-vue'
                        },
                    },
                ],
            },
        ]

        const onKeyDown = (event: KeyboardEvent) => {
            const nodeElement = event.target as any
            if (event.code === 'Enter' || event.code === 'Space') {
                nodeElement.click()
                event.preventDefault()
            }
        }

        return {
            onKeyDown,

            menu,
        }
    },
})
</script>

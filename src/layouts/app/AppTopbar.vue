<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <span>SAKAI</span>
        </router-link>
        <button class="p-link layout-menu-button layout-topbar-button" @click="$emit('menu-toggle', $event)">
            <i class="pi pi-bars"></i>
        </button>

        <button
            class="p-link layout-topbar-menu-button layout-topbar-button"
            v-styleclass="{
                selector: '@next',
                enterClass: 'hidden',
                enterActiveClass: 'scalein',
                leaveToClass: 'hidden',
                leaveActiveClass: 'fadeout',
                hideOnOutsideClick: true,
            }"
        >
            <i class="pi pi-ellipsis-v"></i>
        </button>
        <PDivider layout="vertical" />
        <div>
            <AppBreadcrumb />
        </div>

        <ul class="layout-topbar-menu hidden lg:flex origin-top">
            <li>
                <button class="p-link layout-topbar-button">
                    <i class="pi pi-calendar"></i>
                    <span>Events</span>
                </button>
            </li>
            <li>
                <button class="p-link layout-topbar-button">
                    <i class="pi pi-cog"></i>
                    <span>Settings</span>
                </button>
            </li>
            <li>
                <button class="p-link layout-topbar-button">
                    <i class="pi pi-user"></i>
                    <span>Profile</span>
                </button>
            </li>
            <li>
                <button class="p-link layout-topbar-button" @click="logOut" v-tooltip.bottom="'Odhlásit'">
                    <i class="pi pi-sign-out"></i>
                    <span>Odhlásit</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/auth.store'
import AppBreadcrumb from './AppBreadcrumb'

const { logOut } = useAuthStore()
</script>

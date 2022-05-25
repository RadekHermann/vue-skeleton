<template>
    <div class="layout-toolbar" :class="{ open: !appState.menuInactive && isDesktop() }">
        <PToolbar>
            <template #start>
                <div
                    class="pi text-2xl toolbar-menu-icon"
                    :class="{ open: !appState.menuInactive && isDesktop(), 'pi-angle-double-right': isDesktop(), 'pi-bars': !isDesktop() }"
                    @click="$emit('menu-toggle', $event)"
                ></div>
            </template>
            <h1>TEST</h1>
            <template #end>
                <PButton icon="pi pi-search" class="mr-2" />
                <p-divider layout="vertical" />
                <PButton icon="pi pi-calendar" class="p-button-success mr-2" />
                <template v-if="authState.user">
                    <p-divider layout="vertical" />
                    <PButton icon="pi pi-sign-out" iconPos="right" class="p-button-text" :label="authState.user?.userName" @click="logOut" />
                </template>
                <template v-else>
                    <p-divider layout="vertical" />
                    <PButton icon="pi pi-sign-in" iconPos="right" class="p-button-text" @click="router.push({ name: 'auth.login.page' })" />
                </template>
            </template>
        </PToolbar>
    </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app.store'
import { useAuthStore } from '@/store/auth.store'
import { useRouter } from 'vue-router'

const router = useRouter()

const { state: appState, isDesktop } = useAppStore()
const { state: authState, logOut } = useAuthStore()
</script>

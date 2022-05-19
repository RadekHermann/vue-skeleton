<template>
    <router-view />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app.store'
import { useAuthStore } from '@/store/auth.store'

useAppStore()
useAuthStore()
</script>

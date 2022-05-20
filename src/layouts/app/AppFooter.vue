<template>
    <div class="layout-footer flex justify-content-between flex-wrap">
        <div class="flex align-items-center justify-content-center"></div>
        <div class="flex align-items-center justify-content-center"><CountryFlag code="cz" /> <span class="font-medium ml-2">PrimeVue</span></div>
        <div class="flex align-items-center justify-content-center">
            <DarkmodeSwitch />
        </div>
    </div>
</template>

<script lang="ts" setup>
import DarkmodeSwitch from '@/components/DarkmodeSwitch.vue'
</script>

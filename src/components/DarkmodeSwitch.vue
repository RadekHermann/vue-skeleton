<template>
    <PButton
        icon="fa-solid fa-lightbulb"
        :style="darkThemeStyle"
        class="p-button-rounded p-button-text"
        @click="toggleDarkTheme"
        v-tooltip.left="!app.darkTheme ? t('DarkMode') : t('LightMode')"
        v-bind="$attrs"
    />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/app.store'

const { t } = useI18n({ inheritLocale: true, useScope: 'local' })
const { state: app, toggleDarkTheme } = useAppStore()

const darkThemeStyle = computed(() => {
    return {
        color: app.darkTheme ? 'var(--yellow-500)' : 'var(--gray-800)',
    }
})
</script>

<i18n>
{
    cs: {
        'DarkMode': 'Tmavý režim',
        'LightMode': 'Světlý režim',
    }
}
</i18n>

<template>
    <div>
        <PBreadcrumb :home="home" :model="items" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

export default defineComponent({
    setup() {
        const route = useRoute()
        const { t } = useI18n()

        const items = ref<{ label: string; to: string | null }[]>([])

        const home = ref({
            icon: 'pi pi-home',
            to: '/',
        })

        watch(
            () => route.path,
            () => {
                items.value = route.matched
                    .filter((f) => !!f.meta.breadcrumb)
                    .map((m) => {
                        const bc = m.meta.breadcrumb as any

                        return {
                            label: bc.labelKey ? t(bc.labelKey) : bc.label,
                            to: bc.href ? m.path : null,
                        }
                    })
            },
            { immediate: true }
        )

        return {
            home,
            items,
        }
    },
})
</script>

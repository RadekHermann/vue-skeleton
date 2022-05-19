<template>
    <span :class="flag" :style="style" v-bind="$attrs" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
    props: {
        code: {
            type: String,
            required: true,
        },
        width: {
            type: Number,
            default: 18,
        },
        height: {
            type: Number,
            default: 12,
        },
    },
    setup(props) {
        const style = computed(() => {
            return {
                width: `${props.width}px`,
                height: `${props.height}px`,
            }
        })

        const flag = computed(() => {
            return `flag flag-${props.code}`
        })

        return { flag, style }
    },
})
</script>

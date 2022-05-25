<template>
    <PMultiSelect
        :modelValue="modelValue"
        :options="result"
        :optionLabel="optionLabel"
        :optionValue="optionValue"
        @update:modelValue="$emit('update:modelValue', $event)"
    />
</template>

<script lang="ts">
import { useODataList } from '@/core/composable/odata.composable'
import { defineComponent, onMounted } from 'vue'

export default defineComponent({
    props: {
        modelValue: {
            type: Array,
            default: () => [],
        },
        controller: {
            type: String,
            required: true,
        },
        optionValue: {
            type: String,
            default: 'id',
        },
        optionLabel: {
            type: String,
            default: 'nazev',
        },
    },

    setup(props) {
        const { isLoading, fetchData, result } = useODataList(props.controller)

        onMounted(() => {
            fetchData({ orderBy: props.optionLabel })
        })

        return {
            isLoading,
            result,
        }
    },
})
</script>

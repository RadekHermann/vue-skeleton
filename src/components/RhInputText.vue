<template>
    <div class="field" v-bind="$attrs">
        <label v-if="!float" :for="id" class="block mb-2" :class="labelClass" :style="labelStyle"
            >{{ label }} <span v-if="required" style="color: red">*</span>
        </label>
        <span class="block" :class="{ 'p-float-label': float, 'p-input-icon-left': iconLeft, 'p-input-icon-right': iconRight }">
            <i v-if="iconLeft" :class="iconLeft" />
            <PInputText
                :id="id"
                :type="type"
                class="w-full"
                :class="[inputClass, { 'p-invalid': invalid && validate }]"
                :style="inputStyle"
                :modelValue="modelValue"
                :placeholder="placeholder"
            />
            <i v-if="iconRight" :class="iconRight" />
            <label v-if="float && label" :for="id" class="block mb-2" :class="labelClass" :style="labelStyle"
                >{{ label }} <span v-if="required" style="color: red">*</span>
            </label>
        </span>
        <small v-if="hintText" class="blick">{{ hintText }}</small>
        <small v-if="invalid && validate" class="block p-error">
            {{ errorText }}
        </small>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { v4 as uuid } from 'uuid'

export default defineComponent({
    props: {
        modelValue: String,
        label: String,
        placeholder: String,

        type: {
            type: String,
            default: 'text',
        },

        required: {
            type: Boolean,
            default: false,
        },

        validate: {
            type: Boolean,
            default: false,
        },

        float: {
            type: Boolean,
            default: true,
        },

        invalid: Boolean,
        errorText: String,

        hintText: String,

        iconLeft: String,
        iconRight: String,

        labelClass: String,
        labelStyle: String,

        inputClass: String,
        inputStyle: String,
    },
    emits: ['update:modelValue'],
    setup() {
        return {
            id: uuid(),
        }
    },
})
</script>

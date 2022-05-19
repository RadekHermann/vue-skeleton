<template>
    <ul v-if="items">
        <template v-for="(item, i) of items">
            <li
                v-if="visible(item) && !item.separator"
                :key="item.label || i"
                :class="[{ 'layout-menuitem-category': root, 'active-menuitem': activeIndex === i && !item.to && !item.disabled }]"
                role="none"
            >
                <template v-if="root">
                    <div class="layout-menuitem-root-text" :aria-label="item.label">{{ item.label }}</div>
                    <AppSubMenu :items="visible(item) && item.items" @menuitem-click="$emit('menuitem-click', $event)" />
                </template>
                <template v-else>
                    <router-link
                        v-if="item.to"
                        :to="item.to"
                        :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]"
                        :style="item.style"
                        @click="onMenuItemClick($event, item, i)"
                        :target="item.target"
                        :aria-label="item.label"
                        exact
                        role="menuitem"
                        v-ripple
                    >
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                        <i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>
                        <PBadge v-if="item.badge" :value="item.badge" :severity="item.badgeSeverity" :class="item.badgeClass" />
                    </router-link>
                    <a
                        v-if="!item.to"
                        :href="item.url || '#'"
                        :style="item.style"
                        :class="[item.class, 'p-ripple', { 'p-disabled': item.disabled }]"
                        @click="onMenuItemClick($event, item, i)"
                        :target="item.target"
                        :aria-label="item.label"
                        role="menuitem"
                        v-ripple
                    >
                        <i :class="item.icon"></i>
                        <span>{{ item.label }}</span>
                        <i v-if="item.items" class="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>
                        <PBadge v-if="item.badge" :value="item.badge" />
                    </a>
                    <transition name="layout-submenu-wrapper">
                        <AppSubMenu
                            v-show="activeIndex === i"
                            :items="visible(item) && item.items"
                            @menuitem-click="$emit('menuitem-click', $event)"
                        ></AppSubMenu>
                    </transition>
                </template>
            </li>
            <li class="p-menu-separator" :style="item.style" v-if="visible(item) && item.separator" :key="'separator' + i" role="separator"></li>
        </template>
    </ul>
</template>
<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { get, set } from '@vueuse/core'

import { MenuItem } from '@/core/types/menu-item'

export default defineComponent({
    props: {
        items: {
            type: Array as () => MenuItem[],
            default: () => [],
        },
        root: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['menuitem-click'],
    setup(_props, { emit }) {
        const activeIndex = ref(null) as Ref<number | null>

        const onMenuItemClick = (event: Event, item: MenuItem, index: number) => {
            if (item.disabled) {
                event.preventDefault()
                return
            }

            if (!item.to && !item.url) {
                event.preventDefault()
            }

            if (item.command) {
                item.command({ originalEvent: event, item: item })
            }

            set(activeIndex, index === get(activeIndex) ? null : index)

            emit('menuitem-click', {
                originalEvent: event,
                item: item,
            })
        }

        const visible = (item: MenuItem) => (typeof item.visible === 'function' ? item.visible() : item.visible !== false)

        return {
            activeIndex,

            onMenuItemClick,
            visible,
        }
    },
})
</script>

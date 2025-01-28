<template>
    <span class="icon" v-html="iconSvg" :style="styles"></span>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { icons } from './index'

const props = defineProps({
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        default: '24px'
    },
    color: {
        type: String,
        default: 'currentColor'
    }
})

console.log('Available icons:', Object.keys(icons))
console.log('Requested icon:', props.name)

const iconSvg = computed(() => {
    const svg = icons[props.name]
    console.log('Icon SVG:', svg)
    return svg || ''
})

const styles = computed(() => ({
    width: props.size,
    height: props.size,
    color: props.color
}))
</script>

<style scoped>
.icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.icon :deep(svg) {
    width: 100%;
    height: 100%;
}
</style>

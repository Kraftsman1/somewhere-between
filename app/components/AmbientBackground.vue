<template>
  <div
    class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-bg transition-colors duration-[3000ms] ease-in-out"
    :style="{ backgroundColor: warmthColor }">
    <!-- Animated background elements (orbs) -->
    <div ref="dot1"
      class="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full bg-accent/20 blur-3xl opacity-60 transition-all duration-[3000ms]"
      :class="{ 'blur-[120px] scale-125 opacity-40': isGlowing }"></div>
    <div ref="dot2"
      class="absolute bottom-1/3 right-1/4 w-72 md:w-80 h-72 md:h-80 rounded-full bg-accent-warm/15 blur-3xl opacity-60 transition-all duration-[3000ms]"
      :class="{ 'blur-[100px] scale-110 opacity-30': isGlowing }"></div>
    <div ref="dot3"
      class="absolute top-3/4 left-1/2 w-64 md:w-80 h-64 md:h-80 rounded-full bg-accent/10 blur-3xl opacity-50 transition-all duration-[3000ms]"
      :class="{ 'blur-[80px] scale-105 opacity-20': isGlowing }"></div>
  </div>
</template>

<script setup lang="ts">
import { animate } from 'animejs'

const props = defineProps<{
  isStill?: boolean
  isGlowing?: boolean
  warmthLevel?: number // 0 to 1
  depthLevel?: number // 0 to 1
}>()

const dot1 = ref<HTMLElement | null>(null)
const dot2 = ref<HTMLElement | null>(null)
const dot3 = ref<HTMLElement | null>(null)

// Computed warmth color
const warmthColor = computed(() => {
  if (!props.warmthLevel) return '' // Uses CSS default
  const level = props.warmthLevel
  // Mix neutral bg with a warm tone (fdfaf6 is --color-bg)
  // We'll use a CSS variable calculation or just return a hex overlay
  return `rgba(253, 250, 246, ${1 - level})`
})

// Store animation instances
const anim1 = ref<any>(null)
const anim2 = ref<any>(null)
const anim3 = ref<any>(null)

// Watch `isStill` to pause/play
watch(() => props.isStill, (newVal) => {
  if (newVal) {
    anim1.value?.pause()
    anim2.value?.pause()
    anim3.value?.pause()
  } else {
    anim1.value?.play()
    anim2.value?.play()
    anim3.value?.play()
  }
})

// Update speeds based on depthLevel
watch(() => props.depthLevel, (newVal = 0) => {
  const speedMult = 1 - (newVal * 0.5) // Slower = more depth
  // Note: anime.js v4 might not support setting duration on existing instances easily without recreate
  // For now, we'll keep it simple or recreate if needed.
})

onMounted(() => {
  if (dot1.value) {
    anim1.value = animate(dot1.value, {
      translateX: [-20, 40],
      translateY: [-20, 20],
      scale: [0.9, 1.1],
      duration: 15000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true
    })
  }

  if (dot2.value) {
    anim2.value = animate(dot2.value, {
      translateX: [20, -30],
      translateY: [10, -50],
      scale: [1, 1.2],
      duration: 18000,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true
    })
  }

  if (dot3.value) {
    anim3.value = animate(dot3.value, {
      translateX: [-30, 30],
      translateY: [20, -20],
      duration: 22000,
      easing: 'easeInOutQuad',
      direction: 'alternate',
      loop: true
    })
  }
})
</script>

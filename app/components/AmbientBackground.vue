<template>
  <div
    class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-bg transition-colors duration-[3000ms] ease-in-out"
    :style="{ backgroundColor: warmthColor }">
    <!-- Animated background elements (orbs) -->
    <div ref="dot1"
      class="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 rounded-full bg-accent/15 blur-2xl opacity-50"></div>
    <div ref="dot2"
      class="absolute bottom-1/3 right-1/4 w-72 md:w-80 h-72 md:h-80 rounded-full bg-accent-warm/10 blur-2xl opacity-50">
    </div>
    <div ref="dot3"
      class="absolute top-3/4 left-1/2 w-64 md:w-80 h-64 md:h-80 rounded-full bg-accent/10 blur-2xl opacity-40"></div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

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
  if (!props.warmthLevel) return ''
  const level = props.warmthLevel
  return `rgba(253, 250, 246, ${1 - level})`
})

// Store animation timelines
const floatTls = ref<gsap.core.Timeline[]>([])

// Watch `isStill` to pause/play
watch(() => props.isStill, (newVal) => {
  floatTls.value.forEach(tl => newVal ? tl.pause() : tl.play())
})

// Smooth property updates using GSAP
watch(() => props.isGlowing, (newVal) => {
  const dots = [dot1.value, dot2.value, dot3.value]
  gsap.to(dots, {
    filter: newVal ? 'blur(60px)' : 'blur(30px)',
    scale: newVal ? 1.15 : 1,
    opacity: newVal ? 0.35 : 0.5,
    duration: 3,
    stagger: 0.1,
    ease: 'sine.inOut'
  })
})

const initFloating = (el: HTMLElement, xRange: number[], yRange: number[], duration: number) => {
  const tl = gsap.timeline({ repeat: -1, yoyo: true })
  tl.to(el, {
    x: xRange[1],
    y: yRange[1],
    duration: duration,
    ease: 'sine.inOut'
  })
  return tl
}

onMounted(() => {
  if (dot1.value) floatTls.value.push(initFloating(dot1.value, [-40, 40], [-30, 30], 15))
  if (dot2.value) floatTls.value.push(initFloating(dot2.value, [30, -30], [20, -40], 18))
  if (dot3.value) floatTls.value.push(initFloating(dot3.value, [-30, 30], [30, -30], 22))

  // Set initial states
  gsap.set([dot1.value, dot2.value, dot3.value], {
    filter: props.isGlowing ? 'blur(60px)' : 'blur(30px)',
    scale: props.isGlowing ? 1.15 : 1,
    opacity: props.isGlowing ? 0.35 : 0.5
  })
})
</script>

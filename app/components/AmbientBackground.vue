<template>
  <div
    class="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-[3000ms] ease-in-out"
    :style="{ backgroundColor: warmthColor }">

    <!-- Orb 1: main accent blush, top-left -->
    <div ref="dot1"
      class="orb absolute top-1/4 left-1/5 w-56 md:w-[28rem] h-56 md:h-[28rem] rounded-full"
      style="background: radial-gradient(circle, rgba(190,152,152,0.25) 0%, transparent 70%);"></div>

    <!-- Orb 2: warm amber, bottom-right -->
    <div ref="dot2"
      class="orb absolute bottom-1/4 right-1/5 w-64 md:w-[32rem] h-64 md:h-[32rem] rounded-full"
      style="background: radial-gradient(circle, rgba(201,144,96,0.18) 0%, transparent 70%);"></div>

    <!-- Orb 3: accent, bottom-left -->
    <div ref="dot3"
      class="orb absolute top-2/3 left-1/3 w-48 md:w-96 h-48 md:h-96 rounded-full"
      style="background: radial-gradient(circle, rgba(190,152,152,0.15) 0%, transparent 70%);"></div>

    <!-- Orb 4: blush right — desktop only (blur is GPU-expensive on mobile) -->
    <div ref="dot4"
      class="orb hidden md:block absolute top-1/3 right-1/4 w-80 h-80 rounded-full"
      style="background: radial-gradient(circle, rgba(215,175,155,0.12) 0%, transparent 70%);"></div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const props = defineProps<{
  isStill?: boolean
  isGlowing?: boolean
  warmthLevel?: number
  depthLevel?: number
}>()

const dot1 = ref<HTMLElement | null>(null)
const dot2 = ref<HTMLElement | null>(null)
const dot3 = ref<HTMLElement | null>(null)
const dot4 = ref<HTMLElement | null>(null)

const warmthColor = computed(() => {
  if (!props.warmthLevel) return '#faf5ee'
  const l = props.warmthLevel
  const r = Math.min(255, Math.round(250 + l * 3))
  const g = Math.round(245 - l * 12)
  const b = Math.round(238 - l * 30)
  return `rgb(${r}, ${g}, ${b})`
})

const floatTls = ref<gsap.core.Timeline[]>([])

watch(() => props.isStill, (paused) => {
  floatTls.value.forEach(tl => paused ? tl.pause() : tl.play())
})

watch(() => props.isGlowing, (glow) => {
  const dots = [dot1.value, dot2.value, dot3.value, dot4.value].filter(Boolean)
  gsap.to(dots, {
    scale: glow ? 1.18 : 1,
    opacity: glow ? 0.45 : 0.6,
    duration: 3,
    stagger: 0.12,
    ease: 'sine.inOut'
  })
})

const initFloating = (el: HTMLElement, x: number[], y: number[], dur: number) => {
  const tl = gsap.timeline({ repeat: -1, yoyo: true })
  tl.to(el, { x: x[1], y: y[1], duration: dur, ease: 'sine.inOut' })
  return tl
}

onMounted(() => {
  if (dot1.value) floatTls.value.push(initFloating(dot1.value, [-40, 40], [-30, 28], 16))
  if (dot2.value) floatTls.value.push(initFloating(dot2.value, [28, -32], [18, -40], 19))
  if (dot3.value) floatTls.value.push(initFloating(dot3.value, [-28, 32], [30, -22], 23))
  if (dot4.value) floatTls.value.push(initFloating(dot4.value, [18, -22], [-18, 28], 14))

  gsap.set([dot1.value, dot2.value, dot3.value, dot4.value].filter(Boolean), {
    scale: 1,
    opacity: 0.6
  })
})
</script>

<style scoped>
.orb {
  /* Mobile: lighter blur (blur is expensive on mobile GPU) */
  filter: blur(28px);
  will-change: transform;
}

@media (min-width: 768px) {
  .orb {
    filter: blur(45px);
  }
}
</style>

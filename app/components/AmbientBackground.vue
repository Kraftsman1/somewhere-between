<template>
  <div
    class="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-[3000ms] ease-in-out"
    :style="{ backgroundColor: warmthColor }">

    <!-- Orb 1: main accent, top-left area -->
    <div ref="dot1"
      class="absolute top-1/4 left-1/5 w-72 md:w-[28rem] h-72 md:h-[28rem] rounded-full"
      style="background: radial-gradient(circle, rgba(190,152,152,0.22) 0%, transparent 70%); filter: blur(40px); opacity: 0.6;"></div>

    <!-- Orb 2: warm amber, bottom-right -->
    <div ref="dot2"
      class="absolute bottom-1/4 right-1/5 w-80 md:w-[32rem] h-80 md:h-[32rem] rounded-full"
      style="background: radial-gradient(circle, rgba(201,144,96,0.16) 0%, transparent 70%); filter: blur(50px); opacity: 0.55;"></div>

    <!-- Orb 3: accent faint, bottom-left -->
    <div ref="dot3"
      class="absolute top-3/4 left-1/3 w-64 md:w-96 h-64 md:h-96 rounded-full"
      style="background: radial-gradient(circle, rgba(190,152,152,0.14) 0%, transparent 70%); filter: blur(45px); opacity: 0.5;"></div>

    <!-- Orb 4: warm blush, top-right — for asymmetric depth -->
    <div ref="dot4"
      class="absolute top-1/3 right-1/4 w-56 md:w-80 h-56 md:h-80 rounded-full"
      style="background: radial-gradient(circle, rgba(215,175,155,0.12) 0%, transparent 70%); filter: blur(55px); opacity: 0.45;"></div>
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
  const level = props.warmthLevel
  // Blend from parchment toward a slightly warmer tone
  const r = Math.round(250 + level * 3)
  const g = Math.round(245 - level * 12)
  const b = Math.round(238 - level * 30)
  return `rgb(${r}, ${g}, ${b})`
})

const floatTls = ref<gsap.core.Timeline[]>([])

watch(() => props.isStill, (newVal) => {
  floatTls.value.forEach(tl => newVal ? tl.pause() : tl.play())
})

watch(() => props.isGlowing, (newVal) => {
  const dots = [dot1.value, dot2.value, dot3.value, dot4.value]
  gsap.to(dots, {
    filter: newVal ? 'blur(70px)' : 'blur(45px)',
    scale: newVal ? 1.2 : 1,
    opacity: newVal ? 0.4 : 0.55,
    duration: 3.5,
    stagger: 0.15,
    ease: 'sine.inOut'
  })
})

const initFloating = (el: HTMLElement, xRange: number[], yRange: number[], duration: number) => {
  const tl = gsap.timeline({ repeat: -1, yoyo: true })
  tl.to(el, {
    x: xRange[1],
    y: yRange[1],
    duration,
    ease: 'sine.inOut'
  })
  return tl
}

onMounted(() => {
  if (dot1.value) floatTls.value.push(initFloating(dot1.value, [-45, 45], [-35, 30], 16))
  if (dot2.value) floatTls.value.push(initFloating(dot2.value, [30, -35], [20, -45], 19))
  if (dot3.value) floatTls.value.push(initFloating(dot3.value, [-30, 35], [35, -25], 23))
  if (dot4.value) floatTls.value.push(initFloating(dot4.value, [20, -25], [-20, 30], 14))

  gsap.set([dot1.value, dot2.value, dot3.value, dot4.value], {
    scale: 1,
    opacity: 0.55
  })
})
</script>

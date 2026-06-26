<template>
  <div
    class="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden"
    style="background-color: var(--color-bg);"
    @click="onPageClick"
    @touchstart.passive="onPageClick"
  >
    <!-- Ambient background -->
    <AmbientBackground :is-glowing="isGlowing" :warmth-level="warmthLevel" />

    <!-- Particle canvas -->
    <ParticleCanvas v-if="particleType !== 'none'" :type="particleType" :active="particlesActive" intensity="low" />

    <!-- Grain overlay -->
    <div class="fixed inset-0 z-[2] pointer-events-none opacity-50"
      style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.035\'/%3E%3C/svg%3E'); background-size: 256px 256px;" />

    <!-- Back link -->
    <NuxtLink
      :to="backRoute ?? '/'"
      class="fixed top-6 left-6 z-40 flex items-center gap-2 group"
      style="text-decoration: none;"
    >
      <span class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/30 group-hover:text-accent/65 transition-colors duration-500 font-light">← Back</span>
    </NuxtLink>

    <!-- Month label top right -->
    <div class="fixed top-6 right-6 z-40 flex items-center gap-2">
      <span class="font-sans text-[8px] tracking-[0.35em] uppercase text-accent/30 font-light">
        {{ String(monthNumber).padStart(2, '0') }} · {{ monthName.toUpperCase() }}
      </span>
    </div>

    <!-- Main slide area -->
    <div class="relative z-20 max-w-md w-full px-8 flex flex-col items-center justify-center min-h-[65dvh]">

      <!-- Slide container -->
      <div class="relative w-full text-center">
        <transition name="slide-fade" mode="out-in">
          <div :key="currentIndex" class="slide-content">

            <!-- Theme tagline (only first slide) -->
            <p v-if="currentIndex === 0" class="font-sans text-[9px] tracking-[0.5em] uppercase text-accent/35 mb-8 font-light">
              {{ themeTagline }}
            </p>

            <!-- Main text -->
            <p
              class="font-serif leading-snug text-text"
              :class="textSizeClass"
            >
              {{ currentSlide.text }}
            </p>

            <!-- Subtext -->
            <p
              v-if="currentSlide.subtext"
              class="font-sans text-[10px] tracking-[0.35em] uppercase text-accent/45 mt-6 font-light"
            >
              {{ currentSlide.subtext }}
            </p>
          </div>
        </transition>
      </div>

      <!-- Slide progress dots -->
      <div class="flex gap-2 mt-12">
        <button
          v-for="(_, i) in slides"
          :key="i"
          class="transition-all duration-500 rounded-full"
          :style="{
            width: i === currentIndex ? '20px' : '4px',
            height: '4px',
            background: i === currentIndex ? 'var(--color-accent)' : 'rgba(190,152,152,0.3)',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }"
          @click.stop="goTo(i)"
          :aria-label="`Slide ${i + 1}`"
        />
      </div>

      <!-- Tap indicator (first slide only) -->
      <div v-if="currentIndex === 0" class="mt-8 flex items-center gap-2 animate-fade-in-slow" style="animation-delay: 3s; opacity: 0;">
        <div class="h-[1px] w-5" style="background: rgba(190,152,152,0.2);" />
        <p class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/30 font-light">Tap to continue</p>
        <div class="h-[1px] w-5" style="background: rgba(190,152,152,0.2);" />
      </div>

      <!-- Easter egg slot — shown on last slide -->
      <div v-if="currentIndex === slides.length - 1" class="mt-10 animate-fade-in" style="animation-delay: 1.5s; opacity: 0;">
        <slot name="easter-egg" />
      </div>
    </div>

    <!-- Keyboard hint — desktop only -->
    <div class="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40 gap-4 items-center">
      <button @click.stop="prev" :disabled="currentIndex === 0"
        class="font-sans text-[8px] tracking-[0.3em] uppercase text-accent/20 hover:text-accent/50 disabled:opacity-0 transition-all duration-300 font-light">
        ← prev
      </button>
      <div class="w-[1px] h-3" style="background: rgba(190,152,152,0.2);" />
      <button @click.stop="next" :disabled="currentIndex === slides.length - 1"
        class="font-sans text-[8px] tracking-[0.3em] uppercase text-accent/20 hover:text-accent/50 disabled:opacity-0 transition-all duration-300 font-light">
        next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import type { ParticleType } from '~/composables/useMonthData'

interface Slide {
  text: string
  subtext?: string
}

const props = defineProps<{
  monthName: string
  monthNumber: number
  themeTagline: string
  slides: Slide[]
  particleType: ParticleType
  ambientWarmth?: number
  backRoute?: string
}>()

const currentIndex = ref(0)
const isGlowing = ref(false)
const particlesActive = ref(false)
const warmthLevel = ref(props.ambientWarmth ?? 0)

const currentSlide = computed(() => props.slides[currentIndex.value])
const isLastSlide = computed(() => currentIndex.value === props.slides.length - 1)

const textSizeClass = computed(() => {
  const len = currentSlide.value?.text?.length ?? 0
  if (len > 90) return 'text-[1.5rem] md:text-[2rem]'
  if (len > 55) return 'text-[1.75rem] md:text-4xl'
  return 'text-[2rem] md:text-5xl'
})

const next = () => {
  if (currentIndex.value < props.slides.length - 1) {
    currentIndex.value++
    onSlideChange()
  }
}

const prev = () => {
  if (currentIndex.value > 0) currentIndex.value--
}

const goTo = (i: number) => {
  currentIndex.value = i
  onSlideChange()
}

const onPageClick = (e: Event) => {
  // Don't advance if clicking interactive elements
  const target = e.target as HTMLElement
  if (target.closest('button') || target.closest('a') || target.closest('[data-no-advance]')) return
  next()
}

const onSlideChange = () => {
  // Activate particles on last slide if available
  if (isLastSlide.value && props.particleType !== 'none') {
    setTimeout(() => { particlesActive.value = true }, 400)
  }
  // Glow on later slides
  if (currentIndex.value >= Math.floor(props.slides.length * 0.5)) {
    isGlowing.value = true
    warmthLevel.value = (props.ambientWarmth ?? 0.1) * 1.5
  }
}

// Keyboard navigation (desktop)
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next() }
  if (e.key === 'ArrowLeft') { e.preventDefault(); prev() }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  // Gently activate after a moment
  setTimeout(() => {
    warmthLevel.value = props.ambientWarmth ?? 0
  }, 800)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-leave-active {
  transition: opacity 0.4s ease-in, transform 0.4s ease-in;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(18px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@keyframes fade-in-slow {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in-slow {
  animation: fade-in-slow 1.5s ease-out forwards;
}
.animate-fade-in {
  animation: fade-in-slow 1.5s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition-duration: 0.01ms !important;
  }
}
</style>

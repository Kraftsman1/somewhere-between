<template>
  <SectionWrapper :scroll-resistance="interactionType === 'resistance'" @enter="handleEnter" @leave="handleLeave">
    <div
      ref="container"
      class="space-y-6 text-center"
      @mouseenter="handleInteraction(true)"
      @mouseleave="handleInteraction(false)"
      @touchstart.passive="handleInteraction(true)"
      @touchend.passive="handleInteraction(false)">

      <!-- Month label: numeral · rule · name -->
      <div v-if="month" class="flex items-center gap-3">
        <span class="font-sans text-[9px] tracking-[0.35em] uppercase text-accent/40 tabular-nums select-none">
          {{ String(monthIndex).padStart(2, '0') }}
        </span>
        <div class="h-px w-6 bg-accent/20 shrink-0"></div>
        <h2 class="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-accent/60 font-light">
          {{ month }}
        </h2>
      </div>

      <!-- Main message -->
      <div class="space-y-3">
        <p v-if="!isLineByLine"
          ref="messageEl"
          class="text-[1.75rem] md:text-5xl font-serif font-normal leading-snug text-text">
          {{ message }}
        </p>

        <!-- Pacing: line-by-line (June) -->
        <div v-else class="space-y-2">
          <p
            v-for="(line, i) in lines"
            :key="i"
            class="line-item text-[1.75rem] md:text-5xl font-serif font-normal leading-snug text-text">
            {{ line }}
          </p>
        </div>
      </div>

      <!-- Extra text with ornament -->
      <div ref="extraEl" v-if="extraText" class="opacity-0 flex flex-col items-start gap-2.5">
        <div class="flex items-center gap-2.5">
          <div class="h-px w-4 bg-accent/20"></div>
          <span class="w-[3px] h-[3px] rounded-full bg-accent/30 inline-block shrink-0"></span>
          <div class="h-px w-4 bg-accent/20"></div>
        </div>
        <p class="font-serif italic text-sm md:text-base text-accent/65 tracking-wide">{{ extraText }}</p>
      </div>

      <slot name="extra" />
    </div>
  </SectionWrapper>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import SectionWrapper from '~/components/SectionWrapper.vue'

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']

const props = defineProps<{
  month?: string
  message: string
  interactionType?: 'resistance' | 'focus' | 'exhale' | 'pacing' | 'static'
  extraText?: string
  extraDelay?: number
}>()

const emits = defineEmits(['enter', 'leave'])

const container = ref<HTMLElement | null>(null)
const messageEl = ref<HTMLElement | null>(null)
const extraEl = ref<HTMLElement | null>(null)

const timeline = ref<gsap.core.Timeline | null>(null)

const isLineByLine = computed(() => props.interactionType === 'pacing')
const lines = computed(() => props.message.split('\n'))
const monthIndex = computed(() => props.month ? monthNames.indexOf(props.month) + 1 : 0)

const handleEnter = () => {
  emits('enter')
  timeline.value?.kill()
  timeline.value = gsap.timeline()

  // 'focus' — wrapper already handles the reveal; no extra opacity manipulation
  // (the old opacity:0.35 start caused double-fade and faint text)

  // 'pacing' — staggered line reveal (0.45s stagger, not 2s)
  if (isLineByLine.value && container.value) {
    const lines = container.value.querySelectorAll('.line-item')
    gsap.set(lines, { opacity: 0, y: 10 })
    timeline.value.to(lines, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      stagger: 0.45,   // was 2s — caused 6s total wait on mobile
      ease: 'power2.out'
    }, 0.3)
  }

  // Extra text reveal (delayed)
  if (props.extraText && props.extraDelay && extraEl.value) {
    // Cap the delay at 4s on mobile for usability
    const delay = Math.min(props.extraDelay / 1000, 4)
    timeline.value.to(extraEl.value, {
      opacity: 1,
      duration: 1.5,
      ease: 'sine.inOut'
    }, delay)
  }

  // August haptic pulse
  if (props.month === 'August' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([20, 40, 20])
  }
}

const handleLeave = () => {
  emits('leave')
  timeline.value?.kill()

  // Reset extra text (will re-animate on next enter)
  if (extraEl.value) gsap.set(extraEl.value, { opacity: 0 })

  // Reset exhale effects
  if (messageEl.value) {
    gsap.set(messageEl.value, { letterSpacing: '0em', lineHeight: 1.3 })
  }

  // Reset pacing lines for next enter
  if (isLineByLine.value && container.value) {
    gsap.set(container.value.querySelectorAll('.line-item'), { opacity: 0, y: 10 })
  }
}

const handleInteraction = (active: boolean) => {
  // 'exhale' — expand letter-spacing on hover/touch
  if (props.interactionType === 'exhale' && messageEl.value) {
    gsap.to(messageEl.value, {
      letterSpacing: active ? '0.03em' : '0em',
      lineHeight: active ? 1.55 : 1.3,
      duration: 1.1,
      ease: active ? 'power2.out' : 'power2.inOut'
    })
  }

  // October heartbeat haptic
  if (active && props.month === 'October' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([40, 60, 40])
  }
}
</script>

<style scoped>
/* Pacing lines start hidden — GSAP controls their reveal */
.line-item {
  opacity: 0;
  transform: translateY(10px);
}
</style>

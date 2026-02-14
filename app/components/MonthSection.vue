<template>
  <SectionWrapper :scroll-resistance="interactionType === 'resistance'" @enter="handleEnter" @leave="handleLeave">
    <div ref="container" class="space-y-7" @mouseenter="handleInteraction(true)" @mouseleave="handleInteraction(false)"
      @touchstart.passive="handleInteraction(true)" @touchend.passive="handleInteraction(false)">

      <!-- Month label with number + decorative rule -->
      <div v-if="month" class="flex items-center gap-4">
        <span class="text-[10px] font-sans tracking-[0.35em] uppercase text-accent/40 tabular-nums select-none">
          {{ String(monthIndex).padStart(2, '0') }}
        </span>
        <div class="h-[1px] w-8 bg-accent/20"></div>
        <h2 class="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-sans text-accent opacity-70 font-light">
          {{ month }}
        </h2>
      </div>

      <div class="space-y-4">
        <p v-if="!isLineByLine" ref="messageEl"
          class="text-3xl md:text-5xl font-serif font-normal leading-snug text-text">
          {{ message }}
        </p>

        <div v-else class="space-y-3">
          <p v-for="(line, i) in lines" :key="i"
            class="line-item text-3xl md:text-5xl font-serif font-normal leading-snug text-text opacity-0 translate-y-3">
            {{ line }}
          </p>
        </div>
      </div>

      <!-- Extra text: centered, with ornament -->
      <div ref="extraEl" v-if="extraText" class="mt-10 opacity-0 flex flex-col items-center gap-3">
        <div class="flex items-center gap-3">
          <div class="h-[1px] w-5 bg-accent/25"></div>
          <span class="w-1 h-1 rounded-full bg-accent/30 inline-block"></span>
          <div class="h-[1px] w-5 bg-accent/25"></div>
        </div>
        <p class="text-sm md:text-base font-serif italic text-accent/70 tracking-wide">{{ extraText }}</p>
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

const isFocused = ref(false)
const timeline = ref<gsap.core.Timeline | null>(null)

const isLineByLine = computed(() => props.interactionType === 'pacing')
const lines = computed(() => props.message.split('\n'))
const monthIndex = computed(() => props.month ? monthNames.indexOf(props.month) + 1 : 0)

const handleEnter = () => {
  emits('enter')

  timeline.value?.kill()
  timeline.value = gsap.timeline()

  if (props.interactionType === 'focus' && messageEl.value) {
    gsap.set(messageEl.value, { opacity: 0.35 })
    timeline.value.to(messageEl.value, {
      opacity: 1,
      duration: 1.8,
      delay: 0.2,
      ease: 'power2.out',
      onComplete: () => { isFocused.value = true }
    })
  }

  if (isLineByLine.value && container.value) {
    timeline.value.to(container.value.querySelectorAll('.line-item'), {
      opacity: 1,
      y: 0,
      duration: 1.5,
      stagger: 2,
      ease: 'power2.out'
    }, 0.5)
  }

  if (props.extraText && props.extraDelay) {
    timeline.value.to(extraEl.value, {
      opacity: 1,
      duration: 2,
      delay: props.extraDelay / 1000,
      ease: 'sine.inOut'
    }, 0)
  }

  if (props.month === 'August' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([20, 40, 20])
  }
}

const handleLeave = () => {
  emits('leave')
  isFocused.value = false
  timeline.value?.kill()

  // Reset internal elements so they re-animate correctly on next enter
  if (extraEl.value) gsap.set(extraEl.value, { opacity: 0 })
  if (messageEl.value) {
    gsap.set(messageEl.value, { letterSpacing: '0em', lineHeight: 1.3 })
  }
  if (isLineByLine.value && container.value) {
    gsap.set(container.value.querySelectorAll('.line-item'), { opacity: 0, y: 12 })
  }
}

const handleInteraction = (active: boolean) => {
  if (props.interactionType === 'exhale' && messageEl.value) {
    gsap.to(messageEl.value, {
      letterSpacing: active ? '0.03em' : '0em',
      lineHeight: active ? 1.55 : 1.3,
      duration: 1.2,
      ease: active ? 'power2.out' : 'power2.inOut'
    })
  }

  if (active && props.month === 'October' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([40, 60, 40])
  }
}
</script>

<template>
  <SectionWrapper :scroll-resistance="interactionType === 'resistance'" @enter="handleEnter" @leave="handleLeave">
    <div ref="container" class="space-y-6" @mouseenter="handleInteraction(true)" @mouseleave="handleInteraction(false)"
      @touchstart="handleInteraction(true)" @touchend="handleInteraction(false)">
      <h2 v-if="month" class="text-xs md:text-sm uppercase tracking-[0.2em] font-sans text-accent opacity-80">
        {{ month }}
      </h2>

      <div ref="textContainer" class="space-y-4">
        <p v-if="!isLineByLine" ref="messageEl"
          class="text-2xl md:text-4xl font-serif leading-relaxed text-text opacity-100">
          {{ message }}
        </p>

        <div v-else class="space-y-4">
          <p v-for="(line, i) in lines" :key="i"
            class="line-item text-2xl md:text-4xl font-serif leading-relaxed text-text opacity-0 transform translate-y-4">
            {{ line }}
          </p>
        </div>
      </div>

      <div ref="extraEl" v-if="extraText" class="mt-8 opacity-0">
        <p class="text-sm font-sans tracking-wide italic text-accent/60">{{ extraText }}</p>
      </div>

      <slot name="extra" />
    </div>
  </SectionWrapper>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import SectionWrapper from '~/components/SectionWrapper.vue'

const props = defineProps<{
  month?: string
  message: string
  interactionType?: 'resistance' | 'focus' | 'exhale' | 'pacing' | 'static'
  extraText?: string
  extraDelay?: number
}>()

const emits = defineEmits(['enter', 'leave'])

const container = ref<HTMLElement | null>(null)
const textContainer = ref<HTMLElement | null>(null)
const messageEl = ref<HTMLElement | null>(null)
const extraEl = ref<HTMLElement | null>(null)

const isFocused = ref(false)
const timeline = ref<gsap.core.Timeline | null>(null)

const isLineByLine = computed(() => props.interactionType === 'pacing')
const lines = computed(() => props.message.split('\n'))

const handleEnter = () => {
  emits('enter')

  // Clear any existing timeline
  timeline.value?.kill()
  timeline.value = gsap.timeline()

  if (props.interactionType === 'focus' && messageEl.value) {
    // Reveal by fade instead of blur
    gsap.set(messageEl.value, { opacity: 0.4 })
    timeline.value.to(messageEl.value, {
      opacity: 1,
      duration: 1.5,
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

  // August haptics
  if (props.month === 'August' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([20, 40, 20])
  }
}

const handleLeave = () => {
  emits('leave')
  isFocused.value = false
  timeline.value?.kill()

  // Hard reset all animated states on leave
  if (extraEl.value) gsap.set(extraEl.value, { opacity: 0 })
  if (messageEl.value) {
    gsap.set(messageEl.value, { opacity: 1, letterSpacing: '0em', lineHeight: 1.6 })
  }
  if (isLineByLine.value && container.value) {
    gsap.set(container.value.querySelectorAll('.line-item'), { opacity: 0, y: 16 })
  }
}

const handleInteraction = (active: boolean) => {
  if (props.interactionType === 'exhale' && messageEl.value) {
    gsap.to(messageEl.value, {
      letterSpacing: active ? '0.04em' : '0em',
      lineHeight: active ? 1.75 : 1.6,
      duration: 1.0,
      ease: active ? 'power2.out' : 'power2.inOut' // Removed elastic for better clarity
    })
  }

  // Heartbeat haptics for October
  if (active && props.month === 'October' && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([40, 60, 40])
  }
}
</script>

<template>
  <SectionWrapper :scroll-resistance="interactionType === 'resistance'" @enter="handleEnter">
    <div class="space-y-6 transition-all duration-1000 ease-in-out" :style="interactionStyles"
      @mouseenter="handleTouch(true)" @mouseleave="handleTouch(false)" @touchstart="handleTouch(true)"
      @touchend="handleTouch(false)">
      <h2 v-if="month" class="text-xs md:text-sm uppercase tracking-[0.2em] font-sans text-accent opacity-80">{{ month
        }}</h2>

      <div ref="textContainer" class="space-y-4">
        <p v-if="!isLineByLine"
          class="text-2xl md:text-4xl font-serif leading-relaxed text-text transition-all duration-[2000ms]"
          :class="{ 'blur-sm opacity-50': interactionType === 'focus' && !isFocused }">
          {{ message }}
        </p>

        <div v-else class="space-y-4">
          <p v-for="(line, i) in lines" :key="i"
            class="text-2xl md:text-4xl font-serif leading-relaxed text-text opacity-0 transform translate-y-4 transition-all duration-1000"
            :style="{ transitionDelay: `${i * 2000}ms`, opacity: visibleLines > i ? 1 : 0, transform: visibleLines > i ? 'translateY(0)' : 'translateY(1rem)' }">
            {{ line }}
          </p>
        </div>
      </div>

      <div v-if="extraText" class="mt-8 transition-opacity duration-[2000ms]"
        :class="extraVisible ? 'opacity-60' : 'opacity-0'">
        <p class="text-sm font-sans tracking-wide italic">{{ extraText }}</p>
      </div>

      <slot name="extra" />
    </div>
  </SectionWrapper>
</template>

<script setup lang="ts">
import { animate } from 'animejs'
import SectionWrapper from '~/components/SectionWrapper.vue'

const props = defineProps<{
  month?: string
  message: string
  interactionType?: 'resistance' | 'focus' | 'exhale' | 'pacing' | 'static'
  extraText?: string
  extraDelay?: number
}>()

const textContainer = ref(null)
const isFocused = ref(false)
const extraVisible = ref(false)
const visibleLines = ref(0)
const isExhaling = ref(false)

const isLineByLine = computed(() => props.interactionType === 'pacing')
const lines = computed(() => props.message.split('\n'))

const interactionStyles = computed(() => {
  if (props.interactionType === 'exhale' && isExhaling.value) {
    return {
      letterSpacing: '0.05em',
      lineHeight: '1.8'
    }
  }
  return {}
})

const handleEnter = () => {
  if (props.interactionType === 'focus') {
    setTimeout(() => { isFocused.value = true }, 500)
  }

  if (props.interactionType === 'pacing') {
    visibleLines.value = 0
    lines.value.forEach((_, i) => {
      setTimeout(() => { visibleLines.value = i + 1 }, i * 2000)
    })
  }

  if (props.extraText && props.extraDelay) {
    setTimeout(() => { extraVisible.value = true }, props.extraDelay)
  }

  // Haptic feedback for August (if designated by props later)
  if (props.month === 'August' && 'vibrate' in navigator) {
    navigator.vibrate(50)
  }
}

const handleTouch = (active: boolean) => {
  if (props.interactionType === 'exhale') {
    isExhaling.value = active
  }
}
</script>

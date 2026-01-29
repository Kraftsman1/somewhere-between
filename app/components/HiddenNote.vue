<template>
  <div class="relative cursor-pointer group" @click="reveal" @mouseenter="hover">
    <div ref="triggerRef" class="opacity-50 group-hover:opacity-100 transition-opacity duration-700">
      <slot name="trigger">
        <span class="text-xs tracking-widest uppercase text-accent/60">Tap for a note</span>
      </slot>
    </div>

    <div ref="contentRef"
      class="absolute top-full lg:left-1/2 lg:-translate-x-1/2 mt-4 w-64 text-center opacity-0 pointer-events-none p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm border border-accent/10">
      <p class="text-sm font-serif italic text-text/80">
        <slot name="content">
          "Thank you for being here."
        </slot>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { animate } from 'animejs'

const triggerRef = ref(null)
const contentRef = ref(null)
const isRevealed = ref(false)

const hover = () => {
  if (isRevealed.value || !triggerRef.value) return
  animate(triggerRef.value, {
    scale: [1, 1.05],
    duration: 800,
    easing: 'easeOutElastic(1, .8)'
  })
}

const reveal = () => {
  if (isRevealed.value || !contentRef.value) return
  isRevealed.value = true

  animate(contentRef.value, {
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 2000,
    easing: 'easeOutExpo'
  })
}
</script>

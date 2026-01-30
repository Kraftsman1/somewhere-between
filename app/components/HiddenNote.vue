<template>
  <div class="inline-block">
    <!-- Trigger -->
    <div ref="triggerRef" class="cursor-pointer group py-2" @click="reveal" @mouseenter="hover" @touchstart="hover">
      <slot name="trigger">
        <div class="flex flex-col items-center space-y-2">
          <div class="w-1 h-1 rounded-full bg-accent/40 group-hover:scale-150 transition-transform duration-700"></div>
          <span
            class="text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent/60 group-hover:text-accent transition-colors duration-500">Tap
            for a note</span>
        </div>
      </slot>
    </div>

    <!-- Teleported Modal -->
    <Teleport to="body">
      <div v-if="isVisible" ref="overlayRef"
        class="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 pointer-events-auto">
        <!-- Backdrop -->
        <div ref="backdropRef" class="absolute inset-0 bg-bg/80 backdrop-blur-md opacity-0" @click="close"></div>

        <!-- Note Card -->
        <div ref="cardRef"
          class="relative w-full max-w-lg bg-white/90 p-10 md:p-16 rounded-2xl shadow-2xl border border-accent/10 opacity-0 transform translate-y-8 flex flex-col items-center text-center">
          <!-- Close Button -->
          <button @click="close"
            class="absolute top-6 right-6 p-2 text-accent/40 hover:text-accent transition-colors duration-300"
            aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="space-y-6">
            <p class="text-xl md:text-3xl font-serif italic text-text/90 leading-relaxed">
              <slot name="content">
                "Thank you for being here."
              </slot>
            </p>

            <div class="w-8 h-[1px] bg-accent/20 mx-auto mt-8" @click="close"></div>

            <button @click="close"
              class="mt-8 text-[10px] tracking-[0.3em] uppercase text-accent/40 hover:text-accent transition-colors duration-300">
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

const isVisible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)
const backdropRef = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)

const hover = () => {
  if (isVisible.value || !triggerRef.value) return
  gsap.to(triggerRef.value, {
    scale: 1.1,
    duration: 1,
    ease: 'elastic.out(1, 0.5)'
  })
}

const reveal = () => {
  if (isVisible.value) return
  isVisible.value = true

  if ('vibrate' in navigator) navigator.vibrate(30)

  // Use nextTick or a small timeout to ensure refs are available after v-if
  setTimeout(() => {
    if (backdropRef.value && cardRef.value) {
      const tl = gsap.timeline()
      tl.to(backdropRef.value, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
      })
      tl.to(cardRef.value, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'expo.out'
      }, '-=0.4')
    }
  }, 10)
}

const close = () => {
  if (!backdropRef.value || !cardRef.value) return

  const tl = gsap.timeline({
    onComplete: () => {
      isVisible.value = false
    }
  })

  tl.to(cardRef.value, {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.in'
  })
  tl.to(backdropRef.value, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in'
  }, '-=0.2')
}
</script>

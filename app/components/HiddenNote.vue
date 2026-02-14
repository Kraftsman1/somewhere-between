<template>
  <div class="inline-block">
    <!-- Trigger -->
    <div ref="triggerRef" class="cursor-pointer group py-3" @click="reveal" @mouseenter="hover" @touchstart.passive="hover">
      <slot name="trigger">
        <div class="flex flex-col items-center gap-2.5">
          <div class="w-1 h-1 rounded-full bg-accent/35 group-hover:scale-[2] transition-transform duration-700 ease-out"></div>
          <span
            class="text-[9px] md:text-[10px] tracking-[0.4em] uppercase font-sans text-accent/50 group-hover:text-accent/80 transition-colors duration-500 font-light">
            Tap For A Note
          </span>
        </div>
      </slot>
    </div>

    <!-- Teleported Modal -->
    <Teleport to="body">
      <div v-if="isVisible" ref="overlayRef"
        class="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-16 pointer-events-auto">

        <!-- Backdrop -->
        <div ref="backdropRef" class="absolute inset-0 opacity-0"
          style="background: rgba(32, 30, 26, 0.45); backdrop-filter: blur(12px);"
          @click="close"></div>

        <!-- Note Card -->
        <div ref="cardRef"
          class="relative w-full max-w-sm opacity-0 translate-y-6 px-8 py-10 md:px-12 md:py-14"
          style="background: #f5ede0; border: 1px solid rgba(190,152,152,0.18); border-radius: 4px; box-shadow: 0 32px 80px rgba(32,30,26,0.12), 0 2px 8px rgba(32,30,26,0.06);">

          <!-- Close — oversized touch target -->
          <button @click="close"
            class="absolute top-3 right-3 p-3 text-accent/30 hover:text-accent/60 active:text-accent transition-colors duration-300"
            style="font-family: var(--font-sans); font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center;"
            aria-label="Close">
            ✕
          </button>

          <!-- Thin top rule -->
          <div class="absolute top-0 left-8 right-8 h-[1px]" style="background: linear-gradient(to right, transparent, rgba(190,152,152,0.3), transparent);"></div>

          <div class="flex flex-col items-center text-center gap-6">
            <p class="text-2xl md:text-3xl font-serif italic leading-relaxed" style="color: var(--color-text);">
              <slot name="content">
                "Thank you for being here."
              </slot>
            </p>

            <!-- Ornament -->
            <div class="flex items-center gap-3 mt-2">
              <div class="h-[1px] w-6" style="background: rgba(190,152,152,0.3);"></div>
              <div class="w-[3px] h-[3px] rounded-full" style="background: rgba(190,152,152,0.4);"></div>
              <div class="h-[1px] w-6" style="background: rgba(190,152,152,0.3);"></div>
            </div>
          </div>

          <!-- Thin bottom rule -->
          <div class="absolute bottom-0 left-8 right-8 h-[1px]" style="background: linear-gradient(to right, transparent, rgba(190,152,152,0.3), transparent);"></div>
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
    scale: 1.08,
    duration: 1,
    ease: 'elastic.out(1, 0.5)'
  })
}

const reveal = () => {
  if (isVisible.value) return
  isVisible.value = true

  if ('vibrate' in navigator) navigator.vibrate(30)

  setTimeout(() => {
    if (backdropRef.value && cardRef.value) {
      const tl = gsap.timeline()
      tl.to(backdropRef.value, { opacity: 1, duration: 0.7, ease: 'power2.out' })
      tl.to(cardRef.value, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out' }, '-=0.4')
    }
  }, 10)
}

const close = () => {
  if (!backdropRef.value || !cardRef.value) return
  const tl = gsap.timeline({ onComplete: () => { isVisible.value = false } })
  tl.to(cardRef.value, { opacity: 0, y: 16, duration: 0.5, ease: 'power2.in' })
  tl.to(backdropRef.value, { opacity: 0, duration: 0.35, ease: 'power2.in' }, '-=0.15')
}
</script>

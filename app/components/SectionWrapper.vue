<template>
  <section
    ref="sectionRef"
    class="relative h-[100dvh] w-full snap-center flex flex-col items-center justify-center px-6 py-8 md:p-8 overflow-hidden z-20">
    <div
      ref="contentRef"
      class="reveal-box max-w-md w-full text-center"
      :class="scrollResistance ? 'reveal-slow' : ''">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  scrollResistance?: boolean
}>()

const emits = defineEmits(['enter', 'leave'])

const sectionRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  const el = sectionRef.value
  const content = contentRef.value
  if (!el || !content) return

  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (!entry) return

    if (entry.intersectionRatio >= 0.3) {
      // Section is at least 30% visible — reveal it
      emits('enter')
      content.classList.remove('reveal-out-up', 'reveal-out-down')
      content.classList.add('reveal-in')
    } else if (entry.intersectionRatio <= 0.05) {
      // Section is almost fully gone — hide it
      // Hysteresis gap (0.05–0.3) prevents false leaves during snap animation
      emits('leave')
      const exitedUpward = entry.boundingClientRect.top < 0
      content.classList.remove('reveal-in')
      content.classList.add(exitedUpward ? 'reveal-out-up' : 'reveal-out-down')
    }
  }, {
    threshold: [0, 0.05, 0.1, 0.2, 0.3, 0.5, 1.0]
  })

  observer.observe(el)
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
/* Base hidden state — managed via class toggling, no GSAP conflict */
.reveal-box {
  opacity: 0;
  transform: translateY(22px);
  transition:
    opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1),
    transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.reveal-box.reveal-slow {
  transition-delay: 0.15s;
  transition-duration: 1.4s;
}

.reveal-box.reveal-in {
  opacity: 1;
  transform: translateY(0);
}

.reveal-box.reveal-out-up {
  opacity: 0;
  transform: translateY(-18px);
  transition-duration: 0.55s;
  transition-delay: 0s;
}

.reveal-box.reveal-out-down {
  opacity: 0;
  transform: translateY(18px);
  transition-duration: 0.55s;
  transition-delay: 0s;
}

/* Respect user's motion preference */
@media (prefers-reduced-motion: reduce) {
  .reveal-box,
  .reveal-box.reveal-slow,
  .reveal-box.reveal-out-up,
  .reveal-box.reveal-out-down {
    transition-duration: 0.01ms !important;
    transition-delay: 0ms !important;
  }
}
</style>

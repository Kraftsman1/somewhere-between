<template>
  <section ref="sectionRef"
    class="relative h-[100dvh] w-full snap-center flex flex-col items-center justify-center p-8 overflow-hidden z-20">
    <div ref="contentRef" class="max-w-md w-full text-center">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

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

  // Initialize hidden state via GSAP (not Tailwind) so GSAP owns the property
  gsap.set(content, { opacity: 0, y: 28 })

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        emits('enter')
        gsap.to(content, {
          opacity: 1,
          y: 0,
          duration: props.scrollResistance ? 1.5 : 1.2,
          delay: props.scrollResistance ? 0.2 : 0,
          ease: 'expo.out',
          overwrite: 'auto'
        })
      } else {
        emits('leave')
        const exitUp = entry.boundingClientRect.top < 0
        gsap.to(content, {
          opacity: 0,
          y: exitUp ? -36 : 36,
          duration: 0.7,
          ease: 'power2.in',
          overwrite: 'auto'
        })
      }
    })
  }, {
    threshold: 0.5 // fire when half the section is in view (reliable with snap)
  })

  observer.observe(el)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

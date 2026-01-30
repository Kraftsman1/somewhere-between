<template>
  <section ref="sectionRef"
    class="relative h-screen w-full snap-center flex flex-col items-center justify-center p-8 overflow-hidden z-20">
    <div ref="contentRef" class="max-w-md w-full text-center opacity-0 translate-y-8">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  scrollResistance?: boolean
}>()

const emits = defineEmits(['enter', 'leave'])

const sectionRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const el = sectionRef.value
  const content = contentRef.value

  // Enter animation
  ScrollTrigger.create({
    trigger: el,
    start: 'top 45%', // Slightly earlier for better flow
    end: 'bottom 55%',
    onEnter: () => {
      emits('enter')
      gsap.to(content, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: props.scrollResistance ? 1.5 : 1.2,
        delay: props.scrollResistance ? 0.2 : 0,
        ease: 'expo.out'
      })
    },
    onLeave: () => {
      emits('leave')
      gsap.to(content, {
        opacity: 0,
        y: -40,
        scale: 0.99,
        duration: 0.8,
        ease: 'power2.in'
      })
    },
    onEnterBack: () => {
      emits('enter')
      gsap.to(content, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'expo.out'
      })
    },
    onLeaveBack: () => {
      emits('leave')
      gsap.to(content, {
        opacity: 0,
        y: 40,
        scale: 0.99,
        duration: 0.8,
        ease: 'power2.in'
      })
    }
  })
})
</script>

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

const sectionRef = ref(null)
const contentRef = ref(null)

onMounted(() => {
  const el = sectionRef.value
  const content = contentRef.value

  // Enter animation
  ScrollTrigger.create({
    trigger: el,
    start: 'top 50%',
    onEnter: () => {
      emits('enter')
      gsap.to(content, {
        opacity: 1,
        y: 0,
        duration: props.scrollResistance ? 2.5 : 1.5,
        delay: props.scrollResistance ? 0.5 : 0,
        ease: 'power2.out'
      })
    },
    onLeave: () => {
      emits('leave')
      gsap.to(content, {
        opacity: 0,
        y: -30,
        duration: 1,
        ease: 'power2.in'
      })
    },
    onEnterBack: () => {
      emits('enter')
      gsap.to(content, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power2.out'
      })
    },
    onLeaveBack: () => {
      emits('leave')
      gsap.to(content, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.in'
      })
    }
  })
})
</script>

<template>
  <div class="fixed right-6 top-1/2 -translate-y-1/2 h-32 w-[1px] bg-accent/20 z-40 hidden md:block">
    <div ref="barRef" class="w-full bg-accent origin-top h-0"></div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const barRef = ref(null)

onMounted(() => {
  gsap.to(barRef.value, {
    height: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5
    }
  })
})
</script>

<template>
  <div
    class="fixed right-6 top-1/2 -translate-y-1/2 h-48 w-4 flex flex-col items-center justify-between z-40 hidden md:flex">
    <!-- Progress Track -->
    <div class="absolute h-full w-[1px] bg-accent/10">
      <div ref="barRef" class="w-full bg-accent origin-top h-0 transition-opacity duration-500"></div>
    </div>

    <!-- Segment Markers -->
    <div v-for="i in 13" :key="i"
      class="relative w-1 h-1 rounded-full bg-accent/20 transition-all duration-700 hover:scale-150"
      :class="{ 'bg-accent/60 scale-125': currentSegment >= i - 1 }"></div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const barRef = ref(null)
const currentSegment = ref(0)

onMounted(() => {
  if (barRef.value) {
    gsap.to(barRef.value, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: 'main', // Assuming main container
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          // Update segment markers based on progress
          currentSegment.value = Math.floor(self.progress * 13)
        }
      }
    })
  }
})
</script>

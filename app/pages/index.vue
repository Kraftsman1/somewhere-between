<template>
  <NuxtLayout>
    <AmbientBackground :is-still="isStill" :is-glowing="isGlowing" :warmth-level="warmthLevel"
      :depth-level="depthLevel" />
    <ProgressIndicator />

    <!-- Landing Section -->
    <SectionWrapper>
      <h1 class="font-serif text-5xl md:text-7xl italic mb-6">A Year in <br /> Calm Moments</h1>
      <p class="font-sans text-sm tracking-widest uppercase opacity-60">Scroll gently</p>
    </SectionWrapper>

    <!-- Months Journey -->
    <MonthSection v-for="(month, index) in months" :key="month.name" v-bind="month"
      :id="`month-${month.name.toLowerCase()}`" :class="{ 'text-accent-warm': month.name === 'October' }"
      @enter="handleMonthEnter(month)" />

    <!-- Final Section -->
    <SectionWrapper @enter="handleFinalEnter">
      <div class="space-y-12">
        <p class="font-serif text-2xl md:text-3xl italic">
          Thank you for being the calmest part of my year.
        </p>
        <HiddenNote>
          <template #content>
            Happy Valentine's Day. <br /> I see you. I appreciate you.
          </template>
        </HiddenNote>

        <div class="mt-8 pt-8 border-t border-accent/10 opacity-0 animate-fade-in" style="animation-delay: 3s;">
          <NuxtLink to="/valentine"
            class="text-xs tracking-[0.3em] uppercase text-accent hover:text-accent-warm transition-colors duration-700 no-underline">
            A dedicated moment
          </NuxtLink>
        </div>

        <div v-if="showLoopClosure"
          class="mt-16 opacity-0 animate-fade-in text-xs tracking-widest uppercase opacity-40">
          Some days don’t need much noise to feel meaningful.
        </div>
      </div>
    </SectionWrapper>

  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const isStill = ref(false)
const isGlowing = ref(false)
const warmthLevel = ref(0)
const depthLevel = ref(0)
const lastActivity = ref(Date.now())
const showLoopClosure = ref(false)

const months = ref([
  { name: 'January', message: 'The year began with a quiet promise.', interactionType: 'resistance' },
  { name: 'February', message: 'Short days, long thoughts, and the comfort of returning.', extraText: 'Today felt like a good day to say this.', extraDelay: 7000 },
  { name: 'March', message: 'Slowly, light started to reclaim the afternoons.', interactionType: 'exhale' },
  { name: 'April', message: 'Rain against the window, a rhythm of steady growth.', interactionType: 'focus' },
  { name: 'May', message: 'Flowers bloomed, not for show, but because they had to.', interactionType: 'focus' },
  { name: 'June', message: 'The warmth arrived,\nsettling into the corners\nof the day.', interactionType: 'pacing' },
  { name: 'July', message: 'Stillness in the heat. A pause in the middle of everything.', interactionType: 'static' },
  { name: 'August', message: 'Golden hours that felt like they would last forever.' },
  { name: 'September', message: 'A shift in the air. The beauty of letting go.', extraText: 'Some things stay.', extraDelay: 2000 },
  { name: 'October', message: 'Some people make the year feel gentler just by existing.', extraText: 'October feels warmer for a reason.', extraDelay: 3000 },
  { name: 'November', message: 'The world drew close again. Coziness as a necessity.' },
  { name: 'December', message: 'Looking back, I realized how much peace you brought.', extraText: 'Some days don’t need much noise to feel meaningful.', extraDelay: 4000 },
])

const handleMonthEnter = (month: any) => {
  isGlowing.value = month.name === 'May'
  warmthLevel.value = (month.name === 'May' || month.name === 'October') ? 0.4 : 0
  depthLevel.value = month.name === 'November' ? 0.8 : 0

  if (month.name !== 'February') {
    isStill.value = false
  }
}

const handleFinalEnter = () => {
  isGlowing.value = true
  warmthLevel.value = 0.2
  setTimeout(() => { showLoopClosure.value = true }, 5000)
}

const checkStillness = () => {
  if (Date.now() - lastActivity.value > 7000) {
    isStill.value = true
  }
}

const resetActivity = () => {
  lastActivity.value = Date.now()
  isStill.value = false
}

let ticker: any = null

onMounted(() => {
  window.addEventListener('scroll', resetActivity)
  window.addEventListener('mousemove', resetActivity)
  window.addEventListener('touchstart', resetActivity)
  ticker = setInterval(checkStillness, 1000)

  // September Scroll-Back Logic
  ScrollTrigger.create({
    trigger: '#month-september',
    start: 'top center',
    onUpdate: (self) => {
      // Detect scrolling UP into september
      if (self.direction === -1) {
        // We could trigger something specific here, but since MonthSection 
        // handles extraText on Enter, entering back from August also counts.
      }
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', resetActivity)
  window.removeEventListener('mousemove', resetActivity)
  window.removeEventListener('touchstart', resetActivity)
  clearInterval(ticker)
})

useHead({
  title: 'A Year in Calm Moments'
})
</script>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fadeIn 2s ease-out forwards;
}
</style>

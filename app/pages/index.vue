<template>
  <NuxtLayout>
    <AmbientBackground :is-still="isStill" :is-glowing="isGlowing" :warmth-level="warmthLevel"
      :depth-level="depthLevel" />
    <ProgressIndicator />

    <!-- Landing Section -->
    <SectionWrapper @enter="handleMonthEnter('landing')" @leave="handleMonthLeave('landing')">
      <h1 class="font-serif text-5xl md:text-7xl italic mb-6">A Year in <br /> Calm Moments</h1>
      <p class="font-sans text-sm tracking-widest uppercase opacity-60">Scroll gently</p>
    </SectionWrapper>

    <!-- Months Journey -->
    <MonthSection v-for="(month, index) in months" :key="month.name" v-bind="month"
      :id="`month-${month.name.toLowerCase()}`" :class="{ 'text-accent-warm': month.name === 'October' }"
      @enter="handleMonthEnter(month.name)" @leave="handleMonthLeave(month.name)" />

    <!-- Final Section -->
    <SectionWrapper @enter="handleFinalEnter" @leave="handleMonthLeave('final')">
      <div class="space-y-12">
        <p class="font-serif text-2xl md:text-3xl italic">
          Thank you for being the calmest part of my year.
        </p>
        <HiddenNote>
          <template #content>
            Happy Valentine's Day. <br /> I see you. I appreciate you.
          </template>
        </HiddenNote>

        <div ref="dedicatedMomentRef" class="mt-16 opacity-0 translate-y-4 transition-all duration-1000">
          <NuxtLink to="/valentine" class="group relative inline-flex flex-col items-center no-underline"
            @mouseenter="handleCTAInteraction(true)" @mouseleave="handleCTAInteraction(false)">
            <!-- Decorative Background Glow -->
            <div
              class="absolute -inset-4 bg-accent/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
            </div>

            <div
              class="relative px-8 py-4 border border-accent/20 rounded-full bg-white/5 backdrop-blur-sm group-hover:border-accent/40 transition-all duration-700">
              <span class="text-xs md:text-sm tracking-[0.4em] uppercase text-accent font-sans">
                A dedicated moment
              </span>
            </div>

            <!-- Intent indicator -->
            <div
              class="mt-4 flex flex-col items-center space-y-2 opacity-40 group-hover:opacity-80 transition-opacity duration-1000">
              <div class="w-[1px] h-8 bg-accent/30"></div>
              <span class="text-[9px] tracking-[0.2em] uppercase italic">For you</span>
            </div>
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
const dedicatedMomentRef = ref<HTMLElement | null>(null)
const showLoopClosure = ref(false)
const activeMonth = ref<string | null>(null)

const months = ref<{
  name: string;
  message: string;
  interactionType?: 'resistance' | 'focus' | 'exhale' | 'pacing' | 'static';
  extraText?: string;
  extraDelay?: number;
}[]>([
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

const handleCTAInteraction = (active: boolean) => {
  if (active && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(10)
  }
}

const handleMonthEnter = (name: string) => {
  activeMonth.value = name

  // Explicitly reset on enter to clear any previous state "stuck"
  isGlowing.value = false
  warmthLevel.value = 0
  depthLevel.value = 0

  if (name === 'May') {
    isGlowing.value = true
    warmthLevel.value = 0.4
  } else if (name === 'October') {
    warmthLevel.value = 0.5
  } else if (name === 'February') {
    warmthLevel.value = 0.15
  } else if (name === 'November') {
    depthLevel.value = 0.8
  }

  // Re-sync stillness
  resetActivity()
}

const handleMonthLeave = (name: string) => {
  if (activeMonth.value === name) {
    activeMonth.value = null
    // Reset to defaults on leave to ensure no "glow" hangs
    isGlowing.value = false
    warmthLevel.value = 0
    depthLevel.value = 0
  }
}

const handleFinalEnter = () => {
  activeMonth.value = 'final'
  isGlowing.value = true
  warmthLevel.value = 0.25

  // Reveal Dedicated Moment CTA
  if (dedicatedMomentRef.value) {
    gsap.to(dedicatedMomentRef.value, {
      opacity: 1,
      y: 0,
      duration: 2,
      delay: 1.5,
      ease: 'expo.out'
    })
  }

  setTimeout(() => { showLoopClosure.value = true }, 5000)
}

const checkStillness = () => {
  const now = Date.now()
  // Trigger stillness if idle for 7s AND on February (or February-like states)
  if (now - lastActivity.value > 7000) {
    if (activeMonth.value === 'February' || activeMonth.value === 'final') {
      isStill.value = true
    }
  }
}

const resetActivity = () => {
  lastActivity.value = Date.now()
  isStill.value = false
}

let ticker: any = null

onMounted(() => {
  window.addEventListener('scroll', resetActivity, { passive: true })
  window.addEventListener('mousemove', resetActivity)
  window.addEventListener('touchstart', resetActivity, { passive: true })
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

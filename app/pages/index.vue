<template>
  <NuxtLayout>
    <AmbientBackground :is-still="isStill" :is-glowing="isGlowing" :warmth-level="warmthLevel"
      :depth-level="depthLevel" />
    <ProgressIndicator />

    <!-- Landing Section -->
    <SectionWrapper @enter="handleMonthEnter('landing')" @leave="handleMonthLeave('landing')">
      <div class="text-center">
        <p class="font-sans text-[9px] tracking-[0.5em] uppercase text-accent/40 mb-10 font-light">2025 — 2026</p>
        <h1 class="font-serif text-5xl md:text-7xl leading-[1.1] mb-3">
          A Year in<br />
          <em>Calm Moments</em>
        </h1>
        <div class="flex items-center justify-center gap-4 mt-10">
          <div class="h-[1px] w-10 bg-accent/20"></div>
          <p class="font-sans text-[9px] tracking-[0.5em] uppercase text-accent/40 font-light">Scroll gently</p>
          <div class="h-[1px] w-10 bg-accent/20"></div>
        </div>
      </div>
    </SectionWrapper>

    <!-- Months Journey -->
    <MonthSection v-for="(month, index) in months" :key="month.name" v-bind="month"
      :id="`month-${month.name.toLowerCase()}`" :class="{ 'text-accent-warm': month.name === 'October' }"
      @enter="handleMonthEnter(month.name)" @leave="handleMonthLeave(month.name)" />

    <!-- Final Section -->
    <SectionWrapper @enter="handleFinalEnter" @leave="handleMonthLeave('final')">
      <div class="space-y-14">

        <div class="space-y-5">
          <p class="font-serif text-2xl md:text-4xl italic leading-snug">
            Thank you for being<br />the calmest part of my year.
          </p>
          <!-- Thin rule -->
          <div class="flex justify-center mt-6">
            <div class="h-[1px] w-12 bg-accent/25"></div>
          </div>
        </div>

        <HiddenNote>
          <template #content>
            Happy Valentine's Day.<br />
            <span class="text-accent/80">I see you. I appreciate you.</span>
          </template>
        </HiddenNote>

        <!-- CTA: A dedicated moment -->
        <div ref="dedicatedMomentRef" class="opacity-0 translate-y-4 transition-all duration-1000">
          <NuxtLink to="/valentine" class="group relative inline-flex flex-col items-center no-underline"
            @mouseenter="handleCTAInteraction(true)" @mouseleave="handleCTAInteraction(false)">

            <!-- Ambient glow -->
            <div
              class="absolute -inset-6 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
              style="background: radial-gradient(circle, rgba(190,152,152,0.12) 0%, transparent 70%);"></div>

            <div
              class="relative px-10 py-4 bg-transparent group-hover:bg-accent/5 transition-all duration-700"
              style="border: 1px solid rgba(190,152,152,0.2); border-radius: 2px;">
              <span class="font-sans text-[10px] tracking-[0.5em] uppercase text-accent/70 group-hover:text-accent transition-colors duration-500 font-light">
                A dedicated moment
              </span>
            </div>

            <!-- Descender arrow -->
            <div
              class="mt-5 flex flex-col items-center gap-2 opacity-35 group-hover:opacity-70 transition-opacity duration-700">
              <div class="w-[1px] h-6 bg-accent/40"></div>
              <span class="font-sans text-[8px] tracking-[0.3em] uppercase italic text-accent/60">For you</span>
            </div>
          </NuxtLink>
        </div>

        <!-- Loop closure -->
        <div v-if="showLoopClosure"
          class="animate-fade-in font-sans text-[9px] tracking-[0.4em] uppercase text-accent/35 font-light">
          Some days don't need much noise to feel meaningful.
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

type Month = {
  name: string
  message: string
  interactionType?: 'resistance' | 'focus' | 'exhale' | 'pacing' | 'static'
  extraText?: string
  extraDelay?: number
}

const months = ref<Month[]>([
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
  { name: 'December', message: 'Looking back, I realized how much peace you brought.', extraText: "Some days don\u2019t need much noise to feel meaningful.", extraDelay: 4000 },
])

const handleCTAInteraction = (active: boolean) => {
  if (active && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(10)
  }
}

const handleMonthEnter = (name: string) => {
  activeMonth.value = name
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

  resetActivity()
}

const handleMonthLeave = (name: string) => {
  if (activeMonth.value === name) {
    activeMonth.value = null
    isGlowing.value = false
    warmthLevel.value = 0
    depthLevel.value = 0
  }
}

const handleFinalEnter = () => {
  activeMonth.value = 'final'
  isGlowing.value = true
  warmthLevel.value = 0.25

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

  ScrollTrigger.create({
    trigger: '#month-september',
    start: 'top center',
    onUpdate: (_self) => {}
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
  from { opacity: 0; }
  to   { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 2.5s ease-out forwards;
}
</style>

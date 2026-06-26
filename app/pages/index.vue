<template>
  <NuxtLayout>
    <AmbientBackground :is-still="isStill" :is-glowing="isGlowing" :warmth-level="warmthLevel"
      :depth-level="depthLevel" />
    <ProgressIndicator />

    <!-- Landing Section -->
    <SectionWrapper @enter="handleMonthEnter('landing')" @leave="handleMonthLeave('landing')">
      <div class="text-center">
        <p class="font-sans text-[9px] tracking-[0.5em] uppercase text-accent/35 mb-8 font-light">2025 — 2026</p>
        <h1 class="font-serif text-[2.6rem] md:text-7xl leading-[1.1]">
          A Year in<br /><em>Calm Moments</em>
        </h1>
        <div class="flex items-center gap-3 mt-10 justify-center">
          <p class="font-sans text-[9px] tracking-[0.45em] uppercase text-accent/40 font-light">Scroll gently</p>
        </div>
      </div>
    </SectionWrapper>

    <!-- Months Journey -->
    <MonthSection v-for="month in months" :key="month.name" v-bind="month"
      :month="month.name" :id="`month-${month.name.toLowerCase()}`"
      :class="{ 'text-accent-warm': month.name === 'October' }"
      @enter="handleMonthEnter(month.name)" @leave="handleMonthLeave(month.name)" />

    <!-- Final Section -->
    <SectionWrapper @enter="handleFinalEnter" @leave="handleMonthLeave('final')">
      <div class="space-y-10 text-center">

        <p class="font-serif text-[1.75rem] md:text-4xl italic leading-snug">
          Thank you for being in these quiet moments.
        </p>

        <div ref="closingLine2Ref" class="opacity-0">
          <p class="font-sans text-[9px] tracking-[0.4em] uppercase text-accent/30 font-light">
            Some days don't need much noise to feel meaningful.
          </p>
        </div>

        <div ref="closingLine3Ref" class="opacity-0">
          <p class="font-serif text-lg md:text-xl italic text-text/55 leading-snug">
            Some stories aren't finished where the page ends.
          </p>
        </div>

        <div ref="invitationRef" class="opacity-0">
          <NuxtLink to="/chapters" style="text-decoration: none;">
            <span class="font-sans text-[9px] md:text-[10px] tracking-[0.45em] uppercase text-accent/50 hover:text-accent/80 transition-colors duration-500 font-light">
              The Quiet Chapters →
            </span>
          </NuxtLink>
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
const closingLine2Ref = ref<HTMLElement | null>(null)  // "Some days don't need..."
const closingLine3Ref = ref<HTMLElement | null>(null)  // "Some stories aren't finished..."
const invitationRef = ref<HTMLElement | null>(null)    // "The Quiet Chapters →"
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
  { name: 'April', message: 'Some victories don\'t announce themselves.', interactionType: 'focus' },
  { name: 'May', message: 'Some loves leave a shape that stays.', interactionType: 'focus' },
  { name: 'June', message: 'The warmth arrived,\nsettling into the corners\nof the day.', interactionType: 'pacing' },
  { name: 'July', message: 'Stillness in the heat. A pause in the middle of everything.', interactionType: 'static' },
  { name: 'August', message: 'Golden hours that felt like they would last forever.' },
  { name: 'September', message: 'A shift in the air. The beauty of letting go.', extraText: 'Some things stay.', extraDelay: 2000 },
  { name: 'October', message: 'Some people make the year feel gentler just by existing.', extraText: 'October feels warmer for a reason.', extraDelay: 3000 },
  { name: 'November', message: 'The world drew close again. Coziness as a necessity.' },
  { name: 'December', message: 'Looking back, I realized how much peace you brought.', extraText: "Some days don\u2019t need much noise to feel meaningful.", extraDelay: 4000 },
])

const handleMonthEnter = (name: string) => {
  activeMonth.value = name
  isGlowing.value = false
  warmthLevel.value = 0
  depthLevel.value = 0

  if (name === 'October') {
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

  if (closingLine2Ref.value) {
    gsap.to(closingLine2Ref.value, {
      opacity: 1,
      duration: 1.5,
      delay: 3,
      ease: 'sine.inOut',
    })
  }

  if (closingLine3Ref.value) {
    gsap.to(closingLine3Ref.value, {
      opacity: 1,
      duration: 1.5,
      delay: 5.5,
      ease: 'sine.inOut',
    })
  }

  if (invitationRef.value) {
    gsap.to(invitationRef.value, {
      opacity: 1,
      duration: 1.5,
      delay: 8,
      ease: 'sine.inOut',
    })
  }
}

const checkStillness = () => {
  const now = Date.now()
  if (now - lastActivity.value > 5000) {
    if (activeMonth.value === 'February' || activeMonth.value === 'final') {
      isStill.value = true
    }
    if (activeMonth.value === 'final' && invitationRef.value) {
      // Reveal invitation early if user is still — GSAP handles already-animating gracefully
      gsap.to(invitationRef.value, { opacity: 1, duration: 1.5, ease: 'sine.inOut' })
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
</style>

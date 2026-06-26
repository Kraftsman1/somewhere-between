<template>
  <NuxtLayout>
    <!-- Landing overlay — dissolves on Continue → -->
    <div
      v-if="overlayVisible"
      ref="overlayRef"
      class="fixed inset-0 z-50 flex items-center justify-center px-8"
      style="background-color: var(--color-bg);"
    >
      <div class="max-w-xs w-full text-center space-y-10">

        <!-- Title -->
        <div ref="titleRef" style="opacity: 0;">
          <h1 class="font-serif text-[2.2rem] md:text-5xl leading-snug">Somewhere Between</h1>
        </div>

        <!-- Paragraph with rotating word -->
        <div ref="paraRef" style="opacity: 0;">
          <p class="font-serif text-base md:text-lg leading-relaxed text-text/70 italic">
            <template v-if="introWord !== 'home'">There are <em>{{ introWord }}</em> that never asked to be extraordinary.</template>
            <template v-else>There is <em>home</em>.</template>
            They arrived quietly, stayed longer than expected, and, somewhere along the way, became part of the story.
            Some were joyful. Some were difficult. Most were ordinary in the moment, only revealing their meaning much later.
            This is simply a place where a few of those moments are remembered.
          </p>
        </div>

        <!-- Continue CTA -->
        <div ref="ctaRef" style="opacity: 0;" class="space-y-6">
          <button
            @click="handleContinue"
            class="font-sans text-[9px] tracking-[0.45em] uppercase text-accent/50 hover:text-accent/80 transition-colors duration-500 font-light cursor-pointer bg-transparent border-none"
          >
            Continue →
          </button>
          <p class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/30 font-light">
            scroll gently ↓
          </p>
        </div>

      </div>
    </div>

    <AmbientBackground :is-still="isStill" :is-glowing="isGlowing" :warmth-level="warmthLevel"
      :depth-level="depthLevel" />
    <ProgressIndicator />

    <!-- Months Journey -->
    <MonthSection v-for="month in months" :key="month.name" v-bind="month"
      :month="month.name" :id="`month-${month.name.toLowerCase()}`"
      :theme="month.theme"
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

        <div ref="timestampRef" class="opacity-0 mt-8">
          <p class="font-sans text-[7px] tracking-[0.35em] uppercase text-accent/25 font-light">
            Last updated quietly · June 2026
          </p>
        </div>

      </div>
    </SectionWrapper>

  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { getMonthByNumber } = useMonthData()

const isStill = ref(false)
const isGlowing = ref(false)
const warmthLevel = ref(0)
const depthLevel = ref(0)
const lastActivity = ref(Date.now())
const closingLine2Ref = ref<HTMLElement | null>(null)  // "Some days don't need..."
const closingLine3Ref = ref<HTMLElement | null>(null)  // "Some stories aren't finished..."
const invitationRef = ref<HTMLElement | null>(null)    // "The Quiet Chapters →"
const invitationRevealed = ref(false)
const activeMonth = ref<string | null>(null)

const overlayRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const paraRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const timestampRef = ref<HTMLElement | null>(null)
const overlayVisible = ref(true)

type Month = {
  name: string
  message: string
  interactionType?: 'resistance' | 'focus' | 'exhale' | 'pacing' | 'static'
  extraText?: string
  extraDelay?: number
  theme?: string
}

const months = ref<Month[]>([
  { name: 'January', message: 'The year began with a quiet promise.', interactionType: 'resistance', theme: getMonthByNumber(1)?.theme },
  { name: 'February', message: 'Short days, long thoughts, and the comfort of returning.', extraText: 'Today felt like a good day to say this.', extraDelay: 7000, theme: getMonthByNumber(2)?.theme },
  { name: 'March', message: 'Slowly, light started to reclaim the afternoons.', interactionType: 'exhale', theme: getMonthByNumber(3)?.theme },
  { name: 'April', message: 'Some victories don\'t announce themselves.', interactionType: 'focus', theme: getMonthByNumber(4)?.theme },
  { name: 'May', message: 'Some loves leave a shape that stays.', interactionType: 'focus', theme: getMonthByNumber(5)?.theme },
  { name: 'June', message: 'The warmth arrived,\nsettling into the corners\nof the day.', interactionType: 'pacing', theme: getMonthByNumber(6)?.theme },
  { name: 'July', message: 'Stillness in the heat. A pause in the middle of everything.', interactionType: 'static', theme: getMonthByNumber(7)?.theme },
  { name: 'August', message: 'Golden hours that felt like they would last forever.', theme: getMonthByNumber(8)?.theme },
  { name: 'September', message: 'A shift in the air. The beauty of letting go.', extraText: 'Some things stay.', extraDelay: 2000, theme: getMonthByNumber(9)?.theme },
  { name: 'October', message: 'Some people make the year feel gentler just by existing.', extraText: 'October feels warmer for a reason.', extraDelay: 3000, theme: getMonthByNumber(10)?.theme },
  { name: 'November', message: 'The world drew close again. Coziness as a necessity.', theme: getMonthByNumber(11)?.theme },
  { name: 'December', message: 'Looking back, I realized how much peace you brought.', extraText: "Some days don’t need much noise to feel meaningful.", extraDelay: 4000, theme: getMonthByNumber(12)?.theme },
])

const introWords = ['moments', 'conversations', 'seasons', 'memories', 'beginnings', 'home']

const introWord = computed(() => {
  if (!import.meta.client) return introWords[0]
  const count = parseInt(localStorage.getItem('sb_visit_count') ?? '0')
  return introWords[count % introWords.length]
})

const handleContinue = () => {
  // Increment visit counter for next session
  const count = parseInt(localStorage.getItem('sb_visit_count') ?? '0')
  localStorage.setItem('sb_visit_count', String(count + 1))

  // Re-enable scroll immediately so she can see February emerge beneath
  document.documentElement.style.overflow = ''

  if (!overlayRef.value) {
    overlayVisible.value = false
    return
  }

  gsap.to(overlayRef.value, {
    opacity: 0,
    duration: 1.8,
    ease: 'sine.inOut',
    onComplete: () => {
      overlayVisible.value = false
    },
  })
}

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

  if (timestampRef.value) {
    gsap.to(timestampRef.value, {
      opacity: 1,
      duration: 2,
      delay: 10,
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
    if (activeMonth.value === 'final' && invitationRef.value && !invitationRevealed.value) {
      invitationRevealed.value = true
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
  // Disable scroll until Continue is pressed
  document.documentElement.style.overflow = 'hidden'

  // Overlay reveal sequence
  if (titleRef.value) {
    gsap.to(titleRef.value, { opacity: 1, duration: 2, delay: 0.5, ease: 'sine.inOut' })
  }
  if (paraRef.value) {
    gsap.to(paraRef.value, { opacity: 1, duration: 1.8, delay: 3, ease: 'sine.inOut' })
  }
  if (ctaRef.value) {
    gsap.to(ctaRef.value, { opacity: 1, duration: 1.5, delay: 5.5, ease: 'sine.inOut' })
  }

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
  document.documentElement.style.overflow = ''
  window.removeEventListener('scroll', resetActivity)
  window.removeEventListener('mousemove', resetActivity)
  window.removeEventListener('touchstart', resetActivity)
  clearInterval(ticker)
})

useHead({
  title: 'Somewhere Between'
})
</script>

<style>
</style>

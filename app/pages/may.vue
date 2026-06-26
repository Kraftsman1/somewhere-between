<template>
  <div
    class="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden"
    style="background-color: var(--color-bg);"
  >
    <AmbientBackground :warmth-level="0.08" />

    <!-- Grain -->
    <div class="fixed inset-0 z-[2] pointer-events-none opacity-50"
      style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.035\'/%3E%3C/svg%3E'); background-size: 256px 256px;" />

    <!-- Back -->
    <NuxtLink to="/" class="fixed top-6 left-6 z-40" style="text-decoration: none;">
      <span class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/30 hover:text-accent/65 transition-colors duration-500 font-light">← Back</span>
    </NuxtLink>

    <!-- Month label -->
    <div class="fixed top-6 right-6 z-40">
      <span class="font-sans text-[8px] tracking-[0.35em] uppercase text-accent/30 font-light">05 · MAY</span>
    </div>

    <!-- Canvas text area -->
    <div class="relative z-20 max-w-md w-full px-8 text-center flex flex-col items-center gap-10">

      <p class="font-sans text-[9px] tracking-[0.5em] uppercase text-accent/35 font-light">some loves leave a shape that stays</p>

      <!-- Word-by-word reveal -->
      <div class="space-y-8">
        <div ref="line1" class="overflow-hidden">
          <p class="font-serif text-[2.5rem] md:text-6xl leading-snug" style="opacity: 0; transform: translateY(30px);">
            Some loves
          </p>
        </div>
        <div ref="line2" class="overflow-hidden">
          <p class="font-serif text-[2rem] md:text-5xl leading-snug italic" style="opacity: 0; transform: translateY(30px);">
            don't need words
          </p>
        </div>
        <div ref="line3" class="overflow-hidden">
          <p class="font-serif text-[2.5rem] md:text-6xl leading-snug" style="opacity: 0; transform: translateY(30px);">
            to be understood.
          </p>
        </div>
      </div>

      <!-- Follow-up text -->
      <div ref="followUp" style="opacity: 0;">
        <p class="font-serif text-xl md:text-2xl leading-snug text-text/70 italic">
          Thirteen years of presence. Of loyalty that never<br />asked for anything in return.
        </p>
        <p class="font-serif text-lg md:text-xl mt-4 leading-snug text-text/60 italic">
          The kind of love that makes the house feel<br />different when it's gone.
        </p>
      </div>

      <!-- Bibi's name -->
      <div ref="bibiEl" style="opacity: 0;">
        <p class="font-serif text-xl md:text-2xl text-text/80 italic">Bibi.</p>
      </div>

      <!-- Easter egg — appears after full animation completes -->
      <div v-if="animDone" class="mt-4">
        <EasterEgg
          trigger="corner"
          icon="·"
          content="Love doesn't disappear."
          sub-content="Sometimes it simply changes shape."
          corner-position="bottom-6 right-6"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

definePageMeta({ layout: false })
useHead({ title: 'May — Somewhere Between' })

const line1 = ref<HTMLElement | null>(null)
const line2 = ref<HTMLElement | null>(null)
const line3 = ref<HTMLElement | null>(null)
const followUp = ref<HTMLElement | null>(null)
const bibiEl = ref<HTMLElement | null>(null)
const animDone = ref(false)

onMounted(() => {
  const lineRefs = [line1.value, line2.value, line3.value]
  const tl = gsap.timeline({ onComplete: () => { animDone.value = true } })

  lineRefs.forEach((el, i) => {
    if (!el) return
    const p = el.querySelector('p')
    if (!p) return
    tl.to(p, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: 'expo.out',
      delay: i === 0 ? 0.8 : 0,
    }, i === 0 ? '+=0' : '+=0.6')
  })

  tl.to(followUp.value, { opacity: 1, duration: 1.8, ease: 'sine.inOut' }, '+=1.5')
  // Bibi's name: imperceptibly slow. She should almost wonder if she imagined it.
  tl.to(bibiEl.value, { opacity: 0.65, duration: 4.5, ease: 'power1.inOut' }, '+=4')
})
</script>

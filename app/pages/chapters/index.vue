<template>
  <div
    class="relative min-h-[100dvh] w-full"
    style="background-color: var(--color-bg);"
  >
    <!-- Grain -->
    <div class="fixed inset-0 z-[2] pointer-events-none opacity-50"
      style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.035\'/%3E%3C/svg%3E'); background-size: 256px 256px;" />

    <!-- Back -->
    <NuxtLink to="/" class="fixed top-6 left-6 z-40" style="text-decoration: none;">
      <span class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/30 hover:text-accent/65 transition-colors duration-500 font-light">← Back</span>
    </NuxtLink>

    <!-- Page label -->
    <div class="fixed top-6 right-6 z-40">
      <span class="font-sans text-[8px] tracking-[0.35em] uppercase text-accent/30 font-light">The Quiet Chapters</span>
    </div>

    <!-- Content -->
    <div ref="pageEl" class="relative z-10 max-w-sm mx-auto px-8 pt-28 pb-32" style="opacity: 0;">

      <!-- Header -->
      <div class="mb-16 text-center">
        <h1 class="font-serif text-[2rem] md:text-4xl text-text leading-snug">The Quiet Chapters</h1>
        <p class="font-sans text-[9px] tracking-[0.4em] uppercase text-accent/40 mt-3 font-light">A record of the story so far.</p>
      </div>

      <!-- Timeline — chronological order, prologue in its natural position -->
      <div>

        <template v-for="chapter in allVisible" :key="chapter.id">
          <div class="h-px w-full bg-accent/10 mb-8" />

          <div
            class="mb-8 cursor-pointer"
            @click="toggleOpen(chapter.id)"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1.5">
                <p class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/40 font-light">
                  Chapter {{ chapterNumerals.get(chapter.id) }}
                </p>
                <h2 class="font-serif text-[1.3rem] md:text-2xl text-text leading-snug">{{ chapter.title }}</h2>
                <p class="font-sans text-[8px] tracking-[0.3em] uppercase text-accent/35 font-light">{{ chapter.displayDate }}</p>
              </div>
              <div class="shrink-0 pt-0.5">
                <span
                  class="font-sans text-[7px] tracking-[0.35em] uppercase font-light"
                  :class="chapter.state === 'still-unfolding' ? 'text-accent/25 italic' : 'text-accent/50'"
                >
                  {{ chapter.state === 'still-unfolding' ? 'Still unfolding' : 'Remembered' }}
                </span>
              </div>
            </div>

            <div
              class="overflow-hidden transition-all duration-700 ease-in-out"
              :style="{ maxHeight: openId === chapter.id ? '500px' : '0px' }"
            >
              <div class="pt-6 space-y-4">
                <p
                  v-for="(para, i) in chapter.reflection.split('\n\n')"
                  :key="i"
                  class="font-serif text-base md:text-lg text-text/65 leading-relaxed italic"
                >
                  {{ para }}
                </p>

                <p v-if="chapter.type === 'reflection'"
                  class="font-serif text-sm text-text/30 italic pt-2">
                  Some memories are complete exactly as they are.
                </p>

                <div v-if="chapter.type === 'immersive'" class="pt-2">
                  <div class="h-px w-8 bg-accent/20 mb-4" />
                  <NuxtLink
                    :to="`/chapters/${chapter.slug}`"
                    class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/50 hover:text-accent/80 transition-colors duration-300 font-light"
                    style="text-decoration: none;"
                    @click.stop
                  >
                    Continue →
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- Final rule -->
        <div class="h-px w-full bg-accent/10 mb-14" />

        <!-- Unwritten -->
        <div class="text-center space-y-5 pb-4">
          <p class="font-serif text-text/25 text-xl">·</p>
          <p class="font-serif text-base text-text/35 italic leading-relaxed">
            The next chapter hasn't been written yet.
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

definePageMeta({ layout: false })
useHead({ title: 'The Quiet Chapters — Somewhere Between' })

const { getVisibleChapters } = useChapters()
const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

const allVisible = computed(() => getVisibleChapters())

const chapterNumerals = computed(() => {
  const map = new Map<string, string>()
  allVisible.value.forEach((c, idx) => map.set(c.id, romanNumerals[idx]))
  return map
})

const openId = ref<string | null>(null)
const pageEl = ref<HTMLElement | null>(null)

const toggleOpen = (id: string) => {
  openId.value = openId.value === id ? null : id
}

onMounted(() => {
  if (pageEl.value) {
    gsap.to(pageEl.value, { opacity: 1, duration: 1.5, ease: 'sine.inOut', delay: 0.3 })
  }
})
</script>

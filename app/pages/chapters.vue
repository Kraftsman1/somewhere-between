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

      <!-- Timeline -->
      <div>
        <template v-for="chapter in visibleChapters" :key="chapter.number">
          <!-- Rule above each entry -->
          <div class="h-px w-full bg-accent/10 mb-8" />

          <!-- Chapter card -->
          <div
            class="mb-8 cursor-pointer"
            @click="toggleChapter(chapter.number)"
          >
            <!-- Header row -->
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1.5">
                <p class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/40 font-light">
                  Chapter {{ chapter.roman }}
                </p>
                <h2 class="font-serif text-[1.3rem] md:text-2xl text-text leading-snug">
                  {{ chapter.title }}
                </h2>
                <p class="font-sans text-[8px] tracking-[0.3em] uppercase text-accent/35 font-light">
                  {{ chapter.displayDate }}
                </p>
              </div>
              <div class="shrink-0 pt-0.5">
                <span
                  class="font-sans text-[7px] tracking-[0.35em] uppercase font-light"
                  :class="chapter.status === 'remembered' ? 'text-accent/50' : 'text-accent/25 italic'"
                >
                  {{ chapter.status === 'remembered' ? 'Remembered' : 'Still unfolding' }}
                </span>
              </div>
            </div>

            <!-- Expandable content -->
            <div
              class="overflow-hidden transition-all duration-700 ease-in-out"
              :style="{ maxHeight: openChapter === chapter.number ? '500px' : '0px' }"
            >
              <div class="pt-6 space-y-4">
                <p
                  v-for="(para, i) in chapter.reflection.split('\n\n')"
                  :key="i"
                  class="font-serif text-base md:text-lg text-text/65 leading-relaxed italic"
                >
                  {{ para }}
                </p>

                <!-- Footer line for reflection-only chapters (Part I — Remembered) -->
                <p v-if="!chapter.hasFullPage"
                  class="font-serif text-sm text-text/30 italic pt-2">
                  Some memories are complete exactly as they are.
                </p>

                <!-- Link for full-page chapters (Part II — Lived) -->
                <div v-if="chapter.hasFullPage" class="pt-2">
                  <div class="h-px w-8 bg-accent/20 mb-4" />
                  <NuxtLink
                    :to="chapter.route!"
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

const visibleChapters = ref(getVisibleChapters())
const openChapter = ref<number | null>(null)
const pageEl = ref<HTMLElement | null>(null)

const toggleChapter = (num: number) => {
  openChapter.value = openChapter.value === num ? null : num
}

onMounted(() => {
  if (pageEl.value) {
    gsap.to(pageEl.value, { opacity: 1, duration: 1.5, ease: 'sine.inOut', delay: 0.3 })
  }
})
</script>

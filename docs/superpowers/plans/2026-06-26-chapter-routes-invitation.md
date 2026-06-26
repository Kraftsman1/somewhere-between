# Chapter Routes, Data Model Refactor & Homepage Invitation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate chapter pages to `/chapters/[slug]` URLs, introduce the new Chapter data model (Prologue + Chapters I–V), add theme-primary display to MonthSection, and build the homepage invitation overlay.

**Architecture:** A new `useChapters.ts` interface drives the archive page and chapter routing. Chapter pages move from `/april`, `/may`, `/valentine` to `/chapters/healing`, `/chapters/remembering`, `/chapters/somewhere-between`. Old routes become client-side redirect shims. The homepage gains a full-screen overlay that dissolves on "Continue →", revealing the monthly journey beneath.

**Tech Stack:** Nuxt 4 (SSR: false), Vue 3 Composition API, GSAP 3, TailwindCSS, Cormorant Garamond (font-serif) / Josefin Sans (font-sans), localStorage, CSS variables `var(--color-bg)` / `var(--color-accent)` / `text-text`.

## Global Constraints

- Mobile-first: base Tailwind classes for 375px, `md:` breakpoint only for desktop scale-up. Never reverse this.
- No Co-Authored-By trailers in any commit message.
- SSR is false — localStorage and `document.*` access is always safe (always client-side).
- Never use `ssr: false` guards (`process.client`, `onMounted` wrappers) for simple reactive reads since there is no SSR.
- All text content copied verbatim from this plan — do not paraphrase chapter reflections, paragraph text, or UI copy.
- Do NOT push to remote.
- Font classes: `font-serif` = Cormorant Garamond, `font-sans` = Josefin Sans.
- CSS var colors: `var(--color-bg)` background, `var(--color-accent)` accent, `text-text` main text.
- Grain overlay pattern (used in standalone pages): `url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.035\'/%3E%3C/svg%3E')` at `background-size: 256px 256px`.

---

## File Map

| File | Action | Responsible Task |
|------|--------|-----------------|
| `app/composables/useChapters.ts` | Rewrite | Task 1 |
| `app/components/MonthPage.vue` | Modify — add `backRoute` prop | Task 2 |
| `app/pages/chapters/somewhere-between.vue` | Create (from valentine.vue content) | Task 2 |
| `app/pages/chapters/healing.vue` | Create (from april.vue content) | Task 2 |
| `app/pages/chapters/remembering.vue` | Create (from may.vue content) | Task 2 |
| `app/pages/chapters/index.vue` | Create (from chapters.vue, initial copy) | Task 2 |
| `app/pages/valentine.vue` | Convert to redirect shim | Task 2 |
| `app/pages/april.vue` | Convert to redirect shim | Task 2 |
| `app/pages/may.vue` | Convert to redirect shim | Task 2 |
| `app/pages/chapters.vue` | Delete (replaced by chapters/index.vue) | Task 2 |
| `app/composables/useMonthData.ts` | Modify — update April/May routes | Task 2 |
| `app/pages/chapters/index.vue` | Modify — new Chapter interface + Prologue display | Task 3 |
| `app/components/MonthSection.vue` | Modify — add `theme` prop | Task 4 |
| `app/pages/index.vue` | Modify — pass themes to MonthSection + homepage overlay | Tasks 4 & 5 |

---

### Task 1: Rewrite useChapters.ts

**Files:**
- Modify: `app/composables/useChapters.ts`

**Interfaces:**
- Produces: `ChapterType`, `ChapterState`, `Chapter` interface, `useChapters()` composable with `{ chapters, getVisibleChapters }`

**Verification:** `npm run build` completes without TypeScript errors (Nuxt type-checks composables at build).

- [ ] **Step 1: Replace the file with the new interface and data**

```typescript
// app/composables/useChapters.ts
export type ChapterType = 'prologue' | 'reflection' | 'immersive'
export type ChapterState = 'remembered' | 'preserved' | 'still-unfolding'

export interface Chapter {
  id: string
  title: string
  subtitle?: string
  date: Date
  displayDate: string
  type: ChapterType
  state: ChapterState
  slug: string
  reflection: string
  hiddenNote?: string
}

export const useChapters = () => {
  const chapters: Chapter[] = [
    {
      id: 'somewhere-between',
      title: 'Somewhere Between',
      date: new Date('2025-02-01'),
      displayDate: 'February 2025',
      type: 'prologue',
      state: 'remembered',
      slug: 'somewhere-between',
      reflection: 'A year of quiet moments, small joys, and the comfort of returning. Not every chapter needs a turning point to matter.',
    },
    {
      id: 'the-first-hello',
      title: 'The First Hello',
      date: new Date('2020-05-06'),
      displayDate: 'May 6, 2020',
      type: 'reflection',
      state: 'remembered',
      slug: 'the-first-hello',
      reflection: 'Some conversations begin so simply that you don\'t realize until later that everything changed inside them.',
    },
    {
      id: 'finding-our-way-back',
      title: 'Finding Our Way Back',
      date: new Date('2022-01-01'),
      displayDate: '2022',
      type: 'reflection',
      state: 'remembered',
      slug: 'finding-our-way-back',
      reflection: 'Some distances aren\'t measured in miles. And some returns feel more like arrivals than homecomings.',
    },
    {
      id: 'the-twelve-days',
      title: 'The Twelve Days',
      date: new Date('2024-12-01'),
      displayDate: 'December 2024',
      type: 'reflection',
      state: 'remembered',
      slug: 'the-twelve-days',
      reflection: 'There are stretches of time that don\'t feel like time at all. Just a steady presence that makes the ordinary feel significant.',
    },
    {
      id: 'healing',
      title: 'Healing',
      date: new Date('2026-04-01'),
      displayDate: 'April 2026',
      type: 'immersive',
      state: 'preserved',
      slug: 'healing',
      reflection: 'Some victories don\'t arrive with celebration. They arrive after years of carrying something heavier than anyone else could see. I hope the days ahead continue to become gentler than the ones behind.',
    },
    {
      id: 'remembering',
      title: 'Remembering',
      date: new Date('2026-05-01'),
      displayDate: 'May 2026',
      type: 'immersive',
      state: 'preserved',
      slug: 'remembering',
      reflection: 'Thirteen years. She was there through the ordinary days and the hard ones, asking nothing but presence in return. Some loves leave a shape that stays long after they\'re gone.\n\nFor Bibi.',
    },
  ]

  const getVisibleChapters = (): Chapter[] => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return chapters.filter(c => c.date <= today)
  }

  return { chapters, getVisibleChapters }
}
```

- [ ] **Step 2: Verify build**

```bash
cd /home/ghost/PlayGround/somewhere-between && npm run build 2>&1 | tail -20
```

Expected: Build completes. Ignore any "chapters.vue uses old interface" type errors — they will be fixed in Task 3. If there are errors in `chapters.vue` but nowhere else, proceed.

- [ ] **Step 3: Commit**

```bash
git add app/composables/useChapters.ts
git commit -m "refactor: rewrite useChapters with new Chapter interface — Prologue + Chapters I–V"
```

---

### Task 2: Route restructure — create chapters/ directory, redirect shims, MonthPage backRoute

**Files:**
- Modify: `app/components/MonthPage.vue` (add `backRoute` prop)
- Create: `app/pages/chapters/somewhere-between.vue`
- Create: `app/pages/chapters/healing.vue`
- Create: `app/pages/chapters/remembering.vue`
- Create: `app/pages/chapters/index.vue` (initial copy of chapters.vue, updated in Task 3)
- Modify (convert to shim): `app/pages/valentine.vue`
- Modify (convert to shim): `app/pages/april.vue`
- Modify (convert to shim): `app/pages/may.vue`
- Delete: `app/pages/chapters.vue`
- Modify: `app/composables/useMonthData.ts` (update April and May routes)

**Interfaces:**
- Consumes: Nothing from Task 1 (chapters/index.vue gets Task 1 interface in Task 3)
- Produces: Routes `/chapters/somewhere-between`, `/chapters/healing`, `/chapters/remembering`, `/chapters` (index)
- `MonthPage.vue` gains optional `backRoute?: string` prop defaulting to `'/'`

**Verification:** Dev server shows all 4 new routes work; old routes `/valentine`, `/april`, `/may` redirect correctly; `/chapters` still renders (even if it uses the old data interface temporarily).

- [ ] **Step 1: Add `backRoute` prop to MonthPage.vue**

In `app/components/MonthPage.vue`, the `defineProps` block currently ends at line ~128. Add `backRoute` to the props and update the back link in the template.

Current `defineProps` block (around line 122):
```typescript
const props = defineProps<{
  monthName: string
  monthNumber: number
  themeTagline: string
  slides: Slide[]
  particleType: ParticleType
  ambientWarmth?: number
}>()
```

Replace with:
```typescript
const props = defineProps<{
  monthName: string
  monthNumber: number
  themeTagline: string
  slides: Slide[]
  particleType: ParticleType
  ambientWarmth?: number
  backRoute?: string
}>()
```

Current back link in the template (around line 19):
```vue
<NuxtLink
  to="/"
  class="fixed top-6 left-6 z-40 flex items-center gap-2 group"
  style="text-decoration: none;"
>
  <span class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/30 group-hover:text-accent/65 transition-colors duration-500 font-light">← Back</span>
</NuxtLink>
```

Replace with:
```vue
<NuxtLink
  :to="backRoute ?? '/'"
  class="fixed top-6 left-6 z-40 flex items-center gap-2 group"
  style="text-decoration: none;"
>
  <span class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/30 group-hover:text-accent/65 transition-colors duration-500 font-light">← Back</span>
</NuxtLink>
```

- [ ] **Step 2: Create app/pages/chapters/somewhere-between.vue**

This is the ex-valentine.vue (5-phase cinematic experience), moved to `/chapters/somewhere-between`. Content is unchanged; only the back link target and page-label change.

```vue
<template>
    <div
        class="relative min-h-[100dvh] w-full flex flex-col items-center justify-center bg-bg text-text overflow-hidden font-sans"
        style="background-color: #faf5ee;">

        <AmbientBackground :is-still="isStill" :is-glowing="isGlowing" :warmth-level="warmthLevel" />

        <!-- Grain overlay -->
        <div class="fixed inset-0 z-[2] pointer-events-none opacity-50"
            style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.035\'/%3E%3C/svg%3E'); background-size: 256px 256px;">
        </div>

        <!-- Back to archive -->
        <NuxtLink to="/chapters" class="fixed top-6 left-6 z-40" style="text-decoration: none;">
            <span class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/30 hover:text-accent/65 transition-colors duration-500 font-light">← Back</span>
        </NuxtLink>

        <!-- Chapter label -->
        <div class="fixed top-6 right-6 z-40">
            <span class="font-sans text-[8px] tracking-[0.35em] uppercase text-accent/30 font-light">Prologue</span>
        </div>

        <!-- Content -->
        <div
            class="relative z-20 max-w-md w-full px-8 text-center flex flex-col items-center justify-center min-h-[65vh]">

            <!-- Phase 1: Arrival -->
            <div v-show="phase === 0" class="arrival-text opacity-0 translate-y-6">
                <p class="font-serif text-3xl md:text-5xl italic leading-snug mb-8">
                    Some days don't need much noise<br />to feel meaningful.
                </p>
                <div class="flex items-center justify-center gap-4">
                    <div class="h-[1px] w-8" style="background: rgba(190,152,152,0.25);"></div>
                    <p class="font-sans text-[9px] tracking-[0.4em] uppercase text-accent/40 font-light">
                        Today felt like one of those days.
                    </p>
                    <div class="h-[1px] w-8" style="background: rgba(190,152,152,0.25);"></div>
                </div>
            </div>

            <!-- Phase 2: Recognition -->
            <div v-show="phase === 1"
                class="recognition-text absolute inset-0 px-8 flex flex-col items-center justify-center opacity-0">
                <p class="font-serif text-3xl md:text-4xl leading-snug italic">
                    There's a calm I associate with you —<br />
                    something steady, familiar,<br />
                    and grounding in the best way.
                </p>
            </div>

            <!-- Phase 3: Presence -->
            <div v-show="phase === 2 || phase === 3"
                class="presence-text absolute inset-0 px-8 flex flex-col items-center justify-center opacity-0">
                <p class="font-serif text-2xl md:text-4xl leading-snug italic mb-10">
                    I've come to appreciate how your presence<br />
                    changes a moment, often quietly,<br />
                    without asking for attention —<br />
                    and yet it always feels felt.
                </p>
                <p class="font-sans text-[10px] tracking-[0.4em] uppercase text-accent/50 font-light leading-relaxed">
                    Today just felt like a good day<br />to pause and say that.
                </p>
            </div>

            <!-- Phase 4: Stillness Layer -->
            <div v-show="phase === 3" class="stillness-layer absolute inset-0 flex items-center justify-center">
                <p v-if="showStillnessReward"
                    class="font-serif text-base italic opacity-0 animate-fade-in tracking-[0.06em]"
                    style="color: var(--color-accent);">
                    Some moments don't need words at all.
                </p>
            </div>

            <!-- Phase 5: Closing -->
            <div v-show="phase === 4"
                class="closing-text absolute inset-0 px-8 flex flex-col items-center justify-center opacity-0 gap-8 md:gap-14">

                <div class="flex flex-col items-center gap-5">
                    <p class="font-serif text-2xl italic" style="color: rgba(32,30,26,0.5);">No expectations.</p>
                    <p class="font-serif text-2xl italic" style="color: rgba(32,30,26,0.5);">No pressure.</p>
                    <p class="font-serif text-2xl italic" style="color: rgba(32,30,26,0.5);">Just appreciation.</p>
                </div>

                <div class="flex items-center gap-3">
                    <div class="h-[1px] w-10" style="background: rgba(190,152,152,0.2);"></div>
                    <div class="w-1 h-1 rounded-full" style="background: rgba(190,152,152,0.3);"></div>
                    <div class="h-[1px] w-10" style="background: rgba(190,152,152,0.2);"></div>
                </div>

                <p class="font-serif text-2xl md:text-3xl leading-snug max-w-xs mx-auto italic">
                    However today meets you,<br />
                    I hope it's kind to you —<br />
                    and gentle in all the ways that matter.
                </p>

                <div class="relative flex flex-col items-center">
                    <div
                        class="cursor-pointer group flex flex-col items-center gap-3 px-8 py-5 select-none"
                        @mousedown="startPress" @mouseup="cancelPress"
                        @touchstart.passive="startPress" @touchend.passive="cancelPress"
                        @mouseleave="cancelPress">

                        <div class="w-2 h-2 rounded-full transition-all duration-500 ease-out"
                            style="background: var(--color-accent);"
                            :style="{ transform: 'scale(' + (isHolding ? 2.5 : 1) + ')', opacity: isHolding ? 1 : 0.4 }">
                        </div>
                        <p class="font-sans text-[8px] md:text-[9px] tracking-[0.35em] uppercase text-accent/35 group-hover:text-accent/55 transition-colors duration-500 font-light">
                            Hold to reveal
                        </p>
                    </div>

                    <p v-if="revealed"
                        class="mt-2 whitespace-nowrap font-serif text-lg italic animate-fade-in"
                        style="color: var(--color-accent);">
                        I'm really glad you're here.
                    </p>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

definePageMeta({
    layout: false
})
useHead({ title: 'Somewhere Between — The Quiet Chapters' })

const phase = ref(0)
const isStill = ref(false)
const isGlowing = ref(false)
const warmthLevel = ref(0)
const showStillnessReward = ref(false)
const revealed = ref(false)
const isHolding = ref(false)
let pressTimer: any = null

const startPress = () => {
    if (revealed.value) return
    isHolding.value = true
    pressTimer = setTimeout(() => {
        revealed.value = true
        isHolding.value = false
        if ('vibrate' in navigator) navigator.vibrate([20, 100, 20])
    }, 1000)
}

const cancelPress = () => {
    clearTimeout(pressTimer)
    isHolding.value = false
}

onMounted(() => {
    const tl = gsap.timeline()

    tl.to('.arrival-text', { opacity: 1, y: 0, duration: 2.5, ease: 'expo.out', delay: 1 })
        .to('.arrival-text', { opacity: 0, y: -16, duration: 1.5, ease: 'expo.in' }, '+=4')

        .call(() => {
            phase.value = 1
            warmthLevel.value = 0.1
        })
        .to('.recognition-text', { opacity: 1, duration: 2.5, ease: 'expo.out' })
        .to('.recognition-text', { opacity: 0, duration: 1.5, ease: 'expo.in' }, '+=5')

        .call(() => {
            phase.value = 2
            isGlowing.value = true
            warmthLevel.value = 0.2
        })
        .to('.presence-text', { opacity: 1, duration: 2.5, ease: 'expo.out' })

        .call(() => {
            phase.value = 3
            isStill.value = true
        })
        .to({}, {
            duration: 7,
            onStart: () => {
                setTimeout(() => { showStillnessReward.value = true }, 2500)
            }
        })
        .to('.presence-text', { opacity: 0, duration: 2, ease: 'expo.in' })

        .call(() => {
            phase.value = 4
            showStillnessReward.value = false
            isStill.value = false
            isGlowing.value = true
            warmthLevel.value = 0.3
        })
        .to('.closing-text', { opacity: 1, duration: 3, ease: 'expo.out' })
})
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 2s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}
</style>
```

- [ ] **Step 3: Create app/pages/chapters/healing.vue**

This is april.vue moved to the new route. Pass `backRoute="/chapters"` to MonthPage. Update `useHead` title. The `getMonthByRoute` call stays as `/april` until Task 2 Step 7 updates useMonthData.

```vue
<template>
  <MonthPage
    month-name="April"
    :month-number="4"
    :theme-tagline="month.themeTagline"
    :slides="slides"
    particle-type="none"
    :ambient-warmth="month.ambientWarmth"
    back-route="/chapters"
  >
    <template #easter-egg>
      <div class="flex flex-col items-center gap-3">
        <EasterEgg
          trigger="hover"
          icon="◦"
          label="A quiet note"
          content="Healing isn't always visible."
          sub-content="I'm proud of you anyway."
        />
      </div>
    </template>
  </MonthPage>
</template>

<script setup lang="ts">
const { getMonthByRoute } = useMonthData()
const month = getMonthByRoute('/april')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'Healing — Somewhere Between' })
</script>
```

- [ ] **Step 4: Create app/pages/chapters/remembering.vue**

This is may.vue moved to the new route. Add the back link and chapter label (may.vue is custom, doesn't use MonthPage, so these elements must be added manually). Keep all animation logic unchanged.

```vue
<template>
  <div
    class="relative min-h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden"
    style="background-color: var(--color-bg);"
  >
    <AmbientBackground :warmth-level="0.08" />

    <!-- Grain -->
    <div class="fixed inset-0 z-[2] pointer-events-none opacity-50"
      style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.035\'/%3E%3C/svg%3E'); background-size: 256px 256px;" />

    <!-- Back to archive -->
    <NuxtLink to="/chapters" class="fixed top-6 left-6 z-40" style="text-decoration: none;">
      <span class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/30 hover:text-accent/65 transition-colors duration-500 font-light">← Back</span>
    </NuxtLink>

    <!-- Chapter label -->
    <div class="fixed top-6 right-6 z-40">
      <span class="font-sans text-[8px] tracking-[0.35em] uppercase text-accent/30 font-light">Chapter V · May 2026</span>
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
useHead({ title: 'Remembering — Somewhere Between' })

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
  tl.to(bibiEl.value, { opacity: 0.65, duration: 4.5, ease: 'power1.inOut' }, '+=4')
})
</script>
```

- [ ] **Step 5: Create app/pages/chapters/index.vue as initial copy**

Create `app/pages/chapters/index.vue` with the full content of the CURRENT `app/pages/chapters.vue`. Copy it verbatim — it still uses the old Chapter interface, which is acceptable as a temporary bridge. Task 3 will update it to use the new interface.

Copy the entire content of `app/pages/chapters.vue` into `app/pages/chapters/index.vue` (exact same content, no changes).

- [ ] **Step 6: Delete app/pages/chapters.vue**

```bash
git rm app/pages/chapters.vue
```

- [ ] **Step 7: Update useMonthData.ts — April and May routes**

In `app/composables/useMonthData.ts`, find the April entry (around line 87) and update its `route`:
- Change: `route: '/april'`
- To: `route: '/chapters/healing'`

Find the May entry (around line 115) and update its `route`:
- Change: `route: '/may'`
- To: `route: '/chapters/remembering'`

Also update `healing.vue`'s route lookup: in `app/pages/chapters/healing.vue`, change:
```typescript
const month = getMonthByRoute('/april')!
```
to:
```typescript
const month = getMonthByRoute('/chapters/healing')!
```

- [ ] **Step 8: Convert valentine.vue to redirect shim**

Replace the entire content of `app/pages/valentine.vue`:

```vue
<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
onMounted(() => {
  navigateTo('/chapters/somewhere-between', { replace: true })
})
</script>
```

- [ ] **Step 9: Convert april.vue to redirect shim**

Replace the entire content of `app/pages/april.vue`:

```vue
<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
onMounted(() => {
  navigateTo('/chapters/healing', { replace: true })
})
</script>
```

- [ ] **Step 10: Convert may.vue to redirect shim**

Replace the entire content of `app/pages/may.vue`:

```vue
<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
onMounted(() => {
  navigateTo('/chapters/remembering', { replace: true })
})
</script>
```

- [ ] **Step 11: Verify dev server**

```bash
cd /home/ghost/PlayGround/somewhere-between && npm run dev &
```

Wait ~5 seconds, then check:
- Navigate to `/chapters/somewhere-between` — should show the 5-phase cinematic; top-right label says "Prologue"; back link goes to /chapters
- Navigate to `/chapters/healing` — should show the April MonthPage with slide content; back link goes to /chapters
- Navigate to `/chapters/remembering` — should show the May animation; back link goes to /chapters; top-right label says "Chapter V · May 2026"
- Navigate to `/valentine` — should immediately redirect to `/chapters/somewhere-between`
- Navigate to `/april` — should immediately redirect to `/chapters/healing`
- Navigate to `/may` — should immediately redirect to `/chapters/remembering`
- Navigate to `/chapters` — should render the archive (even if using old interface data temporarily)

- [ ] **Step 12: Commit**

```bash
git add app/components/MonthPage.vue \
        app/pages/chapters/somewhere-between.vue \
        app/pages/chapters/healing.vue \
        app/pages/chapters/remembering.vue \
        app/pages/chapters/index.vue \
        app/pages/valentine.vue \
        app/pages/april.vue \
        app/pages/may.vue \
        app/composables/useMonthData.ts
git commit -m "refactor: move chapter pages to /chapters/[slug], add redirect shims for old routes"
```

---

### Task 3: Update chapters/index.vue for new Chapter interface + Prologue display

**Files:**
- Modify: `app/pages/chapters/index.vue`

**Interfaces:**
- Consumes: `Chapter`, `ChapterType`, `ChapterState`, `useChapters()` from Task 1
- The new Chapter interface has no `number`, `roman`, `hasFullPage`, `status`, or `route` fields — these are all derived

**Verification:** `/chapters` route shows Prologue at top with "Prologue" label, then Chapters I–V with roman numerals derived from position. "Continue →" links to `/chapters/[slug]`. Reflection chapters show "Some memories are complete exactly as they are." Prologue shows "Continue →" linking to `/chapters/somewhere-between`.

- [ ] **Step 1: Rewrite app/pages/chapters/index.vue**

```vue
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

        <!-- Prologue (displayed separately, before numbered chapters) -->
        <template v-if="prologue">
          <div class="h-px w-full bg-accent/10 mb-8" />
          <div
            class="mb-8 cursor-pointer"
            @click="toggleOpen(prologue.id)"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1.5">
                <p class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/40 font-light">Prologue</p>
                <h2 class="font-serif text-[1.3rem] md:text-2xl text-text leading-snug">{{ prologue.title }}</h2>
                <p class="font-sans text-[8px] tracking-[0.3em] uppercase text-accent/35 font-light">{{ prologue.displayDate }}</p>
              </div>
              <div class="shrink-0 pt-0.5">
                <span class="font-sans text-[7px] tracking-[0.35em] uppercase font-light text-accent/50">
                  Remembered
                </span>
              </div>
            </div>

            <div
              class="overflow-hidden transition-all duration-700 ease-in-out"
              :style="{ maxHeight: openId === prologue.id ? '500px' : '0px' }"
            >
              <div class="pt-6 space-y-4">
                <p
                  v-for="(para, i) in prologue.reflection.split('\n\n')"
                  :key="i"
                  class="font-serif text-base md:text-lg text-text/65 leading-relaxed italic"
                >
                  {{ para }}
                </p>
                <div class="pt-2">
                  <div class="h-px w-8 bg-accent/20 mb-4" />
                  <NuxtLink
                    :to="`/chapters/${prologue.slug}`"
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

        <!-- Numbered chapters (I–V) -->
        <template v-for="(chapter, idx) in numberedChapters" :key="chapter.id">
          <div class="h-px w-full bg-accent/10 mb-8" />

          <div
            class="mb-8 cursor-pointer"
            @click="toggleOpen(chapter.id)"
          >
            <div class="flex items-start justify-between gap-4">
              <div class="space-y-1.5">
                <p class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/40 font-light">
                  Chapter {{ romanNumerals[idx] }}
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
const prologue = computed(() => allVisible.value.find(c => c.type === 'prologue') ?? null)
const numberedChapters = computed(() => allVisible.value.filter(c => c.type !== 'prologue'))

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
```

- [ ] **Step 2: Verify in browser**

With dev server running, navigate to `/chapters`. Verify:
- Page fades in on load
- "Prologue" label appears above "Somewhere Between" entry
- Clicking Prologue expands with reflection text + "Continue →" linking to `/chapters/somewhere-between`
- Below Prologue: "Chapter I The First Hello", "Chapter II Finding Our Way Back", "Chapter III The Twelve Days" (reflection type → "Some memories are complete exactly as they are.")
- "Chapter IV Healing" and "Chapter V Remembering" (immersive type → "Continue →" links)
- Bottom: "The next chapter hasn't been written yet."

- [ ] **Step 3: Commit**

```bash
git add app/pages/chapters/index.vue
git commit -m "refactor: update chapters/index.vue — Prologue + Chapters I–V using new Chapter interface"
```

---

### Task 4: MonthSection.vue theme prop + index.vue theme passthrough

**Files:**
- Modify: `app/components/MonthSection.vue`
- Modify: `app/pages/index.vue`

**Interfaces:**
- `MonthSection` gains optional `theme?: string` prop
- When `theme` is provided, it appears as a small heading above the numeral+month label
- `index.vue` months array gains `theme` field, looked up from `useMonthData`

**Verification:** Homepage journey shows theme name (e.g., "Quiet Strength") for months with themes. Months without themes still display normally with just the month name.

- [ ] **Step 1: Add theme prop to MonthSection.vue**

In `app/components/MonthSection.vue`, find the `defineProps` block (line ~71) and add `theme?`:

```typescript
const props = defineProps<{
  month?: string
  message: string
  interactionType?: 'resistance' | 'focus' | 'exhale' | 'pacing' | 'static'
  extraText?: string
  extraDelay?: number
  theme?: string
}>()
```

In the template, find the "Month label" block (lines 12–20):

```vue
<!-- Month label: numeral · rule · name -->
<div v-if="month" class="flex items-center gap-3">
  <span class="font-sans text-[9px] tracking-[0.35em] uppercase text-accent/40 tabular-nums select-none">
    {{ String(monthIndex).padStart(2, '0') }}
  </span>
  <div class="h-px w-6 bg-accent/20 shrink-0"></div>
  <h2 class="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-accent/60 font-light">
    {{ month }}
  </h2>
</div>
```

Replace with:

```vue
<!-- Month label: theme (if set) · numeral · rule · name -->
<div v-if="theme" class="mb-2">
  <p class="font-sans text-[8px] md:text-[9px] tracking-[0.4em] uppercase text-accent/55 font-light">{{ theme }}</p>
</div>
<div v-if="month" class="flex items-center gap-3">
  <span class="font-sans text-[9px] tracking-[0.35em] uppercase text-accent/40 tabular-nums select-none">
    {{ String(monthIndex).padStart(2, '0') }}
  </span>
  <div class="h-px w-6 bg-accent/20 shrink-0"></div>
  <h2 class="font-sans text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-accent/60 font-light">
    {{ month }}
  </h2>
</div>
```

- [ ] **Step 2: Add themes to the months array in index.vue**

In `app/pages/index.vue`, import `useMonthData` and look up themes. Add these imports at the top of `<script setup>`:

```typescript
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { getMonthByNumber } = useMonthData()
```

Update the `Month` type and months array to include `theme`:

```typescript
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
```

In the template, pass `theme` to `MonthSection`:

```vue
<MonthSection v-for="month in months" :key="month.name" v-bind="month"
  :month="month.name" :id="`month-${month.name.toLowerCase()}`"
  :theme="month.theme"
  :class="{ 'text-accent-warm': month.name === 'October' }"
  @enter="handleMonthEnter(month.name)" @leave="handleMonthLeave(month.name)" />
```

- [ ] **Step 3: Verify theme display**

Navigate to the homepage. Scroll through the MonthSection journey. You should see small theme labels above each month's numeral:
- April: "Quiet Strength" appears above "04 — APRIL"
- May: "Enduring Love" appears above "05 — MAY"
- February: "Quiet Celebration" above "02 — FEBRUARY"
- All 12 months should show their theme from useMonthData

- [ ] **Step 4: Commit**

```bash
git add app/components/MonthSection.vue app/pages/index.vue
git commit -m "feat: add theme-primary display to MonthSection, pass themes from useMonthData to homepage journey"
```

---

### Task 5: Homepage landing overlay — The Invitation

**Files:**
- Modify: `app/pages/index.vue`

**Interfaces:**
- Adds a new `overlayVisible` ref (boolean), `overlayRef`, `titleRef`, `paraRef`, `ctaRef` template refs
- Adds `introWord` (computed from localStorage visit count)
- Adds `handleContinue()` function
- Adds the overlay `<div>` before the existing `<SectionWrapper>` landing section
- Disables body scroll on mount; re-enables on Continue
- Adds "Last updated quietly · June 2026" below The Quiet Chapters → link in the Final Section

**Verification:** On first load the overlay is visible and scroll is locked. Title fades in at ~0.5s, paragraph at ~3s, CTA at ~5.5s. Clicking "Continue →" fades the overlay and unlocks scroll. Word cycles on subsequent visits: moments → conversations → seasons → memories → beginnings → home (using localStorage key `sb_visit_count`).

- [ ] **Step 1: Add overlay template block to index.vue**

In `app/pages/index.vue`, inside the `<NuxtLayout>` block, add the overlay as the FIRST child (before AmbientBackground):

```vue
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
    <div ref="ctaRef" style="opacity: 0;">
      <button
        @click="handleContinue"
        class="font-sans text-[9px] tracking-[0.45em] uppercase text-accent/50 hover:text-accent/80 transition-colors duration-500 font-light cursor-pointer bg-transparent border-none"
      >
        Continue →
      </button>
    </div>

  </div>
</div>
```

- [ ] **Step 2: Update the Final Section to add timestamp**

Find the final section in `app/pages/index.vue` (the `SectionWrapper` with `@enter="handleFinalEnter"`). Inside, after the `invitationRef` div, add a "last updated" line:

Current closing of Final Section:
```vue
        <div ref="invitationRef" class="opacity-0">
          <NuxtLink to="/chapters" style="text-decoration: none;">
            <span class="font-sans text-[9px] md:text-[10px] tracking-[0.45em] uppercase text-accent/50 hover:text-accent/80 transition-colors duration-500 font-light">
              The Quiet Chapters →
            </span>
          </NuxtLink>
        </div>

      </div>
    </SectionWrapper>
```

Replace with:
```vue
        <div ref="invitationRef" class="opacity-0">
          <NuxtLink to="/chapters" style="text-decoration: none;">
            <span class="font-sans text-[9px] md:text-[10px] tracking-[0.45em] uppercase text-accent/50 hover:text-accent/80 transition-colors duration-500 font-light">
              The Quiet Chapters →
            </span>
          </NuxtLink>
        </div>

        <div ref="invitationRef" class="opacity-0 mt-8">
          <p class="font-sans text-[7px] tracking-[0.35em] uppercase text-accent/25 font-light">
            Last updated quietly · June 2026
          </p>
        </div>

      </div>
    </SectionWrapper>
```

Wait — two elements cannot share the same ref `invitationRef`. The timestamp should be a separate ref. Let me correct that:

Add a new ref `timestampRef` and animate it alongside `invitationRef`.

The correct replacement for the Final Section ending:
```vue
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
```

- [ ] **Step 3: Add overlay script logic to index.vue**

Add to the `<script setup>` section. Insert the following new refs and functions alongside the existing ones:

**New refs** (add near the existing `ref` declarations):
```typescript
const overlayRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const paraRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const timestampRef = ref<HTMLElement | null>(null)
const overlayVisible = ref(true)
```

**Rotating word logic** (add before `handleMonthEnter`):
```typescript
const introWords = ['moments', 'conversations', 'seasons', 'memories', 'beginnings', 'home']

const introWord = computed(() => {
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
```

**Update `handleFinalEnter`** to also animate `timestampRef`. Replace the existing function:

```typescript
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
```

**Update `onMounted`** to disable scroll and start overlay reveal sequence. Replace the entire `onMounted` block:

```typescript
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
```

**Update `onUnmounted`** to clean up the overflow style:

```typescript
onUnmounted(() => {
  document.documentElement.style.overflow = ''
  window.removeEventListener('scroll', resetActivity)
  window.removeEventListener('mousemove', resetActivity)
  window.removeEventListener('touchstart', resetActivity)
  clearInterval(ticker)
})
```

**Update `useHead`**:

```typescript
useHead({
  title: 'Somewhere Between'
})
```

- [ ] **Step 4: Remove the old landing section content**

The old landing `SectionWrapper` block in the template (lines 8–18 of the template) is now redundant — the overlay replaces it. Remove the old landing section completely:

Remove:
```vue
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
```

Also remove the `handleMonthEnter('landing')` / `handleMonthLeave('landing')` handling (they just reset warmth to 0 via `handleMonthEnter`, which is harmless but unused — safe to leave if it's inside the existing function and not causing issues).

- [ ] **Step 5: Full final index.vue — verify the complete file is coherent**

After all edits, the template structure should be:
1. `<!-- Landing overlay -->` (the new fixed overlay, `v-if="overlayVisible"`)
2. `<AmbientBackground />`
3. `<ProgressIndicator />`
4. `<MonthSection v-for="month in months" ...>`  (12 months, no landing SectionWrapper above them)
5. `<!-- Final Section -->` with closing lines + invitation + timestamp

The script should have:
- All existing refs: `isStill`, `isGlowing`, `warmthLevel`, `depthLevel`, `lastActivity`, `closingLine2Ref`, `closingLine3Ref`, `invitationRef`, `invitationRevealed`, `activeMonth`
- New refs: `overlayRef`, `titleRef`, `paraRef`, `ctaRef`, `timestampRef`, `overlayVisible`
- `introWords`, `introWord` computed, `handleContinue`
- `handleMonthEnter`, `handleMonthLeave`, `handleFinalEnter` (updated with `timestampRef`)
- `checkStillness`, `resetActivity`
- `onMounted` (updated with overflow + overlay GSAP)
- `onUnmounted` (updated with overflow cleanup)
- `useHead({ title: 'Somewhere Between' })`

- [ ] **Step 6: Verify in browser**

With dev server running, navigate to `/`:
1. Page loads with overlay visible. Scroll is locked (try scrolling — nothing happens).
2. After ~0.5s: "Somewhere Between" fades in.
3. After ~3s: Paragraph fades in with the rotating word (e.g., "moments" on first visit).
4. After ~5.5s: "Continue →" button fades in.
5. Click "Continue →": overlay fades out smoothly over ~1.8s; scroll is re-enabled; you can now scroll through February, March, April... sections.
6. Clear localStorage (`localStorage.removeItem('sb_visit_count')`), reload, confirm word is "moments".
7. Set `localStorage.setItem('sb_visit_count', '1')`, reload, confirm word is "conversations".
8. Set count to 5, reload, confirm word is "home" and first sentence reads "There is <em>home</em>."
9. Scroll to the final section, wait for the 4-beat reveal; confirm "Last updated quietly · June 2026" appears last.

- [ ] **Step 7: Commit**

```bash
git add app/pages/index.vue
git commit -m "feat: homepage invitation overlay — rotating intro word, Continue dissolve, last updated timestamp"
```

---

## Post-Implementation Checklist

- [ ] All 4 chapter routes load without errors: `/chapters`, `/chapters/somewhere-between`, `/chapters/healing`, `/chapters/remembering`
- [ ] Old routes redirect correctly: `/valentine` → `/chapters/somewhere-between`, `/april` → `/chapters/healing`, `/may` → `/chapters/remembering`
- [ ] Prologue appears at top of `/chapters`, labeled "Prologue" not "Chapter 0"
- [ ] Chapters I–V appear in correct order with correct roman numerals
- [ ] Reflection chapters show "Some memories are complete exactly as they are."
- [ ] Immersive chapters show "Continue →" linking to `/chapters/[slug]`
- [ ] MonthSection shows theme above month label for all 12 months
- [ ] Homepage overlay appears on load, scroll locked
- [ ] Continue → dissolves overlay, unlocks scroll
- [ ] Word cycles correctly across visits
- [ ] "Last updated quietly · June 2026" appears in final section
- [ ] No TypeScript errors in `npm run build`

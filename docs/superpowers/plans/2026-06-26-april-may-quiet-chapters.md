# April/May Rewrites & The Quiet Chapters — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite April (healing) and May (Bibi, remembrance) chapters, redesign the homepage ending, and build the `/chapters` archive page driven by a new `useChapters.ts` composable.

**Architecture:** A new `useChapters.ts` composable defines all emotional landmarks as structured data. The `/chapters` page reads from it. Individual chapter pages (`/april`, `/may`) are rewritten in place — their routes and component structure stay the same, only content and interactions change. The homepage's final section loses the Valentine framing and gains a quiet invitation to `/chapters`.

**Tech Stack:** Nuxt 4 (SSR: false), Vue 3 Composition API, GSAP 3, TailwindCSS, Cormorant Garamond + Josefin Sans fonts. Dev server: `npm run dev` (port 3000).

## Global Constraints

- No automated test suite — verification is manual in-browser via `npm run dev`
- All font classes: `font-serif` = Cormorant Garamond, `font-sans` = Josefin Sans
- CSS variable `var(--color-bg)` = deep navy background; `var(--color-accent)` = muted rose/gold accent; `text-text` = warm off-white
- `layout: false` in `definePageMeta` for all standalone pages (not using default layout)
- No emojis anywhere in content — project aesthetic is text-only
- No audio added — silence is intentional throughout
- Grain SVG overlay is identical across all pages — copy verbatim from existing pages
- `baseURL` is `/somewhere-between/` — dev server runs at `http://localhost:3000/somewhere-between/`
- Never commit `Co-Authored-By` trailers in git commit messages

---

### Task 1: Create `useChapters.ts`

**Files:**
- Create: `app/composables/useChapters.ts`

**Interfaces:**
- Produces: `Chapter` interface, `useChapters()` composable exporting `{ chapters, getVisibleChapters }`
- `getVisibleChapters(): Chapter[]` — returns chapters where `date <= today` in chronological order

- [ ] **Step 1: Create the file with full chapter registry**

Create `app/composables/useChapters.ts` with this exact content:

```typescript
export type ChapterStatus = 'written' | 'unfolding'

export interface Chapter {
  number: number
  roman: string
  title: string
  date: string         // ISO: 'YYYY-MM-DD' — used for time-gating
  displayDate: string  // Human-readable: 'May 6, 2020'
  reflection: string   // Paragraph(s) shown when a card unfolds; use \n\n for paragraph breaks
  status: ChapterStatus
  hasFullPage: boolean // true = show 'Open Chapter →' link
  route?: string       // e.g. '/april' — only set when hasFullPage is true
}

export const useChapters = () => {
  const chapters: Chapter[] = [
    {
      number: 1,
      roman: 'I',
      title: 'The First Hello',
      date: '2020-05-06',
      displayDate: 'May 6, 2020',
      reflection: 'Some conversations begin so simply that you don\'t realize until later that everything changed inside them.',
      status: 'written',
      hasFullPage: false,
    },
    {
      number: 2,
      roman: 'II',
      title: 'Finding Our Way Back',
      date: '2022-01-01',
      displayDate: '2022',
      reflection: 'Some distances aren\'t measured in miles. And some returns feel more like arrivals than homecomings.',
      status: 'written',
      hasFullPage: false,
    },
    {
      number: 3,
      roman: 'III',
      title: 'The Twelve Days',
      date: '2024-12-01',
      displayDate: 'December 2024',
      reflection: 'There are stretches of time that don\'t feel like time at all. Just a steady presence that makes the ordinary feel significant.',
      status: 'written',
      hasFullPage: false,
    },
    {
      number: 4,
      roman: 'IV',
      title: 'Somewhere Between',
      date: '2025-02-01',
      displayDate: '2025',
      reflection: 'A year of quiet moments, small joys, and the comfort of returning. Not every chapter needs a turning point to matter.',
      status: 'written',
      hasFullPage: true,
      route: '/',
    },
    {
      number: 5,
      roman: 'V',
      title: 'Healing',
      date: '2026-04-01',
      displayDate: 'April 2026',
      reflection: 'Some victories don\'t arrive with celebration. They arrive after years of carrying something heavier than anyone else could see. I hope the days ahead continue to become gentler than the ones behind.',
      status: 'written',
      hasFullPage: true,
      route: '/april',
    },
    {
      number: 6,
      roman: 'VI',
      title: 'Remembering',
      date: '2026-05-01',
      displayDate: 'May 2026',
      reflection: 'Thirteen years. She was there through the ordinary days and the hard ones, asking nothing but presence in return. Some loves leave a shape that stays long after they\'re gone.\n\nFor Bibi.',
      status: 'written',
      hasFullPage: true,
      route: '/may',
    },
  ]

  const getVisibleChapters = (): Chapter[] => {
    const today = new Date().toISOString().split('T')[0]
    return chapters.filter(c => c.date <= today)
  }

  return { chapters, getVisibleChapters }
}
```

- [ ] **Step 2: Verify the composable is importable**

Start the dev server if not already running:
```bash
npm run dev
```

Navigate to any page (e.g. `http://localhost:3000/somewhere-between/`). No console errors about `useChapters`. If there are import errors, check the file path — Nuxt auto-imports from `app/composables/`.

- [ ] **Step 3: Commit**

```bash
git add app/composables/useChapters.ts
git commit -m "feat: add useChapters composable with chapter registry and time-gating"
```

---

### Task 2: Update April and May entries in `useMonthData.ts`

**Files:**
- Modify: `app/composables/useMonthData.ts`

**Interfaces:**
- Consumes: existing `MonthData`, `Slide`, `EasterEggConfig` interfaces (no changes to interfaces)
- Produces: updated April and May entries consumed by `april.vue`, `may.vue`, and `index.vue`

- [ ] **Step 1: Update the April entry**

In `app/composables/useMonthData.ts`, find the April entry (currently `name: 'April'`) and replace it entirely:

```typescript
{
  name: 'April',
  number: 4,
  route: '/april',
  theme: 'Quiet Strength',
  themeTagline: 'some victories arrive quietly',
  slides: [
    {
      text: 'Some things you carry for so long, you forget what it felt like not to carry them.',
      subtext: 'Until one day, you don\'t have to anymore.',
    },
    {
      text: 'There is a particular kind of courage in choosing to heal — even when it\'s slow, even when it\'s inconvenient, even when no one else can see it.',
    },
    {
      text: 'Some victories don\'t arrive with celebration. They arrive quietly. After years of waiting.',
      subtext: 'I think you\'ve earned this one.',
    },
  ],
  easterEgg: {
    trigger: 'hover',
    triggerLabel: 'A quiet note',
    triggerIcon: '◦',
    content: 'Healing isn\'t always visible.',
    subContent: 'I\'m proud of you anyway.',
  },
  animationStyle: 'fadeFloat',
  particleType: 'none',
  ambientWarmth: 0.2,
},
```

- [ ] **Step 2: Update the May entry**

Find the May entry (currently `name: 'May'`) and replace it entirely:

```typescript
{
  name: 'May',
  number: 5,
  route: '/may',
  theme: 'Enduring Love',
  themeTagline: 'some loves leave a shape that stays',
  slides: [
    { text: 'Some loves', subtext: '—' },
    { text: 'don\'t need words', subtext: '—' },
    { text: 'to be understood.' },
    { text: 'Thirteen years of presence. Of loyalty that never asked for anything in return.' },
    { text: 'The kind of love that makes the house feel different when it\'s gone.' },
  ],
  easterEgg: {
    trigger: 'corner',
    triggerLabel: 'A quiet corner',
    triggerIcon: '·',
    content: 'Love doesn\'t disappear.',
    subContent: 'Sometimes it simply changes shape.',
  },
  animationStyle: 'canvas',
  particleType: 'none',
  ambientWarmth: 0.08,
},
```

- [ ] **Step 3: Verify no type errors**

The dev server (already running) should show no TypeScript errors in the terminal. If errors appear, confirm the `animationStyle` value `'canvas'` and `particleType` value `'none'` match the union types defined at the top of `useMonthData.ts`.

- [ ] **Step 4: Commit**

```bash
git add app/composables/useMonthData.ts
git commit -m "feat: update April and May entries in useMonthData — healing and remembrance themes"
```

---

### Task 3: Rewrite `app/pages/april.vue`

**Files:**
- Modify: `app/pages/april.vue`

**Interfaces:**
- Consumes: `useMonthData()` → `getMonthByRoute('/april')` → `month.slides`, `month.themeTagline`, `month.ambientWarmth`
- Consumes: `MonthPage` component (props: `monthName`, `monthNumber`, `themeTagline`, `slides`, `particleType`, `ambientWarmth`)
- Consumes: `EasterEgg` component (props: `trigger`, `icon`, `label`, `content`, `sub-content`)

- [ ] **Step 1: Replace `april.vue` entirely**

```vue
<template>
  <MonthPage
    month-name="April"
    :month-number="4"
    :theme-tagline="month.themeTagline"
    :slides="slides"
    particle-type="none"
    :ambient-warmth="month.ambientWarmth"
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
useHead({ title: 'April — Somewhere Between' })
</script>
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/somewhere-between/april`.

Check:
- Tagline reads "some victories arrive quietly"
- Slide 1: "Some things you carry for so long…" with subtext "Until one day…"
- Slide 2: "There is a particular kind of courage…" (no subtext)
- Slide 3: "Some victories don't arrive with celebration…" with subtext "I think you've earned this one."
- On the last slide, hovering the `◦` element reveals "Healing isn't always visible. / I'm proud of you anyway."
- Background has a slightly warmer feel than before (ambientWarmth 0.2)
- Tap/click advances slides; prev/next buttons work on desktop

- [ ] **Step 3: Commit**

```bash
git add app/pages/april.vue
git commit -m "feat: rewrite April chapter — Quiet Strength, healing theme"
```

---

### Task 4: Rewrite `app/pages/may.vue`

**Files:**
- Modify: `app/pages/may.vue`

**Interfaces:**
- Consumes: `AmbientBackground` component (prop: `warmth-level`)
- Consumes: `EasterEgg` component (props: `trigger`, `icon`, `content`, `sub-content`, `corner-position`)
- Consumes: `gsap` from `'gsap'`
- Produces: standalone page at `/may` — no parent component

- [ ] **Step 1: Replace `may.vue` entirely**

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
  tl.to(bibiEl.value, { opacity: 1, duration: 2, ease: 'sine.inOut' }, '+=4')
})
</script>
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/somewhere-between/may`.

Check:
- Tagline reads "some loves leave a shape that stays"
- Three lines appear in sequence: "Some loves" → "don't need words" → "to be understood."
- After the lines complete, the follow-up text fades in: "Thirteen years of presence…"
- After a ~4 second pause, "Bibi." fades in alone, centered
- No audio chime plays at any point
- After the full animation, the corner easter egg (`·`) appears bottom-right
- Tapping the `·` reveals "Love doesn't disappear. / Sometimes it simply changes shape."

- [ ] **Step 3: Commit**

```bash
git add app/pages/may.vue
git commit -m "feat: rewrite May chapter — remembrance of Bibi, enduring love theme"
```

---

### Task 5: Update `app/pages/index.vue` — homepage ending and month messages

**Files:**
- Modify: `app/pages/index.vue`

**Interfaces:**
- Consumes: `SectionWrapper`, `MonthSection`, `HiddenNote` (HiddenNote is removed from final section)
- Consumes: `gsap` from `'gsap'`
- Produces: updated homepage with new closing sequence linking to `/chapters`

- [ ] **Step 1: Update the April and May messages in the `months` array**

Find the `months` ref definition. Update the April entry:

```typescript
{ name: 'April', message: 'Some victories don\'t announce themselves.', interactionType: 'focus' },
```

Update the May entry (also remove the special `isGlowing`/`warmthLevel` casing — handled in Step 3):

```typescript
{ name: 'May', message: 'Some loves leave a shape that stays.', interactionType: 'focus' },
```

- [ ] **Step 2: Add new refs for the closing sequence**

In the `<script setup>` block, find where `dedicatedMomentRef` is declared and replace it with:

```typescript
const closingLine2Ref = ref<HTMLElement | null>(null)
const invitationRef = ref<HTMLElement | null>(null)
```

Remove the `dedicatedMomentRef` declaration entirely.

- [ ] **Step 3: Update `handleMonthEnter` — remove May glow**

Find the `handleMonthEnter` function. Remove the May special case:

```typescript
// DELETE this block:
if (name === 'May') {
  isGlowing.value = true
  warmthLevel.value = 0.4
}
```

May now receives no special ambient treatment on the homepage scroll (it reads as quiet, like the new content).

- [ ] **Step 4: Remove `handleCTAInteraction`**

Delete the entire `handleCTAInteraction` function:

```typescript
// DELETE:
const handleCTAInteraction = (active: boolean) => {
  if (active && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(10)
  }
}
```

- [ ] **Step 5: Update `handleFinalEnter`**

Replace the entire `handleFinalEnter` function:

```typescript
const handleFinalEnter = () => {
  activeMonth.value = 'final'
  isGlowing.value = true
  warmthLevel.value = 0.25

  // Phase 1: second closing line fades in after 3s
  if (closingLine2Ref.value) {
    gsap.to(closingLine2Ref.value, {
      opacity: 1,
      duration: 1.5,
      delay: 3,
      ease: 'sine.inOut',
    })
  }

  // Loop closure line at 5s
  setTimeout(() => { showLoopClosure.value = true }, 5000)

  // Phase 2: invitation at 6s (stillness detection can also trigger it — whichever fires first)
  if (invitationRef.value) {
    gsap.to(invitationRef.value, {
      opacity: 1,
      duration: 1.5,
      delay: 6,
      ease: 'sine.inOut',
    })
  }
}
```

- [ ] **Step 6: Update `checkStillness` to reveal invitation early**

Find `checkStillness` and update it:

```typescript
const checkStillness = () => {
  const now = Date.now()
  if (now - lastActivity.value > 5000) {
    if (activeMonth.value === 'February' || activeMonth.value === 'final') {
      isStill.value = true
    }
    if (activeMonth.value === 'final' && invitationRef.value) {
      gsap.to(invitationRef.value, { opacity: 1, duration: 1.5, ease: 'sine.inOut' })
    }
  }
}
```

- [ ] **Step 7: Replace the final SectionWrapper in the template**

Find the final `<SectionWrapper>` block (the one with `@enter="handleFinalEnter"`) and replace its inner content entirely:

```vue
<SectionWrapper @enter="handleFinalEnter" @leave="handleMonthLeave('final')">
  <div class="space-y-10 text-center">

    <p class="font-serif text-[1.75rem] md:text-4xl italic leading-snug">
      Thank you for being in these quiet moments.
    </p>

    <div ref="closingLine2Ref" class="opacity-0">
      <p class="font-serif text-lg md:text-xl italic text-text/65 leading-snug">
        Some stories aren't finished where the page ends.
      </p>
    </div>

    <div v-if="showLoopClosure"
      class="animate-fade-in font-sans text-[9px] tracking-[0.4em] uppercase text-accent/30 font-light">
      Some days don't need much noise to feel meaningful.
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
```

- [ ] **Step 8: Verify in browser**

Navigate to `http://localhost:3000/somewhere-between/` and scroll to the bottom.

Check:
- April scroll entry reads "Some victories don't announce themselves."
- May scroll entry reads "Some loves leave a shape that stays."
- May section no longer triggers an ambient glow on the homepage
- Final section reads "Thank you for being in these quiet moments."
- After ~3 seconds: "Some stories aren't finished where the page ends." fades in
- After ~5 seconds: the loop closure line appears
- After ~6 seconds (or after 5s of stillness): "The Quiet Chapters →" fades in
- Clicking "The Quiet Chapters →" navigates to `/chapters` (will 404 until Task 6 is complete — that's expected)
- No Valentine link or HiddenNote component appears anywhere in the final section

- [ ] **Step 9: Commit**

```bash
git add app/pages/index.vue
git commit -m "feat: redesign homepage ending — remove valentine CTA, add Quiet Chapters invitation"
```

---

### Task 6: Create `app/pages/chapters.vue`

**Files:**
- Create: `app/pages/chapters.vue`

**Interfaces:**
- Consumes: `useChapters()` → `getVisibleChapters(): Chapter[]`
- Consumes: `Chapter` interface from `useChapters.ts`
- Consumes: `gsap` from `'gsap'`
- Produces: standalone page at `/chapters`

- [ ] **Step 1: Create `chapters.vue`**

Create `app/pages/chapters.vue` with this exact content:

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
                  :class="chapter.status === 'written' ? 'text-accent/50' : 'text-accent/25 italic'"
                >
                  {{ chapter.status === 'written' ? 'Written' : 'Still unfolding' }}
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

                <div v-if="chapter.hasFullPage" class="pt-2">
                  <div class="h-px w-8 bg-accent/20 mb-4" />
                  <NuxtLink
                    :to="chapter.route!"
                    class="font-sans text-[8px] tracking-[0.4em] uppercase text-accent/50 hover:text-accent/80 transition-colors duration-300 font-light"
                    style="text-decoration: none;"
                    @click.stop
                  >
                    Open Chapter →
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
```

- [ ] **Step 2: Verify in browser**

Navigate to `http://localhost:3000/somewhere-between/chapters`.

Check:
- Page fades in gently on load (0.3s delay, 1.5s duration)
- Header: "The Quiet Chapters" + "A record of the story so far."
- All 6 chapters are visible (all have dates ≤ today: 2026-06-26)
- Each entry shows: chapter roman numeral, title, date, "Written" status
- Tapping Chapter I expands it: reflection text appears with smooth height animation
- Tapping Chapter I again collapses it
- Tapping Chapter II while Chapter I is open: Chapter I closes, Chapter II opens
- Chapters V and VI (Healing, Remembering) show "Open Chapter →" when expanded
- "Open Chapter →" on Chapter V links to `/april`; on Chapter VI links to `/may`
- Clicking "Open Chapter →" navigates correctly without also toggling the card
- "The next chapter hasn't been written yet." appears at the bottom
- Back link returns to `/`

- [ ] **Step 3: Commit**

```bash
git add app/pages/chapters.vue
git commit -m "feat: add /chapters page — The Quiet Chapters archive with time-gated timeline"
```

---

## Self-Review Notes

- All 6 spec requirements have corresponding tasks (data architecture → Task 1, April → Tasks 2+3, May → Tasks 2+4, homepage ending → Task 5, /chapters page → Task 6)
- `useChapters` is auto-imported by Nuxt — no explicit import needed in `chapters.vue`
- `@click.stop` on the "Open Chapter →" `NuxtLink` prevents the card toggle from firing when clicking the link
- The `reflection.split('\n\n')` in `chapters.vue` handles the May entry's two-paragraph reflection (separated by `\n\n` in `useChapters.ts`)
- `checkStillness` in `index.vue` calls `gsap.to` on `invitationRef` which may already be animating via the 6s delay — GSAP handles this gracefully (it kills the pending tween and animates from current state)
- The `/valentine` page is not deleted — it simply has no link pointing to it

# Design Spec: April Rewrite, May Rewrite & The Quiet Chapters

**Date:** 2026-06-26
**Project:** Somewhere Between
**Scope:** Three deliverables — April chapter content update, May chapter content update, new `/chapters` archive page with supporting data architecture.

---

## Context

The project is evolving from a year-long monthly experience into a living archive. The philosophical shift: from "how I feel about you" to "the story we've quietly lived." Two recent life events — a surgery (April 2026) and the passing of a thirteen-year-old dog named Bibi (May 2026) — require the April and May chapters to be rewritten with care. A new `/chapters` page creates a permanent, growing archive of emotional landmarks.

---

## 1. Data Architecture

### New composable: `app/composables/useChapters.ts`

Single source of truth for the chapter archive. Defines all chapters past, present, and the boundary of the unwritten.

```typescript
export interface Chapter {
  number: number        // 1, 2, 3…
  roman: string         // 'I', 'II', 'III'…
  title: string         // 'The First Hello'
  date: string          // ISO: '2020-05-06'
  displayDate: string   // 'May 6, 2020'
  reflection: string    // The paragraph that unfolds on the /chapters page
  status: 'written' | 'unfolding'
  hasFullPage: boolean  // false = reflection only; true = has a route
  route?: string        // '/april', '/may', etc.
}
```

**`getVisibleChapters()`** — filters chapters where `date <= today`, returns chronological order. Evaluated client-side on mount.

### Initial chapter registry

| # | Roman | Title | Date | Full page | Route |
|---|-------|-------|------|-----------|-------|
| 1 | I | The First Hello | 2020-05-06 | No | — |
| 2 | II | Finding Our Way Back | 2022-01-01* | No | — |
| 3 | III | The Twelve Days | 2024-12-01* | No | — |
| 4 | IV | Somewhere Between | 2025-02-01* | Yes | `/` |
| 5 | V | Healing | 2026-04-01 | Yes | `/april` |
| 6 | VI | Remembering | 2026-05-01 | Yes | `/may` |

*Approximate dates — exact dates to be confirmed and updated.

### Relationship to `useMonthData.ts`

`useMonthData.ts` is **not migrated** in this implementation. It continues to drive the homepage scroll and individual month pages. `useChapters.ts` references routes that already exist. Full migration is a future step once the archive is established.

---

## 2. April Chapter Rewrite

**Theme:** Quiet Strength
**Tagline:** *some victories arrive quietly*
**Page:** `app/pages/april.vue` (keeps `MonthPage.vue` structure)
**Animation style:** `fadeFloat` (unchanged)
**Particle type:** `none` (unchanged)
**Ambient warmth:** `0.2` (slightly warmer than before — healing has arrived)

### Slides

**Slide 1**
> Some things you carry for so long, you forget what it felt like not to carry them.

*subtext: Until one day, you don't have to anymore.*

**Slide 2**
> There is a particular kind of courage in choosing to heal — even when it's slow, even when it's inconvenient, even when no one else can see it.

**Slide 3**
> Some victories don't arrive with celebration. They arrive quietly. After years of waiting.

*subtext: I think you've earned this one.*

### Easter egg

- **Trigger:** `hover`
- **Icon:** `◦`
- **Label:** *A quiet note*
- **Content:** Healing isn't always visible.
- **Sub-content:** I'm proud of you anyway.

### Chapter reflection (shown on `/chapters` page when unfolded)

> Some victories don't arrive with celebration. They arrive after years of carrying something heavier than anyone else could see. I hope the days ahead continue to become gentler than the ones behind.

### `useMonthData.ts` changes

Update the April entry:
- `theme`: `'Quiet Strength'`
- `themeTagline`: `'some victories arrive quietly'`
- `slides`: updated to the three slides above
- `easterEgg`: updated trigger, content, subContent
- `ambientWarmth`: `0.2`

### `index.vue` monthly overview message

Update April entry in the `months` array:
```
message: 'Some victories don\'t announce themselves.'
interactionType: 'focus' (unchanged)
```

---

## 3. May Chapter Rewrite

**Subject:** Bibi — thirteen years, May 2026.
**Treatment:** Remembrance. No fixing grief. No silver lining forced.
**Page:** `app/pages/may.vue` (keeps bespoke canvas structure)

### Canvas word reveal (three lines — same GSAP timing as current)

Line 1: *Some loves*
Line 2: *don't need words*
Line 3: *to be understood.*

### Follow-up text (fades in after lines complete)

> Thirteen years of presence. Of loyalty that never asked for anything in return.
>
> The kind of love that makes the house feel different when it's gone.

### New layer — the name

After a 4-second pause following the follow-up text, a single element fades in:

> *Bibi.*

- Centered, same font size as follow-up text (not larger, not smaller)
- No date, no caption, no decoration
- Implemented as a new `ref` with a GSAP delayed fade-in
- This is the emotional peak of the page — nothing follows it except the easter egg

### What's removed

- The Web Audio chime is removed. Silence is more appropriate.
- The `onAnyClick` / `chimeReady` audio context logic is removed entirely.

### Easter egg

- **Trigger:** `corner`
- **Position:** bottom-right (`bottom-6 right-6`)
- **Icon:** `·`
- **Content:** Love doesn't disappear.
- **Sub-content:** Sometimes it simply changes shape.
- Appears after `animDone` is true (unchanged behavior)

### Chapter reflection (shown on `/chapters` page when unfolded)

> Thirteen years. She was there through the ordinary days and the hard ones, asking nothing but presence in return. Some loves leave a shape that stays long after they're gone.
>
> For Bibi.

### `useMonthData.ts` changes

Update the May entry:
- `theme`: `'Enduring Love'`
- `themeTagline`: `'some loves leave a shape that stays'`
- `slides`: updated (used for data consistency — the page is bespoke and doesn't read slides from this composable directly)
- `easterEgg`: updated content and subContent
- `animationStyle`: `'canvas'` (unchanged)
- `ambientWarmth`: `0.08` (slightly increased from current `0.05` — 0.05 was too cold for a grief month; 0.08 is still very quiet but not completely absent)

### `index.vue` monthly overview message

Update May entry in the `months` array:
```
message: 'Some loves leave a shape that stays.'
interactionType: 'focus'
```
Remove the `isGlowing: true` and `warmthLevel: 0.4` special-casing for May in `handleMonthEnter` — the glow was tied to the old romantic framing.

---

## 4. Homepage Ending Redesign

**File:** `app/pages/index.vue` — final `SectionWrapper` block.

### New sequence

The final section becomes a two-phase experience driven by `handleFinalEnter` and the existing stillness detection.

**Phase 1 — The closing** (visible on arrival):
> Thank you for being in these quiet moments.

After 3 seconds, a second line fades in:
> Some stories aren't finished where the page ends.

**Phase 2 — The invitation** (appears 6 seconds after phase 1 begins; stillness detection can trigger it earlier if the user has been still for 5 seconds — whichever fires first):

A single link fades in:
> *The Quiet Chapters →*

Clicking navigates to `/chapters`. The transition uses Nuxt's built-in page transition (fade) — no custom router logic needed.

### What's removed

- The `/valentine` NuxtLink and its surrounding `div`
- The `HiddenNote` component with "Happy Valentine's Day" content
- The `handleCTAInteraction` vibrate function (tied to the valentine CTA)

### What's kept

- `showLoopClosure` and its line: *"Some days don't need much noise to feel meaningful."* — this appears before the invitation, as the bridge between closing and the Continue link.
- The stillness detection system (`checkStillness`, `resetActivity`, `ticker`) — now triggers the invitation reveal rather than an ambient effect.

### New refs

- `closingLine2Ref` — the second closing line ("Some stories aren't finished…")
- `invitationRef` — the "The Quiet Chapters →" link element

---

## 5. The Quiet Chapters Page (`/chapters`)

**File:** `app/pages/chapters.vue`
**Layout:** `layout: false` (standalone, like all other chapter pages)

### Atmosphere

- Deep navy background, same CSS variables as the rest of the project
- Cormorant Garamond throughout
- Very little animation — only the unfold and the initial page fade-in
- Heavy whitespace — the emptiness is intentional
- No particle canvas, no ambient background glow
- Subtle grain overlay (consistent with other pages)

### Page structure

```
[fade in on load]

The Quiet Chapters
A record of the story so far.

─────────────────────────────

Chapter I
The First Hello
May 6, 2020                 Written

─────────────────────────────

Chapter II
Finding Our Way Back
2022                        Written

... (time-gated)

─────────────────────────────

·

The next chapter hasn't been written yet.
```

### Chapter card — closed state

```
Chapter [Roman]
[Title]
[Display date]              [Status]
```

Status renders as:
- `Written` — muted accent color, small caps
- `Still unfolding` — slightly more muted, italic (future chapters only)

### Chapter card — open state

Tapping/clicking a card expands it with a smooth CSS `max-height` transition (not GSAP — simpler, more reliable for variable content height).

```
Chapter [Roman]
[Title]
[Display date]              [Status]

[Reflection paragraph]

──────

Open Chapter →              ← only if hasFullPage === true
```

`openChapter` is a `ref<number | null>` — only one chapter open at a time. Clicking an open chapter closes it. Clicking a different chapter closes the current and opens the new one.

### Time-gating

On `onMounted`, call `getVisibleChapters()` which filters `date <= new Date().toISOString().split('T')[0]`. The reactive `visibleChapters` array drives the `v-for`.

### Navigation

- Back link: `← Back` top-left, links to `/`
- Page label: top-right, `The Quiet Chapters` in small caps
- No other navigation

### "Open Chapter →" behavior

`NuxtLink` to the chapter's `route`. Standard Nuxt page transition handles the fade.

---

## Implementation Order

1. Create `useChapters.ts` with full chapter registry and `getVisibleChapters()`
2. Update `useMonthData.ts` — April and May entries
3. Rewrite `app/pages/april.vue` — new slides, easter egg
4. Rewrite `app/pages/may.vue` — new words, Bibi's name, remove audio
5. Update `app/pages/index.vue` — new ending sequence, remove valentine CTA
6. Create `app/pages/chapters.vue` — the archive page

---

## What This Is Not

- This is not a Valentine's website anymore. The `/valentine` page is not deleted (it exists, it just loses its link), but it is no longer the destination of the homepage.
- No new month pages are created for the past chapters (2020, 2022, 2024). They exist as data and reflection only.
- No audio is added to any page in this implementation.

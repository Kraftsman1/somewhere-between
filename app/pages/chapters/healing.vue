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
const month = getMonthByRoute('/chapters/healing')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'Healing — Somewhere Between' })
</script>

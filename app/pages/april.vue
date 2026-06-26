<template>
  <MonthPage
    month-name="April"
    :month-number="4"
    theme-tagline="three things I admire"
    :slides="slides"
    particle-type="none"
    :ambient-warmth="0.15"
  >
    <template #easter-egg>
      <!-- Flower SVG hover Easter egg -->
      <div class="flex flex-col items-center gap-3">
        <EasterEgg
          trigger="hover"
          icon="✿"
          label="Hover here"
          content="Even small things you do stand out."
          sub-content="You just don't always see it."
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

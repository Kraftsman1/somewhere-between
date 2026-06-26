<template>
  <MonthPage
    month-name="December"
    :month-number="12"
    theme-tagline="moments from the year"
    :slides="slides"
    particle-type="snowflakes"
    :ambient-warmth="0.08"
  >
    <template #easter-egg>
      <EasterEgg
        trigger="click"
        icon="★"
        label="A small star"
        content="Here's to quiet joys, and more to come."
        sub-content="Wherever they find you."
      />
    </template>
  </MonthPage>
</template>

<script setup lang="ts">
const { getMonthByRoute } = useMonthData()
const month = getMonthByRoute('/december')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'December — Somewhere Between' })
</script>

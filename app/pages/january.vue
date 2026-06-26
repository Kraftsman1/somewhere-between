<template>
  <MonthPage
    month-name="January"
    :month-number="1"
    theme-tagline="quiet hopes ahead"
    :slides="slides"
    particle-type="stars"
    :ambient-warmth="0.05"
  >
    <template #easter-egg>
      <EasterEgg
        trigger="corner"
        icon="·"
        label="A corner note"
        content="May these days be calm, steady, and familiar."
        sub-content="The good kind of familiar."
        corner-position="bottom-6 left-6"
      />
    </template>
  </MonthPage>
</template>

<script setup lang="ts">
const { getMonthByRoute } = useMonthData()
const month = getMonthByRoute('/january')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'January — Somewhere Between' })
</script>

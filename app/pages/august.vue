<template>
  <MonthPage
    month-name="August"
    :month-number="8"
    theme-tagline="quiet things you inspire"
    :slides="slides"
    particle-type="none"
    :ambient-warmth="0.3"
  >
    <template #easter-egg>
      <EasterEgg
        trigger="click"
        icon="◌"
        label="Feel the shift"
        content="Some people just make things calmer by being near."
        sub-content="That's not nothing."
      />
    </template>
  </MonthPage>
</template>

<script setup lang="ts">
const { getMonthByRoute } = useMonthData()
const month = getMonthByRoute('/august')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'August — Somewhere Between' })
</script>

<template>
  <MonthPage
    month-name="October"
    :month-number="10"
    theme-tagline="a month for you"
    :slides="slides"
    particle-type="confetti"
    :ambient-warmth="0.5"
  >
    <template #easter-egg>
      <EasterEgg
        trigger="click"
        icon="🎂"
        label="Tap the cake"
        content="Grateful for you every year."
        sub-content="This one especially."
      />
    </template>
  </MonthPage>
</template>

<script setup lang="ts">
const { getMonthByRoute } = useMonthData()
const month = getMonthByRoute('/october')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'October — Somewhere Between' })
</script>

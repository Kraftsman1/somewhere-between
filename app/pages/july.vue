<template>
  <MonthPage
    month-name="July"
    :month-number="7"
    theme-tagline="small, unnoticed moments"
    :slides="slides"
    particle-type="sparkle"
    :ambient-warmth="0.25"
  >
    <template #easter-egg>
      <EasterEgg
        trigger="click"
        icon="✦"
        label="Notice this"
        content="You make ordinary days feel considered."
        sub-content="That's rarer than you think."
      />
    </template>
  </MonthPage>
</template>

<script setup lang="ts">
const { getMonthByRoute } = useMonthData()
const month = getMonthByRoute('/july')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'July — Somewhere Between' })
</script>

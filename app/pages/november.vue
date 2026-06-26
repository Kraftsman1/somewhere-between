<template>
  <MonthPage
    month-name="November"
    :month-number="11"
    theme-tagline="five things I appreciate"
    :slides="slides"
    particle-type="none"
    :ambient-warmth="0.2"
  >
    <template #easter-egg>
      <EasterEgg
        trigger="click"
        icon="🍂"
        label="A fallen leaf"
        content="You've left a mark on these small days."
        sub-content="A good one."
      />
    </template>
  </MonthPage>
</template>

<script setup lang="ts">
const { getMonthByRoute } = useMonthData()
const month = getMonthByRoute('/november')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'November — Somewhere Between' })
</script>

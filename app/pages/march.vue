<template>
  <MonthPage
    month-name="March"
    :month-number="3"
    theme-tagline="small joys"
    :slides="slides"
    particle-type="none"
    :ambient-warmth="0.1"
  >
    <template #easter-egg>
      <EasterEgg
        trigger="click"
        icon="◦"
        label="Something I noticed"
        content="This made me think of you."
        sub-content="Not for any big reason. Just a quiet one."
      />
    </template>
  </MonthPage>
</template>

<script setup lang="ts">
const { getMonthByRoute } = useMonthData()
const month = getMonthByRoute('/march')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'March — Somewhere Between' })
</script>

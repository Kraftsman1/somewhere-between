<template>
  <MonthPage
    month-name="September"
    :month-number="9"
    theme-tagline="your presence matters"
    :slides="slides"
    particle-type="none"
    :ambient-warmth="0.12"
  >
    <template #easter-egg>
      <EasterEgg
        trigger="corner"
        icon="·"
        label="A quiet corner"
        content="Some things are felt, not said."
        sub-content="This is one of them."
        corner-position="bottom-6 left-6"
      />
    </template>
  </MonthPage>
</template>

<script setup lang="ts">
const { getMonthByRoute } = useMonthData()
const month = getMonthByRoute('/september')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'September — Somewhere Between' })
</script>

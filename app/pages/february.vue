<template>
  <MonthPage
    month-name="February"
    :month-number="2"
    theme-tagline="the moments that stayed"
    :slides="slides"
    particle-type="hearts"
    :ambient-warmth="0.35"
  >
    <template #easter-egg>
      <EasterEgg
        trigger="click"
        icon="✦"
        label="A small note"
        content="You've been the highlight of these little days."
        sub-content="Even the ones that didn't feel like much."
      />
    </template>
  </MonthPage>
</template>

<script setup lang="ts">
const { getMonthByRoute } = useMonthData()
const month = getMonthByRoute('/february')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'February — Somewhere Between' })
</script>

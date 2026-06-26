<template>
  <MonthPage
    month-name="June"
    :month-number="6"
    theme-tagline="things only we understand"
    :slides="slides"
    particle-type="sparkle"
    :ambient-warmth="0.2"
  >
    <template #easter-egg>
      <div class="flex flex-col items-center gap-2">
        <EasterEgg
          trigger="click"
          icon="✌"
          label="You found it"
          content="This is the part where something funny was supposed to go."
          sub-content="You'll have to imagine it. It was good."
        />
      </div>
    </template>
  </MonthPage>
</template>

<script setup lang="ts">
const { getMonthByRoute } = useMonthData()
const month = getMonthByRoute('/june')!
const slides = month.slides

definePageMeta({ layout: false })
useHead({ title: 'June — Somewhere Between' })
</script>

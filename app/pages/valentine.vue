<template>
  <div />
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
onMounted(() => {
  navigateTo('/chapters/somewhere-between', { replace: true })
})
</script>

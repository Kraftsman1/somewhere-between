<template>
  <div
    class="fixed right-7 top-1/2 -translate-y-1/2 h-56 flex-col items-center justify-between z-40 max-md:hidden md:flex"
    style="gap: 0;">

    <!-- Track line -->
    <div class="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-accent/10"></div>

    <!-- Segment ticks -->
    <div
      v-for="i in 13"
      :key="i"
      class="relative flex items-center justify-center transition-all duration-700"
      style="height: calc(100% / 13);">
      <div
        class="transition-all duration-700 rounded-full"
        :class="currentSegment >= i - 1
          ? 'bg-accent w-[1px] opacity-80'
          : 'bg-accent/25 w-[1px] opacity-50'"
        :style="currentSegment >= i - 1
          ? 'height: 10px;'
          : 'height: 5px;'">
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
const currentSegment = ref(0)

const updateProgress = () => {
  const total = document.documentElement.scrollHeight - window.innerHeight
  if (total <= 0) return
  const progress = window.scrollY / total
  currentSegment.value = Math.floor(progress * 13)
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

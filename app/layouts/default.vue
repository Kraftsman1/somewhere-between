<template>
  <div class="relative min-h-screen w-full font-sans text-text selection:bg-accent selection:text-white">
    <AmbientBackground />
    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import AmbientBackground from '~/components/AmbientBackground.vue'
</script>

<style>
/* Hide scrollbar for clean look but allow scrolling */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

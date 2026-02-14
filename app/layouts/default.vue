<template>
  <div class="relative min-h-screen w-full font-serif text-text"
    style="scrollbar-width: none; -ms-overflow-style: none;">
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
::-webkit-scrollbar { display: none; }
</style>

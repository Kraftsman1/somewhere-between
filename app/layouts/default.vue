<template>
  <div class="relative min-h-screen w-full font-serif text-text"
    style="scrollbar-width: none; -ms-overflow-style: none;">
    <AmbientBackground />
    <div class="relative z-10">
      <slot />
    </div>

    <!-- Global Month Navigation -->
    <MonthNav />
  </div>
</template>

<script setup lang="ts">
import AmbientBackground from '~/components/AmbientBackground.vue'
import MonthNav from '~/components/MonthNav.vue'
</script>

<style>
::-webkit-scrollbar { display: none; }
</style>

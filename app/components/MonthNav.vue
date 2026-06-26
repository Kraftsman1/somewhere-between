<template>
  <!-- Floating portal button -->
  <div class="fixed bottom-6 right-6 z-40">
    <button
      @click="isOpen = !isOpen"
      class="group flex items-center gap-2 p-3 transition-all duration-500"
      :aria-label="isOpen ? 'Close month navigation' : 'Open month navigation'"
    >
      <span
        class="font-sans text-[8px] tracking-[0.4em] uppercase font-light transition-colors duration-500"
        :style="{ color: isOpen ? 'rgba(190,152,152,0.7)' : 'rgba(190,152,152,0.3)' }"
      >{{ isOpen ? '✕ close' : '· · ·' }}</span>
    </button>
  </div>

  <!-- Overlay -->
  <Teleport to="body">
    <Transition name="portal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[150] flex items-center justify-center p-8"
        @click.self="isOpen = false"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0"
          style="background: rgba(32, 30, 26, 0.55); backdrop-filter: blur(18px);"
          @click="isOpen = false"
        />

        <!-- Month grid card -->
        <div
          class="relative z-10 w-full max-w-sm px-8 py-10"
          style="background: #f5ede0; border: 1px solid rgba(190,152,152,0.18); border-radius: 4px; box-shadow: 0 32px 80px rgba(32,30,26,0.16);"
        >
          <div class="absolute top-0 left-8 right-8 h-[1px]" style="background: linear-gradient(to right, transparent, rgba(190,152,152,0.3), transparent);" />

          <p class="font-sans text-[8px] tracking-[0.5em] uppercase text-accent/40 font-light text-center mb-8">
            A Year of Moments
          </p>

          <!-- Month list -->
          <div class="grid grid-cols-2 gap-x-8 gap-y-3">
            <NuxtLink
              v-for="month in months"
              :key="month.route"
              :to="month.route"
              @click="isOpen = false"
              class="group flex items-center gap-2 no-underline"
            >
              <span
                class="font-sans text-[8px] tabular-nums font-light transition-colors duration-300"
                :style="{ color: isCurrentMonth(month.number) ? 'var(--color-accent)' : 'rgba(190,152,152,0.3)' }"
              >{{ String(month.number).padStart(2, '0') }}</span>
              <div class="h-px flex-1" style="background: rgba(190,152,152,0.15);" />
              <span
                class="font-serif text-sm italic transition-colors duration-300"
                :class="[
                  isCurrentMonth(month.number)
                    ? 'text-text'
                    : 'text-text/40 group-hover:text-text/80'
                ]"
              >{{ month.name }}</span>
            </NuxtLink>
          </div>

          <div class="absolute bottom-0 left-8 right-8 h-[1px]" style="background: linear-gradient(to right, transparent, rgba(190,152,152,0.3), transparent);" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { months } = useMonthData()
const isOpen = ref(false)

const currentMonthNumber = new Date().getMonth() + 1

const isCurrentMonth = (num: number) => num === currentMonthNumber

// Close on escape
const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') isOpen.value = false
}
onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<style scoped>
.portal-fade-enter-active, .portal-fade-leave-active {
  transition: opacity 0.4s ease;
}
.portal-fade-enter-from, .portal-fade-leave-to {
  opacity: 0;
}
</style>

<template>
  <div class="relative inline-block" :class="triggerClass">
    <!-- CORNER trigger -->
    <template v-if="trigger === 'corner'">
      <div
        ref="cornerRef"
        class="fixed z-30 cursor-pointer select-none"
        :class="cornerPosition"
        @mouseenter="onHoverEnter"
        @mouseleave="onHoverLeave"
        @click="onTrigger"
      >
        <div class="flex flex-col items-center gap-1 group p-3">
          <span
            class="text-[11px] text-accent/20 group-hover:text-accent/60 transition-colors duration-700"
            :class="{ 'animate-gentle-pulse': !revealed }"
          >{{ icon }}</span>
          <span v-if="label" class="font-sans text-[7px] tracking-[0.35em] uppercase text-accent/20 group-hover:text-accent/50 transition-colors duration-700">{{ label }}</span>
        </div>
      </div>
    </template>

    <!-- HOVER trigger -->
    <template v-else-if="trigger === 'hover'">
      <div
        ref="hoverRef"
        class="relative inline-block cursor-default group"
        @mouseenter="onHoverEnter"
        @mouseleave="onHoverLeave"
        @touchstart.passive="onHoverEnter"
        @touchend.passive="onHoverLeave"
      >
        <div class="flex items-center gap-2 py-2">
          <span class="text-base text-accent/30 group-hover:text-accent/70 transition-all duration-500 group-hover:scale-125 inline-block">{{ icon }}</span>
          <span v-if="label" class="font-sans text-[9px] tracking-[0.4em] uppercase text-accent/35 group-hover:text-accent/70 transition-colors duration-500 font-light">{{ label }}</span>
        </div>
      </div>
    </template>

    <!-- CLICK or HOLD trigger -->
    <template v-else>
      <div
        ref="clickRef"
        class="cursor-pointer group flex items-center gap-2.5 py-2 select-none"
        @click="trigger === 'click' ? onTrigger() : undefined"
        @mousedown="trigger === 'hold' ? startHold() : undefined"
        @mouseup="trigger === 'hold' ? cancelHold() : undefined"
        @mouseleave="trigger === 'hold' ? cancelHold() : undefined"
        @touchstart.passive="trigger === 'hold' ? startHold() : undefined"
        @touchend.passive="trigger === 'hold' ? (onTrigger(), cancelHold()) : undefined"
      >
        <span
          class="text-base text-accent/30 group-hover:text-accent/70 transition-all duration-500 inline-block"
          :style="holdProgress > 0 ? `transform: scale(${1 + holdProgress * 0.6}); opacity: ${0.3 + holdProgress * 0.7}` : ''"
        >{{ icon }}</span>
        <span v-if="label" class="font-sans text-[9px] tracking-[0.4em] uppercase text-accent/35 group-hover:text-accent/65 transition-colors duration-500 font-light">{{ label }}</span>
      </div>
    </template>

    <!-- Revealed overlay (teleported to body) -->
    <Teleport to="body">
      <div v-if="isVisible" class="fixed inset-0 z-[200] flex items-center justify-center p-6 pointer-events-auto">
        <!-- Backdrop -->
        <div
          ref="backdropRef"
          class="absolute inset-0 opacity-0"
          style="background: rgba(32, 30, 26, 0.5); backdrop-filter: blur(14px);"
          @click="canClose && close()"
        />
        <!-- Card -->
        <div
          ref="cardRef"
          class="relative w-full max-w-xs opacity-0 translate-y-6 text-center px-10 py-12"
          style="background: #f5ede0; border: 1px solid rgba(190,152,152,0.2); border-radius: 3px; box-shadow: 0 24px 64px rgba(32,30,26,0.14);"
        >
          <button
            @click="close"
            class="absolute top-3 right-3 p-3 text-accent/25 hover:text-accent/55 transition-colors duration-300"
            style="font-family: var(--font-sans); font-size: 9px; letter-spacing: 0.3em; min-width: 44px; min-height: 44px; display: flex; align-items: center; justify-content: center;"
            aria-label="Close"
          >✕</button>

          <div class="absolute top-0 left-8 right-8 h-[1px]" style="background: linear-gradient(to right, transparent, rgba(190,152,152,0.3), transparent);" />

          <div class="flex flex-col items-center gap-5">
            <p class="font-serif text-2xl italic leading-relaxed" style="color: var(--color-text);">
              {{ content }}
            </p>
            <div v-if="subContent" class="flex flex-col items-center gap-3">
              <div class="h-[1px] w-12" style="background: rgba(190,152,152,0.25);" />
              <p class="font-sans text-[9px] tracking-[0.35em] uppercase text-accent/50 font-light">{{ subContent }}</p>
            </div>
          </div>

          <div class="absolute bottom-0 left-8 right-8 h-[1px]" style="background: linear-gradient(to right, transparent, rgba(190,152,152,0.3), transparent);" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

type Trigger = 'click' | 'hover' | 'hold' | 'corner'

const props = defineProps<{
  trigger: Trigger
  icon?: string
  label?: string
  content: string
  subContent?: string
  cornerPosition?: string
}>()

const triggerClass = computed(() =>
  props.trigger === 'corner' ? '' : 'relative'
)

const cornerPosition = computed(() =>
  props.cornerPosition ?? 'bottom-6 right-6'
)

const icon = computed(() => props.icon ?? '✦')

const isVisible = ref(false)
const revealed = ref(false)
const holdProgress = ref(0)
const canClose = ref(false)

const backdropRef = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)
const hoverRef = ref<HTMLElement | null>(null)
const clickRef = ref<HTMLElement | null>(null)
const cornerRef = ref<HTMLElement | null>(null)

let holdTimer: ReturnType<typeof setTimeout> | null = null
let holdInterval: ReturnType<typeof setInterval> | null = null

const onHoverEnter = () => {
  if (props.trigger === 'hover') {
    onTrigger()
  }
}

const onHoverLeave = () => {
  // hover trigger — close on leave
  if (props.trigger === 'hover' && isVisible.value) {
    close()
  }
}

const onTrigger = () => {
  if (revealed.value && props.trigger !== 'corner') return
  if (isVisible.value) return
  openNote()
}

const openNote = () => {
  isVisible.value = true
  revealed.value = true
  canClose.value = false
  setTimeout(() => { canClose.value = true }, 500)
  if ('vibrate' in navigator) navigator.vibrate(20)

  nextTick(() => {
    if (backdropRef.value && cardRef.value) {
      const tl = gsap.timeline()
      tl.to(backdropRef.value, { opacity: 1, duration: 0.6, ease: 'power2.out' })
      tl.to(cardRef.value, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, '-=0.3')
    }
  })
}

const close = () => {
  if (!backdropRef.value || !cardRef.value) return
  const tl = gsap.timeline({
    onComplete: () => { isVisible.value = false }
  })
  tl.to(cardRef.value, { opacity: 0, y: 12, duration: 0.4, ease: 'power2.in' })
  tl.to(backdropRef.value, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.1')
}

const startHold = () => {
  holdProgress.value = 0
  holdInterval = setInterval(() => {
    holdProgress.value = Math.min(holdProgress.value + 0.05, 1)
  }, 50)
  holdTimer = setTimeout(() => {
    cancelHold()
    openNote()
  }, 1000)
}

const cancelHold = () => {
  if (holdTimer) clearTimeout(holdTimer)
  if (holdInterval) clearInterval(holdInterval)
  holdTimer = null
  holdInterval = null
  holdProgress.value = 0
}

onUnmounted(() => {
  cancelHold()
})
</script>

<style scoped>
@keyframes gentle-pulse {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.5; }
}
.animate-gentle-pulse {
  animation: gentle-pulse 3s ease-in-out infinite;
}
</style>

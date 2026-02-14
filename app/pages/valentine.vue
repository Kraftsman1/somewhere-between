<template>
    <div
        class="relative min-h-[100dvh] w-full flex flex-col items-center justify-center bg-bg text-text overflow-hidden font-sans"
        style="background-color: #faf5ee;">

        <AmbientBackground :is-still="isStill" :is-glowing="isGlowing" :warmth-level="warmthLevel" />

        <!-- Grain overlay -->
        <div class="fixed inset-0 z-[2] pointer-events-none opacity-50"
            style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.035\'/%3E%3C/svg%3E'); background-size: 256px 256px;">
        </div>

        <div
            class="relative z-20 max-w-md w-full px-8 text-center flex flex-col items-center justify-center min-h-[65vh]">

            <!-- Phase 1: Arrival -->
            <div v-show="phase === 0" class="arrival-text opacity-0 translate-y-6">
                <p class="font-serif text-3xl md:text-5xl italic leading-snug mb-8">
                    Some days don't need much noise<br />to feel meaningful.
                </p>
                <div class="flex items-center justify-center gap-4">
                    <div class="h-[1px] w-8" style="background: rgba(190,152,152,0.25);"></div>
                    <p class="font-sans text-[9px] tracking-[0.4em] uppercase text-accent/40 font-light">
                        Today felt like one of those days.
                    </p>
                    <div class="h-[1px] w-8" style="background: rgba(190,152,152,0.25);"></div>
                </div>
            </div>

            <!-- Phase 2: Recognition -->
            <div v-show="phase === 1"
                class="recognition-text absolute inset-0 px-8 flex flex-col items-center justify-center opacity-0">
                <p class="font-serif text-3xl md:text-4xl leading-snug italic">
                    There's a calm I associate with you —<br />
                    something steady, familiar,<br />
                    and grounding in the best way.
                </p>
            </div>

            <!-- Phase 3: Presence -->
            <div v-show="phase === 2 || phase === 3"
                class="presence-text absolute inset-0 px-8 flex flex-col items-center justify-center opacity-0">
                <p class="font-serif text-2xl md:text-4xl leading-snug italic mb-10">
                    I've come to appreciate how your presence<br />
                    changes a moment, often quietly,<br />
                    without asking for attention —<br />
                    and yet it always feels felt.
                </p>
                <p class="font-sans text-[10px] tracking-[0.4em] uppercase text-accent/50 font-light leading-relaxed">
                    Today just felt like a good day<br />to pause and say that.
                </p>
            </div>

            <!-- Phase 4: Stillness Layer -->
            <div v-show="phase === 3" class="stillness-layer absolute inset-0 flex items-center justify-center">
                <p v-if="showStillnessReward"
                    class="font-serif text-base italic opacity-0 animate-fade-in tracking-[0.06em]"
                    style="color: var(--color-accent);">
                    Some moments don't need words at all.
                </p>
            </div>

            <!-- Phase 5: Closing -->
            <div v-show="phase === 4"
                class="closing-text absolute inset-0 px-8 flex flex-col items-center justify-center opacity-0 gap-8 md:gap-14">

                <div class="flex flex-col items-center gap-5">
                    <p class="font-serif text-2xl italic" style="color: rgba(32,30,26,0.5);">No expectations.</p>
                    <p class="font-serif text-2xl italic" style="color: rgba(32,30,26,0.5);">No pressure.</p>
                    <p class="font-serif text-2xl italic" style="color: rgba(32,30,26,0.5);">Just appreciation.</p>
                </div>

                <!-- Thin ornament -->
                <div class="flex items-center gap-3">
                    <div class="h-[1px] w-10" style="background: rgba(190,152,152,0.2);"></div>
                    <div class="w-1 h-1 rounded-full" style="background: rgba(190,152,152,0.3);"></div>
                    <div class="h-[1px] w-10" style="background: rgba(190,152,152,0.2);"></div>
                </div>

                <p class="font-serif text-2xl md:text-3xl leading-snug max-w-xs mx-auto italic">
                    However today meets you,<br />
                    I hope it's kind to you —<br />
                    and gentle in all the ways that matter.
                </p>

                <!-- Press-and-hold trigger — large touch area -->
                <div class="relative flex flex-col items-center">
                    <div
                        class="cursor-pointer group flex flex-col items-center gap-3 px-8 py-5 select-none"
                        @mousedown="startPress" @mouseup="cancelPress"
                        @touchstart.passive="startPress" @touchend.passive="cancelPress"
                        @mouseleave="cancelPress">

                        <div class="w-2 h-2 rounded-full transition-all duration-500 ease-out"
                            style="background: var(--color-accent);"
                            :style="{ transform: 'scale(' + (isHolding ? 2.5 : 1) + ')', opacity: isHolding ? 1 : 0.4 }">
                        </div>
                        <p class="font-sans text-[8px] md:text-[9px] tracking-[0.35em] uppercase text-accent/35 group-hover:text-accent/55 transition-colors duration-500 font-light">
                            Hold to reveal
                        </p>
                    </div>

                    <p v-if="revealed"
                        class="mt-2 whitespace-nowrap font-serif text-lg italic animate-fade-in"
                        style="color: var(--color-accent);">
                        I'm really glad you're here.
                    </p>
                </div>

            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

definePageMeta({
    layout: false
})

const phase = ref(0)
const isStill = ref(false)
const isGlowing = ref(false)
const warmthLevel = ref(0)
const showStillnessReward = ref(false)
const revealed = ref(false)
const isHolding = ref(false)
let pressTimer: any = null

const startPress = () => {
    if (revealed.value) return
    isHolding.value = true
    pressTimer = setTimeout(() => {
        revealed.value = true
        isHolding.value = false
        if ('vibrate' in navigator) navigator.vibrate([20, 100, 20])
    }, 1000)
}

const cancelPress = () => {
    clearTimeout(pressTimer)
    isHolding.value = false
}

onMounted(() => {
    const tl = gsap.timeline()

    // Phase 1: Arrival
    tl.to('.arrival-text', { opacity: 1, y: 0, duration: 2.5, ease: 'expo.out', delay: 1 })
        .to('.arrival-text', { opacity: 0, y: -16, duration: 1.5, ease: 'expo.in' }, '+=4')

        // Phase 2: Recognition
        .call(() => {
            phase.value = 1
            warmthLevel.value = 0.1
        })
        .to('.recognition-text', { opacity: 1, duration: 2.5, ease: 'expo.out' })
        .to('.recognition-text', { opacity: 0, duration: 1.5, ease: 'expo.in' }, '+=5')

        // Phase 3: Presence
        .call(() => {
            phase.value = 2
            isGlowing.value = true
            warmthLevel.value = 0.2
        })
        .to('.presence-text', { opacity: 1, duration: 2.5, ease: 'expo.out' })

        // Phase 4: Stillness
        .call(() => {
            phase.value = 3
            isStill.value = true
        })
        .to({}, {
            duration: 7,
            onStart: () => {
                setTimeout(() => { showStillnessReward.value = true }, 2500)
            }
        })
        .to('.presence-text', { opacity: 0, duration: 2, ease: 'expo.in' })

        // Phase 5: Closing
        .call(() => {
            phase.value = 4
            showStillnessReward.value = false
            isStill.value = false
            isGlowing.value = true
            warmthLevel.value = 0.3
        })
        .to('.closing-text', { opacity: 1, duration: 3, ease: 'expo.out' })
})
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 2s ease-out forwards;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
}
</style>

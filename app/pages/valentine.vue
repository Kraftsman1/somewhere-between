<template>
    <div
        class="relative min-h-screen w-full flex flex-col items-center justify-center bg-bg text-text overflow-hidden selection:bg-accent/30 font-sans">
        <AmbientBackground :is-still="isStill" :is-glowing="isGlowing" :warmth-level="warmthLevel" />

        <div
            class="relative z-20 max-w-lg w-full px-8 text-center flex flex-col items-center justify-center min-h-[60vh]">

            <!-- Phase 1: Arrival -->
            <div v-show="phase === 0" class="arrival-text opacity-0 transform translate-y-8">
                <p class="font-serif text-2xl md:text-4xl italic leading-relaxed mb-8">
                    Some days don’t need much noise to feel meaningful.
                </p>
                <p class="font-sans text-xs tracking-[0.3em] uppercase opacity-40">
                    Today felt like one of those days.
                </p>
            </div>

            <!-- Phase 2: Recognition -->
            <div v-show="phase === 1"
                class="recognition-text absolute inset-0 px-8 flex flex-col items-center justify-center opacity-0">
                <p class="font-serif text-2xl md:text-3xl leading-relaxed italic">
                    There’s a calm I associate with you — <br />
                    something steady, familiar, <br />
                    and grounding in the best way.
                </p>
            </div>

            <!-- Phase 3: Presence -->
            <div v-show="phase === 2 || phase === 3"
                class="presence-text absolute inset-0 px-8 flex flex-col items-center justify-center opacity-0 transition-opacity duration-1000">
                <p class="font-serif text-2xl md:text-3xl leading-relaxed italic mb-10">
                    I’ve come to appreciate how your presence changes a moment,<br />
                    often quietly, without asking for attention —<br />
                    and yet it always feels felt.
                </p>
                <p class="font-sans text-sm tracking-widest opacity-60">
                    Today just felt like a good day to pause<br />
                    and say that.
                </p>
            </div>

            <!-- Phase 4: Stillness Layer -->
            <div v-show="phase === 3" class="stillness-layer absolute inset-0 flex items-center justify-center">
                <p v-if="showStillnessReward"
                    class="font-serif text-sm italic opacity-0 animate-fade-in text-accent tracking-[0.1em]">
                    Some moments don’t need words at all.
                </p>
            </div>

            <!-- Phase 5: Closing -->
            <div v-show="phase === 4"
                class="closing-text absolute inset-0 px-8 flex flex-col items-center justify-center opacity-0 space-y-12">
                <div class="space-y-6 text-center">
                    <p class="font-serif text-xl italic opacity-60">No expectations.</p>
                    <p class="font-serif text-xl italic opacity-60">No pressure.</p>
                    <p class="font-serif text-xl italic opacity-60">Just appreciation.</p>
                </div>

                <div class="mt-16">
                    <p class="font-serif text-xl md:text-2xl leading-relaxed max-w-sm mx-auto italic">
                        However today meets you,<br />
                        I hope it’s kind to you —<br />
                        and gentle in all the ways that matter.
                    </p>
                </div>

                <div class="mt-20 cursor-pointer group relative" @mousedown="startPress" @mouseup="cancelPress"
                    @touchstart="startPress" @touchend="cancelPress" @mouseleave="cancelPress">
                    <div
                        class="w-1.5 h-1.5 rounded-full bg-accent mx-auto opacity-40 group-hover:scale-150 group-hover:opacity-100 transition-all duration-700">
                    </div>
                    <p v-if="revealed"
                        class="absolute top-8 left-1/2 -translate-x-1/2 w-64 text-sm font-serif italic text-accent tracking-widest opacity-0 animate-fade-in-up">
                        I’m really glad you’re here.
                    </p>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

definePageMeta({
    layout: false // Standalone
})

const phase = ref(0)
const isStill = ref(false)
const isGlowing = ref(false)
const warmthLevel = ref(0)
const showStillnessReward = ref(false)
const revealed = ref(false)
let pressTimer: any = null

// Interaction: Press and hold
const startPress = () => {
    if (revealed.value) return
    pressTimer = setTimeout(() => {
        revealed.value = true
        if ('vibrate' in navigator) navigator.vibrate([20, 100, 20])
    }, 1000) // Slightly longer for intentionality
}

const cancelPress = () => {
    clearTimeout(pressTimer)
}

onMounted(() => {
    const tl = gsap.timeline()

    // Phase 1: Arrival
    tl.to('.arrival-text', { opacity: 1, y: 0, duration: 2.5, ease: 'expo.out', delay: 1 })
        .to('.arrival-text', { opacity: 0, y: -20, duration: 1.5, ease: 'expo.in' }, "+=4")

        // Phase 2: Recognition
        .call(() => {
            phase.value = 1
            warmthLevel.value = 0.1
        })
        .to('.recognition-text', { opacity: 1, duration: 2.5, ease: 'expo.out' })
        .to('.recognition-text', { opacity: 0, duration: 1.5, ease: 'expo.in' }, "+=5")

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
            isStill.value = true // Pause background motion
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

.animate-fade-in-up {
    animation: fadeInUp 1s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translate(-50%, 10px);
    }

    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}
</style>

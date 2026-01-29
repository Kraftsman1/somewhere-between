<template>
    <div
        class="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#fdfaf6] text-[#2c2c2c] overflow-hidden selection:bg-[#d8b4b4]/30">
        <AmbientBackground :is-still="isStill" />

        <div
            class="relative z-20 max-w-lg w-full px-8 text-center flex flex-col items-center justify-center min-h-[60vh]">

            <!-- Phase 1: Arrival -->
            <div v-show="phase === 0" class="arrival-text opacity-0 transform translate-y-4">
                <p class="font-serif text-2xl md:text-3xl italic leading-relaxed mb-6">
                    Some days don’t need much noise to feel meaningful.
                </p>
                <p class="font-sans text-sm tracking-widest uppercase opacity-60">
                    Today felt like one of those days.
                </p>
            </div>

            <!-- Phase 2: Recognition -->
            <div v-show="phase === 1"
                class="recognition-text absolute inset-0 flex flex-col items-center justify-center opacity-0">
                <p class="font-serif text-xl md:text-2xl leading-loose">
                    There’s a calm I associate with you — <br />
                    something steady, familiar, <br />
                    and grounding in the best way.
                </p>
            </div>

            <!-- Phase 3: Presence -->
            <div v-show="phase === 2 || phase === 3"
                class="presence-text absolute inset-0 flex flex-col items-center justify-center opacity-0">
                <p class="font-serif text-xl md:text-2xl leading-relaxed mb-8">
                    I’ve come to appreciate how your presence changes a moment,<br />
                    often quietly, without asking for attention —<br />
                    and yet it always feels felt.
                </p>
                <p class="font-sans text-sm tracking-wide opacity-80">
                    Today just felt like a good day to pause<br />
                    and say that.
                </p>
            </div>

            <!-- Phase 4: Stillness (No text, just specific hidden note logic if added, or pure silence) -->
            <div v-show="phase === 3" class="stillness-layer absolute inset-0 flex items-center justify-center">
                <p v-if="showStillnessReward"
                    class="font-serif text-sm italic opacity-0 animate-fade-in text-[#d8b4b4]">
                    Some moments don’t need words at all.
                </p>
            </div>


            <!-- Phase 5: Closing -->
            <div v-show="phase === 4"
                class="closing-text absolute inset-0 flex flex-col items-center justify-center opacity-0 space-y-8">
                <div class="space-y-4 text-center">
                    <p class="font-serif text-lg italic opacity-80">No expectations.</p>
                    <p class="font-serif text-lg italic opacity-80">No pressure.</p>
                    <p class="font-serif text-lg italic opacity-80">Just appreciation.</p>
                </div>

                <div class="mt-12">
                    <p class="font-sans text-base leading-relaxed max-w-xs mx-auto">
                        However today meets you,<br />
                        I hope it’s kind to you —<br />
                        and gentle in all the ways that matter.
                    </p>
                </div>

                <div class="mt-16 cursor-pointer group relative" @mousedown="startPress" @mouseup="cancelPress"
                    @touchstart="startPress" @touchend="cancelPress" @mouseleave="cancelPress">
                    <div
                        class="w-1 h-1 rounded-full bg-[#d8b4b4] mx-auto opacity-50 group-hover:scale-150 transition-transform duration-500">
                    </div>
                    <p v-if="revealed"
                        class="absolute top-4 left-1/2 -translate-x-1/2 w-64 text-sm font-serif italic text-muted opacity-0 animate-fade-in-up">
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
const showStillnessReward = ref(false)
const revealed = ref(false)
let pressTimer: any = null

// Interaction: Press and hold
const startPress = () => {
    pressTimer = setTimeout(() => {
        revealed.value = true
    }, 800) // 800ms hold
}

const cancelPress = () => {
    clearTimeout(pressTimer)
}

onMounted(() => {
    const tl = gsap.timeline()

    // Phase 1: Arrival
    tl.to('.arrival-text', { opacity: 1, y: 0, duration: 2, ease: 'power2.out', delay: 1 })
        .to('.arrival-text', { opacity: 0, y: -10, duration: 1.5, ease: 'power2.in' }, "+=3.5")

        // Phase 2: Recognition
        .call(() => { phase.value = 1 })
        .to('.recognition-text', { opacity: 1, duration: 2, ease: 'power2.out' })
        .to('.recognition-text', { opacity: 0, duration: 1.5, ease: 'power2.in' }, "+=5")

        // Phase 3: Presence
        .call(() => { phase.value = 2 })
        .to('.presence-text', { opacity: 1, duration: 2, ease: 'power2.out' })
        .to('.presence-text', { opacity: 0.8, duration: 2 }, "+=5") // Slight dim for stillness

        // Phase 4: Stillness
        .call(() => {
            phase.value = 3
            isStill.value = true // Pause background motion
        })
        // Hold stillness for 6 seconds
        .to({}, {
            duration: 6, onStart: () => {
                // "Stillness Reward" logic: show after 2s of stillness
                setTimeout(() => { showStillnessReward.value = true }, 2000)
            }
        })

        .to('.presence-text', { opacity: 0, duration: 1.5, ease: 'power2.in' })
        .call(() => {
            showStillnessReward.value = false
            isStill.value = false // Resume background breathing slightly if desired? Or keep still? 
            // Note says "This is where motion pauses". Let's keep it paused? 
            // "Phase 3... Everything stops moving".
            // Let's resume soft motion for Closing to feel "alive" again?
            isStill.value = false
        })

        // Phase 5: Closing
        .call(() => { phase.value = 4 })
        .to('.closing-text', { opacity: 1, duration: 2.5, ease: 'power2.out' })

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

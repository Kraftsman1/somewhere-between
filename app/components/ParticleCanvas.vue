<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 pointer-events-none z-10"
    :class="active ? 'opacity-100' : 'opacity-0'"
    style="transition: opacity 1.5s ease;"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'

type ParticleType = 'hearts' | 'confetti' | 'sparkle' | 'snowflakes' | 'stars' | 'none'
type Intensity = 'low' | 'medium' | 'high'

const props = defineProps<{
  type: ParticleType
  intensity?: Intensity
  active?: boolean
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animId: number | null = null
let particles: Particle[] = []

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  rotation: number
  rotationSpeed: number
  life: number
  maxLife: number
  shape: string
}

const countMap = { low: 18, medium: 32, high: 55 }
const getCount = () => countMap[props.intensity ?? 'low']

const colors = {
  hearts: ['#be9898', '#c99060', '#d4a0a0', '#be9898cc'],
  confetti: ['#be9898', '#c99060', '#a8c4a2', '#9ab4c8', '#c4b89a', '#be9898'],
  sparkle: ['#be9898', '#d4c4b4', '#c99060', '#e8ddd0'],
  snowflakes: ['#e8e4e0', '#d4cfc8', '#f0ece8'],
  stars: ['#be9898', '#c99060', '#d4c4b4', '#f0ece8'],
  none: [],
}

const resize = () => {
  if (!canvasRef.value) return
  canvasRef.value.width = window.innerWidth
  canvasRef.value.height = window.innerHeight
}

const createParticle = (): Particle => {
  const w = canvasRef.value?.width ?? window.innerWidth
  const h = canvasRef.value?.height ?? window.innerHeight
  const palette = colors[props.type] ?? colors.sparkle
  const color = palette[Math.floor(Math.random() * palette.length)]
  const maxLife = 120 + Math.random() * 180

  const base = {
    x: Math.random() * w,
    y: props.type === 'snowflakes' ? -20 : Math.random() * h * 0.3,
    opacity: 0,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.04,
    color,
    life: 0,
    maxLife,
    shape: props.type,
  }

  if (props.type === 'snowflakes') {
    return { ...base, vx: (Math.random() - 0.5) * 0.4, vy: 0.4 + Math.random() * 0.6, size: 2 + Math.random() * 4 }
  } else if (props.type === 'confetti') {
    return { ...base, y: -20, vx: (Math.random() - 0.5) * 2.5, vy: 1.5 + Math.random() * 2, size: 4 + Math.random() * 6 }
  } else if (props.type === 'hearts') {
    return { ...base, vx: (Math.random() - 0.5) * 0.5, vy: -(0.3 + Math.random() * 0.5), size: 5 + Math.random() * 8 }
  } else if (props.type === 'stars') {
    return { ...base, vx: (Math.random() - 0.5) * 0.3, vy: -(0.1 + Math.random() * 0.3), size: 1.5 + Math.random() * 3 }
  } else {
    // sparkle
    return { ...base, vx: (Math.random() - 0.5) * 0.8, vy: -(0.2 + Math.random() * 0.6), size: 2 + Math.random() * 4 }
  }
}

const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  c.beginPath()
  c.moveTo(x, y + size * 0.35)
  c.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.35)
  c.bezierCurveTo(x - size, y + size * 0.7, x, y + size * 1.1, x, y + size * 1.4)
  c.bezierCurveTo(x, y + size * 1.1, x + size, y + size * 0.7, x + size, y + size * 0.35)
  c.bezierCurveTo(x + size, y, x, y, x, y + size * 0.35)
  c.closePath()
}

const drawStar = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  const spikes = 5
  const outerRadius = size
  const innerRadius = size * 0.4
  let rot = (Math.PI / 2) * 3
  const step = Math.PI / spikes
  c.beginPath()
  c.moveTo(x, y - outerRadius)
  for (let i = 0; i < spikes; i++) {
    c.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius)
    rot += step
    c.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius)
    rot += step
  }
  c.lineTo(x, y - outerRadius)
  c.closePath()
}

const tick = () => {
  if (!ctx || !canvasRef.value) return
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  const count = getCount()
  while (particles.length < count) particles.push(createParticle())

  particles = particles.filter(p => {
    p.life++
    const progress = p.life / p.maxLife
    // Fade in first 15%, full for middle, fade out last 20%
    p.opacity = progress < 0.15
      ? (progress / 0.15) * 0.7
      : progress > 0.8
        ? (1 - (progress - 0.8) / 0.2) * 0.7
        : 0.7

    p.x += p.vx
    p.y += p.vy
    p.rotation += p.rotationSpeed

    ctx!.save()
    ctx!.globalAlpha = p.opacity
    ctx!.fillStyle = p.color
    ctx!.translate(p.x, p.y)
    ctx!.rotate(p.rotation)

    if (props.type === 'hearts') {
      drawHeart(ctx!, 0, 0, p.size)
      ctx!.fill()
    } else if (props.type === 'stars') {
      drawStar(ctx!, 0, 0, p.size)
      ctx!.fill()
    } else if (props.type === 'snowflakes') {
      ctx!.beginPath()
      ctx!.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx!.fill()
      // snowflake arms
      ctx!.strokeStyle = p.color
      ctx!.lineWidth = 0.5
      for (let i = 0; i < 6; i++) {
        ctx!.beginPath()
        ctx!.moveTo(0, 0)
        ctx!.lineTo(0, p.size * 2.5)
        ctx!.stroke()
        ctx!.rotate(Math.PI / 3)
      }
    } else if (props.type === 'confetti') {
      ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
    } else {
      // sparkle — diamond
      ctx!.beginPath()
      ctx!.moveTo(0, -p.size)
      ctx!.lineTo(p.size * 0.4, 0)
      ctx!.lineTo(0, p.size)
      ctx!.lineTo(-p.size * 0.4, 0)
      ctx!.closePath()
      ctx!.fill()
    }

    ctx!.restore()
    return p.life < p.maxLife
  })

  animId = requestAnimationFrame(tick)
}

const start = () => {
  if (props.type === 'none') return
  if (animId !== null) return
  tick()
}

const stop = () => {
  if (animId !== null) {
    cancelAnimationFrame(animId)
    animId = null
  }
  particles = []
  if (ctx && canvasRef.value) ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

watch(() => props.active, (val) => {
  if (val) start()
  else stop()
})

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d')
    resize()
    window.addEventListener('resize', resize)
    if (props.active) start()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  stop()
})
</script>

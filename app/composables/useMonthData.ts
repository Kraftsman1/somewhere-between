export type EasterEggTrigger = 'click' | 'hover' | 'hold' | 'corner'
export type AnimationStyle = 'fadeFloat' | 'bounce' | 'parallax' | 'sequential' | 'canvas' | 'slideIn'
export type ParticleType = 'hearts' | 'confetti' | 'sparkle' | 'snowflakes' | 'stars' | 'none'

export interface Slide {
  text: string
  subtext?: string
  emphasis?: number // index of word to emphasize
}

export interface EasterEggConfig {
  trigger: EasterEggTrigger
  triggerLabel?: string
  triggerIcon?: string   // emoji or SVG hint
  content: string
  subContent?: string
}

export interface MonthData {
  name: string
  number: number       // 1–12
  route: string
  theme: string
  themeTagline: string
  slides: Slide[]
  easterEgg: EasterEggConfig
  animationStyle: AnimationStyle
  particleType: ParticleType
  ambientWarmth: number  // 0–1
  accentColor?: string   // overrides default accent
}

export const useMonthData = () => {
  const months: MonthData[] = [
    {
      name: 'February',
      number: 2,
      route: '/february',
      theme: 'Quiet Celebration',
      themeTagline: 'the moments that stayed',
      slides: [
        { text: 'The way you laugh at something before you explain it.', subtext: 'That always gets me.' },
        { text: 'That one afternoon where everything felt slow and nothing needed to be said.' },
        { text: 'How you make ordinary things feel like they matter.', subtext: 'Even the boring ones.' },
        { text: 'The texts you send that ask nothing but say everything.', subtext: 'Small, but felt.' },
        { text: 'That quiet thing you do when you actually care about something.' },
        { text: 'The way some days feel lighter just because you were in them.' },
        { text: 'Twelve little reasons this year has been gentler than most.' },
      ],
      easterEgg: {
        trigger: 'click',
        triggerLabel: 'A small note',
        triggerIcon: '✦',
        content: "You've been the highlight of these little days.",
        subContent: 'Even the ones that didn\'t feel like much.'
      },
      animationStyle: 'fadeFloat',
      particleType: 'hearts',
      ambientWarmth: 0.35,
    },
    {
      name: 'March',
      number: 3,
      route: '/march',
      theme: 'Quiet Companionship',
      themeTagline: 'small joys',
      slides: [
        { text: 'Morning light through a window when the day is still deciding what it wants to be.' },
        { text: 'A warm drink you didn\'t expect to enjoy that becomes your go-to.', subtext: 'Small wins.' },
        { text: 'The kind of conversation that doesn\'t need to go anywhere to feel good.' },
        { text: 'Being around someone who makes the background noise quiet down.' },
        { text: 'That feeling when something arrives at exactly the right time.' },
      ],
      easterEgg: {
        trigger: 'click',
        triggerLabel: 'Something I noticed',
        triggerIcon: '◦',
        content: 'This made me think of you.',
        subContent: 'Not for any big reason. Just a quiet one.'
      },
      animationStyle: 'fadeFloat',
      particleType: 'none',
      ambientWarmth: 0.1,
    },
    {
      name: 'April',
      number: 4,
      route: '/april',
      theme: 'Curiosity & Discovery',
      themeTagline: 'three things I admire',
      slides: [
        { text: 'The way you carry your opinions — firm enough to be real, open enough to listen.' },
        { text: 'How you pay attention to things other people walk past without noticing.' },
        { text: 'That quiet steadiness you have when things get a little chaotic.' },
      ],
      easterEgg: {
        trigger: 'hover',
        triggerLabel: 'Hover here',
        triggerIcon: '✿',
        content: 'Even small things you do stand out.',
        subContent: 'You just don\'t always see it.'
      },
      animationStyle: 'bounce',
      particleType: 'none',
      ambientWarmth: 0.15,
    },
    {
      name: 'May',
      number: 5,
      route: '/may',
      theme: 'Shared Silences',
      themeTagline: 'the quiet between',
      slides: [
        { text: 'Sometimes', subtext: '—' },
        { text: 'the quietest moments', subtext: '—' },
        { text: 'say the most.' },
        { text: 'There\'s a kind of comfort in just being somewhere at the same time as someone.' },
        { text: 'No performance. No explanation. Just presence, and that being enough.' },
      ],
      easterEgg: {
        trigger: 'corner',
        triggerLabel: 'Listen',
        triggerIcon: '♩',
        content: 'Some silences are better than most conversations.',
        subContent: 'This is one of them.'
      },
      animationStyle: 'canvas',
      particleType: 'none',
      ambientWarmth: 0.05,
    },
    {
      name: 'June',
      number: 6,
      route: '/june',
      theme: 'Playfulness & Humor',
      themeTagline: 'things only we understand',
      slides: [
        { text: 'The completely unhinged way we got onto that topic the first time.' },
        { text: 'That thing you said that was so wrong it circled back to being right.', subtext: '(It wasn\'t right. But still.)' },
        { text: 'The inside joke that somehow keeps finding new rooms to live in.' },
        { text: 'How seriously you take things that don\'t matter and how casually you handle things that do.', subtext: 'Chaotic. Effective.' },
      ],
      easterEgg: {
        trigger: 'click',
        triggerLabel: 'You found it',
        triggerIcon: '✌',
        content: 'This is the part where something funny was supposed to go.',
        subContent: 'You\'ll have to imagine it. It was good.'
      },
      animationStyle: 'bounce',
      particleType: 'sparkle',
      ambientWarmth: 0.2,
    },
    {
      name: 'July',
      number: 7,
      route: '/july',
      theme: 'Warmth in Everyday Life',
      themeTagline: 'small, unnoticed moments',
      slides: [
        { text: 'The way your attention shifts when something genuinely interests you.', subtext: 'It\'s nice to see.' },
        { text: 'How you hold a room without trying to.' },
        { text: 'The small gestures you make that you don\'t realize you\'re making.' },
        { text: 'The particular warmth of being around someone who just gets it.' },
      ],
      easterEgg: {
        trigger: 'hover',
        triggerLabel: 'Notice this',
        triggerIcon: '✦',
        content: 'You make ordinary days feel considered.',
        subContent: 'That\'s rarer than you think.'
      },
      animationStyle: 'slideIn',
      particleType: 'sparkle',
      ambientWarmth: 0.25,
    },
    {
      name: 'August',
      number: 8,
      route: '/august',
      theme: 'Subtle Inspiration',
      themeTagline: 'quiet things you inspire',
      slides: [
        { text: 'A kind of patience I didn\'t know I had until I saw it reflected back.' },
        { text: 'The willingness to slow down when everything else is moving fast.' },
        { text: 'The way calm can be chosen, not just inherited.', subtext: 'You remind me of that.' },
      ],
      easterEgg: {
        trigger: 'hover',
        triggerLabel: 'Feel the shift',
        triggerIcon: '◌',
        content: 'Some people just make things calmer by being near.',
        subContent: 'That\'s not nothing.'
      },
      animationStyle: 'parallax',
      particleType: 'none',
      ambientWarmth: 0.3,
    },
    {
      name: 'September',
      number: 9,
      route: '/september',
      theme: 'Depth of Presence',
      themeTagline: 'your presence matters',
      slides: [
        { text: 'Your presence matters.' },
        { text: 'Not loudly. Not in a way that demands notice.' },
        { text: 'But in the way a room changes when the right person walks in.' },
        { text: 'Steadily. Quietly. In a way that makes things feel a little more okay.' },
      ],
      easterEgg: {
        trigger: 'corner',
        triggerLabel: 'A quiet corner',
        triggerIcon: '·',
        content: 'Some things are felt, not said.',
        subContent: 'This is one of them.'
      },
      animationStyle: 'sequential',
      particleType: 'none',
      ambientWarmth: 0.12,
    },
    {
      name: 'October',
      number: 10,
      route: '/october',
      theme: 'Celebration & Reflection',
      themeTagline: 'a month for you',
      slides: [
        { text: 'October has always felt like its own kind of month — quieter than summer, warmer than what comes after.' },
        { text: 'A good month to be born in, I think.', subtext: 'It suits you.' },
        { text: 'Here\'s to another year of being quietly, steadily remarkable.' },
        { text: 'And to all the versions of you that this year brought along.' },
        { text: 'Happy birthday. Genuinely.' },
      ],
      easterEgg: {
        trigger: 'click',
        triggerLabel: 'Tap the cake',
        triggerIcon: '🎂',
        content: 'Grateful for you every year.',
        subContent: 'This one especially.'
      },
      animationStyle: 'fadeFloat',
      particleType: 'confetti',
      ambientWarmth: 0.5,
      accentColor: '#c99060',
    },
    {
      name: 'November',
      number: 11,
      route: '/november',
      theme: 'Gratitude & Connection',
      themeTagline: 'five things I appreciate',
      slides: [
        { text: 'The way you ask questions that actually go somewhere.' },
        { text: 'That particular humor that lands exactly when it should and nowhere else.', subtext: 'Precise. Appreciated.' },
        { text: 'How you hold onto the details of things that matter to you.' },
        { text: 'The way you show up, even when quietly.' },
        { text: 'That you existed near enough to notice.', subtext: 'That counts for a lot.' },
      ],
      easterEgg: {
        trigger: 'click',
        triggerLabel: 'A fallen leaf',
        triggerIcon: '🍂',
        content: "You've left a mark on these small days.",
        subContent: 'A good one.'
      },
      animationStyle: 'slideIn',
      particleType: 'none',
      ambientWarmth: 0.2,
    },
    {
      name: 'December',
      number: 12,
      route: '/december',
      theme: 'Calm Closure',
      themeTagline: 'moments from the year',
      slides: [
        { text: 'A year is a lot of small things that don\'t seem like much on their own.' },
        { text: 'But when you line them up — the calm ones, the funny ones, the ones that just fit —' },
        { text: 'it starts to look like something.', subtext: 'Something good.' },
        { text: 'This year had good things in it. Quiet, steady, unfussy good things.' },
        { text: 'Here\'s to that. And to more.' },
      ],
      easterEgg: {
        trigger: 'click',
        triggerLabel: 'A small star',
        triggerIcon: '★',
        content: "Here's to quiet joys, and more to come.",
        subContent: 'Wherever they find you.'
      },
      animationStyle: 'fadeFloat',
      particleType: 'snowflakes',
      ambientWarmth: 0.08,
    },
    {
      name: 'January',
      number: 1,
      route: '/january',
      theme: 'New Beginnings',
      themeTagline: 'quiet hopes ahead',
      slides: [
        { text: 'January always arrives like it\'s trying to be serious about something.' },
        { text: 'A new year. Clean start. The usual ambitions.', subtext: '(Most of which will survive until February.)' },
        { text: 'But beneath all that — a quiet hope that things will be a little calmer.' },
        { text: 'A little steadier. A little more familiar.' },
        { text: 'May this year be all of those things for you.' },
      ],
      easterEgg: {
        trigger: 'corner',
        triggerLabel: 'A corner note',
        triggerIcon: '·',
        content: 'May these days be calm, steady, and familiar.',
        subContent: 'The good kind of familiar.'
      },
      animationStyle: 'parallax',
      particleType: 'stars',
      ambientWarmth: 0.05,
    },
  ]

  const getMonthByRoute = (route: string) =>
    months.find(m => m.route === route) ?? null

  const getMonthByNumber = (num: number) =>
    months.find(m => m.number === num) ?? null

  const getCurrentMonth = (): MonthData | null => {
    const now = new Date()
    const monthNum = now.getMonth() + 1 // getMonth() is 0-indexed
    return getMonthByNumber(monthNum) ?? null
  }

  return { months, getMonthByRoute, getMonthByNumber, getCurrentMonth }
}

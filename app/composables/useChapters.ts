export type ChapterType = 'prologue' | 'reflection' | 'immersive'
export type ChapterState = 'remembered' | 'preserved' | 'still-unfolding'

export interface Chapter {
  id: string
  title: string
  subtitle?: string
  date: Date
  displayDate: string
  type: ChapterType
  state: ChapterState
  slug: string
  reflection: string
  hiddenNote?: string
}

export const useChapters = () => {
  const chapters: Chapter[] = [
    {
      id: 'somewhere-between',
      title: 'Somewhere Between',
      date: new Date('2025-02-01'),
      displayDate: 'February 2025',
      type: 'prologue',
      state: 'remembered',
      slug: 'somewhere-between',
      reflection: 'A year of quiet moments, small joys, and the comfort of returning. Not every chapter needs a turning point to matter.',
    },
    {
      id: 'the-first-hello',
      title: 'The First Hello',
      date: new Date('2020-05-06'),
      displayDate: 'May 6, 2020',
      type: 'reflection',
      state: 'remembered',
      slug: 'the-first-hello',
      reflection: 'Some conversations begin so simply that you don\'t realize until later that everything changed inside them.',
    },
    {
      id: 'finding-our-way-back',
      title: 'Finding Our Way Back',
      date: new Date('2022-01-01'),
      displayDate: '2022',
      type: 'reflection',
      state: 'remembered',
      slug: 'finding-our-way-back',
      reflection: 'Some distances aren\'t measured in miles. And some returns feel more like arrivals than homecomings.',
    },
    {
      id: 'the-twelve-days',
      title: 'The Twelve Days',
      date: new Date('2024-12-01'),
      displayDate: 'December 2024',
      type: 'reflection',
      state: 'remembered',
      slug: 'the-twelve-days',
      reflection: 'There are stretches of time that don\'t feel like time at all. Just a steady presence that makes the ordinary feel significant.',
    },
    {
      id: 'healing',
      title: 'Healing',
      date: new Date('2026-04-01'),
      displayDate: 'April 2026',
      type: 'immersive',
      state: 'preserved',
      slug: 'healing',
      reflection: 'Some victories don\'t arrive with celebration. They arrive after years of carrying something heavier than anyone else could see. I hope the days ahead continue to become gentler than the ones behind.',
    },
    {
      id: 'remembering',
      title: 'Remembering',
      date: new Date('2026-05-01'),
      displayDate: 'May 2026',
      type: 'immersive',
      state: 'preserved',
      slug: 'remembering',
      reflection: 'Thirteen years. She was there through the ordinary days and the hard ones, asking nothing but presence in return. Some loves leave a shape that stays long after they\'re gone.\n\nFor Bibi.',
    },
  ]

  const getVisibleChapters = (): Chapter[] => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return chapters.filter(c => c.date <= today)
  }

  return { chapters, getVisibleChapters }
}

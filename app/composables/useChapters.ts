export type ChapterStatus = 'remembered' | 'unfolding'

export interface Chapter {
  number: number
  roman: string
  title: string
  date: string         // ISO: 'YYYY-MM-DD' — used for time-gating
  displayDate: string  // Human-readable: 'May 6, 2020'
  reflection: string   // Paragraph(s) shown when a card unfolds; use \n\n for paragraph breaks
  status: ChapterStatus
  hasFullPage: boolean // true = show 'Continue →' link
  route?: string       // e.g. '/april' — only set when hasFullPage is true
}

export const useChapters = () => {
  const chapters: Chapter[] = [
    {
      number: 1,
      roman: 'I',
      title: 'The First Hello',
      date: '2020-05-06',
      displayDate: 'May 6, 2020',
      reflection: 'Some conversations begin so simply that you don\'t realize until later that everything changed inside them.',
      status: 'remembered',
      hasFullPage: false,
    },
    {
      number: 2,
      roman: 'II',
      title: 'Finding Our Way Back',
      date: '2022-01-01',
      displayDate: '2022',
      reflection: 'Some distances aren\'t measured in miles. And some returns feel more like arrivals than homecomings.',
      status: 'remembered',
      hasFullPage: false,
    },
    {
      number: 3,
      roman: 'III',
      title: 'The Twelve Days',
      date: '2024-12-01',
      displayDate: 'December 2024',
      reflection: 'There are stretches of time that don\'t feel like time at all. Just a steady presence that makes the ordinary feel significant.',
      status: 'remembered',
      hasFullPage: false,
    },
    {
      number: 4,
      roman: 'IV',
      title: 'Somewhere Between',
      date: '2025-02-01',
      displayDate: '2025',
      reflection: 'A year of quiet moments, small joys, and the comfort of returning. Not every chapter needs a turning point to matter.',
      status: 'remembered',
      hasFullPage: true,
      route: '/',
    },
    {
      number: 5,
      roman: 'V',
      title: 'Healing',
      date: '2026-04-01',
      displayDate: 'April 2026',
      reflection: 'Some victories don\'t arrive with celebration. They arrive after years of carrying something heavier than anyone else could see. I hope the days ahead continue to become gentler than the ones behind.',
      status: 'remembered',
      hasFullPage: true,
      route: '/april',
    },
    {
      number: 6,
      roman: 'VI',
      title: 'Remembering',
      date: '2026-05-01',
      displayDate: 'May 2026',
      reflection: 'Thirteen years. She was there through the ordinary days and the hard ones, asking nothing but presence in return. Some loves leave a shape that stays long after they\'re gone.\n\nFor Bibi.',
      status: 'remembered',
      hasFullPage: true,
      route: '/may',
    },
  ]

  const getVisibleChapters = (): Chapter[] => {
    const today = new Date().toISOString().split('T')[0]
    return chapters.filter(c => c.date <= today)
  }

  return { chapters, getVisibleChapters }
}

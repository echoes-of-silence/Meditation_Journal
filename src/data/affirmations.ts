import type { Affirmation } from '../types'

export const AFFIRMATIONS: Affirmation[] = [
  { id: 'a1', chakraId: 'mooladhara', text: 'Mother, please give me innocence and purity.' },
  { id: 'a2', chakraId: 'mooladhara', text: 'I am an innocent child of the Divine.' },
  { id: 'a3', chakraId: 'swadisthan', text: 'Mother, please give me pure knowledge.' },
  { id: 'a4', chakraId: 'swadisthan', text: 'I rest my mind and let creativity flow.' },
  { id: 'a5', chakraId: 'nabhi', text: 'Mother, I am satisfied in every way.' },
  { id: 'a6', chakraId: 'nabhi', text: 'I am content and generous in spirit.' },
  { id: 'a7', chakraId: 'void', text: 'Mother, please nourish my evolution.' },
  { id: 'a8', chakraId: 'anahata', text: 'Mother, you are my own self.' },
  { id: 'a9', chakraId: 'anahata', text: 'I have confidence in myself and the Divine.' },
  { id: 'a10', chakraId: 'vishuddhi', text: 'Mother, I am not guilty at all.' },
  { id: 'a11', chakraId: 'vishuddhi', text: 'I communicate with sweetness and diplomacy.' },
  { id: 'a12', chakraId: 'agnya', text: 'Mother, I forgive everyone, including myself.' },
  { id: 'a13', chakraId: 'agnya', text: 'I release my ego and conditioning with ease.' },
  { id: 'a14', chakraId: 'sahasrara', text: 'Mother, I am my own master.' },
  { id: 'a15', chakraId: 'sahasrara', text: 'I surrender to the all-pervading divine power.' },
  { id: 'a16', chakraId: 'general', text: 'I am the spirit, eternal and at peace.' },
  { id: 'a17', chakraId: 'general', text: 'My attention is pure, calm, and present.' },
  { id: 'a18', chakraId: 'general', text: 'I allow thoughtless awareness to deepen naturally.' },
]

export function getAffirmationOfDay(date: Date): Affirmation {
  const dayIndex = Math.floor(date.getTime() / 86400000)
  const idx = ((dayIndex % AFFIRMATIONS.length) + AFFIRMATIONS.length) % AFFIRMATIONS.length
  return AFFIRMATIONS[idx]
}

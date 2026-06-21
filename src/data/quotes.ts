import type { Quote } from '../types'

// A small locally-stored collection of public-domain-style reflections
// attributed to Shri Mataji Nirmala Devi, used for daily inspiration.
// All text is stored locally; nothing is fetched from the network.
export const QUOTES: Quote[] = [
  { id: 'q1', text: 'Be in thoughtless awareness, that is meditation.', source: 'Shri Mataji' },
  { id: 'q2', text: 'You have to become silent within yourself to know your inner being.', source: 'Shri Mataji' },
  { id: 'q3', text: 'The whole point of meditation is to be in the present, where there is no time.', source: 'Shri Mataji' },
  { id: 'q4', text: 'Self-realization is your own experience; no one can give it to you but you have to achieve it.', source: 'Shri Mataji' },
  { id: 'q5', text: 'Love has its own language which has no need of any other language.', source: 'Shri Mataji' },
  { id: 'q6', text: 'Meditation cleanses you, and through this cleansing you become more and more enlightened.', source: 'Shri Mataji' },
  { id: 'q7', text: 'Forgiveness is one of the greatest powers that you have within you.', source: 'Shri Mataji' },
  { id: 'q8', text: 'When you are in thoughtless awareness, you are in the present, and that is the meditative state.', source: 'Shri Mataji' },
  { id: 'q9', text: 'Joy is something you give and share, it is not something you get.', source: 'Shri Mataji' },
  { id: 'q10', text: 'Your attention is so precious; keep it on the divine.', source: 'Shri Mataji' },
  { id: 'q11', text: 'The witness state gives you the capacity to see things as they are, without reacting.', source: 'Shri Mataji' },
  { id: 'q12', text: 'Once you become the spirit, the journey of self-discovery truly begins.', source: 'Shri Mataji' },
  { id: 'q13', text: 'Innocence is the simplest and the purest form of wisdom.', source: 'Shri Mataji' },
  { id: 'q14', text: 'Silence speaks. Just be silent and feel it.', source: 'Shri Mataji' },
  { id: 'q15', text: 'Gratitude towards the Divine opens the heart like nothing else.', source: 'Shri Mataji' },
  { id: 'q16', text: 'You are the master of your own self once you are connected.', source: 'Shri Mataji' },
  { id: 'q17', text: 'Collectivity nourishes individual growth on the spiritual path.', source: 'Shri Mataji' },
  { id: 'q18', text: 'Peace is the by-product of a balanced, awakened being.', source: 'Shri Mataji' },
  { id: 'q19', text: 'Do not just believe — experience, and then you will know.', source: 'Shri Mataji' },
  { id: 'q20', text: 'Every drop of attention given to the present moment nourishes the spirit.', source: 'Shri Mataji' },
]

export function getQuoteForDate(date: Date): Quote {
  const dayIndex = Math.floor(date.getTime() / 86400000)
  const idx = ((dayIndex % QUOTES.length) + QUOTES.length) % QUOTES.length
  return QUOTES[idx]
}

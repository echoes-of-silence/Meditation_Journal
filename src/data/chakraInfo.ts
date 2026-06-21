import type { ChakraId, ChakraStateValue, FingerSensation } from '../types'

export interface ChakraInfo {
  id: ChakraId
  name: string
  sanskrit: string
  quality: string
  color: string // base hue for glow
  order: number
}

export const CHAKRAS: ChakraInfo[] = [
  { id: 'mooladhara', name: 'Mooladhara', sanskrit: 'मूलाधार', quality: 'Innocence', color: '#e0524d', order: 1 },
  { id: 'swadisthan', name: 'Swadisthan', sanskrit: 'स्वाधिष्ठान', quality: 'Creativity & Pure Knowledge', color: '#e8924a', order: 2 },
  { id: 'nabhi', name: 'Nabhi', sanskrit: 'नाभि', quality: 'Satisfaction & Generosity', color: '#e3c44a', order: 3 },
  { id: 'void', name: 'Void (Bhavasagara)', sanskrit: 'भवसागर', quality: 'Spiritual Evolution', color: '#7fae6f', order: 4 },
  { id: 'anahata', name: 'Anahata (Heart)', sanskrit: 'अनाहत', quality: 'Self / Pure Love', color: '#4a9b8e', order: 5 },
  { id: 'vishuddhi', name: 'Vishuddhi', sanskrit: 'विशुद्धि', quality: 'Diplomacy & Collectivity', color: '#4a7fc9', order: 6 },
  { id: 'agnya', name: 'Agnya', sanskrit: 'आज्ञा', quality: 'Forgiveness & Ego Dissolution', color: '#7d6bc9', order: 7 },
  { id: 'sahasrara', name: 'Sahasrara', sanskrit: 'सहस्रार', quality: 'Integration & Oneness', color: '#b06bc9', order: 8 },
]

export const CHAKRA_BY_ID: Record<ChakraId, ChakraInfo> = CHAKRAS.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<ChakraId, ChakraInfo>
)

export const STATE_LABELS: Record<ChakraStateValue, string> = {
  cool_clear: 'Cool / Clear',
  balanced: 'Balanced',
  mild_catch: 'Mild Catch',
  moderate_catch: 'Moderate Catch',
  strong_catch: 'Strong Catch',
}

export const STATE_DESCRIPTIONS: Record<ChakraStateValue, string> = {
  cool_clear: 'Cool, clear, flowing vibrations',
  balanced: 'Settled and balanced',
  mild_catch: 'Slight tingling or heaviness',
  moderate_catch: 'Noticeable catch or discomfort',
  strong_catch: 'Heat, pain, or persistent tingling',
}

export const STATE_COLORS: Record<ChakraStateValue, string> = {
  cool_clear: '#bfe3ff',
  balanced: '#f5d98a',
  mild_catch: '#f0b357',
  moderate_catch: '#e8823f',
  strong_catch: '#d8483f',
}

export const STATE_ORDER: ChakraStateValue[] = [
  'cool_clear',
  'balanced',
  'mild_catch',
  'moderate_catch',
  'strong_catch',
]

export const FINGER_SENSATION_LABELS: Record<FingerSensation, string> = {
  cool: 'Cool Vibrations',
  neutral: 'Neutral',
  tingling: 'Tingling',
  heat: 'Heat',
  numbness: 'Numbness / Blockage',
}

export const FINGER_SENSATION_COLORS: Record<FingerSensation, string> = {
  cool: '#bfe3ff',
  neutral: '#d8d3c8',
  tingling: '#f0b357',
  heat: '#d8483f',
  numbness: '#8a7f6f',
}

// Traditional Sahaja Yoga fingertip correspondence chart.
// Each hand's five fingers correspond to the five lower/central chakras;
// both thumbs reflect Agnya and both fingertips together reflect Sahasrara.
export const FINGER_CHAKRA_MAP: Record<'thumb' | 'index' | 'middle' | 'ring' | 'pinky', ChakraId> = {
  pinky: 'mooladhara',
  ring: 'swadisthan',
  middle: 'nabhi',
  index: 'anahata',
  thumb: 'vishuddhi',
}

export const CHAKRA_RECOMMENDATIONS: Record<ChakraId, string[]> = {
  mooladhara: [
    'Sit on the ground / connect to Mother Earth with bare feet.',
    'Practice innocence — watch without judgment.',
    'Footsoak in salt water to release negativity.',
  ],
  swadisthan: [
    'Reduce overthinking; rest the mind from heavy intellectual work.',
    'Affirm: "Mother, please give me pure knowledge."',
    'Avoid excessive planning before meditation.',
  ],
  nabhi: [
    'Cultivate contentment with what you have.',
    'Affirm: "Mother, I am satisfied in every way."',
    'Maintain regular, simple meals and routine.',
  ],
  void: [
    'Surrender doubts about the path; trust your evolution.',
    'Spend time in satsang / collective meditation.',
  ],
  anahata: [
    'Affirm: "Mother, you are my own self."',
    'Practice self-confidence and let go of fear.',
    'Spend a few minutes in gratitude for your heart center.',
  ],
  vishuddhi: [
    'Practice diplomacy; avoid guilt and over-apologizing.',
    'Sing or chant gently to open the throat.',
    'Affirm: "Mother, I am not guilty at all."',
  ],
  agnya: [
    'Practice forgiveness of yourself and others, even if just mentally.',
    'Watch sunset or soft light to soothe the forehead.',
    'Affirm: "Mother, I forgive everyone, including myself."',
  ],
  sahasrara: [
    'Spend a few extra minutes in silent thoughtless awareness.',
    'Offer gratitude collectively; chant softly.',
    'Affirm: "Mother, I am my own master."',
  ],
}

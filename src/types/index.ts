export type ChakraId =
  | 'mooladhara'
  | 'swadisthan'
  | 'nabhi'
  | 'void'
  | 'anahata'
  | 'vishuddhi'
  | 'agnya'
  | 'sahasrara'

export type Channel = 'left' | 'central' | 'right'

export type ChakraStateValue =
  | 'cool_clear'
  | 'balanced'
  | 'mild_catch'
  | 'moderate_catch'
  | 'strong_catch'

export interface ChakraReading {
  state: ChakraStateValue
  intensity?: number // 0-5, optional finer-grained score
}

export type ChakraEntry = Record<Channel, ChakraReading>

export type ChakraMap = Record<ChakraId, ChakraEntry>

export type Hand = 'left' | 'right'
export type Finger = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky'
export type FingerSegment = 'tip' | 'middle' | 'base'

export type FingerSensation = 'cool' | 'neutral' | 'tingling' | 'heat' | 'numbness'

export interface FingertipReading {
  sensation: FingerSensation
}

export type FingertipMap = Record<Hand, Record<Finger, Record<FingerSegment, FingertipReading>>>

export interface SessionNotes {
  experience: string
  insights: string
  sensations: string
  dreams: string
}

export interface MeditationSession {
  id: string
  date: string // ISO date-time string
  durationMinutes: number
  depth: 1 | 2 | 3 | 4 | 5
  notes: SessionNotes
  chakras: ChakraMap
  fingertips: FingertipMap
  createdAt: string
  updatedAt: string
}

export interface Affirmation {
  id: string
  chakraId: ChakraId | 'general'
  text: string
}

export interface Quote {
  id: string
  text: string
  source?: string
}

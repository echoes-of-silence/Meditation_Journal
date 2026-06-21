import Dexie, { type Table } from 'dexie'
import type {
  ChakraMap,
  Channel,
  Finger,
  FingerSegment,
  FingertipMap,
  Hand,
  MeditationSession,
} from '../types'
import { CHAKRAS } from '../data/chakraInfo'

const CHANNELS: Channel[] = ['left', 'central', 'right']
const HANDS: Hand[] = ['left', 'right']
const FINGERS: Finger[] = ['thumb', 'index', 'middle', 'ring', 'pinky']
const SEGMENTS: FingerSegment[] = ['tip', 'middle', 'base']

export function createDefaultChakraMap(): ChakraMap {
  const map = {} as ChakraMap
  for (const c of CHAKRAS) {
    map[c.id] = CHANNELS.reduce((acc, ch) => {
      acc[ch] = { state: 'balanced' }
      return acc
    }, {} as ChakraMap[typeof c.id])
  }
  return map
}

export function createDefaultFingertipMap(): FingertipMap {
  const map = {} as FingertipMap
  for (const hand of HANDS) {
    map[hand] = FINGERS.reduce((acc, finger) => {
      acc[finger] = SEGMENTS.reduce((segAcc, seg) => {
        segAcc[seg] = { sensation: 'neutral' }
        return segAcc
      }, {} as FingertipMap[Hand][Finger])
      return acc
    }, {} as FingertipMap[Hand])
  }
  return map
}

export class MeditationJournalDB extends Dexie {
  sessions!: Table<MeditationSession, string>

  constructor() {
    super('SahajaMeditationJournal')
    this.version(1).stores({
      sessions: 'id, date, depth, createdAt',
    })
  }
}

export const db = new MeditationJournalDB()

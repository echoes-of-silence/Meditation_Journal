import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import type { MeditationSession } from '../types'

export function useSessions(): MeditationSession[] {
  const sessions = useLiveQuery(() => db.sessions.orderBy('date').reverse().toArray(), [], [])
  return sessions ?? []
}

export function useSession(id: string | undefined): MeditationSession | undefined {
  return useLiveQuery(() => (id ? db.sessions.get(id) : undefined), [id])
}

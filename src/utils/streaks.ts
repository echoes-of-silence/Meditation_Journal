import { differenceInCalendarDays, parseISO } from 'date-fns'
import type { MeditationSession } from '../types'
import { toDayKey } from './dateHelpers'

export interface StreakInfo {
  current: number
  longest: number
  totalDays: number
}

export function computeStreaks(sessions: MeditationSession[]): StreakInfo {
  if (sessions.length === 0) return { current: 0, longest: 0, totalDays: 0 }

  const dayKeys = Array.from(new Set(sessions.map((s) => toDayKey(s.date)))).sort()
  const days = dayKeys.map((k) => parseISO(k))

  let longest = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    const diff = differenceInCalendarDays(days[i], days[i - 1])
    if (diff === 1) {
      run += 1
    } else {
      run = 1
    }
    longest = Math.max(longest, run)
  }

  // current streak: walk backwards from today or yesterday
  const today = new Date()
  let current = 0
  const sortedDesc = [...days].sort((a, b) => b.getTime() - a.getTime())
  const mostRecentDiff = differenceInCalendarDays(today, sortedDesc[0])
  if (mostRecentDiff <= 1) {
    current = 1
    for (let i = 1; i < sortedDesc.length; i++) {
      const diff = differenceInCalendarDays(sortedDesc[i - 1], sortedDesc[i])
      if (diff === 1) {
        current += 1
      } else {
        break
      }
    }
  }

  return { current, longest, totalDays: dayKeys.length }
}

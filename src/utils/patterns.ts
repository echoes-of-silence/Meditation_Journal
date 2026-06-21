import { differenceInCalendarDays, parseISO } from 'date-fns'
import type { ChakraId, Channel, MeditationSession } from '../types'
import { CHAKRA_BY_ID } from '../data/chakraInfo'

const CATCH_STATES = new Set(['mild_catch', 'moderate_catch', 'strong_catch'])
const CHANNELS: Channel[] = ['left', 'central', 'right']

function isCatch(state: string): boolean {
  return CATCH_STATES.has(state)
}

function withinDays(session: MeditationSession, days: number, from = new Date()): boolean {
  const diff = differenceInCalendarDays(from, parseISO(session.date))
  return diff >= 0 && diff < days
}

function withinRange(session: MeditationSession, startDaysAgo: number, endDaysAgo: number, from = new Date()): boolean {
  const diff = differenceInCalendarDays(from, parseISO(session.date))
  return diff >= startDaysAgo && diff < endDaysAgo
}

function chakraChannelLabel(chakraId: ChakraId, channel: Channel): string {
  const name = CHAKRA_BY_ID[chakraId].name
  if (channel === 'central') return name
  return `${channel === 'left' ? 'Left' : 'Right'} ${name}`
}

export function generateInsights(sessions: MeditationSession[]): string[] {
  const insights: string[] = []
  if (sessions.length < 3) {
    return ['Log a few more sessions to unlock pattern insights about your subtle system.']
  }

  const chakraIds = Object.keys(CHAKRA_BY_ID) as ChakraId[]

  // 1. Trend: catch rate last 30 days vs prior 30 days
  for (const chakraId of chakraIds) {
    for (const channel of CHANNELS) {
      const recent = sessions.filter((s) => withinDays(s, 30))
      const prior = sessions.filter((s) => withinRange(s, 30, 60))
      if (recent.length < 2 || prior.length < 2) continue

      const recentRate = recent.filter((s) => isCatch(s.chakras[chakraId][channel].state)).length / recent.length
      const priorRate = prior.filter((s) => isCatch(s.chakras[chakraId][channel].state)).length / prior.length

      if (priorRate - recentRate >= 0.25) {
        insights.push(
          `${chakraChannelLabel(chakraId, channel)} catches have decreased over the last 30 days — great progress.`
        )
      } else if (recentRate - priorRate >= 0.25) {
        insights.push(
          `${chakraChannelLabel(chakraId, channel)} catches have increased over the last 30 days — consider extra clearing.`
        )
      }
    }
  }

  // 2. Correlation: catches preceding lower-depth sessions
  const avgDepth = sessions.reduce((sum, s) => sum + s.depth, 0) / sessions.length
  for (const chakraId of chakraIds) {
    for (const channel of CHANNELS) {
      const withCatch = sessions.filter((s) => isCatch(s.chakras[chakraId][channel].state))
      if (withCatch.length < 3) continue
      const avgDepthWithCatch = withCatch.reduce((sum, s) => sum + s.depth, 0) / withCatch.length
      if (avgDepthWithCatch <= avgDepth - 0.75) {
        insights.push(
          `${chakraChannelLabel(chakraId, channel)} catches frequently occur alongside lower meditation-depth sessions.`
        )
      }
    }
  }

  // 3. Consistently clear chakras
  const recentSessions = sessions.filter((s) => withinDays(s, 30))
  if (recentSessions.length >= 5) {
    const consistentlyClear: string[] = []
    for (const chakraId of chakraIds) {
      const allClear = CHANNELS.every((channel) =>
        recentSessions.every((s) => {
          const state = s.chakras[chakraId][channel].state
          return state === 'cool_clear' || state === 'balanced'
        })
      )
      if (allClear) consistentlyClear.push(CHAKRA_BY_ID[chakraId].name)
    }
    if (consistentlyClear.length > 0) {
      const list = consistentlyClear.length > 2 ? `${consistentlyClear.slice(0, -1).join(', ')} and ${consistentlyClear.slice(-1)}` : consistentlyClear.join(' and ')
      insights.push(`${list} have remained consistently clear over the last 30 days.`)
    }
  }

  // 4. Left vs right imbalance
  const recentForBalance = sessions.filter((s) => withinDays(s, 30))
  if (recentForBalance.length >= 3) {
    let leftCatches = 0
    let rightCatches = 0
    let total = 0
    for (const s of recentForBalance) {
      for (const chakraId of chakraIds) {
        total += 1
        if (isCatch(s.chakras[chakraId].left.state)) leftCatches += 1
        if (isCatch(s.chakras[chakraId].right.state)) rightCatches += 1
      }
    }
    const leftRate = leftCatches / total
    const rightRate = rightCatches / total
    if (leftRate - rightRate >= 0.15) {
      insights.push('Your Left Channel has been showing more catches than the Right over the last month — consider grounding and right-side balancing practices.')
    } else if (rightRate - leftRate >= 0.15) {
      insights.push('Your Right Channel has been showing more catches than the Left over the last month — consider relaxation and left-side balancing practices.')
    }
  }

  if (insights.length === 0) {
    insights.push('Your subtle system has been relatively stable recently. Keep up the regular practice.')
  }

  return insights
}

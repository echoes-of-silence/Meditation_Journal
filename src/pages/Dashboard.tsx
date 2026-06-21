import { Link } from 'react-router-dom'
import { useSessions } from '../hooks/useEntries'
import { QuoteOfDay } from '../components/dashboard/QuoteOfDay'
import { StatCard } from '../components/dashboard/StatCard'
import { Card } from '../components/common/Card'
import { computeStreaks } from '../utils/streaks'
import { generateInsights } from '../utils/patterns'
import { SubtleSystemDiagram } from '../components/visualization/SubtleSystemDiagram'
import { createDefaultChakraMap } from '../db/database'
import { formatDateTime } from '../utils/dateHelpers'
import type { ChakraId, Channel } from '../types'

export function Dashboard() {
  const sessions = useSessions()
  const streaks = computeStreaks(sessions)
  const latest = sessions[0]
  const avgDepth = sessions.length
    ? (sessions.reduce((sum, s) => sum + s.depth, 0) / sessions.length).toFixed(1)
    : '—'
  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)
  const insights = sessions.length > 0 ? generateInsights(sessions).slice(0, 3) : []

  const improvedIds = new Set<ChakraId>()
  if (sessions.length >= 2) {
    const [current, previous] = sessions
    ;(Object.keys(current.chakras) as ChakraId[]).forEach((id) => {
      const channels: Channel[] = ['left', 'central', 'right']
      const wasCatch = channels.some((ch) => {
        const s = previous.chakras[id][ch].state
        return s !== 'cool_clear' && s !== 'balanced'
      })
      const nowClear = channels.every((ch) => {
        const s = current.chakras[id][ch].state
        return s === 'cool_clear' || s === 'balanced'
      })
      if (wasCatch && nowClear) improvedIds.add(id)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-ink-700">Namaste 🙏</h2>
          <p className="text-ink-400 text-sm">Your private space for stillness and reflection.</p>
        </div>
        <Link
          to="/new"
          className="px-5 py-2.5 rounded-xl bg-dawn-500 text-white font-medium hover:opacity-90 shadow-sm"
        >
          + New Session
        </Link>
      </div>

      <QuoteOfDay />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Day Streak" value={streaks.current} hint={`Longest: ${streaks.longest}`} />
        <StatCard label="Total Sessions" value={sessions.length} />
        <StatCard label="Avg. Depth" value={avgDepth} hint="out of 5" />
        <StatCard label="Total Minutes" value={totalMinutes} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Current Subtle State" subtitle={latest ? `From ${formatDateTime(latest.date)}` : 'Log a session to see your state'}>
          <SubtleSystemDiagram chakras={latest?.chakras ?? createDefaultChakraMap()} improvedIds={improvedIds} height={460} />
        </Card>

        <div className="space-y-6">
          <Card title="Pattern Observations" subtitle="Noticed across your recent sessions">
            {insights.length === 0 ? (
              <p className="text-sm text-ink-400">Log a few sessions to unlock insights about your subtle system.</p>
            ) : (
              <ul className="space-y-2">
                {insights.map((insight, i) => (
                  <li key={i} className="text-sm text-ink-600 flex gap-2">
                    <span className="text-dawn-400">❀</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link to="/trends" className="inline-block mt-4 text-sm font-medium text-dawn-500 hover:underline">
              View full trends →
            </Link>
          </Card>

          <Card title="Recent Sessions" subtitle="Your latest reflections">
            {sessions.length === 0 ? (
              <p className="text-sm text-ink-400">No sessions yet. Start your first meditation journal entry.</p>
            ) : (
              <ul className="divide-y divide-ink-200/50">
                {sessions.slice(0, 5).map((s) => (
                  <li key={s.id} className="py-2.5">
                    <Link to={`/history/${s.id}`} className="flex justify-between items-center group">
                      <span className="text-sm text-ink-600 group-hover:text-dawn-500">{formatDateTime(s.date)}</span>
                      <span className="text-xs text-ink-400">{s.durationMinutes} min · Depth {s.depth}/5</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

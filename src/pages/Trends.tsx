import { useMemo, useState } from 'react'
import { differenceInCalendarDays, parseISO } from 'date-fns'
import { useSessions } from '../hooks/useEntries'
import { Card } from '../components/common/Card'
import { DepthTrendChart } from '../components/analytics/DepthTrendChart'
import { ChakraFrequencyChart } from '../components/analytics/ChakraFrequencyChart'
import { ChannelImbalanceChart } from '../components/analytics/ChannelImbalanceChart'
import { Heatmap } from '../components/analytics/Heatmap'
import { generateInsights } from '../utils/patterns'
import { computeStreaks } from '../utils/streaks'

type Range = '7' | '30' | '365' | 'all'

const RANGE_OPTIONS: { key: Range; label: string }[] = [
  { key: '7', label: 'Week' },
  { key: '30', label: 'Month' },
  { key: '365', label: 'Year' },
  { key: 'all', label: 'All Time' },
]

export function Trends() {
  const sessions = useSessions()
  const [range, setRange] = useState<Range>('30')

  const filtered = useMemo(() => {
    if (range === 'all') return sessions
    const days = Number(range)
    return sessions.filter((s) => differenceInCalendarDays(new Date(), parseISO(s.date)) < days)
  }, [sessions, range])

  const insights = useMemo(() => generateInsights(sessions), [sessions])
  const streaks = computeStreaks(sessions)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-end gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-ink-700">Trends &amp; Analytics</h2>
          <p className="text-ink-400 text-sm">Observe how your practice and subtle system evolve over time.</p>
        </div>
        <div className="flex gap-1 glass-card rounded-xl p-1">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setRange(opt.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                range === opt.key ? 'bg-dawn-500 text-white' : 'text-ink-500 hover:bg-ink-100/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-xs text-ink-400">Sessions in range</p>
          <p className="text-2xl font-semibold text-dawn-500 font-display">{filtered.length}</p>
        </Card>
        <Card>
          <p className="text-xs text-ink-400">Avg. depth in range</p>
          <p className="text-2xl font-semibold text-dawn-500 font-display">
            {filtered.length ? (filtered.reduce((s, x) => s + x.depth, 0) / filtered.length).toFixed(1) : '—'}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-ink-400">Current / longest streak</p>
          <p className="text-2xl font-semibold text-dawn-500 font-display">
            {streaks.current} / {streaks.longest} days
          </p>
        </Card>
      </div>

      <Card title="Meditation Quality" subtitle="Thoughtless awareness depth over time">
        <DepthTrendChart sessions={filtered} />
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Most Frequently Affected Chakras" subtitle="Sessions with a noted catch, by chakra">
          <ChakraFrequencyChart sessions={filtered} />
        </Card>
        <Card title="Channel Balance" subtitle="Left vs Central vs Right catch frequency">
          <ChannelImbalanceChart sessions={filtered} />
        </Card>
      </div>

      <Card title="Chakra Activity Heatmap" subtitle="Catches noted per day, last 20 weeks">
        <Heatmap sessions={sessions} />
      </Card>

      <Card title="Pattern Observations" subtitle="Automatically noticed trends in your subtle system">
        <ul className="space-y-2">
          {insights.map((insight, i) => (
            <li key={i} className="text-sm text-ink-600 flex gap-2">
              <span className="text-dawn-400">❀</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

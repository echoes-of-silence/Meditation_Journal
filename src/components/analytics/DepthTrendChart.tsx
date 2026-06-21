import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { format, parseISO } from 'date-fns'
import type { MeditationSession } from '../../types'

export function DepthTrendChart({ sessions }: { sessions: MeditationSession[] }) {
  const data = [...sessions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((s) => ({
      date: format(parseISO(s.date), 'MMM d'),
      depth: s.depth,
    }))

  if (data.length === 0) {
    return <p className="text-sm text-ink-400">No sessions yet to chart.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9e3d6" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#837a6c' }} />
        <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#837a6c' }} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e9e3d6', fontSize: 12 }} />
        <Line type="monotone" dataKey="depth" stroke="#bd8b34" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

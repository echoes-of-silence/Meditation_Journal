import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Channel, MeditationSession } from '../../types'
import { CHAKRAS } from '../../data/chakraInfo'

const CATCH_STATES = new Set(['mild_catch', 'moderate_catch', 'strong_catch'])
const CHANNELS: Channel[] = ['left', 'central', 'right']

export function ChakraFrequencyChart({ sessions }: { sessions: MeditationSession[] }) {
  const data = [...CHAKRAS]
    .sort((a, b) => a.order - b.order)
    .map((c) => {
      let count = 0
      for (const s of sessions) {
        const entry = s.chakras[c.id]
        if (CHANNELS.some((ch) => CATCH_STATES.has(entry[ch].state))) {
          count += 1
        }
      }
      return { name: c.name.split(' ')[0], count, fill: c.color }
    })

  if (sessions.length === 0) {
    return <p className="text-sm text-ink-400">No sessions yet to chart.</p>
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e9e3d6" />
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#837a6c' }} interval={0} angle={-25} textAnchor="end" height={50} />
        <YAxis tick={{ fontSize: 11, fill: '#837a6c' }} allowDecimals={false} />
        <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e9e3d6', fontSize: 12 }} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

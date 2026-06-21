import type { Channel, MeditationSession } from '../../types'

const CATCH_STATES = new Set(['mild_catch', 'moderate_catch', 'strong_catch'])
const CHANNELS: Channel[] = ['left', 'central', 'right']

export function ChannelImbalanceChart({ sessions }: { sessions: MeditationSession[] }) {
  if (sessions.length === 0) {
    return <p className="text-sm text-ink-400">No sessions yet to chart.</p>
  }

  const totals: Record<Channel, number> = { left: 0, central: 0, right: 0 }
  let possible = 0
  for (const s of sessions) {
    for (const chakraId of Object.keys(s.chakras) as (keyof typeof s.chakras)[]) {
      possible += 1
      for (const ch of CHANNELS) {
        if (CATCH_STATES.has(s.chakras[chakraId][ch].state)) totals[ch] += 1
      }
    }
  }

  const max = Math.max(totals.left, totals.central, totals.right, 1)

  const labels: { key: Channel; label: string; color: string }[] = [
    { key: 'left', label: 'Left Channel', color: '#4a7fc9' },
    { key: 'central', label: 'Central Channel', color: '#7fae6f' },
    { key: 'right', label: 'Right Channel', color: '#e8924a' },
  ]

  return (
    <div className="space-y-4">
      {labels.map(({ key, label, color }) => (
        <div key={key}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-ink-600 font-medium">{label}</span>
            <span className="text-ink-400">
              {totals[key]} catches ({possible ? Math.round((totals[key] / possible) * 100) : 0}%)
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-ink-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(totals[key] / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

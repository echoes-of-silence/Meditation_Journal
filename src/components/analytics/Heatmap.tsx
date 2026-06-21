import { addDays, format, parseISO, startOfWeek, subWeeks } from 'date-fns'
import type { Channel, MeditationSession } from '../../types'

const CATCH_STATES = new Set(['mild_catch', 'moderate_catch', 'strong_catch'])
const CHANNELS: Channel[] = ['left', 'central', 'right']

interface HeatmapProps {
  sessions: MeditationSession[]
  weeks?: number
}

function catchCount(session: MeditationSession): number {
  let count = 0
  for (const chakraId of Object.keys(session.chakras) as (keyof typeof session.chakras)[]) {
    for (const ch of CHANNELS) {
      if (CATCH_STATES.has(session.chakras[chakraId][ch].state)) count += 1
    }
  }
  return count
}

function colorFor(value: number): string {
  if (value === 0) return '#e9e3d6'
  if (value <= 2) return '#cfe3c2'
  if (value <= 5) return '#f0dba3'
  if (value <= 9) return '#e8923f'
  return '#d8483f'
}

export function Heatmap({ sessions, weeks = 20 }: HeatmapProps) {
  const dayMap = new Map<string, number>()
  for (const s of sessions) {
    const key = format(parseISO(s.date), 'yyyy-MM-dd')
    dayMap.set(key, (dayMap.get(key) ?? 0) + catchCount(s))
  }

  const today = new Date()
  const start = startOfWeek(subWeeks(today, weeks - 1))

  const columns: Date[][] = []
  for (let w = 0; w < weeks; w++) {
    const col: Date[] = []
    for (let d = 0; d < 7; d++) {
      col.push(addDays(start, w * 7 + d))
    }
    columns.push(col)
  }

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {columns.map((col, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {col.map((day, di) => {
              const key = format(day, 'yyyy-MM-dd')
              const value = dayMap.get(key) ?? 0
              const future = day > today
              return (
                <div
                  key={di}
                  title={`${format(day, 'MMM d, yyyy')} · ${value} catch${value === 1 ? '' : 'es'}`}
                  className="w-3.5 h-3.5 rounded-sm"
                  style={{ backgroundColor: future ? 'transparent' : colorFor(value) }}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 text-xs text-ink-400">
        <span>Less catches</span>
        {[0, 1, 4, 7, 10].map((v) => (
          <span key={v} className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: colorFor(v) }} />
        ))}
        <span>More catches</span>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'
import { useSessions } from '../hooks/useEntries'
import { Card } from '../components/common/Card'
import { toDayKey, formatTime } from '../utils/dateHelpers'

const DEPTH_COLORS = ['#e9e3d6', '#cfe3c2', '#f0dba3', '#e6c170', '#d6a648', '#bd8b34']

export function Calendar() {
  const sessions = useSessions()
  const [cursor, setCursor] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<string | null>(null)

  const byDay = useMemo(() => {
    const map = new Map<string, typeof sessions>()
    for (const s of sessions) {
      const key = toDayKey(s.date)
      const arr = map.get(key) ?? []
      arr.push(s)
      map.set(key, arr)
    }
    return map
  }, [sessions])

  const monthStart = startOfMonth(cursor)
  const monthEnd = endOfMonth(cursor)
  const gridStart = startOfWeek(monthStart)
  const gridEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  const selectedSessions = selectedDay ? byDay.get(selectedDay) ?? [] : []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink-700">Calendar</h2>
        <p className="text-ink-400 text-sm">Browse your meditation history by month.</p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCursor(subMonths(cursor, 1))} className="px-3 py-1.5 rounded-lg hover:bg-ink-100/60 text-ink-500">
            ←
          </button>
          <h3 className="font-semibold text-ink-700 text-lg">{format(cursor, 'MMMM yyyy')}</h3>
          <button onClick={() => setCursor(addMonths(cursor, 1))} className="px-3 py-1.5 rounded-lg hover:bg-ink-100/60 text-ink-500">
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-ink-400 mb-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const daySessions = byDay.get(key) ?? []
            const avgDepth = daySessions.length
              ? Math.round(daySessions.reduce((s, x) => s + x.depth, 0) / daySessions.length)
              : 0
            const inMonth = isSameMonth(day, cursor)
            return (
              <button
                key={key}
                onClick={() => setSelectedDay(daySessions.length ? key : null)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative transition-transform ${
                  inMonth ? 'text-ink-600' : 'text-ink-300'
                } ${selectedDay === key ? 'ring-2 ring-dawn-400' : ''} ${isToday(day) ? 'font-bold' : ''}`}
                style={{ backgroundColor: daySessions.length ? DEPTH_COLORS[avgDepth] : 'transparent' }}
              >
                {format(day, 'd')}
                {daySessions.length > 1 && (
                  <span className="absolute bottom-0.5 text-[9px] text-ink-500">{daySessions.length}×</span>
                )}
              </button>
            )
          })}
        </div>
      </Card>

      {selectedDay && (
        <Card title={format(new Date(selectedDay), 'MMMM d, yyyy')}>
          <ul className="divide-y divide-ink-200/50">
            {selectedSessions.map((s) => (
              <li key={s.id} className="py-2.5">
                <Link to={`/history/${s.id}`} className="flex justify-between items-center group">
                  <span className="text-sm text-ink-600 group-hover:text-dawn-500">{formatTime(s.date)}</span>
                  <span className="text-xs text-ink-400">{s.durationMinutes} min · Depth {s.depth}/5</span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}

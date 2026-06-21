import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSessions } from '../hooks/useEntries'
import { formatDateTime } from '../utils/dateHelpers'
import { Card } from '../components/common/Card'

export function History() {
  const sessions = useSessions()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return sessions
    const q = query.toLowerCase()
    return sessions.filter((s) => {
      const haystack = [s.notes.experience, s.notes.insights, s.notes.sensations, s.notes.dreams, formatDateTime(s.date)]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [sessions, query])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink-700">Journal</h2>
        <p className="text-ink-400 text-sm">Search and revisit your past meditation sessions.</p>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search notes, insights, dreams..."
        className="w-full rounded-xl border border-ink-200 px-4 py-2.5 bg-white/70 focus:outline-none focus:ring-2 focus:ring-dawn-300"
      />

      {filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-400 text-center py-6">
            {sessions.length === 0 ? 'No sessions logged yet.' : 'No sessions match your search.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((s) => (
            <Link key={s.id} to={`/history/${s.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <p className="font-medium text-ink-700">{formatDateTime(s.date)}</p>
                    <p className="text-sm text-ink-400 mt-0.5 line-clamp-2">
                      {s.notes.experience || s.notes.insights || 'No notes recorded.'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm text-ink-500">{s.durationMinutes} min</p>
                    <p className="text-xs text-ink-400">Depth {s.depth}/5</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

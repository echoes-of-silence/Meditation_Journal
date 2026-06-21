import { useMemo, useState } from 'react'
import { AFFIRMATIONS, getAffirmationOfDay } from '../data/affirmations'
import { CHAKRA_BY_ID } from '../data/chakraInfo'
import { Card } from '../components/common/Card'
import type { ChakraId } from '../types'

export function Affirmations() {
  const today = getAffirmationOfDay(new Date())
  const [filter, setFilter] = useState<ChakraId | 'general' | 'all'>('all')

  const grouped = useMemo(() => {
    return AFFIRMATIONS.filter((a) => filter === 'all' || a.chakraId === filter)
  }, [filter])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink-700">Affirmations Library</h2>
        <p className="text-ink-400 text-sm">Gentle affirmations to support your subtle system, stored entirely on your device.</p>
      </div>

      <Card className="text-center bg-gradient-to-br from-dawn-50 to-sky-50">
        <p className="text-xs font-medium text-dawn-500 mb-2">Affirmation of the Day</p>
        <p className="font-display text-xl text-ink-700 italic">“{today.text}”</p>
      </Card>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'all' ? 'bg-dawn-500 text-white' : 'bg-white/60 text-ink-500'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('general')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === 'general' ? 'bg-dawn-500 text-white' : 'bg-white/60 text-ink-500'}`}
        >
          General
        </button>
        {Object.values(CHAKRA_BY_ID).map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${filter === c.id ? 'bg-dawn-500 text-white' : 'bg-white/60 text-ink-500'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {grouped.map((a) => (
          <Card key={a.id}>
            <p className="text-sm text-ink-600 italic">“{a.text}”</p>
            <p className="text-xs text-ink-400 mt-2">
              {a.chakraId === 'general' ? 'General' : CHAKRA_BY_ID[a.chakraId].name}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSession } from '../hooks/useEntries'
import { db } from '../db/database'
import { SessionForm } from '../components/session/SessionForm'
import { Card } from '../components/common/Card'
import { SubtleSystemDiagram } from '../components/visualization/SubtleSystemDiagram'
import { formatDateTime } from '../utils/dateHelpers'
import { CHAKRA_BY_ID, STATE_LABELS } from '../data/chakraInfo'
import type { ChakraId, Channel, MeditationSession } from '../types'

const CHANNELS: Channel[] = ['left', 'central', 'right']

export function EntryDetail() {
  const { id } = useParams<{ id: string }>()
  const session = useSession(id)
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)

  if (!session) {
    return <p className="text-ink-400">Loading…</p>
  }

  async function handleSave(updated: MeditationSession) {
    await db.sessions.put(updated)
    setEditing(false)
  }

  async function handleDelete() {
    if (!session) return
    if (!confirm('Delete this session permanently? This cannot be undone.')) return
    await db.sessions.delete(session.id)
    navigate('/history')
  }

  if (editing) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-ink-700 mb-6">Edit Session</h2>
        <SessionForm initial={session} onSave={handleSave} onCancel={() => setEditing(false)} />
      </div>
    )
  }

  const catches: { label: string; state: string }[] = []
  ;(Object.keys(session.chakras) as ChakraId[]).forEach((chakraId) => {
    CHANNELS.forEach((channel) => {
      const reading = session.chakras[chakraId][channel]
      if (reading.state !== 'cool_clear' && reading.state !== 'balanced') {
        const label = channel === 'central' ? CHAKRA_BY_ID[chakraId].name : `${channel === 'left' ? 'Left' : 'Right'} ${CHAKRA_BY_ID[chakraId].name}`
        catches.push({ label, state: STATE_LABELS[reading.state] })
      }
    })
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-ink-700">{formatDateTime(session.date)}</h2>
          <p className="text-ink-400 text-sm">
            {session.durationMinutes} minutes · Thoughtless Awareness Depth {session.depth}/5
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 rounded-xl border border-ink-200 text-ink-600 hover:bg-ink-100/60 text-sm"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Subtle System Snapshot">
          <SubtleSystemDiagram chakras={session.chakras} height={460} />
        </Card>

        <div className="space-y-6">
          {catches.length > 0 && (
            <Card title="Catches Noted">
              <ul className="space-y-1.5">
                {catches.map((c, i) => (
                  <li key={i} className="text-sm text-ink-600 flex justify-between">
                    <span>{c.label}</span>
                    <span className="text-ink-400">{c.state}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {[
            ['Meditation Experience', session.notes.experience],
            ['Insights & Realizations', session.notes.insights],
            ['Physical / Subtle Sensations', session.notes.sensations],
            ['Dreams / Synchronicities', session.notes.dreams],
          ].map(([label, value]) =>
            value ? (
              <Card key={label} title={label as string}>
                <p className="text-sm text-ink-600 whitespace-pre-wrap">{value}</p>
              </Card>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'
import { SessionForm } from '../components/session/SessionForm'
import { db } from '../db/database'
import type { MeditationSession } from '../types'

export function NewEntry() {
  const navigate = useNavigate()

  async function handleSave(session: MeditationSession) {
    await db.sessions.put(session)
    navigate(`/history/${session.id}`)
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-ink-700">New Meditation Session</h2>
        <p className="text-ink-400 text-sm">Take a moment to reflect, then record your experience.</p>
      </div>
      <SessionForm onSave={handleSave} onCancel={() => navigate(-1)} />
    </div>
  )
}

import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import type { ChakraId, ChakraStateValue, Channel, Finger, FingerSegment, FingerSensation, Hand, MeditationSession } from '../../types'
import { createDefaultChakraMap, createDefaultFingertipMap } from '../../db/database'
import { DepthSelector } from './DepthSelector'
import { ChakraStateGrid } from './ChakraStateGrid'
import { FingertipMap } from './FingertipMap'
import { Card } from '../common/Card'

interface SessionFormProps {
  initial?: MeditationSession
  onSave: (session: MeditationSession) => void
  onCancel?: () => void
}

function toLocalInputValue(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function SessionForm({ initial, onSave, onCancel }: SessionFormProps) {
  const [dateValue, setDateValue] = useState(
    initial ? toLocalInputValue(initial.date) : toLocalInputValue(new Date().toISOString())
  )
  const [duration, setDuration] = useState(initial?.durationMinutes ?? 20)
  const [depth, setDepth] = useState<1 | 2 | 3 | 4 | 5>(initial?.depth ?? 3)
  const [experience, setExperience] = useState(initial?.notes.experience ?? '')
  const [insightsText, setInsightsText] = useState(initial?.notes.insights ?? '')
  const [sensations, setSensations] = useState(initial?.notes.sensations ?? '')
  const [dreams, setDreams] = useState(initial?.notes.dreams ?? '')
  const [chakras, setChakras] = useState(initial?.chakras ?? createDefaultChakraMap())
  const [fingertips, setFingertips] = useState(initial?.fingertips ?? createDefaultFingertipMap())

  function handleChakraChange(chakraId: ChakraId, channel: Channel, state: ChakraStateValue, intensity?: number) {
    setChakras((prev) => ({
      ...prev,
      [chakraId]: {
        ...prev[chakraId],
        [channel]: { state, intensity },
      },
    }))
  }

  function handleFingertipChange(hand: Hand, finger: Finger, segment: FingerSegment, sensation: FingerSensation) {
    setFingertips((prev) => ({
      ...prev,
      [hand]: {
        ...prev[hand],
        [finger]: {
          ...prev[hand][finger],
          [segment]: { sensation },
        },
      },
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const now = new Date().toISOString()
    const session: MeditationSession = {
      id: initial?.id ?? uuid(),
      date: new Date(dateValue).toISOString(),
      durationMinutes: duration,
      depth,
      notes: { experience, insights: insightsText, sensations, dreams },
      chakras,
      fingertips,
      createdAt: initial?.createdAt ?? now,
      updatedAt: now,
    }
    onSave(session)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card title="Session Details" subtitle="When and how long was your meditation?">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-600 mb-1">Date &amp; Time</label>
            <input
              type="datetime-local"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-dawn-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-600 mb-1">Duration (minutes)</label>
            <input
              type="number"
              min={1}
              max={300}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-dawn-300"
              required
            />
          </div>
        </div>
      </Card>

      <Card title="Thoughtless Awareness Depth" subtitle="How deep was your stillness?">
        <DepthSelector value={depth} onChange={setDepth} />
      </Card>

      <Card title="Notes" subtitle="Capture your experience freely">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-600 mb-1">Meditation Experience</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-dawn-300"
              placeholder="How did the session feel overall?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-600 mb-1">Insights &amp; Realizations</label>
            <textarea
              value={insightsText}
              onChange={(e) => setInsightsText(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-dawn-300"
              placeholder="Any insight or realization that arose?"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-600 mb-1">Physical / Subtle Sensations</label>
            <textarea
              value={sensations}
              onChange={(e) => setSensations(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-dawn-300"
              placeholder="Vibrations, warmth, lightness, heaviness..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-600 mb-1">Dreams / Synchronicities</label>
            <textarea
              value={dreams}
              onChange={(e) => setDreams(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-ink-200 px-3 py-2 bg-white/70 focus:outline-none focus:ring-2 focus:ring-dawn-300"
              placeholder="Anything notable around or after this session?"
            />
          </div>
        </div>
      </Card>

      <Card title="Chakra State" subtitle="Left · Central · Right channel for each chakra">
        <ChakraStateGrid chakras={chakras} onChange={handleChakraChange} />
      </Card>

      <Card title="Fingertip Awareness Map" subtitle="Tap each segment to record sensation">
        <FingertipMap fingertips={fingertips} onChange={handleFingertipChange} />
      </Card>

      <div className="flex gap-3 justify-end pb-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-ink-200 text-ink-500 hover:bg-ink-100/60"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-dawn-500 text-white font-medium hover:opacity-90 shadow-sm"
        >
          Save Session
        </button>
      </div>
    </form>
  )
}

import { useState } from 'react'
import { useSessions } from '../hooks/useEntries'
import { SubtleSystemDiagram } from '../components/visualization/SubtleSystemDiagram'
import { Card } from '../components/common/Card'
import { createDefaultChakraMap } from '../db/database'
import { CHAKRA_BY_ID, CHAKRA_RECOMMENDATIONS, STATE_DESCRIPTIONS, STATE_LABELS } from '../data/chakraInfo'
import type { ChakraId, Channel } from '../types'
import { formatDateTime } from '../utils/dateHelpers'

const CHANNELS: Channel[] = ['left', 'central', 'right']

export function SubtleSystem() {
  const sessions = useSessions()
  const latest = sessions[0]
  const chakras = latest?.chakras ?? createDefaultChakraMap()
  const [selected, setSelected] = useState<ChakraId | null>(null)

  const info = selected ? CHAKRA_BY_ID[selected] : null
  const reading = selected ? chakras[selected] : null
  const hasCatch = reading
    ? CHANNELS.some((ch) => reading[ch].state !== 'cool_clear' && reading[ch].state !== 'balanced')
    : false

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-ink-700">Subtle System</h2>
        <p className="text-ink-400 text-sm">
          {latest ? `Snapshot from your last session · ${formatDateTime(latest.date)}` : 'Log a session to see your subtle system.'}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <SubtleSystemDiagram chakras={chakras} onSelectChakra={setSelected} selectedId={selected ?? undefined} height={560} />
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs text-ink-500">
            <Legend color="#bfe3ff" label="Cool / Clear" />
            <Legend color="#f5d98a" label="Balanced" />
            <Legend color="#f0b357" label="Mild Catch" />
            <Legend color="#e8823f" label="Moderate Catch" />
            <Legend color="#d8483f" label="Strong Catch" />
          </div>
        </Card>

        <Card title={info ? info.name : 'Select a chakra'} subtitle={info ? `${info.sanskrit} · ${info.quality}` : 'Tap any node in the diagram'}>
          {!info && <p className="text-sm text-ink-400">Click a chakra circle to view its state and recommendations.</p>}
          {info && reading && (
            <div className="space-y-4">
              <div className="space-y-2">
                {CHANNELS.map((ch) => (
                  <div key={ch} className="flex justify-between text-sm">
                    <span className="text-ink-500 capitalize">{ch}</span>
                    <span className="text-ink-700 font-medium">{STATE_LABELS[reading[ch].state]}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-400">{STATE_DESCRIPTIONS[reading.central.state]}</p>

              {hasCatch && (
                <div>
                  <h4 className="text-sm font-semibold text-ink-600 mb-2">Suggested Clearing Practices</h4>
                  <ul className="space-y-1.5">
                    {CHAKRA_RECOMMENDATIONS[selected!].map((rec, i) => (
                      <li key={i} className="text-sm text-ink-600 flex gap-2">
                        <span className="text-dawn-400">·</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="inline-block w-3 h-3 rounded-full border border-white" style={{ backgroundColor: color }} />
      {label}
    </div>
  )
}

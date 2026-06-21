import type { ChakraId, ChakraMap, ChakraStateValue, Channel } from '../../types'
import { CHAKRAS, STATE_COLORS, STATE_LABELS, STATE_ORDER } from '../../data/chakraInfo'

interface ChakraStateGridProps {
  chakras: ChakraMap
  onChange: (chakraId: ChakraId, channel: Channel, state: ChakraStateValue, intensity?: number) => void
  showIntensity?: boolean
}

const CHANNELS: { key: Channel; label: string }[] = [
  { key: 'left', label: 'Left' },
  { key: 'central', label: 'Central' },
  { key: 'right', label: 'Right' },
]

export function ChakraStateGrid({ chakras, onChange, showIntensity = true }: ChakraStateGridProps) {
  const sorted = [...CHAKRAS].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-4">
      {sorted.map((chakra) => (
        <div key={chakra.id} className="rounded-xl border border-ink-200/50 p-3 sm:p-4">
          <div className="flex items-baseline justify-between mb-3">
            <h4 className="font-semibold text-ink-700">{chakra.name}</h4>
            <span className="text-xs text-ink-400">{chakra.quality}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {CHANNELS.map(({ key, label }) => {
              const reading = chakras[chakra.id][key]
              return (
                <div key={key} className="space-y-1.5">
                  <div className="text-xs font-medium text-ink-400">{label}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {STATE_ORDER.map((state) => {
                      const active = reading.state === state
                      return (
                        <button
                          key={state}
                          type="button"
                          title={STATE_LABELS[state]}
                          onClick={() => onChange(chakra.id, key, state, reading.intensity)}
                          className="w-6 h-6 rounded-full border-2 transition-transform"
                          style={{
                            backgroundColor: STATE_COLORS[state],
                            borderColor: active ? '#5c5448' : 'transparent',
                            transform: active ? 'scale(1.15)' : 'scale(1)',
                          }}
                        />
                      )
                    })}
                  </div>
                  <div className="text-[11px] text-ink-400">{STATE_LABELS[reading.state]}</div>
                  {showIntensity && (
                    <input
                      type="range"
                      min={0}
                      max={5}
                      value={reading.intensity ?? 0}
                      onChange={(e) => onChange(chakra.id, key, reading.state, Number(e.target.value))}
                      className="w-full accent-dawn-500 h-1"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

import { motion } from 'framer-motion'
import type { ChakraId, ChakraMap, Channel } from '../../types'
import { CHAKRAS } from '../../data/chakraInfo'
import { STATE_COLORS } from '../../data/chakraInfo'

interface SubtleSystemDiagramProps {
  chakras: ChakraMap
  improvedIds?: Set<ChakraId>
  onSelectChakra?: (id: ChakraId) => void
  selectedId?: ChakraId
  height?: number
}

const CHANNEL_X_OFFSET: Record<Channel, number> = {
  left: -34,
  central: 0,
  right: 34,
}

export function SubtleSystemDiagram({
  chakras,
  improvedIds,
  onSelectChakra,
  selectedId,
  height = 560,
}: SubtleSystemDiagramProps) {
  const sorted = [...CHAKRAS].sort((a, b) => b.order - a.order) // Sahasrara top
  const topPad = 40
  const bottomPad = 40
  const usable = height - topPad - bottomPad
  const step = usable / (sorted.length - 1)
  const centerX = 130

  return (
    <svg
      viewBox={`0 0 ${centerX * 2} ${height}`}
      width="100%"
      height={height}
      className="select-none"
      role="img"
      aria-label="Subtle system chakra diagram"
    >
      <defs>
        {sorted.map((c) => (
          <radialGradient key={c.id} id={`grad-${c.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c.color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={c.color} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>

      {/* central channel line */}
      <line
        x1={centerX}
        y1={topPad}
        x2={centerX}
        y2={height - bottomPad}
        stroke="#cabfa9"
        strokeWidth={2}
        strokeDasharray="1 6"
      />

      {sorted.map((c, i) => {
        const cy = topPad + step * i
        const isSelected = selectedId === c.id
        const improved = improvedIds?.has(c.id)

        return (
          <g key={c.id}>
            {(['left', 'central', 'right'] as Channel[]).map((channel) => {
              const reading = chakras[c.id][channel]
              const color = STATE_COLORS[reading.state]
              const cx = centerX + CHANNEL_X_OFFSET[channel]
              const r = channel === 'central' ? 16 : 10
              const isCatch = reading.state !== 'cool_clear' && reading.state !== 'balanced'

              return (
                <g key={channel}>
                  <circle cx={cx} cy={cy} r={r * 2.1} fill={color} opacity={0.18} />
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={color}
                    stroke="#fff"
                    strokeWidth={1.5}
                    className={isCatch ? 'animate-pulse-glow' : improved ? 'animate-breathe' : ''}
                    style={{ cursor: onSelectChakra ? 'pointer' : 'default' }}
                    whileHover={{ scale: 1.15 }}
                    onClick={() => onSelectChakra?.(c.id)}
                  />
                </g>
              )
            })}
            <text
              x={centerX + 58}
              y={cy + 4}
              fontSize={12}
              fontFamily="var(--font-sans)"
              fill={isSelected ? '#bd8b34' : '#5c5448'}
              fontWeight={isSelected ? 600 : 500}
              style={{ cursor: onSelectChakra ? 'pointer' : 'default' }}
              onClick={() => onSelectChakra?.(c.id)}
            >
              {c.name}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

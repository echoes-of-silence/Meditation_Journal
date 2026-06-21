import type { Finger, FingerSegment, FingerSensation, FingertipMap as FingertipMapType, Hand } from '../../types'
import { FINGER_CHAKRA_MAP, FINGER_SENSATION_COLORS, FINGER_SENSATION_LABELS } from '../../data/chakraInfo'
import { CHAKRA_BY_ID } from '../../data/chakraInfo'

interface FingertipMapProps {
  fingertips: FingertipMapType
  onChange: (hand: Hand, finger: Finger, segment: FingerSegment, sensation: FingerSensation) => void
}

const SENSATION_ORDER: FingerSensation[] = ['neutral', 'cool', 'tingling', 'heat', 'numbness']
const FINGER_ORDER: Finger[] = ['thumb', 'index', 'middle', 'ring', 'pinky']
const SEGMENT_ORDER: FingerSegment[] = ['tip', 'middle', 'base']

function nextSensation(current: FingerSensation): FingerSensation {
  const idx = SENSATION_ORDER.indexOf(current)
  return SENSATION_ORDER[(idx + 1) % SENSATION_ORDER.length]
}

function HandSvg({
  hand,
  fingertips,
  onChange,
}: {
  hand: Hand
  fingertips: FingertipMapType[Hand]
  onChange: FingertipMapProps['onChange']
}) {
  const order = hand === 'left' ? [...FINGER_ORDER].reverse() : FINGER_ORDER
  const segHeight = 22
  const segGap = 3
  const fingerWidth = 30
  const fingerGap = 6
  const palmHeight = 70
  const width = order.length * (fingerWidth + fingerGap)
  const fingerLengths: Record<Finger, number> = {
    thumb: 1.6,
    index: 2.5,
    middle: 3,
    ring: 2.7,
    pinky: 2,
  }

  return (
    <svg viewBox={`0 0 ${width} ${palmHeight + segHeight * 3 + segGap * 2 + 10}`} width="100%">
      <rect
        x={0}
        y={segHeight * 3 + segGap * 2 + 10}
        width={width}
        height={palmHeight}
        rx={18}
        fill="#f3ede3"
        stroke="#d6d0c6"
      />
      {order.map((finger, fi) => {
        const x = fi * (fingerWidth + fingerGap) + fingerGap / 2
        const lenFactor = fingerLengths[finger]
        const segs = SEGMENT_ORDER.map((seg, si) => {
          const reading = fingertips[finger][seg]
          const color = FINGER_SENSATION_COLORS[reading.sensation]
          const yBase = (segHeight * 3 + segGap * 2 + 10) - (si + 1) * (segHeight * lenFactor / 3 + segGap)
          const h = segHeight * lenFactor / 3
          return (
            <rect
              key={seg}
              x={x}
              y={yBase}
              width={fingerWidth - fingerGap}
              height={h}
              rx={8}
              fill={color}
              stroke="#fff"
              strokeWidth={1.5}
              style={{ cursor: 'pointer' }}
              onClick={() => onChange(hand, finger, seg, nextSensation(reading.sensation))}
            >
              <title>
                {finger} · {seg} · {FINGER_SENSATION_LABELS[reading.sensation]}
              </title>
            </rect>
          )
        })
        return (
          <g key={finger}>
            {segs}
            <text
              x={x + (fingerWidth - fingerGap) / 2}
              y={segHeight * 3 + segGap * 2 + 10 + palmHeight / 2}
              fontSize={9}
              textAnchor="middle"
              fill="#5c5448"
              transform={`rotate(-90 ${x + (fingerWidth - fingerGap) / 2} ${segHeight * 3 + segGap * 2 + 10 + palmHeight / 2})`}
            >
              {CHAKRA_BY_ID[FINGER_CHAKRA_MAP[finger]].name.split(' ')[0]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function FingertipMap({ fingertips, onChange }: FingertipMapProps) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-6 sm:gap-10 max-w-md mx-auto">
        <div className="text-center">
          <p className="text-xs font-medium text-ink-400 mb-2">Left Hand</p>
          <HandSvg hand="left" fingertips={fingertips.left} onChange={onChange} />
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-ink-400 mb-2">Right Hand</p>
          <HandSvg hand="right" fingertips={fingertips.right} onChange={onChange} />
        </div>
      </div>
      <p className="text-center text-xs text-ink-400 mt-3">Tap a segment to cycle through sensations.</p>
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {SENSATION_ORDER.map((s) => (
          <div key={s} className="flex items-center gap-1.5 text-xs text-ink-500">
            <span
              className="inline-block w-3 h-3 rounded-full border border-white"
              style={{ backgroundColor: FINGER_SENSATION_COLORS[s] }}
            />
            {FINGER_SENSATION_LABELS[s]}
          </div>
        ))}
      </div>
    </div>
  )
}

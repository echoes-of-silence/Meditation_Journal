interface DepthSelectorProps {
  value: 1 | 2 | 3 | 4 | 5
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void
}

const DEPTH_LABELS: Record<number, { title: string; description: string }> = {
  1: { title: 'Many Thoughts', description: 'Unable to settle, many thoughts' },
  2: { title: 'Intermittent Silence', description: 'Intermittent silence, frequent thoughts' },
  3: { title: 'Balanced', description: 'Balanced meditation with periods of thoughtless awareness' },
  4: { title: 'Deep Silence', description: 'Deep silence and steady awareness' },
  5: { title: 'Effortless Peace', description: 'Effortless, sustained thoughtless awareness with profound peace' },
}

export function DepthSelector({ value, onChange }: DepthSelectorProps) {
  return (
    <div>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n as 1 | 2 | 3 | 4 | 5)}
            className="flex-1 aspect-square rounded-xl border-2 flex items-center justify-center text-lg font-semibold transition-all"
            style={{
              borderColor: value === n ? '#bd8b34' : '#e0dbcf',
              backgroundColor: value >= n ? 'rgba(214, 166, 72, 0.18)' : 'transparent',
              color: value === n ? '#bd8b34' : '#837a6c',
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm font-medium text-ink-600">{DEPTH_LABELS[value].title}</p>
      <p className="text-xs text-ink-400">{DEPTH_LABELS[value].description}</p>
    </div>
  )
}

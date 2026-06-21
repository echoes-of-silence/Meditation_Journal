import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: ReactNode
  hint?: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 text-center">
      <p className="text-2xl sm:text-3xl font-semibold text-dawn-500 font-display">{value}</p>
      <p className="text-xs sm:text-sm text-ink-500 mt-1">{label}</p>
      {hint && <p className="text-[11px] text-ink-300 mt-0.5">{hint}</p>}
    </div>
  )
}

import type { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
  icon?: ReactNode
}

export function Card({ children, className, title, subtitle, icon }: CardProps) {
  return (
    <div
      className={clsx(
        'glass-card rounded-2xl shadow-[0_8px_30px_-12px_rgba(95,75,50,0.25)] p-5 sm:p-6',
        className
      )}
    >
      {(title || subtitle) && (
        <div className="mb-4 flex items-start gap-3">
          {icon && <div className="text-dawn-500 shrink-0 mt-0.5">{icon}</div>}
          <div>
            {title && <h3 className="text-lg font-semibold text-ink-700">{title}</h3>}
            {subtitle && <p className="text-sm text-ink-400">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

interface LotusIconProps {
  className?: string
  size?: number
}

export function LotusIcon({ className, size = 24 }: LotusIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g opacity="0.95">
        <ellipse cx="32" cy="40" rx="7" ry="16" fill="currentColor" opacity="0.85" />
        <ellipse cx="32" cy="40" rx="7" ry="16" fill="currentColor" opacity="0.7" transform="rotate(40 32 40)" />
        <ellipse cx="32" cy="40" rx="7" ry="16" fill="currentColor" opacity="0.7" transform="rotate(-40 32 40)" />
        <ellipse cx="32" cy="40" rx="7" ry="16" fill="currentColor" opacity="0.55" transform="rotate(80 32 40)" />
        <ellipse cx="32" cy="40" rx="7" ry="16" fill="currentColor" opacity="0.55" transform="rotate(-80 32 40)" />
      </g>
      <circle cx="32" cy="32" r="4.5" fill="currentColor" />
    </svg>
  )
}

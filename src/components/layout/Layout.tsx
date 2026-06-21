import { NavLink, Outlet } from 'react-router-dom'
import { LotusIcon } from '../common/LotusIcon'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '◎' },
  { to: '/new', label: 'New Session', icon: '✎' },
  { to: '/history', label: 'Journal', icon: '☰' },
  { to: '/subtle-system', label: 'Subtle System', icon: '✦' },
  { to: '/trends', label: 'Trends', icon: '∿' },
  { to: '/calendar', label: 'Calendar', icon: '▦' },
  { to: '/affirmations', label: 'Affirmations', icon: '❀' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
]

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-ink-200/40 px-5 py-7 gap-1">
        <div className="flex items-center gap-2 mb-8 px-2">
          <LotusIcon size={32} className="text-lotus-500" />
          <div>
            <h1 className="text-xl font-semibold leading-tight text-ink-700">Sahaja Journal</h1>
            <p className="text-xs text-ink-400">Private &amp; offline</p>
          </div>
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-dawn-100 text-dawn-500'
                  : 'text-ink-500 hover:bg-ink-100/60 hover:text-ink-700'
              )
            }
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <div className="mt-auto pt-6 px-2 text-xs text-ink-300 leading-relaxed">
          All data stays on this device. Nothing is uploaded.
        </div>
      </aside>

      <header className="lg:hidden flex items-center gap-2 px-4 py-3 border-b border-ink-200/40">
        <LotusIcon size={26} className="text-lotus-500" />
        <h1 className="text-lg font-semibold text-ink-700">Sahaja Journal</h1>
      </header>

      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 pb-24 lg:pb-10 max-w-6xl w-full mx-auto">
        <Outlet />
      </main>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 glass-card border-t border-ink-200/40 flex justify-between px-2 py-2 z-20 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-[11px] font-medium shrink-0',
                isActive ? 'text-dawn-500' : 'text-ink-400'
              )
            }
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

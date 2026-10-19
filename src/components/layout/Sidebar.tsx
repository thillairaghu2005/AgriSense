import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Leaf, Sparkles, CalendarDays, TrendingUp,
  CloudSun, Bot, BookOpen, Bug, Beaker, Wallet, Library,
  Bell, UserCircle, Sprout
} from 'lucide-react';
import { useApp } from '@/app/providers';

const NAV_GROUPS = [
  {
    sectionKey: 'nav.section.overview',
    items: [
      { to: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard', end: true },
      { to: '/notifications', icon: Bell, labelKey: 'nav.notifications' },
    ],
  },
  {
    sectionKey: 'nav.section.farm',
    items: [
      { to: '/crops', icon: Leaf, labelKey: 'nav.crops' },
      { to: '/recommendations', icon: Sparkles, labelKey: 'nav.recommendations' },
      { to: '/calendar', icon: CalendarDays, labelKey: 'nav.calendar' },
      { to: '/market-prices', icon: TrendingUp, labelKey: 'nav.market' },
      { to: '/farm-finances', icon: Wallet, labelKey: 'nav.finances' },
      { to: '/soil', icon: Beaker, labelKey: 'nav.soil' },
    ],
  },
  {
    sectionKey: 'nav.section.discover',
    items: [
      { to: '/weather', icon: CloudSun, labelKey: 'nav.weather' },
      { to: '/schemes', icon: BookOpen, labelKey: 'nav.schemes' },
      { to: '/pests-diseases', icon: Bug, labelKey: 'nav.pests' },
      { to: '/knowledge', icon: Library, labelKey: 'nav.knowledge' },
      { to: '/assistant', icon: Bot, labelKey: 'nav.assistant' },
    ],
  },
  {
    sectionKey: 'nav.section.settings',
    items: [
      { to: '/profile', icon: UserCircle, labelKey: 'nav.profile' },
    ],
  },
];

export default function Sidebar() {
  const { t } = useApp();

  return (
    <nav
      className="flex flex-col h-full bg-white overflow-y-auto"
      aria-label="Main navigation"
    >
      {/* Logo without container box */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <Sprout className="w-5 h-5 text-[var(--color-primary-600)]" strokeWidth={2.5} />
        <div>
          <span className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight">AgriSense</span>
          <p className="text-[10px] text-[var(--color-text-muted)] leading-none mt-0.5">Indian Farmers Platform</p>
        </div>
      </div>

      {/* Nav groups */}
      <div className="flex-1 px-3 py-2 space-y-5">
        {NAV_GROUPS.map(group => (
          <div key={group.sectionKey}>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              {t(group.sectionKey)}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(item => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
                    <span className="truncate">{t(item.labelKey)}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3">
        <p className="text-[10px] text-[var(--color-text-muted)]">
          Demo prototype — all data is illustrative
        </p>
      </div>
    </nav>
  );
}

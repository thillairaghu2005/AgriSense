import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Leaf, CalendarDays, TrendingUp,
  CloudSun, Bot, BookOpen, Bug, Beaker, Wallet, Library,
  Bell, UserCircle, Sprout, FileText, Receipt, ShieldAlert,
  Trees, BarChart3, Building2, PackageCheck
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
    sectionKey: 'nav.section.welfare',
    items: [
      { to: '/schemes', icon: BookOpen, labelKey: 'nav.schemes' },
      { to: '/applications', icon: FileText, labelKey: 'nav.applications' },
      { to: '/seed-distribution', icon: PackageCheck, labelKey: 'nav.seeds' },
      { to: '/plantations', icon: Trees, labelKey: 'nav.plantations' },
      { to: '/dbt-ledger', icon: Receipt, labelKey: 'nav.dbt' },
      { to: '/grievances', icon: ShieldAlert, labelKey: 'nav.grievances' },
    ],
  },
  {
    sectionKey: 'nav.section.farm',
    items: [
      { to: '/crops', icon: Leaf, labelKey: 'nav.crops' },
      { to: '/recommendations', icon: Sprout, labelKey: 'nav.recommendations' },
      { to: '/calendar', icon: CalendarDays, labelKey: 'nav.calendar' },
      { to: '/market-prices', icon: TrendingUp, labelKey: 'nav.market' },
      { to: '/soil', icon: Beaker, labelKey: 'nav.soil' },
      { to: '/farm-finances', icon: Wallet, labelKey: 'nav.finances' },
    ],
  },
  {
    sectionKey: 'nav.section.intelligence',
    items: [
      { to: '/analytics', icon: BarChart3, labelKey: 'nav.analytics' },
      { to: '/government-resources', icon: Building2, labelKey: 'nav.resources' },
      { to: '/weather', icon: CloudSun, labelKey: 'nav.weather' },
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
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--color-border)]">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-50)] border border-[var(--color-primary-200)] flex items-center justify-center text-[var(--color-primary-600)] shrink-0">
          <Sprout className="w-5 h-5" strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-sm font-bold text-[var(--color-text-primary)] tracking-tight">AgriSense</span>
          <p className="text-[10px] text-[var(--color-text-muted)] leading-none mt-0.5">Indian Farmers Platform</p>
        </div>
      </div>

      {/* Nav groups */}
      <div className="flex-1 px-3 py-3 space-y-5">
        {NAV_GROUPS.map(group => (
          <div key={group.sectionKey}>
            <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
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
      <div className="px-5 py-3 border-t border-[var(--color-border)] bg-[var(--color-surface-1)]">
        <p className="text-[10px] text-[var(--color-text-muted)]">
          Demo prototype — verified MoA&FW guidelines
        </p>
      </div>
    </nav>
  );
}

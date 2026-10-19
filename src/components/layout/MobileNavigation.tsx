import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Leaf, CloudSun, TrendingUp, MoreHorizontal } from 'lucide-react';
import { useApp } from '@/app/providers';

const MOBILE_NAV = [
  { to: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard', end: true },
  { to: '/crops', icon: Leaf, labelKey: 'nav.crops' },
  { to: '/weather', icon: CloudSun, labelKey: 'nav.weather' },
  { to: '/market-prices', icon: TrendingUp, labelKey: 'nav.market' },
  { to: '/profile', icon: MoreHorizontal, labelKey: 'nav.profile' },
];

export default function MobileNavigation() {
  const { t } = useApp();

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--color-border)] z-20"
      aria-label="Mobile navigation"
    >
      <ul className="flex">
        {MOBILE_NAV.map(item => (
          <li key={item.to} className="flex-1">
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--color-primary-600)]'
                    : 'text-[var(--color-text-muted)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className="w-5 h-5"
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  <span className="truncate max-w-[52px] text-center leading-tight">
                    {t(item.labelKey)}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

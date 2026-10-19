import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, User, X, Sprout } from 'lucide-react';
import { useApp } from '@/app/providers';
import { STATES } from '@/data/locations';
import { LANGUAGES } from '@/data/translations';
import Sidebar from './Sidebar';
import GlobalSearch from './GlobalSearch';

export default function TopBar() {
  const { t, language, setLanguage, state, setState, district, setDistrict } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = STATES.find(s => s.id === state);
  const districts = stateData?.districts ?? [];

  // Get page title from current path
  const PAGE_TITLES: Record<string, string> = {
    '/': 'nav.dashboard',
    '/crops': 'nav.crops',
    '/recommendations': 'nav.recommendations',
    '/calendar': 'nav.calendar',
    '/market-prices': 'nav.market',
    '/weather': 'nav.weather',
    '/assistant': 'nav.assistant',
    '/schemes': 'nav.schemes',
    '/pests-diseases': 'nav.pests',
    '/soil': 'nav.soil',
    '/farm-finances': 'nav.finances',
    '/knowledge': 'nav.knowledge',
    '/notifications': 'nav.notifications',
    '/profile': 'nav.profile',
  };
  const pathKey = Object.keys(PAGE_TITLES).find(k =>
    k === location.pathname || (k !== '/' && location.pathname.startsWith(k))
  );
  const pageTitle = pathKey ? t(PAGE_TITLES[pathKey]) : 'AgriSense';

  return (
    <>
      <header className="flex items-center gap-3 px-6 h-16 bg-white z-10 flex-shrink-0">
        {/* Mobile menu button */}
        <button
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] transition-colors"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile logo without box container */}
        <div className="lg:hidden flex items-center gap-2">
          <Sprout className="w-5 h-5 text-[var(--color-primary-600)]" />
        </div>

        {/* Page title (desktop) */}
        <h1 className="hidden lg:block text-sm font-semibold text-[var(--color-text-primary)] flex-shrink-0">
          {pageTitle}
        </h1>

        <div className="flex-1" />

        {/* Region selectors */}
        <div className="hidden md:flex items-center gap-2">
          <select
            value={state}
            onChange={e => { setState(e.target.value); setDistrict(''); }}
            className="text-xs border border-[var(--color-border)] rounded-md px-2.5 py-1.5 bg-white text-[var(--color-text-secondary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-600)]"
            aria-label="Select state"
          >
            {STATES.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="text-xs border border-[var(--color-border)] rounded-md px-2.5 py-1.5 bg-white text-[var(--color-text-secondary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-600)]"
            aria-label="Select district"
          >
            <option value="">All Districts</option>
            {districts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        {/* Language selector */}
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="hidden sm:block text-xs border border-[var(--color-border)] rounded-md px-2.5 py-1.5 bg-white text-[var(--color-text-secondary)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-600)]"
          aria-label="Select language"
        >
          {LANGUAGES.map(l => (
            <option key={l.code} value={l.code}>{l.nativeLabel}</option>
          ))}
        </select>

        {/* Search button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] transition-colors"
          aria-label={t('common.search')}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications without decorative dot */}
        <button
          onClick={() => navigate('/notifications')}
          className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] transition-colors"
          aria-label={t('nav.notifications')}
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] transition-colors"
          aria-label={t('nav.profile')}
        >
          <User className="w-4 h-4" />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <div className="relative w-72 bg-white flex flex-col animate-slide-in">
            <div className="flex items-center justify-end px-3 py-3">
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto" onClick={() => setDrawerOpen(false)}>
              <Sidebar />
            </div>
          </div>
        </div>
      )}

      {/* Global search overlay */}
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </>
  );
}

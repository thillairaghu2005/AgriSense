import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

// ─── Card ─────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export function Card({ children, className = '', onClick, ...rest }: CardProps) {
  const clickable = !!onClick;
  return (
    <div
      {...rest}
      onClick={onClick}
      className={`card ${clickable ? 'cursor-pointer hover:shadow-md hover:border-[var(--color-primary-400)] transition-all' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  iconBg?: string; // Kept for backwards compatibility
  trend?: { value: string; positive: boolean };
  subtitle?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, subtitle, className = '' }: StatCardProps) {
  return (
    <div className={`p-4 bg-white border border-[var(--color-border)] rounded-lg ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide truncate">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-[var(--color-text-muted)] truncate">{subtitle}</p>}
          {trend && (
            <p className={`mt-1 text-xs font-semibold ${trend.positive ? 'text-emerald-700' : 'text-amber-700'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 text-[var(--color-text-muted)]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PageHeader ────────────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  badge?: ReactNode;
}

export function PageHeader({ title, subtitle, actions, badge }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-xl font-bold tracking-tight text-[var(--color-text-primary)]">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="mt-1 text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────
export type BadgeVariant = 'neutral' | 'green' | 'amber' | 'red' | 'blue' | 'gray' | 'purple';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const BADGE_VARIANT_MAP: Record<BadgeVariant, string> = {
  green: 'badge-green',
  amber: 'badge-amber',
  red: 'badge-red',
  blue: 'badge-blue',
  purple: 'badge-purple',
  gray: 'badge-gray',
  neutral: 'badge-neutral',
};

export function Badge({ children, variant = 'green', className = '' }: BadgeProps) {
  const variantClass = BADGE_VARIANT_MAP[variant] || 'badge-green';
  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}

// ─── DemoLabel ─────────────────────────────────────────────────────
export function DemoLabel({ label = 'Illustrative sample data' }: { label?: string }) {
  return (
    <span className="demo-label">
      {label}
    </span>
  );
}

// ─── EmptyState ─────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && <div className="mb-4 text-[var(--color-text-muted)]">{icon}</div>}
      <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
      {description && <p className="mt-1.5 text-xs sm:text-sm text-[var(--color-text-muted)] max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── ErrorState ─────────────────────────────────────────────────────
export function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <AlertTriangle className="w-8 h-8 text-amber-600 mb-3" />
      <p className="text-sm font-medium text-[var(--color-text-primary)]">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 text-xs font-semibold text-[var(--color-primary-700)] hover:underline">
          Try again
        </button>
      )}
    </div>
  );
}

// ─── InfoBanner ─────────────────────────────────────────────────────
interface InfoBannerProps {
  children: ReactNode;
  variant?: 'info' | 'warning' | 'success';
  className?: string;
}

export function InfoBanner({ children, variant = 'info', className = '' }: InfoBannerProps) {
  const variantStyles = {
    success: 'bg-emerald-50 text-emerald-950 border border-emerald-200',
    info: 'bg-sky-50 text-sky-950 border border-sky-200',
    warning: 'bg-amber-50 text-amber-950 border border-amber-200',
  }[variant] || 'bg-sky-50 text-sky-950 border border-sky-200';

  return (
    <div className={`rounded-lg p-3.5 text-xs leading-relaxed shadow-xs ${variantStyles} ${className}`}>
      {children}
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────
interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-[var(--color-surface-3)] border border-[var(--color-border)] rounded-lg w-fit" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === tab.key
              ? 'bg-white text-[var(--color-text-primary)] shadow-xs border border-[var(--color-border)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] border border-transparent'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${activeTab === tab.key ? 'bg-[var(--color-surface-2)] text-[var(--color-primary-800)]' : 'bg-transparent text-[var(--color-text-muted)]'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

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
      className={`card ${clickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
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
  iconBg?: string; // Kept for backwards compatibility but not used as a box container
  trend?: { value: string; positive: boolean };
  subtitle?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, subtitle, className = '' }: StatCardProps) {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide truncate">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)] truncate">{value}</p>
          {subtitle && <p className="mt-0.5 text-xs text-[var(--color-text-muted)] truncate">{subtitle}</p>}
          {trend && (
            <p className={`mt-1 text-xs font-medium ${trend.positive ? 'text-[var(--color-primary-700)]' : 'text-[var(--color-text-secondary)]'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-3 text-[var(--color-primary-600)]">
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
          <h1 className="text-xl font-bold text-[var(--color-text-primary)]">{title}</h1>
          {badge}
        </div>
        {subtitle && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{subtitle}</p>}
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

export function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span className={`badge ${className}`}>
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
      {description && <p className="mt-1.5 text-sm text-[var(--color-text-muted)] max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─── ErrorState ─────────────────────────────────────────────────────
export function ErrorState({ message = 'Something went wrong.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <AlertTriangle className="w-8 h-8 text-[var(--color-text-secondary)] mb-3" />
      <p className="text-sm text-[var(--color-text-secondary)]">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 text-sm text-[var(--color-text-primary)] hover:underline font-medium">
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
  const variantBg = variant === 'success' || variant === 'info'
    ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-900)] border border-[var(--color-primary-200)]'
    : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)]';

  return (
    <div className={`rounded-lg p-3.5 text-xs leading-relaxed ${variantBg} ${className}`}>
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
    <div className="flex gap-1 p-1 bg-[var(--color-surface-2)] rounded-lg w-fit" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={activeTab === tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 ${
            activeTab === tab.key
              ? 'bg-white text-[var(--color-text-primary)] shadow-xs'
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${activeTab === tab.key ? 'bg-[var(--color-surface-3)] text-[var(--color-text-primary)]' : 'bg-transparent text-[var(--color-text-muted)]'}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary: 'bg-[var(--color-primary-600)] text-white hover:bg-[var(--color-primary-700)] active:bg-[var(--color-primary-800)] shadow-xs font-semibold',
  secondary: 'bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] hover:border-[var(--color-border-strong)] active:bg-[var(--color-surface-3)] shadow-xs font-semibold',
  outline: 'bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-white hover:border-[var(--color-primary-600)] active:bg-[var(--color-surface-2)] font-semibold',
  ghost: 'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-primary-800)] active:bg-[var(--color-surface-3)] font-medium',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-xs font-semibold',
};

const SIZE_STYLES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'px-4 py-2 text-xs font-semibold rounded-lg gap-2',
  lg: 'px-5 py-2.5 text-sm font-semibold rounded-lg gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all cursor-pointer focus-visible:outline-[var(--color-primary-600)] disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {rightIcon && !isLoading && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
}

// Icon-only button
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  variant?: Variant;
  size?: Size;
}

export function IconButton({ icon, label, variant = 'ghost', size = 'md', className = '', ...props }: IconButtonProps) {
  const sizeClass = { sm: 'w-7 h-7', md: 'w-8 h-8', lg: 'w-9 h-9' }[size];
  return (
    <button
      {...props}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-md transition-colors ${VARIANT_STYLES[variant]} ${sizeClass} ${className}`}
    >
      {icon}
    </button>
  );
}

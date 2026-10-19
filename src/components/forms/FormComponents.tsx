import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

// ─── FormField wrapper ─────────────────────────────────────────────
interface FormFieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}

export function FormField({ label, htmlFor, hint, error, required, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="block text-xs font-semibold text-[var(--color-text-primary)]"
      >
        {label}
        {required && <span className="text-[var(--color-text-muted)] ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-[var(--color-text-muted)]">{hint}</p>}
      {error && <p className="text-xs text-[var(--color-text-secondary)] font-medium" role="alert">{error}</p>}
    </div>
  );
}

// ─── Input ─────────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, leftIcon, className = '', ...props }, ref) => (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        {...props}
        className={`w-full px-3 py-2 text-xs rounded-md border bg-white text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-600)] focus:border-[var(--color-primary-600)] disabled:opacity-50 disabled:bg-[var(--color-surface-2)] ${
          error ? 'border-neutral-900' : 'border-[var(--color-border)]'
        } ${leftIcon ? 'pl-9' : ''} ${className}`}
      />
    </div>
  )
);
Input.displayName = 'Input';

// ─── SearchInput ────────────────────────────────────────────────────
interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export function SearchInput({ className = '', value, onClear, ...props }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
      <input
        type="search"
        value={value}
        {...props}
        className="w-full pl-9 pr-8 py-2 text-xs rounded-md border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-600)] focus:border-[var(--color-primary-600)] transition-colors"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] p-0.5 rounded"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// ─── Select ────────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      {...props}
      className={`w-full px-3 py-2 text-xs rounded-md border bg-white text-[var(--color-text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-600)] focus:border-[var(--color-primary-600)] transition-colors cursor-pointer disabled:opacity-50 ${
        error ? 'border-neutral-900' : 'border-[var(--color-border)]'
      } ${className}`}
    >
      {children}
    </select>
  )
);
Select.displayName = 'Select';

// ─── Textarea ────────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      {...props}
      className={`w-full px-3 py-2 text-xs rounded-md border bg-white text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary-600)] focus:border-[var(--color-primary-600)] transition-colors resize-y min-h-[80px] ${
        error ? 'border-neutral-900' : 'border-[var(--color-border)]'
      } ${className}`}
    />
  )
);
Textarea.displayName = 'Textarea';

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 active:scale-[0.99] focus-visible:ring-indigo-500 disabled:bg-indigo-300',
  secondary:
    'bg-white text-slate-700 border border-slate-200 shadow-xs hover:bg-slate-50 active:scale-[0.99] focus-visible:ring-slate-300 disabled:opacity-50',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.99] focus-visible:ring-red-500 disabled:bg-red-300',
  ghost:
    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.99] focus-visible:ring-slate-300 disabled:opacity-40',
  outline:
    'border border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-[0.99] focus-visible:ring-indigo-400 disabled:opacity-50',
  emerald:
    'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 active:scale-[0.99] focus-visible:ring-emerald-500 disabled:bg-emerald-300',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
  lg: 'px-6 py-3 text-base font-bold rounded-xl gap-2.5',
};

const Button = forwardRef(function Button(
  {
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    icon: Icon,
    iconPosition = 'left',
    ...props
  },
  ref
) {
  const baseClasses =
    'inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed';
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden="true" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
          )}
        </>
      )}
    </button>
  );
});

export default Button;

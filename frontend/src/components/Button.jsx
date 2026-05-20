export default function Button({
  onClick,
  disabled,
  className = '',
  children,
  variant = 'primary',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl px-8 py-3 font-semibold tracking-tight transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 disabled:active:scale-100';

  const variants = {
    primary:
      'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/40 focus-visible:ring-emerald-400',
    warning:
      'bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-500/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/40 focus-visible:ring-amber-400',
    secondary:
      'bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300 focus-visible:ring-slate-300',
  };

  const combinedClassName = `${baseStyles} ${variants[variant] || variants.primary} ${className}`.trim();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={combinedClassName}
      {...props}
    >
      {children}
    </button>
  );
}

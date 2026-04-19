export default function Button({
  onClick,
  disabled,
  className = '',
  children,
  variant = 'primary',
  ...props
}) {
  const baseStyles = 'rounded-lg px-8 py-3 font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
    warning: 'bg-amber-500 text-white hover:bg-amber-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
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
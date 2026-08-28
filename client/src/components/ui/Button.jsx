import { Link } from 'react-router-dom';

const variants = {
  primary:
    'bg-solar-600 text-white hover:bg-solar-700 shadow-sm shadow-solar-600/20',
  secondary:
    'border border-solar-600 text-solar-700 bg-white hover:bg-solar-50',
  white: 'bg-white text-solar-700 hover:bg-solar-50 shadow-sm',
  dark: 'bg-charcoal text-white hover:bg-charcoal-light',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3.5 text-base',
};

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

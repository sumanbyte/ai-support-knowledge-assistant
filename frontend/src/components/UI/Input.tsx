import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      icon,
      variant = 'default',
      size = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'w-full bg-transparent font-sans transition-smooth focus:outline-none placeholder-text-muted';

    const variantStyles = {
      default: 'border-b border-text-outline text-text-primary focus:border-primary focus:text-primary',
      glass: 'glass-card px-4 py-2 border-text-outline text-text-primary focus:border-primary focus:text-primary focus:ring-1 focus:ring-primary focus:ring-opacity-50',
    };

    const sizeStyles = {
      sm: 'text-sm py-1.5 px-2',
      md: 'text-base py-2 px-3',
      lg: 'text-lg py-3 px-4',
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-label-sm text-text-secondary mb-2 font-mono">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</div>}
          <input
            ref={ref}
            className={cn(
              baseStyles,
              variantStyles[variant],
              sizeStyles[size],
              icon ? 'pl-10' : undefined,
              error && 'border-error text-error',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-label-sm text-error mt-1 font-mono">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

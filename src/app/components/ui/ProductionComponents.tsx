/**
 * ═══════════════════════════════════════════════════════════════════════════
 * PRODUCTION UI COMPONENT LIBRARY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Reusable, fully styled components for consistent UI across the application
 * All components include dark mode, responsive design, and accessibility
 */

import React from 'react';
import { cn } from '@/app/lib/utils';

/**
 * BUTTON COMPONENT - Fully featured with variants and sizes
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading = false, children, disabled, className, ...props }, ref) => {
    const baseStyles = 'font-semibold transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantStyles = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600 focus:ring-slate-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      ghost: 'bg-transparent text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500',
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      >
        {isLoading ? '...' : children}
      </button>
    );
  }
);

Button.displayName = 'Button';

/**
 * INPUT COMPONENT - Text, email, password with label and validation
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-900 dark:text-white mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 text-base border-2 rounded-lg',
            'bg-white dark:bg-slate-900',
            'text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400',
            'border-slate-300 dark:border-slate-700',
            'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30',
            'disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/30',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/**
 * CARD COMPONENT - Container for content with proper spacing and styling
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ title, description, children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700',
          'p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow',
          className
        )}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * MODAL COMPONENT - Dialog with backdrop
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  actions,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={cn(
            'bg-white dark:bg-slate-900 rounded-lg shadow-xl',
            'w-full max-w-2xl',
            sizeClasses[size]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {title && (
            <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
            </div>
          )}
          
          {/* Content */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            {children}
          </div>
          
          {/* Actions */}
          {actions && (
            <div className="border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex justify-end gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

/**
 * BADGE COMPONENT - Small label/status indicator
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'primary', className, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
      success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
      warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
      danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
      neutral: 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

/**
 * ALERT COMPONENT - Information, warning, error, success messages
 */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  onClose?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ type = 'info', title, children, onClose, className, ...props }, ref) => {
    const typeStyles = {
      info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
      error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    };

    const textStyles = {
      info: 'text-blue-800 dark:text-blue-200',
      success: 'text-green-800 dark:text-green-200',
      warning: 'text-yellow-800 dark:text-yellow-200',
      error: 'text-red-800 dark:text-red-200',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'border rounded-lg p-4 flex items-start gap-3',
          typeStyles[type],
          className
        )}
        {...props}
      >
        <div className="flex-1">
          {title && <h3 className={cn('font-semibold', textStyles[type])}>{title}</h3>}
          <p className={cn('text-sm', textStyles[type])}>{children}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={cn('text-xl leading-none hover:opacity-70', textStyles[type])}
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

/**
 * DIVIDER COMPONENT - Visual separator
 */
export const Divider = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn(
        'border-0 border-t border-slate-200 dark:border-slate-700',
        className
      )}
      {...props}
    />
  )
);

Divider.displayName = 'Divider';

/**
 * LOADING SPINNER COMPONENT
 */
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'border-4 border-slate-300 dark:border-slate-600 border-t-blue-500 rounded-full animate-spin',
          sizeClasses[size]
        )}
      />
    </div>
  );
};

/**
 * TYPOGRAPHY COMPONENTS
 */

export const H1: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h1 className={cn('text-4xl md:text-5xl font-bold leading-tight text-slate-900 dark:text-white', className)} {...props} />
);

export const H2: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h2 className={cn('text-3xl md:text-4xl font-bold leading-tight text-slate-900 dark:text-white', className)} {...props} />
);

export const H3: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={cn('text-2xl md:text-3xl font-semibold leading-snug text-slate-900 dark:text-white', className)} {...props} />
);

export const H4: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h4 className={cn('text-xl md:text-2xl font-semibold leading-snug text-slate-900 dark:text-white', className)} {...props} />
);

export const H5: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h5 className={cn('text-lg md:text-xl font-semibold leading-relaxed text-slate-900 dark:text-white', className)} {...props} />
);

export const H6: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h6 className={cn('text-base md:text-lg font-semibold leading-relaxed text-slate-900 dark:text-white', className)} {...props} />
);

export const Body: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-base leading-relaxed text-slate-700 dark:text-slate-200', className)} {...props} />
);

export const BodySmall: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={cn('text-sm leading-relaxed text-slate-700 dark:text-slate-200', className)} {...props} />
);

export const TextSecondary: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span className={cn('text-sm text-slate-600 dark:text-slate-300', className)} {...props} />
);

export const TextMuted: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({ className, ...props }) => (
  <span className={cn('text-xs text-slate-500 dark:text-slate-400', className)} {...props} />
);

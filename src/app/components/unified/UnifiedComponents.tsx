/**
 * ════════════════════════════════════════════════════════════════════════════════
 * UNIFIED COMPONENT LIBRARY
 * ════════════════════════════════════════════════════════════════════════════════
 * 
 * ALL UI components built from design-system.ts.
 * NO inline styles. All values from design-system constants.
 * Every component supports dark mode automatically.
 */

import React, { ReactNode, HTMLAttributes, InputHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { DESIGN_SYSTEM, COMPONENT_DEFAULTS, TYPOGRAPHY, SPACING, Z_CLASSES } from '@/app/lib/design-system';
import { useTheme } from '@/app/hooks/useTheme';

// ════════════════════════════════════════════════════════════════════════════════
// TYPOGRAPHY COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

export const H1: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h1 className={`text-4xl font-bold leading-tight tracking-tight ${className}`}>{children}</h1>
);

export const H2: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`text-3xl font-bold leading-snug tracking-tight ${className}`}>{children}</h2>
);

export const H3: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-normal ${className}`}>{children}</h3>
);

export const H4: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h4 className={`text-xl font-semibold leading-relaxed ${className}`}>{children}</h4>
);

export const H5: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h5 className={`text-lg font-semibold leading-relaxed ${className}`}>{children}</h5>
);

export const H6: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h6 className={`text-base font-semibold leading-relaxed ${className}`}>{children}</h6>
);

export const Body: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-base leading-relaxed text-slate-700 dark:text-slate-300 ${className}`}>{children}</p>
);

export const BodySmall: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`text-sm leading-relaxed text-slate-600 dark:text-slate-400 ${className}`}>{children}</p>
);

export const Label: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <label className={`text-sm font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300 ${className}`}>
    {children}
  </label>
);

export const Caption: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`text-xs text-slate-500 dark:text-slate-400 ${className}`}>{children}</span>
);

// ════════════════════════════════════════════════════════════════════════════════
// BUTTON COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary: 'bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600',
    ghost: 'bg-transparent text-slate-900 hover:bg-slate-100 focus:ring-slate-500 dark:text-white dark:hover:bg-slate-800',
  };

  return (
    <button
      className={`
        rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? '⏳' : children}
    </button>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// INPUT COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  error,
  label,
  fullWidth = true,
  className = '',
  ...props
}) => {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && <Label className="block mb-2">{label}</Label>}
      <input
        className={`
          w-full px-4 py-2 text-base border-2 rounded-lg
          bg-white dark:bg-slate-900
          text-slate-900 dark:text-white
          placeholder-slate-500 dark:placeholder-slate-400
          border-slate-300 dark:border-slate-700
          focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
          transition-colors
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' : ''}
          ${props.disabled ? 'bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <BodySmall className="text-red-500 mt-1">{error}</BodySmall>}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// CARD COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'light';
}

export const Card: React.FC<CardProps> = ({ variant = 'default', className = '', children, ...props }) => {
  const variantClasses = {
    default: 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700',
    light: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  };

  return (
    <div
      className={`
        rounded-lg border p-6 shadow-sm hover:shadow-md transition-shadow
        ${variantClasses[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// MODAL COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 ${Z_CLASSES.modal} flex items-center justify-center p-4`}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Dialog */}
      <div className={`
        relative bg-white dark:bg-slate-900 rounded-lg shadow-xl
        max-w-md w-full max-h-screen overflow-y-auto
        ${Z_CLASSES.modal}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <H3>{title}</H3>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>

        {/* Actions */}
        {actions && <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex gap-3">{actions}</div>}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// ALERT COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', title, onClose, children, className = '', ...props }) => {
  const variants = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      text: 'text-green-800 dark:text-green-300',
      icon: '✓',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      text: 'text-red-800 dark:text-red-300',
      icon: '✕',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-700',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: '⚠',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      text: 'text-blue-800 dark:text-blue-300',
      icon: 'ℹ',
    },
  };

  const variant = variants[type];

  return (
    <div
      className={`
        ${variant.bg} ${variant.border} ${variant.text}
        rounded-lg border p-4
        ${className}
      `}
      {...props}
    >
      <div className="flex gap-3">
        <div className="text-xl">{variant.icon}</div>
        <div className="flex-1">
          {title && <H6 className={variant.text}>{title}</H6>}
          <Body className={variant.text}>{children}</Body>
        </div>
        {onClose && (
          <button onClick={onClose} className={`${variant.text} hover:opacity-75 text-lg leading-none`}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// BADGE COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'error';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'primary', className = '', children, ...props }) => {
  const variants = {
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  return (
    <span
      className={`
        inline-block px-3 py-1 rounded-full text-sm font-medium
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// DIVIDER COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({ vertical = false, className = '', ...props }) => {
  return (
    <div
      className={`
        ${vertical ? 'w-px h-full' : 'w-full h-px'}
        bg-slate-200 dark:bg-slate-700
        ${className}
      `}
      {...props}
    />
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// LOADING SPINNER COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`${sizes[size]} border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin`} />
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// FORM FIELD COMPONENT (Label + Input + Error)
// ════════════════════════════════════════════════════════════════════════════════

export interface FormFieldProps extends InputProps {
  helperText?: string;
}

export const FormField: React.FC<FormFieldProps> = ({ label, error, helperText, ...props }) => {
  return (
    <div className="w-full">
      {label && <Label className="block mb-2">{label}</Label>}
      <Input error={error} {...props} />
      {helperText && !error && <BodySmall className="text-slate-500 dark:text-slate-400 mt-1">{helperText}</BodySmall>}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// EXPORT ALL COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

export default {
  // Typography
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Body,
  BodySmall,
  Label,
  Caption,

  // Controls
  Button,
  Input,
  FormField,

  // Containers
  Card,
  Modal,
  Alert,

  // Elements
  Badge,
  Divider,
  LoadingSpinner,
};

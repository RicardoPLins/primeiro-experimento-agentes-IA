import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
}

const variants = {
  primary: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-cyan-100 text-cyan-700',
  gray: 'bg-gray-100 text-gray-700',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs font-medium',
  md: 'px-3 py-1 text-sm font-medium',
  lg: 'px-4 py-2 text-base font-medium',
};

export const Badge: FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
}) => {
  return (
    <span className={clsx('rounded-full inline-flex items-center gap-1', variants[variant], sizes[size])}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};

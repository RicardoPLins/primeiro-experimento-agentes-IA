import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
}

export const Input: FC<InputProps> = ({
  label,
  error,
  icon,
  helperText,
  className,
  ...props
}) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}
      <input
        className={clsx(
          'w-full rounded-lg border px-4 py-2 transition-all',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-100 disabled:text-gray-500',
          icon ? 'pl-10' : '',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    {helperText && <p className="text-sm text-gray-500 mt-1">{helperText}</p>}
  </div>
);

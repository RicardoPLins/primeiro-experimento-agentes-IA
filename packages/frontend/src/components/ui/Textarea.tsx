import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  helperText?: string;
  maxLength?: number;
}

export const Textarea: FC<TextareaProps> = ({
  label,
  error,
  helperText,
  maxLength,
  value,
  className,
  ...props
}) => {
  const charCount = typeof value === 'string' ? value.length : 0;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={clsx(
          'w-full rounded-lg border px-4 py-2 transition-all resize-none',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-100 disabled:text-gray-500',
          error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
          className
        )}
        maxLength={maxLength}
        value={value}
        {...props}
      />
      <div className="flex justify-between items-center mt-1">
        <div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {helperText && <p className="text-sm text-gray-500">{helperText}</p>}
        </div>
        {maxLength && <p className="text-xs text-gray-500">{charCount}/{maxLength}</p>}
      </div>
    </div>
  );
};

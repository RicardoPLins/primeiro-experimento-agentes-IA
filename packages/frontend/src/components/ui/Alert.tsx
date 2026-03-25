import { FC, ReactNode } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  onClose?: () => void;
  actions?: ReactNode;
}

const alertConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: CheckCircle,
    iconColor: 'text-green-600',
    title: 'text-green-900',
    text: 'text-green-700',
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: AlertCircle,
    iconColor: 'text-red-600',
    title: 'text-red-900',
    text: 'text-red-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: Info,
    iconColor: 'text-blue-600',
    title: 'text-blue-900',
    text: 'text-blue-700',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: AlertCircle,
    iconColor: 'text-yellow-600',
    title: 'text-yellow-900',
    text: 'text-yellow-700',
  },
};

export const Alert: FC<AlertProps> = ({ type, title, message, onClose, actions }) => {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border ${config.border} rounded-lg p-4 flex gap-4`}>
      <Icon className={`w-6 h-6 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1">
        <h3 className={`font-semibold ${config.title}`}>{title}</h3>
        <p className={`text-sm mt-1 ${config.text}`}>{message}</p>
        {actions && <div className="mt-3 flex gap-2">{actions}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

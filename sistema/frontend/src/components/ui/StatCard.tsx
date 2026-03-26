import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
}

const colorClasses = {
  blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
  green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
  purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
  orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
  red: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
  cyan: 'bg-gradient-to-br from-cyan-50 to-cyan-100 border-cyan-200',
};

const iconColorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600',
  red: 'text-red-600',
  cyan: 'text-cyan-600',
};

const trendClasses = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-600',
};

export const StatCard: FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  trendValue,
  color = 'blue',
}) => {
  return (
    <div className={clsx('rounded-xl border p-6 shadow-sm transition-all hover:shadow-md', colorClasses[color])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && trendValue && (
            <p className={clsx('text-xs font-semibold mt-2', trendClasses[trend])}>
              {trend === 'up' && '↑'}
              {trend === 'down' && '↓'}
              {trend === 'neutral' && '→'} {trendValue}
            </p>
          )}
        </div>
        {icon && <div className={clsx('text-3xl', iconColorClasses[color])}>{icon}</div>}
      </div>
    </div>
  );
};

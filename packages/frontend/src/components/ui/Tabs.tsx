import { FC, ReactNode } from 'react';
import clsx from 'clsx';

interface TabItem {
  label: string;
  value: string;
  icon?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  activeTab: string;
  onTabChange: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

const variants = {
  default: 'flex gap-2 border-b border-gray-200',
  pills: 'flex gap-2 bg-gray-100 p-1 rounded-lg',
  underline: 'flex gap-6 border-b border-gray-200',
};

const tabClasses = {
  default: {
    active: 'border-b-2 border-blue-600 text-blue-600 font-semibold',
    inactive: 'text-gray-600 hover:text-gray-900',
    base: 'px-4 py-2 transition-colors cursor-pointer flex items-center gap-2',
  },
  pills: {
    active: 'bg-white text-blue-600 font-medium rounded-md shadow-sm',
    inactive: 'text-gray-600 hover:text-gray-900',
    base: 'px-4 py-2 transition-colors cursor-pointer rounded-md flex items-center gap-2',
  },
  underline: {
    active: 'border-b-2 border-blue-600 text-blue-600 font-semibold',
    inactive: 'text-gray-600 hover:text-gray-900',
    base: 'pb-3 transition-colors cursor-pointer flex items-center gap-2',
  },
};

export const Tabs: FC<TabsProps> = ({
  items,
  activeTab,
  onTabChange,
  variant = 'default',
}) => {
  return (
    <div className={variants[variant]}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onTabChange(item.value)}
          className={clsx(
            tabClasses[variant].base,
            activeTab === item.value
              ? tabClasses[variant].active
              : tabClasses[variant].inactive
          )}
        >
          {item.icon && <span>{item.icon}</span>}
          {item.label}
        </button>
      ))}
    </div>
  );
};

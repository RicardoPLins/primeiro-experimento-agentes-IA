import { FC, ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

interface DropdownItem {
  label: string;
  value: string;
  icon?: ReactNode;
  divider?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  onSelect: (value: string) => void;
  trigger?: ReactNode;
  defaultValue?: string;
}

export const Dropdown: FC<DropdownProps> = ({
  items,
  onSelect,
  trigger,
  defaultValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue || items[0]?.value);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setIsOpen(false);
  };

  const selectedItem = items.find((item) => item.value === selected);

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'w-full px-4 py-2 rounded-lg border border-gray-300 text-left',
          'flex items-center justify-between gap-2',
          'bg-white hover:bg-gray-50 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-blue-500'
        )}
      >
        <span className="flex-1">
          {trigger || (
            <span className="flex items-center gap-2">
              {selectedItem?.icon && <span>{selectedItem.icon}</span>}
              {selectedItem?.label}
            </span>
          )}
        </span>
        <ChevronDown
          className={clsx('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {items.map((item, idx) => (
            <div key={idx}>
              {item.divider && <div className="border-t border-gray-200" />}
              <button
                onClick={() => handleSelect(item.value)}
                className={clsx(
                  'w-full px-4 py-2 text-left text-sm transition-colors',
                  'hover:bg-blue-50 flex items-center gap-2',
                  selected === item.value && 'bg-blue-50 text-blue-600 font-medium'
                )}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

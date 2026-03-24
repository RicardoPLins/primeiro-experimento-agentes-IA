import { FC } from 'react';
import { useUiStore } from '../store/uiStore';

export const Toast: FC = () => {
  const { toast } = useUiStore();

  if (!toast) return null;

  const bgColor =
    toast.type === 'success'
      ? 'bg-green-500'
      : toast.type === 'error'
        ? 'bg-red-500'
        : 'bg-blue-500';

  return (
    <div className={`fixed bottom-4 right-4 text-white px-6 py-3 rounded-lg shadow-lg ${bgColor}`}>
      {toast.message}
    </div>
  );
};

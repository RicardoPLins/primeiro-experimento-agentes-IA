import { FC } from 'react';
import { useUiStore } from '../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Info, XCircle, X } from 'lucide-react';

export const Toast: FC = () => {
  const { toast, hideToast } = useUiStore();

  if (!toast) return null;

  const config = {
    success: {
      bg: 'bg-green-500',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-500',
      icon: XCircle,
    },
    info: {
      bg: 'bg-blue-500',
      icon: Info,
    },
  };

  const Icon = config[toast.type].icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 20, x: 20 }}
        transition={{ duration: 0.3 }}
        className={`fixed bottom-4 right-4 ${config[toast.type].bg} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="flex-1">{toast.message}</p>
        <button
          onClick={hideToast}
          className="flex-shrink-0 hover:opacity-80 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

import { FC } from 'react';
import { useUiStore } from '../store/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, IconButton } from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

export const Toast: FC = () => {
  const { toast, hideToast } = useUiStore();

  if (!toast) return null;

  const config = {
    success: {
      severity: 'success' as const,
      icon: <CheckCircleIcon />,
    },
    error: {
      severity: 'error' as const,
      icon: <ErrorIcon />,
    },
    info: {
      severity: 'info' as const,
      icon: <InfoIcon />,
    },
  };

  const currentConfig = config[toast.type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        exit={{ opacity: 0, y: 20, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Alert
          severity={currentConfig.severity}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={hideToast}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            maxWidth: 400,
            boxShadow: 2,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {toast.message}
        </Alert>
      </motion.div>
    </AnimatePresence>
  );
};

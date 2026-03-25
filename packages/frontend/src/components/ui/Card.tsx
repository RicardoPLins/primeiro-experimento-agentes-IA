import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  animated?: boolean;
}

export const Card: FC<CardProps> = ({
  children,
  className = '',
  hover = true,
  animated = false,
}) => {
  const content = (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 ${
        hover ? 'hover:shadow-md transition-shadow' : ''
      } ${className}`}
    >
      {children}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

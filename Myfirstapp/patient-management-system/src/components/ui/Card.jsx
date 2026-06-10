import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md',
  onClick 
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 ${paddings[padding]} ${hover ? 'cursor-pointer hover:shadow-md transition-all' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Card sub-components
export const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-800 ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;
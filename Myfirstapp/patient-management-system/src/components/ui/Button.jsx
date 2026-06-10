import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  disabled, 
  onClick, 
  type = 'button',
  className = '',
  fullWidth = false
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    success: 'bg-green-600 text-white hover:bg-green-700',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
    ghost: 'text-gray-600 hover:bg-gray-100'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} rounded-lg font-medium transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      )}
      <span>{children}</span>
    </motion.button>
  );
};

export default Button;
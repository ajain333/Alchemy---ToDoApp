
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  let baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  if (variant === 'primary') {
    baseStyles += ' bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
  } else if (variant === 'secondary') {
    baseStyles += ' bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400';
  } else if (variant === 'danger') {
    baseStyles += ' bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
  }

  return (
    <button className={`${baseStyles} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;

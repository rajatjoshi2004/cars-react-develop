import React from 'react';

interface ResponsiveButtonProps {
  text: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
}

const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  text,
  onClick,
  active = false,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-full transition-colors text-sm ${className}`}
    >
      <span className={`inline-block w-3 h-3 rounded-full ${active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
      <span>{text}</span>
    </button>
  );
};

export default ResponsiveButton;
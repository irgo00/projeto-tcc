import React, { type InputHTMLAttributes, type ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  error,
  icon: Icon,
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-gray-700 font-medium mb-2">
          {Icon && <Icon className="inline w-4 h-4 mr-1" />}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        type={type}
        className={`
          w-full px-4 py-3 border rounded-lg
          focus:ring-2 focus:ring-purple-500 focus:border-transparent
          transition-colors
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        {...props}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default Input;

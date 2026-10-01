import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm text-gray-300">{label}</label>}
        <input
          ref={ref}
          className={`bg-dark-700 border rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:border-primary-500 focus:outline-none transition-colors ${
            error ? 'border-red-500' : 'border-gray-600'
          } ${className}`}
          {...props}
        />
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

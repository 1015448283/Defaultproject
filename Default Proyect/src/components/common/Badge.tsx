import React from 'react';

export interface BadgeProps {
  variant: string;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    success: 'bg-green-600/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-600/20 text-yellow-400 border border-yellow-500/30',
    error: 'bg-red-600/20 text-red-400 border border-red-500/30',
    info: 'bg-blue-600/20 text-blue-400 border border-blue-500/30',
    pending: 'bg-gray-600/20 text-gray-400 border border-gray-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || 'bg-gray-600 text-white'} ${className}`}>
      {children}
    </span>
  );
}

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <div className={`bg-dark-800 border border-dark-700 rounded-xl p-6 ${className}`}>{children}</div>;
}

// Re-export Badge and Button for backward compatibility with existing imports
export { Badge } from './Badge';
export { Button } from './Button';

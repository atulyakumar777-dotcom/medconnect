import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-gray-300 bg-white", className)}>
      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6 text-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, color = 'blue', className }: StatsCardProps) {
  const colorStyles = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className={cn("bg-white rounded-xl border border-gray-100 p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={cn("p-2 rounded-lg", colorStyles[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <span className={cn(
            "text-sm font-medium",
            trend.startsWith('+') ? "text-green-600" : trend.startsWith('-') ? "text-red-600" : "text-gray-500"
          )}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

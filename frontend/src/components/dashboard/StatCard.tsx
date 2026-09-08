import React from 'react';
import { Card } from '../ui/Card';

export interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  hint?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, hint }) => {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-muted">{label}</span>
        <div className="p-2 rounded-xl bg-gray-50 border border-edge text-brand-600">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <span className="text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          {value}
        </span>
        {hint && <p className="text-[11px] text-ink-muted mt-1">{hint}</p>}
      </div>
    </Card>
  );
};

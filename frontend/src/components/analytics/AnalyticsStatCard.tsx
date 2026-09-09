import React from 'react';

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  badge?: string;
  badgeColor?: string;
}

export const AnalyticsStatCard: React.FC<AnalyticsStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor = 'bg-brand-50 text-brand-600 border-brand-100',
  badge,
  badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200',
}) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-edge shadow-card flex flex-col justify-between space-y-3 transition-all hover:shadow-elevated">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-xl border ${iconBgColor}`}>{icon}</div>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            {value}
          </span>
          {badge && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}
            >
              {badge}
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
      </div>
    </div>
  );
};

export default AnalyticsStatCard;

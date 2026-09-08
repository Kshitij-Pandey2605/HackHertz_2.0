import React, { useState } from 'react';
import { Calendar, Clock, Flame } from 'lucide-react';
import { DailyActivityItem } from '../../types';

interface ActivityChartProps {
  data: DailyActivityItem[];
  period: '7d' | '30d' | 'all';
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data, period }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 60);
  const totalMinutes = data.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="bg-white border border-edge rounded-2xl p-6 shadow-card space-y-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-edge/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-brand-50 text-brand-600 border border-brand-100">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-ink">Study Activity</h3>
          </div>
          <p className="text-xs text-ink-muted mt-0.5">
            {period === '7d'
              ? 'Daily active revision time across the past 7 days'
              : 'Weekly study consistency across this period'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-xl">
          <Clock className="w-3.5 h-3.5" />
          <span>{totalHours}h Total ({totalMinutes} mins)</span>
        </div>
      </div>

      {/* Responsive Bar Visualizer */}
      <div className="space-y-2">
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
          {data.map((item, idx) => {
            const heightPercent = Math.max(Math.round((item.minutes / maxMinutes) * 100), 8);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center h-full justify-end group relative"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] rounded-xl py-1.5 px-2.5 shadow-elevated whitespace-nowrap pointer-events-none animate-fadeIn flex flex-col items-center">
                    <span className="font-bold">{item.minutes} mins</span>
                    <span className="text-[10px] text-slate-300">{item.sessions} sessions</span>
                    <div className="w-2 h-2 bg-slate-900 rotate-45 -mb-1 mt-0.5" />
                  </div>
                )}

                {/* Bar */}
                <div className="w-full max-w-[36px] flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-xl transition-all duration-300 ${
                      isHovered
                        ? 'bg-brand-600 shadow-md scale-y-105'
                        : item.minutes >= 60
                        ? 'bg-gradient-to-t from-brand-600 to-indigo-500'
                        : item.minutes >= 30
                        ? 'bg-brand-400'
                        : 'bg-brand-200'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 border-t border-edge pt-2 px-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex-1 text-center">
              <span
                className={`text-[11px] font-semibold block truncate ${
                  hoveredIndex === idx ? 'text-brand-600 font-bold' : 'text-ink-muted'
                }`}
              >
                {item.day}
              </span>
              <span className="text-[10px] text-ink-muted/70 block hidden sm:block">
                {item.minutes}m
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Chart Footer Legend */}
      <div className="flex items-center justify-between text-[11px] text-ink-muted pt-2 border-t border-edge/40">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-brand-200" />
            <span>&lt;30 mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-brand-400" />
            <span>30-60 mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-brand-600" />
            <span>60+ mins</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-emerald-700 font-medium">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>Active Streak: 4 Days</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityChart;

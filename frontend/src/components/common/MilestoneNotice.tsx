import React from 'react';
import { Calendar, Layers } from 'lucide-react';

interface MilestoneNoticeProps {
  currentMilestone: string;
  plannedMilestone: string;
  description: string;
}

export const MilestoneNotice: React.FC<MilestoneNoticeProps> = ({
  currentMilestone,
  plannedMilestone,
  description,
}) => {
  return (
    <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-50/40 dark:bg-sky-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 shrink-0">
          <Layers className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">
              {currentMilestone}
            </span>
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              Interactive Prototype
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium shrink-0 self-start sm:self-auto pl-9 sm:pl-0">
        <Calendar className="w-3.5 h-3.5 text-sky-500" />
        <span>Full Integration: <strong>{plannedMilestone}</strong></span>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Loader2, 
  FileText,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

interface BadgeProps {
  status: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'sm', showIcon = true }) => {
  const normalized = status.toUpperCase();

  let styles = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  let icon = <FileText className="w-3 h-3" />;
  let label = status.replace(/_/g, ' ');

  switch (normalized) {
    case 'VERIFIED':
    case 'PASS':
    case 'ACTIVE_ISSUED':
    case 'APPROVED':
      styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60';
      icon = <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />;
      break;

    case 'FLAGGED':
    case 'WARN':
    case 'WARNING':
    case 'EXPIRED':
    case 'HIGH':
      styles = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60';
      icon = <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />;
      break;

    case 'REJECTED':
    case 'FAIL':
    case 'REVOKED':
    case 'RECORD_NOT_FOUND':
    case 'BLOCKING':
      styles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60';
      icon = <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />;
      break;

    case 'UNDER_REVIEW':
    case 'IN_REVIEW':
    case 'MANUAL_REVIEW_REQUIRED':
    case 'MEDIUM':
      styles = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60';
      icon = <Clock className="w-3 h-3 text-sky-600 dark:text-sky-400" />;
      break;

    case 'PROCESSING':
      styles = 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60';
      icon = <Loader2 className="w-3 h-3 animate-spin text-indigo-600 dark:text-indigo-400" />;
      break;

    case 'OPEN':
      styles = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800/60';
      icon = <ShieldAlert className="w-3 h-3 text-purple-600 dark:text-purple-400" />;
      break;

    case 'LOW':
    case 'INFO':
      styles = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      icon = <CheckCircle2 className="w-3 h-3 text-slate-500" />;
      break;
  }

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${sizeClasses} ${styles}`}>
      {showIcon && icon}
      <span className="capitalize">{label}</span>
    </span>
  );
};

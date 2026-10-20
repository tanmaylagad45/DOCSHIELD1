import React, { useState } from 'react';
import { 
  History, 
  Search, 
  UserCheck, 
  Cpu, 
  Clock 
} from 'lucide-react';
import { initialAuditLogs } from '../services/mockData';
import type { AuditLog } from '../types';
import { MilestoneNotice } from '../components/common/MilestoneNotice';

export const AuditView: React.FC = () => {
  const [logs] = useState<AuditLog[]>(initialAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(
    (l) =>
      l.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <MilestoneNotice
        currentMilestone="Milestone 2 Frontend Prototype"
        plannedMilestone="Milestone 10 (FastAPI Persistent Audit Logging)"
        description="Chronological event log tracking automated system extractions, scoring, and reviewer decisions."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-sky-500" />
            <span>Immutable Audit Trail</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cryptographically tracked timeline of all document extractions, evaluations, and reviewer actions.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/40"
          />
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs p-6">
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 space-y-6">
          {filteredLogs.map((log) => {
            const isSystem = log.actor.toLowerCase().includes('engine') || log.actor.toLowerCase().includes('worker') || log.actor.toLowerCase().includes('pipeline');

            return (
              <div key={log.id} className="relative pl-6 space-y-1">
                {/* Timeline node */}
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${isSystem ? 'bg-indigo-500' : 'bg-emerald-500'}`} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                      {log.action}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {log.entityType}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {log.details}
                </p>

                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  {isSystem ? <Cpu className="w-3 h-3 text-indigo-400" /> : <UserCheck className="w-3 h-3 text-emerald-400" />}
                  <span>Actor: <strong className="text-slate-600 dark:text-slate-400 font-medium">{log.actor}</strong></span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  ShieldAlert, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  MessageSquare, 
  Clock, 
  UserCheck 
} from 'lucide-react';
import type { Case, DocumentItem } from '../types';
import type { AppOutletContext } from '../components/layout/AppLayout';
import { Badge } from '../components/common/Badge';
import { MilestoneNotice } from '../components/common/MilestoneNotice';

interface CasesViewProps {
  cases?: Case[];
  documents?: DocumentItem[];
  onSelectDocument?: (doc: DocumentItem) => void;
  onUpdateCaseStatus?: (caseId: string, newStatus: Case['status']) => void;
}

export const CasesView: React.FC<CasesViewProps> = (props) => {
  const outlet = useOutletContext<AppOutletContext | undefined>();

  const cases = props.cases || outlet?.cases || [];
  const documents = props.documents || outlet?.documents || [];
  const onSelectDocument = props.onSelectDocument || outlet?.onSelectDocument || (() => {});
  const onUpdateCaseStatus = props.onUpdateCaseStatus || outlet?.onUpdateCaseStatus || (() => {});

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const filteredCases = cases.filter((c) => {
    return selectedStatus === 'ALL' || c.status === selectedStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <MilestoneNotice
        currentMilestone="Milestone 2 Frontend Prototype"
        plannedMilestone="Milestone 10 (FastAPI Case Management & Audit Trail)"
        description="Manual adjudication queue with reviewer overrides and persistent notes."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <span>Case Management & Manual Review</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Adjudicate ambiguous documents, investigate tamper flags, and record audit decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-sky-500/40"
          >
            <option value="ALL">All Active Cases</option>
            <option value="OPEN">Open</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Cases Queue Cards */}
      <div className="space-y-4">
        {filteredCases.map((c) => {
          const linkedDoc = documents.find((d) => d.id === c.documentId);

          return (
            <div
              key={c.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400">
                    {c.caseNumber}
                  </span>
                  <Badge status={c.status} size="sm" />
                  <Badge status={c.priority} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Created {new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Document details and Assignee */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {c.documentName}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Assigned to: <strong className="text-slate-700 dark:text-slate-300">{c.assignedTo}</strong></span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {linkedDoc && (
                    <button
                      onClick={() => onSelectDocument(linkedDoc)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <span>Inspect Document</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {c.status !== 'APPROVED' && (
                    <button
                      onClick={() => onUpdateCaseStatus(c.id, 'APPROVED')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {c.status !== 'REJECTED' && (
                    <button
                      onClick={() => onUpdateCaseStatus(c.id, 'REJECTED')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Case Notes History */}
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>Review Notes ({c.notes.length})</span>
                </span>
                <div className="space-y-1.5">
                  {c.notes.map((note) => (
                    <div 
                      key={note.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 flex items-start justify-between gap-3"
                    >
                      <div>
                        <strong className="text-slate-800 dark:text-slate-200">{note.author}:</strong> {note.text}
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                        {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

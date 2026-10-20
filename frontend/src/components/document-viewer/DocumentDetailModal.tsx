import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Scale, 
  Sparkles,
  ArrowRight,
  Send,
  Download
} from 'lucide-react';
import type { DocumentItem } from '../../types';
import { 
  mockExtractedFields, 
  mockVerificationRecords, 
  mockComplianceResults 
} from '../../services/mockData';
import { Badge } from '../common/Badge';
import { SimulationBanner } from '../common/SimulationBanner';

interface DocumentDetailModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onStatusChange?: (docId: string, newStatus: DocumentItem['status']) => void;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({ 
  document, 
  onClose,
  onStatusChange
}) => {
  const [activeTab, setActiveTab] = useState<'FIELDS' | 'AUTHENTICITY' | 'COMPLIANCE' | 'REVIEW'>('FIELDS');
  const [copiedHash, setCopiedHash] = useState(false);
  const [reviewerNote, setReviewerNote] = useState('');
  const [notesHistory, setNotesHistory] = useState<string[]>([
    'Automated extraction completed in 420ms.',
    'Simulated issuer adapter executed query against test registry.'
  ]);

  if (!document) return null;

  const fields = mockExtractedFields[document.id] || [];
  const verification = mockVerificationRecords[document.id];
  const compliance = mockComplianceResults[document.id] || [];

  const handleCopyHash = () => {
    navigator.clipboard.writeText(document.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerNote.trim()) return;
    setNotesHistory((prev) => [...prev, `[Reviewer]: ${reviewerNote.trim()}`]);
    setReviewerNote('');
  };

  const handleDecision = (status: DocumentItem['status']) => {
    if (onStatusChange) {
      onStatusChange(document.id, status);
    }
    setNotesHistory((prev) => [...prev, `[Status Updated]: Changed status to ${status}`]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-500">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {document.filename}
                </h3>
                <Badge status={document.status} size="sm" />
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {document.documentType}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span>ID: {document.id}</span>
                <span>•</span>
                <button 
                  onClick={handleCopyHash}
                  className="flex items-center gap-1 font-mono text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
                  title="Click to copy full SHA-256 hash"
                >
                  <span>SHA256: {document.sha256.slice(0, 12)}...</span>
                  {copiedHash ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Download report feature scheduled in Milestone 11 (PDF Generation).')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legal Simulation Disclaimer Banner */}
        <div className="px-6 pt-3 pb-1">
          <SimulationBanner compact />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('FIELDS')}
            className={`py-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'FIELDS'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Extracted Fields & OCR ({fields.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('AUTHENTICITY')}
            className={`py-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'AUTHENTICITY'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Explainable Authenticity ({document.authenticityScore || 0}%)</span>
          </button>

          <button
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`py-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'COMPLIANCE'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compliance Rules ({compliance.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('REVIEW')}
            className={`py-3 px-1 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REVIEW'
                ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Case Review & Actions</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: EXTRACTED FIELDS & OCR PREVIEW */}
          {activeTab === 'FIELDS' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Document Visualizer Mockup */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Synthetic Document Preview</span>
                  <span>Page 1 of 1</span>
                </div>
                <div className="relative aspect-3/4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
                  {/* Subtle document watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 dark:opacity-10 rotate-45 text-4xl font-black">
                    SYNTHETIC TEST
                  </div>

                  {/* Document Header representation */}
                  <div className="space-y-2 border-b border-slate-300 dark:border-slate-800 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-500 font-bold text-xs">
                        ID
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        OFFICIAL SAMPLE
                      </span>
                    </div>
                    <div className="h-3 w-3/4 bg-slate-300 dark:bg-slate-800 rounded-sm" />
                    <div className="h-2 w-1/2 bg-slate-200 dark:bg-slate-800/60 rounded-sm" />
                  </div>

                  {/* Visualizer bounding boxes */}
                  <div className="space-y-3 my-4">
                    <div className="p-2 rounded-lg border border-sky-500/50 bg-sky-500/10 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-sky-600 dark:text-sky-400 font-bold">
                        <span>FULL NAME BOUNDING BOX</span>
                        <span>98.4%</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {fields[0]?.fieldValue || 'JANE ELEANOR DOE'}
                      </p>
                    </div>

                    <div className="p-2 rounded-lg border border-emerald-500/50 bg-emerald-500/10 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        <span>DOCUMENT NUMBER</span>
                        <span>99.1%</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
                        {fields[1]?.fieldValue || 'P982410291'}
                      </p>
                    </div>

                    <div className="p-2 rounded-lg border border-indigo-500/50 bg-indigo-500/10 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                        <span>EXPIRY DATE</span>
                        <span>98.5%</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {fields[5]?.fieldValue || '2031-08-09'}
                      </p>
                    </div>
                  </div>

                  {/* MRZ Strip */}
                  <div className="p-2 rounded-lg bg-slate-200/80 dark:bg-slate-800/80 font-mono text-[9px] text-slate-700 dark:text-slate-300 tracking-widest break-all border border-slate-300 dark:border-slate-700">
                    P&lt;UTOPOEDOE&lt;&lt;JANE&lt;ELEANOR&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;<br/>
                    P9824102919UTO9205142F3108097&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;04
                  </div>
                </div>
              </div>

              {/* Extracted Fields Table */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">Extracted Field Attributes</span>
                  <span>{fields.length} normalized fields</span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-xs">
                  {fields.map((field) => (
                    <div key={field.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                            {field.fieldName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                            {field.fieldType}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white font-mono break-all">
                          {field.fieldValue}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Confidence Indicator */}
                        <div className="text-right">
                          <span className="text-[10px] font-semibold text-slate-400">OCR Confidence</span>
                          <p className={`text-xs font-bold ${field.confidence > 90 ? 'text-emerald-500' : field.confidence > 75 ? 'text-amber-500' : 'text-rose-500'}`}>
                            {field.confidence.toFixed(1)}%
                          </p>
                        </div>
                        {field.isConsistent ? (
                          <span title="Cross-field consistency verified">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </span>
                        ) : (
                          <span title="Consistency anomaly detected">
                            <AlertTriangle className="w-4 h-4 text-rose-500" />
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EXPLAINABLE AUTHENTICITY ASSESSMENT */}
          {activeTab === 'AUTHENTICITY' && verification && (
            <div className="space-y-6">
              {/* Score Highlight Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent border border-sky-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                    Calculated Authenticity Score
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {verification.authenticityScore}%
                    </span>
                    <Badge status={verification.recommendation} size="md" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Calculated from multi-signal heuristics including metadata integrity, OCR typography alignment, and simulated issuer check.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shrink-0 text-right sm:text-left">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Simulated Issuer Response
                  </span>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <Badge status={verification.simulatedIssuerStatus} size="sm" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Source: {verification.simulatedIssuerName}
                  </p>
                </div>
              </div>

              {/* Signals Breakdown Matrix */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Itemized Explainability Signals ({verification.signals.length})
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {verification.signals.map((sig) => (
                    <div 
                      key={sig.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                              {sig.title}
                            </h5>
                            <Badge status={sig.status} size="sm" />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">
                            Category: {sig.category} • Weight: {sig.weight}%
                          </span>
                        </div>
                        <span className={`text-xs font-bold ${sig.status === 'PASS' ? 'text-emerald-500' : sig.status === 'WARN' ? 'text-amber-500' : 'text-rose-500'}`}>
                          {sig.impact}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {sig.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REGULATORY COMPLIANCE RULES */}
          {activeTab === 'COMPLIANCE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold uppercase tracking-wider text-[11px]">
                  Evaluated Rules Engine Checklist
                </span>
                <span>{compliance.filter(c => c.status === 'PASS').length} of {compliance.length} Rules Passed</span>
              </div>

              <div className="space-y-3">
                {compliance.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                          {item.ruleCode}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                          {item.ruleName}
                        </h5>
                        <Badge status={item.severity} size="sm" />
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {item.message}
                      </p>
                      {item.remediation && (
                        <div className="mt-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span><strong>Recommended Action:</strong> {item.remediation}</span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0">
                      <Badge status={item.status} size="md" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CASE REVIEW & ACTIONS */}
          {activeTab === 'REVIEW' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Reviewer Decision Controls
                </h4>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleDecision('VERIFIED')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Document as Genuine</span>
                  </button>
                  <button
                    onClick={() => handleDecision('UNDER_REVIEW')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Assign to Manual Secondary Review</span>
                  </button>
                  <button
                    onClick={() => handleDecision('FLAGGED')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Flag & Request Resubmission</span>
                  </button>
                  <button
                    onClick={() => handleDecision('REJECTED')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject (Suspected Fraud)</span>
                  </button>
                </div>
              </div>

              {/* Reviewer Note Input */}
              <form onSubmit={handleAddNote} className="space-y-3">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Add Case Adjudication Note
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={reviewerNote}
                    onChange={(e) => setReviewerNote(e.target.value)}
                    placeholder="Enter reason for decision or note for the audit trail..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/40"
                  />
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </form>

              {/* Timeline of notes */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Case Activity History
                </span>
                <div className="space-y-2">
                  {notesHistory.map((note, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-700 dark:text-slate-300 font-mono"
                    >
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

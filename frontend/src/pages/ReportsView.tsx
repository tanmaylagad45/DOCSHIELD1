import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Eye 
} from 'lucide-react';
import { MilestoneNotice } from '../components/common/MilestoneNotice';

export const ReportsView: React.FC = () => {
  const [jsonPreviewOpen, setJsonPreviewOpen] = useState(false);

  const sampleReportData = {
    reportId: "REP-2026-DOC-101",
    generatedAt: new Date().toISOString(),
    specimen: "SYNTHETIC_PASSPORT_JDOE.pdf",
    sha256: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    overallAuthenticityScore: 94,
    recommendation: "ACCEPT",
    simulatedIssuerVerification: {
      status: "ACTIVE_ISSUED",
      registry: "Synthetic Civil Registry Service",
      reference: "P982410291",
      disclaimer: "Simulated response for demonstration purposes only."
    },
    regulatoryCompliance: [
      { code: "KYC-AGE-18", status: "PASS", message: "Age 34 meets threshold" },
      { code: "DOC-VALIDITY", status: "PASS", message: "Expires 2031-08-09" }
    ]
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <MilestoneNotice
        currentMilestone="Milestone 2 Frontend Blueprint"
        plannedMilestone="Milestone 11 (PDF Verification Reports Engine)"
        description="Comprehensive PDF and JSON export generation will be integrated with the ReportLab/Weasyprint backend service."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-500" />
            <span>Verification Reports & Certifications</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export comprehensive, itemized audit reports for regulatory compliance and audit submissions.
          </p>
        </div>

        <button
          onClick={() => setJsonPreviewOpen(!jsonPreviewOpen)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Eye className="w-4 h-4" />
          <span>{jsonPreviewOpen ? 'Hide JSON Specimen' : 'Preview JSON Report Specimen'}</span>
        </button>
      </div>

      {jsonPreviewOpen && (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner">
          <pre>{JSON.stringify(sampleReportData, null, 2)}</pre>
        </div>
      )}

      {/* Report Templates Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400">
              Template Type
            </span>
            <span className="text-xs text-slate-400">Single Document</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Comprehensive Authenticity Dossier (PDF)
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Multi-page dossier containing high-resolution rendered document preview, highlighted OCR bounding boxes, explainable authenticity signal breakdowns, and compliance rule outputs.
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>Includes cryptographic SHA-256 seal</span>
            <span className="font-semibold text-teal-500">Planned M11</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
              Template Type
            </span>
            <span className="text-xs text-slate-400">Governance & Batch</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Regulatory Compliance Audit Summary (CSV/JSON)
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Batch-level compliance export designed for institutional auditors, highlighting pass/warning rates across evaluated policies, reviewer override histories, and remediation logs.
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>Structured for SIEM / Data Lakes</span>
            <span className="font-semibold text-purple-500">Planned M11</span>
          </div>
        </div>
      </div>
    </div>
  );
};

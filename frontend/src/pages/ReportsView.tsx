import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Eye,
  FileCode,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import type { AppOutletContext } from '../components/layout/AppLayout';
import { MilestoneNotice } from '../components/common/MilestoneNotice';

export const ReportsView: React.FC = () => {
  const outlet = useOutletContext<AppOutletContext | undefined>();
  const [jsonPreviewOpen, setJsonPreviewOpen] = useState(false);

  const activeDoc = outlet?.selectedDocument || (outlet?.documents && outlet.documents.length > 0 ? outlet.documents[0] : null);

  // Official Export Schema Template (Milestone 3.1: No fabricated fake user credentials)
  const reportSchemaSpecification = {
    $schema: "https://docshield.ai/schemas/v1/verification-dossier.json",
    specificationVersion: "1.0.0",
    description: "Export Schema Specification for DocShield Authenticity & Compliance Dossier",
    targetDocument: activeDoc ? {
      documentId: activeDoc.id,
      filename: activeDoc.filename,
      sha256: activeDoc.sha256,
      status: activeDoc.status,
      authenticityScore: activeDoc.authenticityScore ?? "PENDING_EVALUATION"
    } : "No document currently selected",
    schemaFields: {
      reportId: "string (Format: REP-YYYY-DOC-XXXX)",
      generatedAt: "string (ISO 8601 UTC timestamp)",
      specimen: {
        filename: "string",
        fileSize: "integer (bytes)",
        mimeType: "string",
        sha256: "string (64-character SHA-256 digest)"
      },
      authenticity: {
        score: "integer (0-100)",
        recommendation: "ACCEPT | MANUAL_REVIEW_REQUIRED | REJECT",
        evaluatedSignals: "Array<VerificationSignal>"
      },
      compliance: {
        passCount: "integer",
        failCount: "integer",
        evaluatedRules: "Array<ComplianceRuleResult>"
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <MilestoneNotice
        currentMilestone="Milestone 3.1 Clean Data Architecture"
        plannedMilestone="Milestone 11 (PDF Verification Reports Engine)"
        description="Comprehensive PDF and JSON export generation will be integrated with the ReportLab/Weasyprint backend service in Milestone 11."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-teal-500" />
            <span>Verification Reports & Certifications</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Export itemized audit dossiers and regulatory compliance certifications.
          </p>
        </div>

        <button
          onClick={() => setJsonPreviewOpen(!jsonPreviewOpen)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          {jsonPreviewOpen ? <Eye className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
          <span>{jsonPreviewOpen ? 'Hide Schema Specification' : 'Preview JSON Dossier Schema'}</span>
        </button>
      </div>

      {jsonPreviewOpen && (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto shadow-inner space-y-2">
          <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
            <span>DOCUMENT DOSSIER SPECIFICATION (JSON)</span>
            <span className="text-teal-400 font-bold">v1.0.0</span>
          </div>
          <pre>{JSON.stringify(reportSchemaSpecification, null, 2)}</pre>
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

          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-500" />
            <span>Comprehensive Authenticity Dossier (PDF)</span>
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Multi-page dossier containing rendered document preview, highlighted OCR bounding coordinates, explainable authenticity signal breakdowns, and compliance rule verification outputs.
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>Includes cryptographic SHA-256 seal</span>
            <span className="font-semibold text-teal-500">Scheduled Milestone 11</span>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
              Template Type
            </span>
            <span className="text-xs text-slate-400">Governance & Batch</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
            <span>Regulatory Compliance Audit Summary (CSV/JSON)</span>
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Batch-level compliance export designed for institutional auditors, highlighting pass/warning rates across evaluated policies, reviewer override histories, and remediation logs.
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>Structured for SIEM / Data Lakes</span>
            <span className="font-semibold text-purple-500">Scheduled Milestone 11</span>
          </div>
        </div>
      </div>
    </div>
  );
};

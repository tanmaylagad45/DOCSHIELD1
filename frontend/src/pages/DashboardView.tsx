import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  FileCheck2, 
  AlertTriangle, 
  Scale, 
  UploadCloud, 
  ArrowUpRight, 
  ExternalLink, 
  Sparkles,
  TrendingUp,
  FlaskConical
} from 'lucide-react';
import type { DocumentItem, DashboardMetrics } from '../types';
import type { AppOutletContext } from '../components/layout/AppLayout';
import { Badge } from '../components/common/Badge';
import { SimulationBanner } from '../components/common/SimulationBanner';
import { MilestoneNotice } from '../components/common/MilestoneNotice';

interface DashboardViewProps {
  metrics?: DashboardMetrics;
  documents?: DocumentItem[];
  onSelectDocument?: (doc: DocumentItem) => void;
  onUploadClick?: () => void;
  onLoadDemoFixtures?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = (props) => {
  const outlet = useOutletContext<AppOutletContext | undefined>();

  const metrics = props.metrics || outlet?.metrics || {
    totalDocuments: 0,
    verifiedCount: 0,
    flaggedCount: 0,
    underReviewCount: 0,
    averageAuthenticityScore: 0,
    compliancePassRate: 0,
  };
  const documents = props.documents || outlet?.documents || [];
  const onSelectDocument = props.onSelectDocument || outlet?.onSelectDocument || (() => {});
  const onUploadClick = props.onUploadClick || outlet?.onOpenUpload || (() => {});
  const onLoadDemoFixtures = props.onLoadDemoFixtures || outlet?.loadDemoFixtures;

  const hasDocuments = documents.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <MilestoneNotice
        currentMilestone="Milestone 3.1 Data Architecture"
        plannedMilestone="Milestone 5 (FastAPI Dashboard Endpoints & DB Ingestion)"
        description="The dashboard is currently operating on clean in-memory state. Real document extractions and database storage will be connected in Milestone 6."
      />

      {/* Simulation Notice Banner */}
      <SimulationBanner />

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Ingested</span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics.totalDocuments}
            </h3>
            {hasDocuments ? (
              <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3" /> Active workspace
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-0.5">
                No ingestions yet
              </p>
            )}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verified Genuine</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics.verifiedCount}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {hasDocuments ? (
                <>Avg score: <strong className="text-emerald-500 font-bold">{metrics.averageAuthenticityScore}%</strong></>
              ) : (
                'Awaiting evaluation'
              )}
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Flagged Anomalies</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics.flaggedCount}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {hasDocuments && metrics.flaggedCount > 0 ? (
                <span className="text-amber-500 font-semibold">Requires attention</span>
              ) : (
                'No anomalies detected'
              )}
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Compliance Rate</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {metrics.compliancePassRate}%
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {hasDocuments 
                ? `${metrics.verifiedCount} of ${metrics.totalDocuments} passed`
                : '5 active policy rules'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Middle Row: Quick Upload Trigger & Architecture Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Upload Action Card */}
        <div 
          onClick={onUploadClick}
          className="group p-5 rounded-2xl border border-dashed border-sky-400/60 dark:border-sky-500/30 bg-sky-50/40 dark:bg-sky-950/20 hover:border-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-all duration-200 cursor-pointer flex flex-col justify-between"
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/25 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-sky-500" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Ingest Document Specimen
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload passport, ID card, driver&apos;s license, or utility bill to run OCR parsing, authenticity scoring, and KYC validation.
            </p>
          </div>
          <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 mt-4 inline-flex items-center gap-1">
            Open File Ingestion Modal →
          </span>
        </div>

        {/* Intelligence Engine Status Card */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span className="uppercase tracking-wider text-[11px]">Verification Pipeline</span>
              <span className="text-emerald-500 font-bold">Ready</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Multi-Signal Verification Matrix
            </h4>
            <div className="space-y-2 mt-3 text-xs">
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>PDF Structure & Metadata</span>
                <span className="font-mono text-emerald-500 font-semibold">Active</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>OCR Text & MRZ Checksum</span>
                <span className="font-mono text-emerald-500 font-semibold">Active</span>
              </div>
              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Font Micro-Alignment Anomaly</span>
                <span className="font-mono text-emerald-500 font-semibold">Active</span>
              </div>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Deterministic client sandbox mode.</span>
          </div>
        </div>

        {/* Case Queue Snapshot */}
        <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span className="uppercase tracking-wider text-[11px]">Adjudication Queue</span>
              <span className={metrics.underReviewCount > 0 ? 'text-amber-500 font-bold' : 'text-slate-400'}>
                {metrics.underReviewCount} Pending
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Human-in-the-Loop Review
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Documents exhibiting tamper indicators or low OCR confidence are routed to reviewer adjudication.
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-300">Queue Status</span>
            {metrics.underReviewCount > 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px]">
                {metrics.underReviewCount} Under Review
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                Queue Clear
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Document Verification Activity Table / Empty State */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recent Document Intelligence Records
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect OCR bounding boxes, authenticity heuristics, and compliance rule outputs.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {documents.length} {documents.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        {hasDocuments ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-950/50 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Document File</th>
                  <th className="px-4 py-3.5">Classification</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Authenticity</th>
                  <th className="px-4 py-3.5">Simulated Issuer</th>
                  <th className="px-4 py-3.5">Fields</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => onSelectDocument(doc)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-sky-500 transition-colors">
                          <FileCheck2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">{doc.filename}</p>
                          <p className="text-[11px] font-mono text-slate-400">
                            {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB • {doc.sha256.slice(0, 10)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
                        {doc.documentType}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge status={doc.status} size="sm" />
                    </td>
                    <td className="px-4 py-4">
                      {doc.authenticityScore !== undefined ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {doc.authenticityScore}%
                          </span>
                          <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full ${
                                doc.authenticityScore >= 80
                                  ? 'bg-emerald-500'
                                  : doc.authenticityScore >= 60
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${doc.authenticityScore}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {doc.simulatedIssuerStatus ? (
                        <Badge status={doc.simulatedIssuerStatus} size="sm" />
                      ) : (
                        <span className="text-slate-400">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400 font-mono">
                      {doc.extractedFieldsCount > 0 ? `${doc.extractedFieldsCount} fields` : '0 fields'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectDocument(doc);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 transition-colors"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No documents yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your workspace is currently empty. Ingest a document specimen to evaluate OCR parsing, authenticity signals, and compliance rules.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onUploadClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload your first document</span>
              </button>
              {onLoadDemoFixtures && (
                <button
                  onClick={onLoadDemoFixtures}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FlaskConical className="w-4 h-4 text-sky-500" />
                  <span>Load Sample Test Fixtures</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Files, 
  Search, 
  Filter, 
  FileCheck2, 
  ExternalLink, 
  UploadCloud, 
  Trash2, 
  Calendar,
  FlaskConical,
  RotateCcw,
  Download,
  Loader2
} from 'lucide-react';
import type { DocumentItem } from '../types';
import type { AppOutletContext } from '../components/layout/AppLayout';
import { Badge } from '../components/common/Badge';
import { MilestoneNotice } from '../components/common/MilestoneNotice';
import { documentsApi } from '../services/documentsApi';

interface DocumentsViewProps {
  documents?: DocumentItem[];
  onSelectDocument?: (doc: DocumentItem) => void;
  onUploadClick?: () => void;
  onDeleteDocument?: (docId: string) => void;
  onLoadDemoFixtures?: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = (props) => {
  const outlet = useOutletContext<AppOutletContext | undefined>();

  const documents = props.documents || outlet?.documents || [];
  const onSelectDocument = props.onSelectDocument || outlet?.onSelectDocument || (() => {});
  const onUploadClick = props.onUploadClick || outlet?.onOpenUpload || (() => {});
  const onDeleteDocument = props.onDeleteDocument || outlet?.onDeleteDocument || (() => {});
  const onLoadDemoFixtures = props.onLoadDemoFixtures || outlet?.loadDemoFixtures;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const hasDocuments = documents.length > 0;

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = 
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.sha256.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'ALL' || doc.documentType === selectedType;
    const matchesStatus = selectedStatus === 'ALL' || doc.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('ALL');
    setSelectedStatus('ALL');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <MilestoneNotice
        currentMilestone="Milestone 4C Secure Document Management"
        plannedMilestone="Milestone 7 (PyMuPDF & Tesseract Extraction Engine)"
        description="The document repository is connected to persistent SQLite storage and private file storage. Documents are isolated to your authenticated account."
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Files className="w-5 h-5 text-sky-500" />
            <span>Document Repository</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse, filter, and inspect verified identity credentials and extracted intelligence.
          </p>
        </div>

        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={!hasDocuments}
            placeholder={hasDocuments ? "Search by file name or SHA-256 hash..." : "Repository is currently empty..."}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        {/* Classification Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            disabled={!hasDocuments}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="ALL">All Classifications</option>
            <option value="PASSPORT">Passport</option>
            <option value="DRIVING_LICENSE">Driver&apos;s License</option>
            <option value="NATIONAL_ID">National ID</option>
            <option value="UTILITY_BILL">Utility Bill</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            disabled={!hasDocuments}
            className="px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-sky-500/40 w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <option value="ALL">All Statuses</option>
            <option value="UPLOADED">Uploaded</option>
            <option value="VERIFIED">Verified</option>
            <option value="FLAGGED">Flagged</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Documents Grid / Table / Empty State */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 shadow-xs overflow-hidden">
        {!hasDocuments ? (
          /* Empty Repository State */
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto">
              <Files className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                No documents in repository
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Your document repository is currently empty. Upload a passport, identity card, driver&apos;s license, or utility bill to start.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onUploadClick}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Document</span>
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
        ) : filteredDocs.length === 0 ? (
          /* Filtered Results Empty State */
          <div className="p-12 text-center space-y-3">
            <Files className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No matching documents found
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No documents match your search query or filter selection.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-slate-950/50 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Filename</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Authenticity</th>
                  <th className="px-4 py-3.5">Simulated Issuer</th>
                  <th className="px-4 py-3.5">Ingested Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredDocs.map((doc) => (
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
                            {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB • {doc.sha256.slice(0, 12)}...
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
                        <span className="font-bold text-slate-900 dark:text-white">
                          {doc.authenticityScore}%
                        </span>
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
                    <td className="px-4 py-4 text-slate-500 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDocument(doc);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 transition-colors cursor-pointer"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              setDownloadingId(doc.id);
                              await documentsApi.downloadDocument(doc.id, doc.filename);
                            } catch (err: unknown) {
                              alert(err instanceof Error ? err.message : 'Download failed.');
                            } finally {
                              setDownloadingId(null);
                            }
                          }}
                          disabled={downloadingId === doc.id}
                          className="p-1 rounded-lg text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors cursor-pointer disabled:opacity-50"
                          title="Download document binary"
                        >
                          {downloadingId === doc.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-500" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete ${doc.filename}?`)) {
                              onDeleteDocument(doc.id);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete document"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

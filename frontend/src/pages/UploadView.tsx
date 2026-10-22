import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  FileText 
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { MilestoneNotice } from '../components/common/MilestoneNotice';
import { SimulationBanner } from '../components/common/SimulationBanner';
import type { DocumentType, DocumentItem } from '../types';
import type { AppOutletContext } from '../components/layout/AppLayout';

interface UploadViewProps {
  onDocumentUploaded?: (newDoc: DocumentItem) => void;
  onSelectDocument?: (doc: DocumentItem) => void;
}

export const UploadView: React.FC<UploadViewProps> = (props) => {
  const outlet = useOutletContext<AppOutletContext | undefined>();
  const onDocumentUploaded = props.onDocumentUploaded || outlet?.onDocumentUploaded || (() => {});
  const onSelectDocument = props.onSelectDocument || outlet?.onSelectDocument || (() => {});
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>('PASSPORT');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successDoc, setSuccessDoc] = useState<DocumentItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const newDoc: DocumentItem = {
        id: `doc-${Date.now().toString().slice(-4)}`,
        filename: selectedFile ? selectedFile.name : `LOCAL_${documentType}_SPECIMEN.pdf`,
        fileSize: selectedFile ? selectedFile.size : 2100400,
        mimeType: selectedFile ? selectedFile.type : 'application/pdf',
        documentType: documentType,
        status: 'UPLOADED',
        sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        extractedFieldsCount: 0,
        authenticityScore: undefined,
        simulatedIssuerStatus: undefined,
      };
      setSuccessDoc(newDoc);
      onDocumentUploaded(newDoc);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <MilestoneNotice
        currentMilestone="Milestone 2 Frontend UI"
        plannedMilestone="Milestone 6 (FastAPI Upload API & Storage)"
        description="This ingestion workspace runs in client-side simulation mode. Documents are processed locally with synthetic intelligence heuristics."
      />

      <SimulationBanner />

      <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-sky-500" />
            <span>Document Ingestion Workspace</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a document category and upload a synthetic sample for OCR extraction and authenticity verification.
          </p>
        </div>

        <form onSubmit={handleSimulateUpload} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Document Classification
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value as DocumentType)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-sky-500/40"
            >
              <option value="PASSPORT">Passport (MRZ Zone & Biometrics)</option>
              <option value="DRIVING_LICENSE">Driver's License / State Credential</option>
              <option value="NATIONAL_ID">National ID Card</option>
              <option value="UTILITY_BILL">Utility Bill (Proof of Residence)</option>
              <option value="INVOICE">Commercial Invoice</option>
              <option value="CERTIFICATE">Official Certification</option>
            </select>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-sky-500 text-center space-y-2 cursor-pointer bg-slate-50/50 dark:bg-slate-950/40 transition-colors"
          >
            {selectedFile ? (
              <div className="flex flex-col items-center">
                <FileText className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for ingestion
                </p>
              </div>
            ) : (
              <div>
                <UploadCloud className="w-8 h-8 text-sky-500 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  Drag & drop synthetic file, or click to browse
                </p>
                <p className="text-[11px] text-slate-400">
                  PDF, PNG, JPG up to 15MB
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? 'Staging Document Locally...' : 'Ingest Document to Workspace'}
          </button>
        </form>

        {successDoc && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Ingested: <strong>{successDoc.filename}</strong> <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-normal">(Staged locally in current session)</span></span>
            </div>
            <button
              onClick={() => onSelectDocument(successDoc)}
              className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Inspect Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

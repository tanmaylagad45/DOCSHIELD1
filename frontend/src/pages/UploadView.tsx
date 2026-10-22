import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  FileText,
  AlertCircle,
  Loader2,
  ShieldCheck
} from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { MilestoneNotice } from '../components/common/MilestoneNotice';
import type { DocumentType, DocumentItem } from '../types';
import type { AppOutletContext } from '../components/layout/AppLayout';
import { documentsApi } from '../services/documentsApi';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successDoc, setSuccessDoc] = useState<DocumentItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setSuccessDoc(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setErrorMessage('Unsupported file format. Please choose a PDF, PNG, or JPEG file.');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(`File exceeds the 10 MB maximum limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMessage('Please select a document file to upload.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessDoc(null);

    try {
      const newDoc = await documentsApi.uploadDocument(selectedFile, documentType);
      setSuccessDoc(newDoc);
      onDocumentUploaded(newDoc);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed. Please check file format and server connection.';
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <MilestoneNotice
        currentMilestone="Milestone 4C Document Management"
        plannedMilestone="Milestone 7 (PyMuPDF & Tesseract Extraction Engine)"
        description="Documents uploaded here are securely validated via binary magic bytes, integrity-hashed with SHA-256, and stored in isolated server storage."
      />

      <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/60 p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-sky-500" />
            <span>Document Ingestion Workspace</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Upload genuine document specimens (PDF, PNG, JPEG up to 10 MB) for secure storage and verified integrity indexing.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-5">
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
                  Click to browse or drop file here
                </p>
                <p className="text-[11px] text-slate-400">
                  Supported formats: PDF, PNG, JPG up to 10MB
                </p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
            <span>Server verifies binary magic bytes, streams to isolated storage, and generates cryptographic SHA-256.</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing || !selectedFile}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading to Secure Storage...</span>
              </>
            ) : (
              <span>Upload Document to Storage</span>
            )}
          </button>
        </form>

        {successDoc && (
          <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between text-xs animate-in fade-in">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <p>Saved to private storage: <strong>{successDoc.filename}</strong></p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                  SHA-256: {successDoc.sha256.slice(0, 16)}... • {(successDoc.fileSize / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectDocument(successDoc)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 transition-colors cursor-pointer shrink-0"
            >
              Inspect Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

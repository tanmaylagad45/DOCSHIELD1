import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { UploadModal } from '../upload/UploadModal';
import { DocumentDetailModal } from '../document-viewer/DocumentDetailModal';
import { initialDocuments, initialCases, mockMetrics } from '../../services/mockData';
import type { DocumentItem, Case, DashboardMetrics } from '../../types';

export interface AppOutletContext {
  documents: DocumentItem[];
  cases: Case[];
  metrics: DashboardMetrics;
  selectedDocument: DocumentItem | null;
  onSelectDocument: (doc: DocumentItem | null) => void;
  onDocumentUploaded: (newDoc: DocumentItem) => void;
  onStatusChange: (docId: string, newStatus: DocumentItem['status']) => void;
  onDeleteDocument: (docId: string) => void;
  onUpdateCaseStatus: (caseId: string, newStatus: Case['status']) => void;
  onOpenUpload: () => void;
}

export const AppLayout: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const openCasesCount = cases.filter((c) => c.status === 'OPEN' || c.status === 'IN_REVIEW').length;

  const handleDocumentUploaded = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocument(newDoc);
  };

  const handleStatusChange = (docId: string, newStatus: DocumentItem['status']) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, status: newStatus } : doc))
    );
    if (selectedDocument && selectedDocument.id === docId) {
      setSelectedDocument((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleUpdateCaseStatus = (caseId: string, newStatus: Case['status']) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
    );
  };

  const contextValue: AppOutletContext = {
    documents,
    cases,
    metrics: mockMetrics,
    selectedDocument,
    onSelectDocument: setSelectedDocument,
    onDocumentUploaded: handleDocumentUploaded,
    onStatusChange: handleStatusChange,
    onDeleteDocument: handleDeleteDocument,
    onUpdateCaseStatus: handleUpdateCaseStatus,
    onOpenUpload: () => setIsUploadOpen(true),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col">
      <Navbar onUploadClick={() => setIsUploadOpen(true)} />

      <div className="flex flex-1">
        <Sidebar openCasesCount={openCasesCount} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet context={contextValue} />
        </main>
      </div>

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDocumentUploaded={handleDocumentUploaded}
      />

      <DocumentDetailModal
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

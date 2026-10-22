import React, { useState, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { UploadModal } from '../upload/UploadModal';
import { DocumentDetailModal } from '../document-viewer/DocumentDetailModal';
import { 
  initialDocuments, 
  initialCases, 
  initialAuditLogs, 
  calculateMetrics,
  DEMO_FIXTURES_DOCUMENTS,
  DEMO_FIXTURES_CASES,
  DEMO_FIXTURES_AUDIT_LOGS
} from '../../services/mockData';
import type { DocumentItem, Case, AuditLog, DashboardMetrics } from '../../types';

import { documentsApi } from '../../services/documentsApi';

export interface AppOutletContext {
  documents: DocumentItem[];
  cases: Case[];
  auditLogs: AuditLog[];
  metrics: DashboardMetrics;
  selectedDocument: DocumentItem | null;
  isDemoMode: boolean;
  loadDemoFixtures: () => void;
  clearAllData: () => void;
  onSelectDocument: (doc: DocumentItem | null) => void;
  onDocumentUploaded: (newDoc: DocumentItem) => void;
  onStatusChange: (docId: string, newStatus: DocumentItem['status']) => void;
  onDeleteDocument: (docId: string) => void;
  onUpdateCaseStatus: (caseId: string, newStatus: Case['status']) => void;
  onOpenUpload: () => void;
}

export const AppLayout: React.FC = () => {
  // Empty baseline by default (Milestone 3.1)
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Load authenticated user documents from backend
  React.useEffect(() => {
    let isSubscribed = true;
    const fetchUserDocs = async () => {
      try {
        const backendDocs = await documentsApi.getDocuments();
        if (isSubscribed && backendDocs.length > 0) {
          setDocuments(backendDocs);
        }
      } catch {
        // Fall back gracefully to local state
      }
    };
    fetchUserDocs();
    return () => { isSubscribed = false; };
  }, []);

  // Derive metrics dynamically from available records
  const metrics = useMemo(() => calculateMetrics(documents), [documents]);

  const openCasesCount = cases.filter((c) => c.status === 'OPEN' || c.status === 'IN_REVIEW').length;

  const handleDocumentUploaded = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocument(newDoc);
    setAuditLogs((prev) => [
      {
        id: `al-${Date.now()}`,
        entityType: 'DOCUMENT',
        entityId: newDoc.id,
        action: 'STAGED_UPLOAD',
        actor: 'Operator (Current Session)',
        details: `Ingested ${newDoc.filename} (${(newDoc.fileSize / (1024 * 1024)).toFixed(2)} MB) - Staged in memory`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleStatusChange = (docId: string, newStatus: DocumentItem['status']) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, status: newStatus } : doc))
    );
    if (selectedDocument && selectedDocument.id === docId) {
      setSelectedDocument((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setAuditLogs((prev) => [
      {
        id: `al-${Date.now()}`,
        entityType: 'DOCUMENT',
        entityId: docId,
        action: 'STATUS_UPDATE',
        actor: 'Operator (Manual Override)',
        details: `Updated document ${docId} verification status to ${newStatus}`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    if (selectedDocument?.id === docId) {
      setSelectedDocument(null);
    }
    setAuditLogs((prev) => [
      {
        id: `al-${Date.now()}`,
        entityType: 'DOCUMENT',
        entityId: docId,
        action: 'DELETE',
        actor: 'Operator (Current Session)',
        details: `Removed document ${docId} from local workspace repository`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const handleUpdateCaseStatus = (caseId: string, newStatus: Case['status']) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
    );
    setAuditLogs((prev) => [
      {
        id: `al-${Date.now()}`,
        entityType: 'CASE',
        entityId: caseId,
        action: 'CASE_STATUS_CHANGE',
        actor: 'Compliance Reviewer',
        details: `Updated adjudication status for ${caseId} to ${newStatus}`,
        timestamp: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  // Optional development fixture loader
  const loadDemoFixtures = () => {
    setDocuments(DEMO_FIXTURES_DOCUMENTS);
    setCases(DEMO_FIXTURES_CASES);
    setAuditLogs(DEMO_FIXTURES_AUDIT_LOGS);
    setIsDemoMode(true);
  };

  // Reset to clean empty state
  const clearAllData = () => {
    setDocuments([]);
    setCases([]);
    setAuditLogs([]);
    setSelectedDocument(null);
    setIsDemoMode(false);
  };

  const contextValue: AppOutletContext = {
    documents,
    cases,
    auditLogs,
    metrics,
    selectedDocument,
    isDemoMode,
    loadDemoFixtures,
    clearAllData,
    onSelectDocument: setSelectedDocument,
    onDocumentUploaded: handleDocumentUploaded,
    onStatusChange: handleStatusChange,
    onDeleteDocument: handleDeleteDocument,
    onUpdateCaseStatus: handleUpdateCaseStatus,
    onOpenUpload: () => setIsUploadOpen(true),
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col">
      <Navbar 
        onUploadClick={() => setIsUploadOpen(true)}
        isDemoMode={isDemoMode}
        onLoadDemoFixtures={loadDemoFixtures}
        onClearData={clearAllData}
      />

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

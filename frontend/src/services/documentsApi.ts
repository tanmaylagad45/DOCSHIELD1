/**
 * Service functions for documents API interfacing with backend /api/v1/documents.
 * Real file upload, download, metadata retrieval, and deletion.
 */

import { apiFetch, API_BASE_URL } from './api';
import type { DocumentItem } from '../types';

export interface DocumentCreatePayload {
  filename: string;
  file_size: number;
  mime_type: string;
  document_type: string;
  sha256: string;
  storage_path?: string;
}

function mapDocumentItem(doc: any): DocumentItem {
  return {
    id: doc.id,
    filename: doc.filename,
    fileSize: doc.file_size,
    mimeType: doc.mime_type,
    documentType: doc.document_type,
    status: doc.status,
    sha256: doc.sha256,
    createdAt: doc.created_at,
    updatedAt: doc.updated_at,
    extractedFieldsCount: doc.extracted_fields_count || 0,
    authenticityScore: doc.authenticity_score,
  };
}

export const documentsApi = {
  /**
   * Fetches the authenticated user's documents.
   */
  async getDocuments(): Promise<DocumentItem[]> {
    const raw = await apiFetch<any>('/api/v1/documents');
    const items = Array.isArray(raw) ? raw : (raw?.items || []);
    return items.map(mapDocumentItem);
  },

  /**
   * Retrieves single document metadata by ID.
   */
  async getDocument(documentId: string): Promise<DocumentItem> {
    const doc = await apiFetch<any>(`/api/v1/documents/${documentId}`);
    return mapDocumentItem(doc);
  },

  /**
   * Uploads an authentic document file (PDF, PNG, JPEG) using multipart/form-data.
   */
  async uploadDocument(file: File, documentType: string = 'PASSPORT'): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', documentType);

    const doc = await apiFetch<any>('/api/v1/documents/upload', {
      method: 'POST',
      body: formData,
    });

    return mapDocumentItem(doc);
  },

  /**
   * Securely downloads an owned document file as a binary attachment.
   */
  async downloadDocument(documentId: string, filename: string): Promise<void> {
    const url = `${API_BASE_URL}/api/v1/documents/${documentId}/download`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      let errMessage = 'Failed to download document.';
      try {
        const data = await response.json();
        if (data?.error?.message) {
          errMessage = data.error.message;
        }
      } catch {
        // use fallback
      }
      throw new Error(errMessage);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'document';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(link);
  },

  /**
   * Deletes a document owned by the current user.
   */
  async deleteDocument(documentId: string): Promise<{ success: boolean; message: string; id: string }> {
    return apiFetch<{ success: boolean; message: string; id: string }>(
      `/api/v1/documents/${documentId}`,
      {
        method: 'DELETE',
      }
    );
  },

  /**
   * Registers a document metadata record in the database (JSON legacy).
   */
  async createDocument(payload: DocumentCreatePayload): Promise<DocumentItem> {
    const doc = await apiFetch<any>('/api/v1/documents', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return mapDocumentItem(doc);
  },
};

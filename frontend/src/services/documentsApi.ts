/**
 * Service functions for documents API interfacing with backend /api/v1/documents.
 */

import { apiFetch } from './api';
import type { DocumentItem } from '../types';

export interface DocumentCreatePayload {
  filename: string;
  file_size: number;
  mime_type: string;
  document_type: string;
  sha256: string;
  storage_path: string;
}

export const documentsApi = {
  /**
   * Fetches the authenticated user's documents.
   */
  async getDocuments(): Promise<DocumentItem[]> {
    const rawDocs = await apiFetch<any[]>('/api/v1/documents');
    return rawDocs.map((doc) => ({
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
    }));
  },

  /**
   * Registers a document metadata record in the database.
   */
  async createDocument(payload: DocumentCreatePayload): Promise<DocumentItem> {
    const doc = await apiFetch<any>('/api/v1/documents', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
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
    };
  },
};

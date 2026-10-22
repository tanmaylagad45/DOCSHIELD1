import type { 
  DocumentItem, 
  ExtractedField, 
  VerificationRecord, 
  ComplianceRule, 
  ComplianceResult, 
  Case, 
  AuditLog, 
  DashboardMetrics 
} from '../types';

/**
 * DocShield Application Data Layer & Development Fixtures
 * 
 * Milestone 3.1: Clean Data Boundary & Empty Baseline
 * ----------------------------------------------------
 * - Runtime application state starts EMPTY by default.
 * - Components derive counts and status summaries from actual active records.
 * - Test specimens are isolated under DEMO_FIXTURES_* for development testing.
 * - Static compliance rules remain active configuration baselines.
 */

export const emptyMetrics: DashboardMetrics = {
  totalDocuments: 0,
  verifiedCount: 0,
  flaggedCount: 0,
  underReviewCount: 0,
  averageAuthenticityScore: 0,
  compliancePassRate: 0,
};

/**
 * Calculates real-time dashboard statistics dynamically from available document records.
 */
export const calculateMetrics = (documents: DocumentItem[]): DashboardMetrics => {
  if (documents.length === 0) {
    return { ...emptyMetrics };
  }

  const verified = documents.filter((d) => d.status === 'VERIFIED').length;
  const flagged = documents.filter((d) => d.status === 'FLAGGED').length;
  const underReview = documents.filter((d) => d.status === 'UNDER_REVIEW').length;
  const scoredDocs = documents.filter((d) => d.authenticityScore !== undefined);

  const avgScore = scoredDocs.length > 0
    ? Math.round((scoredDocs.reduce((acc, d) => acc + (d.authenticityScore || 0), 0) / scoredDocs.length) * 10) / 10
    : 0;

  const passRate = Math.round((verified / documents.length) * 1000) / 10;

  return {
    totalDocuments: documents.length,
    verifiedCount: verified,
    flaggedCount: flagged,
    underReviewCount: underReview,
    averageAuthenticityScore: avgScore,
    compliancePassRate: passRate,
  };
};

// Default application baseline (Empty by default)
export const initialDocuments: DocumentItem[] = [];
export const initialCases: Case[] = [];
export const initialAuditLogs: AuditLog[] = [];
export const mockMetrics: DashboardMetrics = emptyMetrics;

/**
 * Active Declarative Compliance Rules
 * (These are regulatory policy configurations of the rules engine, not fictional user records)
 */
export const initialComplianceRules: ComplianceRule[] = [
  {
    id: 'cr-1',
    code: 'KYC-AGE-18',
    name: 'Minimum Legal Age Threshold (18+)',
    category: 'KYC',
    severity: 'BLOCKING',
    description: 'Calculates the age of the document owner from Date of Birth and validates age >= 18 years.',
    isActive: true,
  },
  {
    id: 'cr-2',
    code: 'DOC-VALIDITY-UNEXPIRED',
    name: 'Document Expiration Verification',
    category: 'EXPIRY',
    severity: 'BLOCKING',
    description: 'Ensures the document expiry date is strictly later than the current evaluation date.',
    isActive: true,
  },
  {
    id: 'cr-3',
    code: 'ID-COMPLETENESS-MANDATORY',
    name: 'Mandatory Primary Field Completeness',
    category: 'DATA_QUALITY',
    severity: 'BLOCKING',
    description: 'Verifies presence of Full Name, ID Number, Issue Date, and Expiry Date with confidence > 80%.',
    isActive: true,
  },
  {
    id: 'cr-4',
    code: 'ADDR-RECENCY-90D',
    name: 'Proof of Address Recency (90 Days)',
    category: 'KYC',
    severity: 'WARNING',
    description: 'For utility bills and bank statements, verifies the statement date is within the last 90 calendar days.',
    isActive: true,
  },
  {
    id: 'cr-5',
    code: 'TAMPER-ANOMALY-ALERT',
    name: 'Digital Splicing & Tamper Detection',
    category: 'INTEGRITY',
    severity: 'BLOCKING',
    description: 'Triggers blocking failure if layout heuristics detect font alterations or spliced image bounding boxes.',
    isActive: true,
  }
];

/* =====================================================================
   OPTIONAL DEVELOPMENT-ONLY FIXTURES (DEMO_FIXTURES_*)
   Isolated for manual testing; never injected into normal user state.
   ===================================================================== */

export const DEMO_FIXTURES_DOCUMENTS: DocumentItem[] = [
  {
    id: 'demo-doc-101',
    filename: 'SPECIMEN_PASSPORT_JDOE.pdf',
    fileSize: 2411724,
    mimeType: 'application/pdf',
    documentType: 'PASSPORT',
    status: 'VERIFIED',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    createdAt: '2026-10-19T14:32:00Z',
    updatedAt: '2026-10-19T14:35:10Z',
    extractedFieldsCount: 8,
    authenticityScore: 94,
    simulatedIssuerStatus: 'ACTIVE_ISSUED',
  },
  {
    id: 'demo-doc-102',
    filename: 'SPECIMEN_DL_ASMITH_EXPIRED.pdf',
    fileSize: 1142850,
    mimeType: 'application/pdf',
    documentType: 'DRIVING_LICENSE',
    status: 'FLAGGED',
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    createdAt: '2026-10-20T09:15:00Z',
    updatedAt: '2026-10-20T09:18:22Z',
    extractedFieldsCount: 7,
    authenticityScore: 68,
    simulatedIssuerStatus: 'EXPIRED',
  },
  {
    id: 'demo-doc-103',
    filename: 'SPECIMEN_UTILITY_TAMPERED.pdf',
    fileSize: 3120400,
    mimeType: 'application/pdf',
    documentType: 'UTILITY_BILL',
    status: 'REJECTED',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    createdAt: '2026-10-20T11:05:00Z',
    updatedAt: '2026-10-20T11:08:44Z',
    extractedFieldsCount: 6,
    authenticityScore: 34,
    simulatedIssuerStatus: 'RECORD_NOT_FOUND',
  },
  {
    id: 'demo-doc-104',
    filename: 'SPECIMEN_NATID_RWILLIAMS.pdf',
    fileSize: 1854000,
    mimeType: 'application/pdf',
    documentType: 'NATIONAL_ID',
    status: 'UNDER_REVIEW',
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    createdAt: '2026-10-20T13:40:00Z',
    updatedAt: '2026-10-20T13:42:15Z',
    extractedFieldsCount: 9,
    authenticityScore: 82,
    simulatedIssuerStatus: 'ACTIVE_ISSUED',
  },
];

export const DEMO_FIXTURES_CASES: Case[] = [
  {
    id: 'demo-case-501',
    caseNumber: 'DEMO-CASE-0042',
    documentId: 'demo-doc-102',
    documentName: 'SPECIMEN_DL_ASMITH_EXPIRED.pdf',
    status: 'OPEN',
    priority: 'HIGH',
    assignedTo: 'Compliance Officer (Reviewer Queue)',
    createdAt: '2026-10-20T09:20:00Z',
    updatedAt: '2026-10-20T09:20:00Z',
    notes: [
      { id: 'cn-1', author: 'Rules Engine', text: 'Auto-flagged due to BLOCKING failure on rule DOC-VALIDITY-UNEXPIRED.', timestamp: '2026-10-20T09:20:00Z' }
    ]
  },
  {
    id: 'demo-case-502',
    caseNumber: 'DEMO-CASE-0043',
    documentId: 'demo-doc-103',
    documentName: 'SPECIMEN_UTILITY_TAMPERED.pdf',
    status: 'IN_REVIEW',
    priority: 'HIGH',
    assignedTo: 'Fraud Analyst (Reviewer Queue)',
    createdAt: '2026-10-20T11:10:00Z',
    updatedAt: '2026-10-20T11:25:00Z',
    notes: [
      { id: 'cn-2', author: 'Rules Engine', text: 'Auto-flagged: Simulated Issuer RECORD_NOT_FOUND and font splicing anomalies.', timestamp: '2026-10-20T11:10:00Z' }
    ]
  }
];

export const DEMO_FIXTURES_AUDIT_LOGS: AuditLog[] = [
  { id: 'demo-al-1', entityType: 'DOCUMENT', entityId: 'demo-doc-101', action: 'DEMO_FIXTURE_LOAD', actor: 'Developer Sandbox', details: 'Initialized demo test fixtures for specimen validation', timestamp: '2026-10-20T13:40:00Z' },
  { id: 'demo-al-2', entityType: 'PIPELINE', entityId: 'demo-doc-101', action: 'OCR_EXTRACTION', actor: 'DocShield OCR Worker', details: 'Extracted 8 fields with mean confidence 97.8%', timestamp: '2026-10-20T13:41:05Z' },
];

export const DEMO_FIXTURES_EXTRACTED_FIELDS: Record<string, ExtractedField[]> = {
  'demo-doc-101': [
    { id: 'f-1', documentId: 'demo-doc-101', fieldName: 'Full Name', fieldValue: 'SAMPLE ELEANOR DOE', fieldType: 'STRING', confidence: 98.4, isConsistent: true, boundingBox: { x: 120, y: 180, width: 240, height: 24, page: 1 } },
    { id: 'f-2', documentId: 'demo-doc-101', fieldName: 'Document Number', fieldValue: 'P982410291', fieldType: 'IDENTIFIER', confidence: 99.1, isConsistent: true, boundingBox: { x: 380, y: 120, width: 140, height: 22, page: 1 } },
    { id: 'f-3', documentId: 'demo-doc-101', fieldName: 'Date of Birth', fieldValue: '1992-05-14', fieldType: 'DATE', confidence: 97.5, isConsistent: true, boundingBox: { x: 120, y: 220, width: 110, height: 20, page: 1 } },
    { id: 'f-4', documentId: 'demo-doc-101', fieldName: 'Nationality', fieldValue: 'DEMO STATE (SPECIMEN)', fieldType: 'STRING', confidence: 96.0, isConsistent: true, boundingBox: { x: 260, y: 220, width: 180, height: 20, page: 1 } },
    { id: 'f-5', documentId: 'demo-doc-101', fieldName: 'Date of Issue', fieldValue: '2021-08-10', fieldType: 'DATE', confidence: 98.0, isConsistent: true, boundingBox: { x: 120, y: 260, width: 110, height: 20, page: 1 } },
    { id: 'f-6', documentId: 'demo-doc-101', fieldName: 'Date of Expiry', fieldValue: '2031-08-09', fieldType: 'DATE', confidence: 98.5, isConsistent: true, boundingBox: { x: 260, y: 260, width: 110, height: 20, page: 1 } },
    { id: 'f-7', documentId: 'demo-doc-101', fieldName: 'Issuing Authority', fieldValue: 'PASSPORT AGENCY - SPECIMEN', fieldType: 'STRING', confidence: 95.2, isConsistent: true, boundingBox: { x: 120, y: 300, width: 220, height: 20, page: 1 } },
    { id: 'f-8', documentId: 'demo-doc-101', fieldName: 'Machine Readable Zone (MRZ)', fieldValue: 'P<UTOSAMPLEDOE<<ELEANOR<<<<<<<<<<<<<<<<<<<\nP9824102919UTO9205142F3108097<<<<<<<<<<<<<<<04', fieldType: 'IDENTIFIER', confidence: 99.6, isConsistent: true, boundingBox: { x: 60, y: 380, width: 480, height: 48, page: 1 } },
  ],
  'demo-doc-102': [
    { id: 'f-21', documentId: 'demo-doc-102', fieldName: 'Full Name', fieldValue: 'ALEXANDER SMITH', fieldType: 'STRING', confidence: 94.2, isConsistent: true },
    { id: 'f-22', documentId: 'demo-doc-102', fieldName: 'License Number', fieldValue: 'DL-883910-B', fieldType: 'IDENTIFIER', confidence: 95.8, isConsistent: true },
    { id: 'f-23', documentId: 'demo-doc-102', fieldName: 'Date of Birth', fieldValue: '1985-11-23', fieldType: 'DATE', confidence: 96.0, isConsistent: true },
    { id: 'f-24', documentId: 'demo-doc-102', fieldName: 'Date of Expiry', fieldValue: '2024-02-15', fieldType: 'DATE', confidence: 97.1, isConsistent: false },
  ],
  'demo-doc-103': [
    { id: 'f-31', documentId: 'demo-doc-103', fieldName: 'Account Holder', fieldValue: 'MARKUS VANCE', fieldType: 'STRING', confidence: 82.1, isConsistent: false },
    { id: 'f-32', documentId: 'demo-doc-103', fieldName: 'Account Number', fieldValue: 'UTIL-0992-881', fieldType: 'IDENTIFIER', confidence: 71.3, isConsistent: false },
  ],
  'demo-doc-104': [
    { id: 'f-41', documentId: 'demo-doc-104', fieldName: 'Full Name', fieldValue: 'RACHEL WILLIAMS', fieldType: 'STRING', confidence: 96.2, isConsistent: true },
    { id: 'f-42', documentId: 'demo-doc-104', fieldName: 'National ID Number', fieldValue: 'NAT-449-019-33', fieldType: 'IDENTIFIER', confidence: 97.0, isConsistent: true },
  ]
};

export const DEMO_FIXTURES_VERIFICATION_RECORDS: Record<string, VerificationRecord> = {
  'demo-doc-101': {
    id: 'vr-101',
    documentId: 'demo-doc-101',
    authenticityScore: 94,
    recommendation: 'ACCEPT',
    simulatedIssuerStatus: 'ACTIVE_ISSUED',
    simulatedIssuerName: 'Synthetic Civil Registry Service',
    evaluatedAt: '2026-10-19T14:35:10Z',
    isSimulated: true,
    signals: [
      {
        id: 's-1',
        signalKey: 'PDF_METADATA_INTEGRITY',
        title: 'PDF Structural Metadata Analysis',
        category: 'METADATA',
        status: 'PASS',
        weight: 20,
        description: 'Creation timestamp matches layout timestamp; valid PDF version 1.7 header.',
        impact: '+20% (Consistent structure)'
      },
      {
        id: 's-2',
        signalKey: 'MRZ_CROSS_CHECKSUM',
        title: 'MRZ Checksum & Consistency Validation',
        category: 'OCR_CONSISTENCY',
        status: 'PASS',
        weight: 30,
        description: 'Calculated checksum for DOB, Expiry, and Document Number strictly matches raw MRZ line.',
        impact: '+30% (Deterministic identity link)'
      },
      {
        id: 's-3',
        signalKey: 'FONT_LAYOUT_HOMOGENEITY',
        title: 'Font Uniformity & Micro-Alignment',
        category: 'LAYOUT_ANALYSIS',
        status: 'PASS',
        weight: 20,
        description: 'No raster artifacts or font kerning anomalies detected along extracted text bounds.',
        impact: '+20% (No graphic editing detected)'
      },
      {
        id: 's-4',
        signalKey: 'SIMULATED_ISSUER_STATUS',
        title: 'Simulated Issuer Registry Verification',
        category: 'ISSUER_REGISTRY',
        status: 'PASS',
        weight: 24,
        description: 'Simulated issuer registry returned status ACTIVE_ISSUED for reference P982410291.',
        impact: '+24% (Simulated registry match)'
      }
    ]
  }
};

export const DEMO_FIXTURES_COMPLIANCE_RESULTS: Record<string, ComplianceResult[]> = {
  'demo-doc-101': [
    { id: 'res-1', ruleCode: 'KYC-AGE-18', ruleName: 'Minimum Legal Age Threshold (18+)', category: 'KYC', severity: 'BLOCKING', status: 'PASS', message: 'Calculated age is 34 years. Exceeds minimum threshold.' },
    { id: 'res-2', ruleCode: 'DOC-VALIDITY-UNEXPIRED', ruleName: 'Document Expiration Verification', category: 'EXPIRY', severity: 'BLOCKING', status: 'PASS', message: 'Document is valid until 2031-08-09 (4.8 years remaining).' },
    { id: 'res-3', ruleCode: 'ID-COMPLETENESS-MANDATORY', ruleName: 'Mandatory Primary Field Completeness', category: 'DATA_QUALITY', severity: 'BLOCKING', status: 'PASS', message: 'All 4 mandatory fields present with average confidence 98.4%.' },
    { id: 'res-5', ruleCode: 'TAMPER-ANOMALY-ALERT', ruleName: 'Digital Splicing & Tamper Detection', category: 'INTEGRITY', severity: 'BLOCKING', status: 'PASS', message: 'No graphic artifacts or font alterations detected.' }
  ]
};

// Aliases for backwards compatibility with any remaining references
export const mockExtractedFields = DEMO_FIXTURES_EXTRACTED_FIELDS;
export const mockVerificationRecords = DEMO_FIXTURES_VERIFICATION_RECORDS;
export const mockComplianceResults = DEMO_FIXTURES_COMPLIANCE_RESULTS;

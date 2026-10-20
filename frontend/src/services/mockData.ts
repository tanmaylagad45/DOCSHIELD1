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


export const mockMetrics: DashboardMetrics = {
  totalDocuments: 248,
  verifiedCount: 184,
  flaggedCount: 38,
  underReviewCount: 26,
  averageAuthenticityScore: 84.6,
  compliancePassRate: 91.2,
};

export const initialDocuments: DocumentItem[] = [
  {
    id: 'doc-101',
    filename: 'SYNTHETIC_PASSPORT_JDOE.pdf',
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
    id: 'doc-102',
    filename: 'SYNTHETIC_DL_ASMITH_EXPIRED.pdf',
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
    id: 'doc-103',
    filename: 'SYNTHETIC_UTILITY_TAMPERED.pdf',
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
    id: 'doc-104',
    filename: 'SYNTHETIC_NATID_RWILLIAMS.pdf',
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

export const mockExtractedFields: Record<string, ExtractedField[]> = {
  'doc-101': [
    { id: 'f-1', documentId: 'doc-101', fieldName: 'Full Name', fieldValue: 'JANE ELEANOR DOE', fieldType: 'STRING', confidence: 98.4, isConsistent: true, boundingBox: { x: 120, y: 180, width: 240, height: 24, page: 1 } },
    { id: 'f-2', documentId: 'doc-101', fieldName: 'Document Number', fieldValue: 'P982410291', fieldType: 'IDENTIFIER', confidence: 99.1, isConsistent: true, boundingBox: { x: 380, y: 120, width: 140, height: 22, page: 1 } },
    { id: 'f-3', documentId: 'doc-101', fieldName: 'Date of Birth', fieldValue: '1992-05-14', fieldType: 'DATE', confidence: 97.5, isConsistent: true, boundingBox: { x: 120, y: 220, width: 110, height: 20, page: 1 } },
    { id: 'f-4', documentId: 'doc-101', fieldName: 'Nationality', fieldValue: 'SYNTHETIC STATE (UTOPIA)', fieldType: 'STRING', confidence: 96.0, isConsistent: true, boundingBox: { x: 260, y: 220, width: 180, height: 20, page: 1 } },
    { id: 'f-5', documentId: 'doc-101', fieldName: 'Date of Issue', fieldValue: '2021-08-10', fieldType: 'DATE', confidence: 98.0, isConsistent: true, boundingBox: { x: 120, y: 260, width: 110, height: 20, page: 1 } },
    { id: 'f-6', documentId: 'doc-101', fieldName: 'Date of Expiry', fieldValue: '2031-08-09', fieldType: 'DATE', confidence: 98.5, isConsistent: true, boundingBox: { x: 260, y: 260, width: 110, height: 20, page: 1 } },
    { id: 'f-7', documentId: 'doc-101', fieldName: 'Issuing Authority', fieldValue: 'PASSPORT AGENCY - DEPT 04', fieldType: 'STRING', confidence: 95.2, isConsistent: true, boundingBox: { x: 120, y: 300, width: 220, height: 20, page: 1 } },
    { id: 'f-8', documentId: 'doc-101', fieldName: 'Machine Readable Zone (MRZ)', fieldValue: 'P<UTOPOEDOE<<JANE<ELEANOR<<<<<<<<<<<<<<<<<<<\nP9824102919UTO9205142F3108097<<<<<<<<<<<<<<<04', fieldType: 'IDENTIFIER', confidence: 99.6, isConsistent: true, boundingBox: { x: 60, y: 380, width: 480, height: 48, page: 1 } },
  ],
  'doc-102': [
    { id: 'f-21', documentId: 'doc-102', fieldName: 'Full Name', fieldValue: 'ALEXANDER SMITH', fieldType: 'STRING', confidence: 94.2, isConsistent: true },
    { id: 'f-22', documentId: 'doc-102', fieldName: 'License Number', fieldValue: 'DL-883910-B', fieldType: 'IDENTIFIER', confidence: 95.8, isConsistent: true },
    { id: 'f-23', documentId: 'doc-102', fieldName: 'Date of Birth', fieldValue: '1985-11-23', fieldType: 'DATE', confidence: 96.0, isConsistent: true },
    { id: 'f-24', documentId: 'doc-102', fieldName: 'Date of Expiry', fieldValue: '2024-02-15', fieldType: 'DATE', confidence: 97.1, isConsistent: false },
    { id: 'f-25', documentId: 'doc-102', fieldName: 'Address', fieldValue: '742 Evergreen Terrace, Sector 4', fieldType: 'ADDRESS', confidence: 91.0, isConsistent: true },
    { id: 'f-26', documentId: 'doc-102', fieldName: 'Vehicle Class', fieldValue: 'C - Standard Non-Commercial', fieldType: 'STRING', confidence: 93.4, isConsistent: true },
    { id: 'f-27', documentId: 'doc-102', fieldName: 'Issuing Jurisdiction', fieldValue: 'State of Greenfield', fieldType: 'STRING', confidence: 95.0, isConsistent: true },
  ],
  'doc-103': [
    { id: 'f-31', documentId: 'doc-103', fieldName: 'Account Holder', fieldValue: 'MARKUS VANCE', fieldType: 'STRING', confidence: 82.1, isConsistent: false },
    { id: 'f-32', documentId: 'doc-103', fieldName: 'Account Number', fieldValue: 'UTIL-0992-881', fieldType: 'IDENTIFIER', confidence: 71.3, isConsistent: false },
    { id: 'f-33', documentId: 'doc-103', fieldName: 'Statement Date', fieldValue: '2026-09-01', fieldType: 'DATE', confidence: 64.0, isConsistent: false },
    { id: 'f-34', documentId: 'doc-103', fieldName: 'Due Date', fieldValue: '2026-08-15', fieldType: 'DATE', confidence: 60.5, isConsistent: false },
    { id: 'f-35', documentId: 'doc-103', fieldName: 'Service Address', fieldValue: '108 Industrial Park, Building C', fieldType: 'ADDRESS', confidence: 79.2, isConsistent: true },
    { id: 'f-36', documentId: 'doc-103', fieldName: 'Amount Due', fieldValue: '$148.20', fieldType: 'NUMBER', confidence: 88.0, isConsistent: true },
  ],
  'doc-104': [
    { id: 'f-41', documentId: 'doc-104', fieldName: 'Full Name', fieldValue: 'RACHEL WILLIAMS', fieldType: 'STRING', confidence: 96.2, isConsistent: true },
    { id: 'f-42', documentId: 'doc-104', fieldName: 'National ID Number', fieldValue: 'NAT-449-019-33', fieldType: 'IDENTIFIER', confidence: 97.0, isConsistent: true },
    { id: 'f-43', documentId: 'doc-104', fieldName: 'Date of Birth', fieldValue: '1998-03-30', fieldType: 'DATE', confidence: 98.1, isConsistent: true },
    { id: 'f-44', documentId: 'doc-104', fieldName: 'Date of Expiry', fieldValue: '2029-12-31', fieldType: 'DATE', confidence: 97.4, isConsistent: true },
    { id: 'f-45', documentId: 'doc-104', fieldName: 'Gender', fieldValue: 'Female', fieldType: 'STRING', confidence: 99.0, isConsistent: true },
    { id: 'f-46', documentId: 'doc-104', fieldName: 'Residential Address', fieldValue: '42 Pinecrest Blvd, Apt 3B', fieldType: 'ADDRESS', confidence: 89.5, isConsistent: false },
    { id: 'f-47', documentId: 'doc-104', fieldName: 'Issuing Country', fieldValue: 'Federal Union', fieldType: 'STRING', confidence: 98.0, isConsistent: true },
  ]
};

export const mockVerificationRecords: Record<string, VerificationRecord> = {
  'doc-101': {
    id: 'vr-101',
    documentId: 'doc-101',
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
  },
  'doc-102': {
    id: 'vr-102',
    documentId: 'doc-102',
    authenticityScore: 68,
    recommendation: 'MANUAL_REVIEW_REQUIRED',
    simulatedIssuerStatus: 'EXPIRED',
    simulatedIssuerName: 'Simulated Motor Vehicle Division',
    evaluatedAt: '2026-10-20T09:18:22Z',
    isSimulated: true,
    signals: [
      {
        id: 's-21',
        signalKey: 'PDF_METADATA_INTEGRITY',
        title: 'Document Metadata Check',
        category: 'METADATA',
        status: 'PASS',
        weight: 20,
        description: 'PDF structure is valid with authentic generator metadata.',
        impact: '+20% (Structure intact)'
      },
      {
        id: 's-22',
        signalKey: 'DOCUMENT_EXPIRATION_CHECK',
        title: 'Document Validity Period',
        category: 'METADATA',
        status: 'FAIL',
        weight: 25,
        description: 'Document expiration date (2024-02-15) is in the past. Expired by over 2 years.',
        impact: '-25% (Document is expired)'
      },
      {
        id: 's-23',
        signalKey: 'OCR_CLARITY_CHECK',
        title: 'OCR Optical Character Clarity',
        category: 'OCR_CONSISTENCY',
        status: 'PASS',
        weight: 25,
        description: 'High mean OCR confidence (95.4%) across all bounding fields.',
        impact: '+25% (High clarity)'
      },
      {
        id: 's-24',
        signalKey: 'SIMULATED_ISSUER_STATUS',
        title: 'Simulated Registry Check',
        category: 'ISSUER_REGISTRY',
        status: 'WARN',
        weight: 15,
        description: 'Simulated issuer acknowledges record existence but reports status as EXPIRED.',
        impact: '-10% (Expired record)'
      }
    ]
  },
  'doc-103': {
    id: 'vr-103',
    documentId: 'doc-103',
    authenticityScore: 34,
    recommendation: 'REJECT',
    simulatedIssuerStatus: 'RECORD_NOT_FOUND',
    simulatedIssuerName: 'Simulated Utility Billing Network',
    evaluatedAt: '2026-10-20T11:08:44Z',
    isSimulated: true,
    signals: [
      {
        id: 's-31',
        signalKey: 'GRAPHIC_MANIPULATION_DETECTED',
        title: 'Font & Layout Inconsistency (Splicing Anomaly)',
        category: 'LAYOUT_ANALYSIS',
        status: 'FAIL',
        weight: 35,
        description: 'Detected conflicting font metrics and background JPEG compression block discrepancies around Account Holder name.',
        impact: '-35% (Suspected graphic tampering)'
      },
      {
        id: 's-32',
        signalKey: 'TEMPORAL_LOGIC_INCONSISTENCY',
        title: 'Logical Chronology Anomaly',
        category: 'OCR_CONSISTENCY',
        status: 'FAIL',
        weight: 25,
        description: 'Due date (2026-08-15) precedes statement issue date (2026-09-01). Impossible chronological order.',
        impact: '-25% (Internal inconsistency)'
      },
      {
        id: 's-33',
        signalKey: 'SIMULATED_ISSUER_STATUS',
        title: 'Simulated Registry Check',
        category: 'ISSUER_REGISTRY',
        status: 'FAIL',
        weight: 20,
        description: 'Simulated utility registry returned RECORD_NOT_FOUND for identifier UTIL-0992-881.',
        impact: '-20% (Unregistered identifier)'
      }
    ]
  },
  'doc-104': {
    id: 'vr-104',
    documentId: 'doc-104',
    authenticityScore: 82,
    recommendation: 'MANUAL_REVIEW_REQUIRED',
    simulatedIssuerStatus: 'ACTIVE_ISSUED',
    simulatedIssuerName: 'Synthetic Civil Registry Service',
    evaluatedAt: '2026-10-20T13:42:15Z',
    isSimulated: true,
    signals: [
      {
        id: 's-41',
        signalKey: 'PDF_METADATA_INTEGRITY',
        title: 'Digital Integrity & File Header',
        category: 'METADATA',
        status: 'PASS',
        weight: 20,
        description: 'Clean raster rendering without metadata anomalies.',
        impact: '+20% (Valid header)'
      },
      {
        id: 's-42',
        signalKey: 'ADDRESS_FORMAT_WARNING',
        title: 'Cross-Field Address Formatting',
        category: 'LAYOUT_ANALYSIS',
        status: 'WARN',
        weight: 15,
        description: 'Extracted address apartment format deviates slightly from national postal standard notation.',
        impact: '-5% (Minor formatting divergence)'
      },
      {
        id: 's-43',
        signalKey: 'SIMULATED_ISSUER_STATUS',
        title: 'Simulated Issuer Registry Verification',
        category: 'ISSUER_REGISTRY',
        status: 'PASS',
        weight: 30,
        description: 'Identifier NAT-449-019-33 is confirmed ACTIVE_ISSUED in simulated civil registry.',
        impact: '+30% (Simulated verification passed)'
      }
    ]
  }
};

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

export const mockComplianceResults: Record<string, ComplianceResult[]> = {
  'doc-101': [
    { id: 'res-1', ruleCode: 'KYC-AGE-18', ruleName: 'Minimum Legal Age Threshold (18+)', category: 'KYC', severity: 'BLOCKING', status: 'PASS', message: 'Calculated age is 34 years. Exceeds minimum threshold.' },
    { id: 'res-2', ruleCode: 'DOC-VALIDITY-UNEXPIRED', ruleName: 'Document Expiration Verification', category: 'EXPIRY', severity: 'BLOCKING', status: 'PASS', message: 'Document is valid until 2031-08-09 (4.8 years remaining).' },
    { id: 'res-3', ruleCode: 'ID-COMPLETENESS-MANDATORY', ruleName: 'Mandatory Primary Field Completeness', category: 'DATA_QUALITY', severity: 'BLOCKING', status: 'PASS', message: 'All 4 mandatory fields present with average confidence 98.4%.' },
    { id: 'res-5', ruleCode: 'TAMPER-ANOMALY-ALERT', ruleName: 'Digital Splicing & Tamper Detection', category: 'INTEGRITY', severity: 'BLOCKING', status: 'PASS', message: 'No graphic artifacts or font alterations detected.' }
  ],
  'doc-102': [
    { id: 'res-21', ruleCode: 'KYC-AGE-18', ruleName: 'Minimum Legal Age Threshold (18+)', category: 'KYC', severity: 'BLOCKING', status: 'PASS', message: 'Calculated age is 40 years. Meets requirement.' },
    { id: 'res-22', ruleCode: 'DOC-VALIDITY-UNEXPIRED', ruleName: 'Document Expiration Verification', category: 'EXPIRY', severity: 'BLOCKING', status: 'FAIL', message: 'Document expired on 2024-02-15.', remediation: 'Request applicant to upload a renewed or unexpired government-issued credential.' },
    { id: 'res-23', ruleCode: 'ID-COMPLETENESS-MANDATORY', ruleName: 'Mandatory Primary Field Completeness', category: 'DATA_QUALITY', severity: 'BLOCKING', status: 'PASS', message: 'Mandatory fields identified.' },
  ],
  'doc-103': [
    { id: 'res-31', ruleCode: 'ADDR-RECENCY-90D', ruleName: 'Proof of Address Recency (90 Days)', category: 'KYC', severity: 'WARNING', status: 'WARNING', message: 'Statement date is 51 days old. Within 90-day window but close to threshold.' },
    { id: 'res-32', ruleCode: 'TAMPER-ANOMALY-ALERT', ruleName: 'Digital Splicing & Tamper Detection', category: 'INTEGRITY', severity: 'BLOCKING', status: 'FAIL', message: 'Severe font kerning divergence and inconsistent dates detected around account name block.', remediation: 'Reject document and open fraud investigation case.' }
  ],
  'doc-104': [
    { id: 'res-41', ruleCode: 'KYC-AGE-18', ruleName: 'Minimum Legal Age Threshold (18+)', category: 'KYC', severity: 'BLOCKING', status: 'PASS', message: 'Calculated age is 28 years.' },
    { id: 'res-42', ruleCode: 'DOC-VALIDITY-UNEXPIRED', ruleName: 'Document Expiration Verification', category: 'EXPIRY', severity: 'BLOCKING', status: 'PASS', message: 'Valid until 2029-12-31.' },
    { id: 'res-43', ruleCode: 'ID-COMPLETENESS-MANDATORY', ruleName: 'Mandatory Primary Field Completeness', category: 'DATA_QUALITY', severity: 'BLOCKING', status: 'PASS', message: 'All primary fields extracted with high confidence.' }
  ]
};

export const initialCases: Case[] = [
  {
    id: 'case-501',
    caseNumber: 'CASE-2026-0042',
    documentId: 'doc-102',
    documentName: 'SYNTHETIC_DL_ASMITH_EXPIRED.pdf',
    status: 'OPEN',
    priority: 'HIGH',
    assignedTo: 'Compliance Officer (Sarah K.)',
    createdAt: '2026-10-20T09:20:00Z',
    updatedAt: '2026-10-20T09:20:00Z',
    notes: [
      { id: 'cn-1', author: 'System Rule Engine', text: 'Auto-flagged due to BLOCKING failure on rule DOC-VALIDITY-UNEXPIRED.', timestamp: '2026-10-20T09:20:00Z' }
    ]
  },
  {
    id: 'case-502',
    caseNumber: 'CASE-2026-0043',
    documentId: 'doc-103',
    documentName: 'SYNTHETIC_UTILITY_TAMPERED.pdf',
    status: 'IN_REVIEW',
    priority: 'HIGH',
    assignedTo: 'Senior Fraud Analyst (David M.)',
    createdAt: '2026-10-20T11:10:00Z',
    updatedAt: '2026-10-20T11:25:00Z',
    notes: [
      { id: 'cn-2', author: 'System Rule Engine', text: 'Auto-flagged: Simulated Issuer RECORD_NOT_FOUND and font splicing anomalies.', timestamp: '2026-10-20T11:10:00Z' },
      { id: 'cn-3', author: 'David M.', text: 'Reviewing compression artifacts around the account name field. Looks like manual modification.', timestamp: '2026-10-20T11:25:00Z' }
    ]
  },
  {
    id: 'case-503',
    caseNumber: 'CASE-2026-0044',
    documentId: 'doc-104',
    documentName: 'SYNTHETIC_NATID_RWILLIAMS.pdf',
    status: 'IN_REVIEW',
    priority: 'MEDIUM',
    assignedTo: 'Compliance Officer (Sarah K.)',
    createdAt: '2026-10-20T13:45:00Z',
    updatedAt: '2026-10-20T13:50:00Z',
    notes: [
      { id: 'cn-4', author: 'Sarah K.', text: 'Authenticity is high (82%). Validating address format discrepancy with applicant records.', timestamp: '2026-10-20T13:50:00Z' }
    ]
  }
];

export const initialAuditLogs: AuditLog[] = [
  { id: 'al-1', entityType: 'DOCUMENT', entityId: 'doc-104', action: 'UPLOAD', actor: 'Client User (portal_user_22)', details: 'Uploaded SYNTHETIC_NATID_RWILLIAMS.pdf (1.8 MB)', timestamp: '2026-10-20T13:40:00Z' },
  { id: 'al-2', entityType: 'PIPELINE', entityId: 'doc-104', action: 'OCR_EXTRACTION', actor: 'DocShield OCR Worker #1', details: 'Extracted 7 fields with mean confidence 96.3%', timestamp: '2026-10-20T13:41:05Z' },
  { id: 'al-3', entityType: 'VERIFICATION', entityId: 'doc-104', action: 'SIMULATED_ISSUER_CHECK', actor: 'Simulated Issuer Adapter', details: 'Queried reference NAT-449-019-33: ACTIVE_ISSUED', timestamp: '2026-10-20T13:42:15Z' },
  { id: 'al-4', entityType: 'CASE', entityId: 'case-503', action: 'CREATE_CASE', actor: 'Compliance Automation Engine', details: 'Generated CASE-2026-0044 for address format review', timestamp: '2026-10-20T13:45:00Z' },
  { id: 'al-5', entityType: 'DOCUMENT', entityId: 'doc-101', action: 'VERIFICATION_PASSED', actor: 'System Pipeline', details: 'Passed all verification and regulatory compliance checks with score 94%', timestamp: '2026-10-19T14:35:10Z' },
  { id: 'al-6', entityType: 'DOCUMENT', entityId: 'doc-103', action: 'FRAUD_FLAGGED', actor: 'System Heuristic Engine', details: 'Flagged for digital manipulation anomalies and non-matching registry record', timestamp: '2026-10-20T11:08:44Z' }
];

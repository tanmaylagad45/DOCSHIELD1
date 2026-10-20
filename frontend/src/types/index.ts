export type DocumentType = 
  | 'PASSPORT'
  | 'DRIVING_LICENSE'
  | 'NATIONAL_ID'
  | 'UTILITY_BILL'
  | 'INVOICE'
  | 'CERTIFICATE';

export type DocumentStatus = 
  | 'UPLOADED'
  | 'PROCESSING'
  | 'VERIFIED'
  | 'FLAGGED'
  | 'REJECTED'
  | 'UNDER_REVIEW';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

export interface ExtractedField {
  id: string;
  documentId: string;
  fieldName: string;
  fieldValue: string;
  fieldType: 'STRING' | 'DATE' | 'NUMBER' | 'ADDRESS' | 'IDENTIFIER';
  confidence: number; // 0 - 100
  isConsistent: boolean;
  boundingBox?: BoundingBox;
}

export type SignalCategory = 'METADATA' | 'OCR_CONSISTENCY' | 'LAYOUT_ANALYSIS' | 'ISSUER_REGISTRY';
export type SignalStatus = 'PASS' | 'WARN' | 'FAIL';

export interface VerificationSignal {
  id: string;
  signalKey: string;
  title: string;
  category: SignalCategory;
  status: SignalStatus;
  weight: number;
  description: string;
  impact: string;
}

export type SimulatedIssuerStatus = 
  | 'ACTIVE_ISSUED'
  | 'EXPIRED'
  | 'REVOKED'
  | 'RECORD_NOT_FOUND';

export interface VerificationRecord {
  id: string;
  documentId: string;
  authenticityScore: number; // 0 - 100
  recommendation: 'ACCEPT' | 'MANUAL_REVIEW_REQUIRED' | 'REJECT';
  simulatedIssuerStatus: SimulatedIssuerStatus;
  simulatedIssuerName: string;
  signals: VerificationSignal[];
  evaluatedAt: string;
  isSimulated: true;
}

export type ComplianceSeverity = 'BLOCKING' | 'WARNING' | 'INFO';
export type ComplianceCheckStatus = 'PASS' | 'FAIL' | 'WARNING';

export interface ComplianceRule {
  id: string;
  code: string;
  name: string;
  category: 'KYC' | 'INTEGRITY' | 'EXPIRY' | 'DATA_QUALITY';
  severity: ComplianceSeverity;
  description: string;
  isActive: boolean;
}

export interface ComplianceResult {
  id: string;
  ruleCode: string;
  ruleName: string;
  category: string;
  severity: ComplianceSeverity;
  status: ComplianceCheckStatus;
  message: string;
  remediation?: string;
}

export type CaseStatus = 'OPEN' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED';
export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CaseNote {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  documentId: string;
  documentName: string;
  status: CaseStatus;
  priority: PriorityLevel;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  finalDecision?: string;
  notes: CaseNote[];
}

export interface DocumentItem {
  id: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  documentType: DocumentType;
  status: DocumentStatus;
  sha256: string;
  createdAt: string;
  updatedAt: string;
  extractedFieldsCount: number;
  authenticityScore?: number;
  simulatedIssuerStatus?: SimulatedIssuerStatus;
}

export interface AuditLog {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  actor: string;
  details: string;
  timestamp: string;
}

export interface DashboardMetrics {
  totalDocuments: number;
  verifiedCount: number;
  flaggedCount: number;
  underReviewCount: number;
  averageAuthenticityScore: number;
  compliancePassRate: number;
}

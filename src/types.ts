export type ViewMode = 
  | 'dashboard'
  | 'patient-flow'
  | 'patient-files'
  | 'billing-amo'
  | 'hospitalization'
  | 'nursing'
  | 'examinations'
  | 'operating-room'
  | 'referrals'
  | 'pharmacy'
  | 'documents'
  | 'administration'
  | 'audit'
  | 'amo-portal'
  | 'settings'
  | 'documentation'
  | 'admission'
  | 'consultation'
  | 'billing'
  | 'cash-register';

export type UserRole = 
  | 'super-admin'
  | 'clinic-admin'
  | 'reception'
  | 'doctor'
  | 'nurse'
  | 'billing'
  | 'insurance-agent'
  | 'laboratory'
  | 'radiology'
  | 'pharmacy'
  | 'hygiene-agent';

export interface ClinicUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId: string;
  clinicName: string;
  department: string;
  phone: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  avatarUrl?: string;
  specialty?: string;
}

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'validate' | 'export' | 'approve' | 'refund';

export type PermissionEntity = 
  | 'patients'
  | 'consultations'
  | 'examinations'
  | 'hospitalization'
  | 'nursing'
  | 'operating-room'
  | 'billing'
  | 'cash-register'
  | 'insurance'
  | 'pharmacy'
  | 'transfers'
  | 'documents'
  | 'administration'
  | 'audit';

export type RolePermissions = Record<UserRole, Record<PermissionEntity, PermissionAction[]>>;

export interface Clinic {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  licenseNumber: string;
  totalBeds: number;
  activePatients: number;
}

export type PatientStrictStatus = 
  | 'REGISTERED'
  | 'WAITING'
  | 'CALLING'
  | 'IN_CONSULTATION'
  | 'EXAM_REQUESTED'
  | 'EXAM_IN_PROGRESS'
  | 'EXAM_COMPLETED'
  | 'HOSPITALIZATION_REQUESTED'
  | 'HOSPITALIZED'
  | 'DISCHARGE_REQUESTED'
  | 'BILLING'
  | 'DISCHARGED'
  | 'TRANSFERRED';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface VitalSignRecord {
  id: string;
  patientId: string;
  timestamp: string; // ISO string e.g. "2024-10-24T10:15:00Z"
  displayDate: string; // Formatted date e.g. "24/10/2024 à 10:15"
  temperature: number; // in °C (e.g. 36.8)
  systolicBP: number; // in mmHg (e.g. 135)
  diastolicBP: number; // in mmHg (e.g. 85)
  bloodPressure: string; // Formatted e.g. "135/85"
  heartRate: number; // in bpm (e.g. 72)
  oxygenSat?: number; // SpO2 in % (e.g. 99)
  respiratoryRate?: number; // cpm (e.g. 15)
  bloodGlucose?: string; // g/L (e.g. "0.98")
  recordedBy: string; // Doctor or nurse name e.g. "Dr. Hicham Amrani"
  context?: string; // e.g. "Consultation", "Suivi HTA", "Contrôle Post-op"
  notes?: string;
  status: 'normal' | 'warning' | 'critical';
  alerts?: string[];
}

export interface Patient {
  id: string;
  cin: string;
  name: string;
  firstName?: string;
  lastName?: string;
  age: number;
  gender: 'M' | 'F';
  birthDate?: string;
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  chronicDiseases?: string[];
  medicalHistory?: string[];
  surgicalHistory?: string[];
  amoType: 'CNSS' | 'CNOPS' | 'Tadamon' | 'Privé' | 'Saham' | 'Wafa Assurance';
  amoRate: number; // e.g. 70, 80, 100
  affiliationNumber?: string;
  secondaryInsurance?: string;
  eligibilityStatus?: 'valid' | 'expired' | 'pending' | 'rejected';
  balanceDue: number;
  allergies?: string[];
  medicalAlerts?: string[];
  status: 'consultation' | 'waiting' | 'calling' | 'hospitalized' | 'discharged';
  strictStatus?: PatientStrictStatus;
  currentLocation?: string;
  arrivalTime: string;
  assignedDoctor: string;
  specialty: string;
  ticketNumber?: string;
  waitingMinutes?: number;
  photoUrl?: string;
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    oxygenSat: number;
    bloodGlucose: string;
    temperature?: number;
    respiratoryRate?: number;
  };
  vitalsHistory?: VitalSignRecord[];
  notes?: string;
  isolationStatus?: 'none' | 'contact' | 'respiratory' | 'strict';
  diet?: string;
  mobility?: 'autonomous' | 'assisted' | 'bedridden';
}

export interface Bed {
  id: string;
  code: string; // e.g. "Lit A"
  status: 'occupied' | 'available' | 'cleaning' | 'reserved';
  patientId?: string;
  patientName?: string;
  patientAge?: number;
  patientCin?: string;
  diagnosis?: string;
  doctor?: string;
  careTeam?: string[];
  coverage?: string;
  stayDay?: string; // e.g. "J+1 Post-op"
  admissionDate?: string;
  expectedDischargeDate?: string;
  isolationStatus?: 'none' | 'contact' | 'respiratory' | 'strict';
  diet?: string;
  mobility?: 'autonomous' | 'assisted' | 'bedridden';
  clinicalAlerts?: string[];
  cleaningEstimatedEnd?: string;
  reservedForTime?: string;
  notes?: string;
  aldreteScore?: string;
  vitalsSummary?: string;
}

export interface BedTransferRecord {
  id: string;
  patientId: string;
  patientName: string;
  patientCin: string;
  previousRoom: string;
  previousBed: string;
  newRoom: string;
  newBed: string;
  dateTime: string;
  user: string;
  reason: string;
}

export interface Room {
  id: string;
  number: string;
  name: string;
  floor: string;
  department: string;
  type: 'single' | 'double' | 'vip' | 'icu';
  beds: Bed[];
  isVip?: boolean;
}

export interface PrescriptionItem {
  medication: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  notes?: string;
}

export interface ConsultationRecord {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  medicalHistoryNotes: string;
  surgicalHistoryNotes: string;
  allergiesList: string[];
  vitals: {
    bloodPressure: string;
    heartRate: number;
    oxygenSat: number;
    bloodGlucose: string;
    temperature: number;
    respiratoryRate: number;
  };
  clinicalExamination: string;
  diagnosis: string;
  differentialDiagnosis?: string;
  treatmentPlan: string;
  prescriptions: PrescriptionItem[];
  requestedExaminations: string[];
  followUpInstructions: string;
  status: 'draft' | 'validated' | 'signed';
  version: string;
}

export interface MedicationItem {
  id: string;
  name: string;
  dci: string;
  dosage: string;
  form: string;
  category: string;
  stock: number;
  minThreshold: number;
  unitPriceMAD: number;
  batchNumber: string;
  expiryDate: string;
  storageConditions?: string;
  unit: string;
}

export interface MedicalDocument {
  id: string;
  patientId: string;
  patientName: string;
  patientCin: string;
  type: 
    | 'medical-report' 
    | 'medical_report' 
    | 'prescription' 
    | 'medical-certificate' 
    | 'referral-letter' 
    | 'hospitalization-report' 
    | 'discharge-summary' 
    | 'discharge_summary' 
    | 'operative_report' 
    | 'consent_form' 
    | 'consent' 
    | 'invoice';
  title: string;
  author: string;
  authorRole?: string;
  date?: string;
  createdAt?: string;
  status: 'draft' | 'validated' | 'signed' | 'archived';
  version?: string;
  confidentiality?: 'normal' | 'restricted' | 'confidential';
  content?: string;
  contentText?: string;
  fileSize?: string;
  canDownload?: boolean;
}

export interface PatientConsent {
  id: string;
  patientId: string;
  patientName: string;
  patientCin: string;
  type?: 'surgical' | 'anesthesia' | 'treatment' | 'data_processing_cndp';
  consentType?: 'surgery' | 'anesthesia' | 'treatment' | 'data_cndp';
  title?: string;
  version?: string;
  date?: string;
  signedBy?: string;
  relationship?: string;
  doctorName?: string;
  doctorSignature?: string;
  signedAt?: string;
  consentText?: string;
  status: 'draft' | 'presented' | 'signed' | 'revoked';
  notes?: string;
}

export interface ExamParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
}

export interface ExaminationRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientCin: string;
  type: 'laboratory' | 'radiology';
  category: string;
  examinationName: string;
  modality?: string; // e.g. 'Scanner', 'Échographie', 'Radiographie', 'IRM'
  requestingDoctor: string;
  requestDate: string;
  sampleId?: string;
  collectionTime?: string;
  technician?: string;
  radiologist?: string;
  parameters?: ExamParameter[];
  report?: string;
  status: 'requested' | 'scheduled' | 'patient_arrived' | 'performed' | 'result_entered' | 'validated';
  validatedBy?: string;
  validationDate?: string;
  urgency: 'normal' | 'urgent' | 'vital';
}

export interface ReferralTransfer {
  id: string;
  patientId: string;
  patientName: string;
  patientCin: string;
  destinationFacility: string;
  specialty: string;
  reason: string;
  urgency: 'routine' | 'urgent' | 'vital';
  responsibleDoctor: string;
  ambulanceRequired: boolean;
  attachedDocuments: string[];
  status: 'requested' | 'accepted' | 'transport_planned' | 'transferred' | 'received' | 'closed';
  createdAt: string;
  transferredAt?: string;
  contactPerson?: string;
  notes?: string;
}

export interface NursingTask {
  id: string;
  patientId: string;
  patientName: string;
  roomBed: string;
  taskType: 'vital_signs' | 'medication' | 'iv_therapy' | 'wound_care' | 'hygiene' | 'nutrition' | 'mobility' | 'observation';
  title: string;
  details: string;
  responsibleNurse: string;
  scheduledTime: string;
  completionTime?: string;
  status: 'prescribed' | 'assigned' | 'in_progress' | 'completed' | 'validated';
  validatedBy?: string;
}

export interface MedicationAdministration {
  id: string;
  patientId: string;
  patientName: string;
  medication: string;
  dose: string;
  route: string;
  frequency: string;
  scheduledTime: string;
  administeredTime?: string;
  nurse: string;
  status: 'scheduled' | 'given' | 'skipped' | 'refused' | 'cancelled';
  reasonForOmission?: string;
}

export interface MedicationCatalogItem {
  id: string;
  code: string;
  name: string;
  category: string;
  form: string;
  strength: string;
  stock: number;
  minStockAlert: number;
  unit: string;
  unitPrice: number;
  location: string;
  batchNumber: string;
  expiryDate: string;
}

export interface SurgerySchedule {
  id: string;
  patientId: string;
  patientName: string;
  patientCin: string;
  procedure: string;
  surgeon: string;
  anesthetist: string;
  operatingRoom: string;
  scheduledDate: string;
  startTime: string;
  expectedDurationMinutes: number;
  preOpChecklistCompleted: boolean;
  status: 'surgery_requested' | 'pre_op' | 'scheduled' | 'patient_prepared' | 'in_surgery' | 'recovery' | 'completed';
  recoveryAldreteScore?: number;
  anesthesiaType: 'Générale' | 'Rachianesthésie' | 'Péridurale' | 'Locale';
  postOpNotes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category?: 'consultation' | 'technical_act' | 'surgery' | 'stay' | 'consumable';
  code?: string;
  amount: number;
  doctor?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  patientCin: string;
  patientPhoto?: string;
  date: string;
  time: string;
  items: InvoiceItem[];
  totalAmount: number;
  amoCoveragePercent: number;
  amoAmount: number;
  patientAmount: number;
  amountPaid: number;
  remainingBalance: number;
  status: 'paid' | 'pending' | 'partial' | 'refunded' | 'rejected' | 'transmitted';
  insuranceType: 'CNSS' | 'CNOPS' | 'Tadamon' | 'Privé';
  fseNumber?: string;
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'cheque';
}

export interface BillingRefund {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  patientName: string;
  amount: number;
  reason: string;
  authorizedBy: string;
  date: string;
  user: string;
  paymentMethod: 'cash' | 'card' | 'transfer';
}

export interface CashRegisterSession {
  id: string;
  date: string;
  openedBy: string;
  closedBy?: string;
  openingBalance: number;
  cashTransactions: number;
  cardTransactions: number;
  chequeTransactions: number;
  refunds: number;
  adjustments: number;
  expectedBalance: number;
  countedBalance: number;
  variance: number;
  varianceReason?: string;
  status: 'open' | 'closed';
  closedAt?: string;
}

export interface InsuranceCoverageRule {
  id: string;
  organism: 'CNSS' | 'CNOPS' | 'Tadamon' | 'Saham' | 'Wafa Assurance';
  actCategory: string;
  coverageRate: number;
  requiresPreAuth: boolean;
  ceilingAmount?: number;
  notes: string;
}

export interface ClaimTimelineItem {
  date: string;
  status: 'created' | 'submitted' | 'processing' | 'accepted' | 'rejected' | 'resubmitted' | 'reimbursed';
  title: string;
  comment: string;
  actor: string;
}

export interface AmoRejection {
  id: string;
  code: string; // e.g. "#REJ-492"
  dossierNumber: string;
  patientName: string;
  patientCin: string;
  doctorName: string;
  organism: 'CNSS' | 'CNOPS';
  amount: number;
  totalAmount: number;
  deadlineDays: number;
  reasonCode: string;
  reasonTitle: string;
  reasonDescription: string;
  batchNumber: string;
  status: 'urgent' | 'pending' | 'resolved';
  suggestedAction?: string;
  timeline?: ClaimTimelineItem[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  module: string;
  entity: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  result: 'success' | 'failure' | 'warning';
}

export interface AppNotification {
  id: string;
  category: 'clinical' | 'administrative' | 'financial' | 'insurance' | 'operational';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetView?: ViewMode;
  relatedEntityId?: string;
}

export interface DoctorStaff {
  id: string;
  name: string;
  specialty: string;
  location: string;
  status: 'active' | 'in_surgery' | 'on_duty' | 'break';
  color: string;
}


# 🤖 CODEX ENGINE SPECIFICATION & REFACTORING BLUEPRINT
## ClinicFlow Central SIH (Morocco Healthtech OS)
*Target: Automated Refactoring, Zero-Bug Hardening & Architecture Standardization for Codex / AI Coding Agents*
*Document Version: 1.0.0 — Production Standard 2026*

---

## 1. MISSION STATEMENT FOR CODEX

You are tasked with refactoring, hardening, and standardizing the **ClinicFlow Central SIH** web application.
Your goal is to transition the codebase into an enterprise-grade, **zero-bug**, **resilient**, and **maintainable** production architecture while preserving 100% of the clinical domain logic (Moroccan healthcare regulatory standards: CNSS, CNOPS, AMO, NGAP, CNDP 09-08, WORM logs).

### Core Invariants:
1. **Zero Runtime Exceptions**: No `undefined is not an object`, no unhandled promise rejections, no uncontrolled modal states.
2. **Zero TypeScript Errors**: The refactored code must pass `tsc --noEmit` under `"strict": true` without `@ts-ignore` or `any` casts.
3. **Data Integrity & Reactive Persistence**: State transitions must be atomic, deterministic, and synchronized to a persistent storage layer (e.g. `localStorage` with migration schema or backend API).
4. **UI Stability & Fluidity**: No horizontal overflow, strict adherence to Tailwind CSS utility conventions, accessible contrast, responsive down to 360px mobile width.

---

## 2. AUDIT OF CODE SMELLS & TARGET ARCHITECTURE

### 2.1 Current Technical Debt & Anti-Patterns to Eliminate
| Area | Current Anti-Pattern | Target Architecture |
| :--- | :--- | :--- |
| **State Management** | Global state hoisted into `App.tsx` (~480 lines) with deep prop-drilling into 16 views. | Modular Central Store (React Context + Custom Hook or lightweight store pattern) with decoupled selectors. |
| **Data Mutability** | In-memory arrays modified via shallow spread operations without atomic ID collision checks. | Immutable Reducer / Store with deterministic mutations, UUID generation, and normalized data maps (`byId`, `allIds`). |
| **Error Handling** | Direct rendering of optional nested properties (`patient.vitals.bloodPressure`) risking null dereference crashes. | Safe optional chaining, null-guard view wrappers, and React Error Boundaries surrounding critical clinical modules. |
| **Persistence** | Data resides purely in memory; page reload (`F5`) resets all patient records and admissions. | Persistent Storage Adapter with versioned schema hydration (`localStorage` fallback + API sync readiness). |
| **Business Logic Leakage** | Calculations (AMO reimbursement rates, Aldrete scores, bed turnover delays) embedded inside JSX view components. | Extracted pure domain service functions in `/src/services/` with 100% unit-testable signatures. |

---

## 3. MODULAR ARCHITECTURE DIRECTORY STRUCTURE

Reorganize the `/src` directory to follow a feature-sliced, domain-driven structure:

```
src/
├── app/
│   ├── App.tsx                    # Minimal orchestrator: Providers, ErrorBoundary, Layout shell
│   └── routes.ts                  # View registry & route transition definitions
├── context/
│   ├── ClinicContext.tsx          # Central state provider (Patients, Admissions, WORM logs, Cash)
│   ├── useClinicStore.ts          # Strongly-typed consumer hook with memoized actions
│   └── clinicReducer.ts           # Pure state transition reducer
├── services/
│   ├── amoEngine.ts               # Moroccan AMO/CNSS/CNOPS tariff & co-pay calculation engine
│   ├── aldreteCalculator.ts       # Post-anesthesia score validation & discharge criteria
│   ├── bedManagementService.ts    # Room occupancy state machine (Free -> Occupied -> Bio-clean)
│   ├── auditLogger.ts             # WORM (Write-Once-Read-Many) CNDP 09-08 compliant logging
│   └── storageAdapter.ts          # LocalStorage persistence with schema versioning & migration
├── types/
│   ├── index.ts                   # Barrel export of domain models
│   ├── patient.ts                 # Patient, Admission, Vitals, Consultations, Prescriptions
│   ├── billing.ts                 # FSE, Bordereaux, NGAP acts, Co-pay, Cashier register
│   ├── clinical.ts                # Operating room, WHO checklist, SSPI, Laboratory, Pharmacy
│   └── rbac.ts                    # User roles (10 profiles), permissions matrix, audit events
├── components/
│   ├── common/
│   │   ├── ErrorBoundary.tsx      # Graceful crash handler with recovery actions
│   │   ├── Toast.tsx              # Unobtrusive alert notifications
│   │   ├── StatCard.tsx           # Standardized clinical metric cards
│   │   └── StatusBadge.tsx        # High-contrast clinical status pills
│   ├── layout/
│   │   ├── Header.tsx             # Responsive header with 2026 unified module menu & RBAC switcher
│   │   └── MegaMenu.tsx           # Categorized 16-module command catalog
│   ├── modals/
│   │   ├── NewAdmissionModal.tsx  # Patient admission workflow
│   │   ├── AmoCheckModal.tsx      # Real-time CNSS/CNOPS eligibility verification
│   │   ├── CashRegisterModal.tsx  # Caisse journal & cash collection
│   │   └── DemoScenarioModal.tsx  # 25-step guided interactive presentation engine
│   └── views/
│       ├── DashboardView.tsx      # High-level KPIs & executive operations
│       ├── PatientFlowView.tsx    # Waiting room triage & admission flow
│       ├── PatientFilesView.tsx   # 360° Electronic Health Record (EHR)
│       ├── HospitalizationView.tsx# Bed management & room turnover
│       ├── OperatingRoomView.tsx  # Surgical schedule & WHO 3-step checklist
│       ├── NursingView.tsx        # Vitals logging & drug administration
│       ├── PharmacyView.tsx       # Medication stocks, expiry & dispensation
│       ├── ExaminationsView.tsx   # Labs, Radiology, Cardiology reports
│       ├── BillingAmoView.tsx     # NGAP acts, bordereaux & co-pay settlement
│       ├── AmoPortalView.tsx      # CNSS/CNOPS B2B teletransmission & rejection manager
│       ├── AuditLogView.tsx       # Forensic CNDP compliance logs
│       └── AdminView.tsx          # Staff directories & clinic configurations
└── utils/
    ├── formatters.ts              # Currency (MAD), Moroccan phone, date/time formatting
    └── cn.ts                      # Tailwind class merger utility
```

---

## 4. DOMAIN ENGINES SPECIFICATIONS (PURE BUSINESS LOGIC)

Codex must implement these domain functions as isolated, deterministic pure functions in `/src/services/`.

### 4.1 AMO / CNSS / CNOPS Co-Pay Calculation Engine (`src/services/amoEngine.ts`)
```typescript
export interface AmoCalculationInput {
  insuranceType: 'CNSS' | 'CNOPS' | 'MUTUELLE_PRIVEE' | 'AUCUNE';
  totalAmountMAD: number;
  coveredActsRate?: number; // e.g. 0.80 for 80% coverage
  hasPriorAuthorization: boolean;
}

export interface AmoCalculationResult {
  totalAmountMAD: number;
  amoShareMAD: number;
  patientCoPayMAD: number;
  coveragePercentage: number;
  approvalStatus: 'ELIGIBLE' | 'REQUIRES_PRIOR_AUTH' | 'REJECTED';
  notes: string;
}

export function calculateAmoCoverage(input: AmoCalculationInput): AmoCalculationResult {
  const { insuranceType, totalAmountMAD, coveredActsRate = 0.70, hasPriorAuthorization } = input;
  
  if (insuranceType === 'AUCUNE' || totalAmountMAD <= 0) {
    return {
      totalAmountMAD,
      amoShareMAD: 0,
      patientCoPayMAD: totalAmountMAD,
      coveragePercentage: 0,
      approvalStatus: 'ELIGIBLE',
      notes: 'Patient sans couverture AMO : 100% à la charge du patient.'
    };
  }

  const rate = insuranceType === 'CNOPS' ? 0.80 : coveredActsRate;
  
  if (totalAmountMAD > 5000 && !hasPriorAuthorization) {
    return {
      totalAmountMAD,
      amoShareMAD: 0,
      patientCoPayMAD: totalAmountMAD,
      coveragePercentage: 0,
      approvalStatus: 'REQUIRES_PRIOR_AUTH',
      notes: 'Dépassement du seuil de 5 000 MAD : Entente préalable obligatoire requise par la caisse.'
    };
  }

  const amoShareMAD = Math.round(totalAmountMAD * rate * 100) / 100;
  const patientCoPayMAD = Math.round((totalAmountMAD - amoShareMAD) * 100) / 100;

  return {
    totalAmountMAD,
    amoShareMAD,
    patientCoPayMAD,
    coveragePercentage: Math.round(rate * 100),
    approvalStatus: 'ELIGIBLE',
    notes: `Prise en charge ${insuranceType} validée à ${Math.round(rate * 100)}%.`
  };
}
```

### 4.2 Score d'Aldrete SSPI & Validation Sortie Bloc (`src/services/aldreteCalculator.ts`)
```typescript
export interface AldreteScoreInput {
  motorActivity: 0 | 1 | 2; // 0=immobile, 1=2 membres, 2=4 membres volontaires
  respiration: 0 | 1 | 2;   // 0=apnée, 1=dyspnée/limitée, 2=respiration ample & toux
  circulation: 0 | 1 | 2;   // 0=TA ±50%, 1=TA ±20-50%, 2=TA ±20% valeur préop
  consciousness: 0 | 1 | 2; // 0=inconscient, 1=réveil à l'appel, 2=parfaitement réveillé
  o2Saturation: 0 | 1 | 2;  // 0=SpO2 <90% sous O2, 1=besoin O2 pour SpO2 >90%, 2=SpO2 >92% air ambiant
}

export interface AldreteScoreResult {
  totalScore: number; // Max 10
  isDischargeAuthorized: boolean;
  alertLevel: 'NORMAL' | 'VIGILANCE' | 'DANGER';
  recommendation: string;
}

export function evaluateAldreteScore(input: AldreteScoreInput): AldreteScoreResult {
  const totalScore = input.motorActivity + input.respiration + input.circulation + input.consciousness + input.o2Saturation;
  const isDischargeAuthorized = totalScore >= 9;
  
  let alertLevel: 'NORMAL' | 'VIGILANCE' | 'DANGER' = 'NORMAL';
  let recommendation = 'Aptitude au transfert vers le service d hospitalisation validée.';

  if (totalScore < 7) {
    alertLevel = 'DANGER';
    recommendation = 'Surveillance continue SSPI obligatoire. Alerte anesthésiste requise.';
  } else if (totalScore < 9) {
    alertLevel = 'VIGILANCE';
    recommendation = 'Score insuffisant pour sortie de SSPI (<9). Maintien monitoring.';
  }

  return { totalScore, isDischargeAuthorized, alertLevel, recommendation };
}
```

### 4.3 Registre Immuable CNDP 09-08 WORM Log (`src/services/auditLogger.ts`)
```typescript
export interface WormLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: 'READ' | 'WRITE' | 'DELETE_ATTEMPT' | 'EXPORT' | 'TELETRANSMISSION';
  resourceType: 'DOSSIER_PATIENT' | 'ORDONNANCE' | 'BORDEREAU_AMO' | 'CAISSE' | 'BLOC';
  resourceId: string;
  hashSha256: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED';
  metadata?: Record<string, unknown>;
}

// Generates an irreversible pseudo-hash for audit integrity
export function createWormEntry(entry: Omit<WormLogEntry, 'id' | 'timestamp' | 'hashSha256'>): WormLogEntry {
  const id = `LOG-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const timestamp = new Date().toISOString();
  const rawString = `${id}|${timestamp}|${entry.user}|${entry.role}|${entry.action}|${entry.resourceId}`;
  
  // Deterministic checksum
  let hash = 0;
  for (let i = 0; i < rawString.length; i++) {
    hash = (hash << 5) - hash + rawString.charCodeAt(i);
    hash |= 0;
  }

  return {
    ...entry,
    id,
    timestamp,
    hashSha256: `SHA-${Math.abs(hash).toString(16).padStart(8, '0')}-${timestamp.slice(0, 10)}`
  };
}
```

---

## 5. REFACTORING PHASES & EXECUTION ROADMAP FOR CODEX

When running this refactoring task, Codex must proceed sequentially through these 6 phases:

### Phase 1: Directory Setup & Type Hardening
- Audit `/src/types.ts` to ensure no `any`, all enums are standard TypeScript enums, and all optional properties have default fallbacks.
- Create `/src/services/` and populate pure business logic modules with automated typing.

### Phase 2: Centralized State Management (`ClinicContext`)
- Create `src/context/ClinicContext.tsx` and `useClinicStore.ts`.
- Hydrate initial mock data from `mockData.ts` and `saasSeedData.ts` with local storage persistence adapter.
- Export atomic mutation actions:
  - `addPatient(patient)`
  - `updatePatientStatus(id, newStatus)`
  - `recordVitalSigns(patientId, vitals)`
  - `admitToBed(patientId, bedNumber, service)`
  - `releaseBed(bedNumber)`
  - `recordPayment(receipt)`
  - `transmitAmoBatch(batchId)`
  - `logAuditEvent(event)`

### Phase 3: Root Refactoring (`App.tsx`)
- Wrap the app in `<ClinicProvider>` and `<ErrorBoundary>`.
- Remove all state duplication between `App.tsx` and view components.
- Ensure views read from `useClinicStore()` rather than taking 20+ props.

### Phase 4: Views & Modals Decoupling
- Refactor all 16 views in `/src/components/views/` to consume the store.
- Verify every button has an active, accessible handler (no dummy empty closures).
- Ensure all modals use portal/fixed overlays with backdrop blur and escape key closure.

### Phase 5: Design System & Responsive Hardening
- Ensure all tables have responsive horizontal scroll wrappers (`overflow-x-auto`).
- Validate header alignment on 360px, 768px, 1024px, 1440px, and ultra-wide screens.
- Guarantee that profile badge (Dr. Layla Zahiri) never overlaps or gets pushed off-screen.

### Phase 6: Compilation & Verification Gates
- Execute `npm run lint` (`tsc --noEmit`) -> Must exit with code 0.
- Execute `npm run build` -> Must bundle clean static assets into `dist/`.

---

## 6. CODEX PROMPT TEMPLATE (COPY-PASTE FOR AUTOMATED EXECUTION)

```markdown
You are Codex, acting as Lead Healthcare Software Architect.
Execute the refactoring plan specified in CODEX_REFACTORING_BLUEPRINT.md on this repository:

1. Create the modular directory structure defined in Section 3.
2. Implement pure business logic services in /src/services/ (AMO calculations, Aldrete evaluation, Bed management, WORM logging).
3. Establish the central ClinicContext with localStorage hydration to prevent data loss on reload.
4. Refactor App.tsx and all 16 views to consume the unified store, eliminating prop-drilling and duplicated state.
5. Wrap clinical views in an ErrorBoundary to guarantee zero unhandled runtime crashes.
6. Verify code quality by running tsc --noEmit and npm run build. Ensure zero errors.
```

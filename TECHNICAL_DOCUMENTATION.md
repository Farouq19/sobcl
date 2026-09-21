# Documentation Technique — Plateforme ClinicFlow Casablanca
**Système Intégré de Gestion Clinique, Médico-Technique & Régulation Hospitalière**
*Version Architecture : 2.4.0 — Révision Mars 2026*

---

## Table des Matières

1. [Stack Technique & Environnement d'Exécution](#1-stack-technique--environnement-dexécution)
2. [Arborescence et Cartographie du Code Source](#2-arborescence-et-cartographie-du-code-source)
3. [Modèle de Données & Typage Strict (TypeScript)](#3-modèle-de-données--typage-strict-typescript)
4. [Machine à États Finis (FSM) : Cycle de Vie Patient](#4-machine-à-états-finis-fsm--cycle-de-vie-patient)
5. [Architecture de Sécurité & Contrôle d'Accès RBAC](#5-architecture-de-sécurité--contrôle-daccès-rbac)
6. [Moteurs & Algorithmes Métiers](#6-moteurs--algorithmes-métiers)
   - 6.1 Moteur de Calcul Tiers-Payant AMO & Co-pay
   - 6.2 Algorithme SSPI & Score d'Aldrete
   - 6.3 Protocole Check-list Chirurgicale OMS (3 Temps)
   - 6.4 Gestionnaire de Litière & Asepsie Bio-nettoyage
   - 6.5 Réconciliation et Clôture de Caisse
   - 6.6 Moteur de Résolution des Rejets Masar FSE
7. [Gestion de l'État & Flux Unidirectionnel](#7-gestion-de-létat--flux-unidirectionnel)
8. [Traçabilité Forensique WORM & Conformité CNDP (Loi 09-08)](#8-traçabilité-forensique-worm--conformité-cndp-loi-09-08)
9. [Build, Déploiement & Spécifications de Production](#9-build-déploiement--spécifications-de-production)

---

## 1. Stack Technique & Environnement d'Exécution

### 1.1 Composants Principaux
* **Runtime & Framework** : React 19 (`react: ^19.0.1`, `react-dom: ^19.0.1`) avec typage strict TypeScript 5.8 (`typescript: ~5.8.2`).
* **Moteur de Build & Bundler** : Vite 6 (`vite: ^6.2.3`) couplé au plugin officiel `@vitejs/plugin-react: ^5.0.4`.
* **Styling & Design System** : Tailwind CSS v4 (`tailwindcss: ^4.1.14`, `@tailwindcss/vite: ^4.1.14`) exploitant la nouvelle directive unifiée `@import "tailwindcss";`.
* **Moteur d'Animation** : Motion (`motion: ^12.23.24`) pour les transitions d'état fluides, tiroirs et modales.
* **Bibliothèque Iconographique** : `lucide-react: ^0.546.0` (icônes vectorielles standardisées conformes au design médical).
* **Serveur & Proxy** : Express 4 (`express: ^4.21.2`) pour les routes d'orchestration ou conteneurisation Cloud Run.

### 1.2 Principes d'Architecture Frontend
* **Client-Side SPA Réactif** : Aucun rechargement de page ; bascule d'écran instantanée via l'état `currentView: ViewMode`.
* **Zéro Dépendance Non Contrôlée** : Absence d'alertes natives bloquantes (`window.alert`, `window.confirm`), utilisation de toasters contextuels et de modales accessibles.
* **Typage Nominal et Structurel** : Tous les modèles sont déclarés dans un module central (`/src/types.ts`) interdisant l'utilisation du type `any` ou des objets non typés.

---

## 2. Arborescence et Cartographie du Code Source

```
/
├── index.html                           # Entrée HTML principale avec métadonnées médicales
├── package.json                         # Déclaration des dépendances et scripts d'outillage
├── tsconfig.json                        # Configuration du compilateur TypeScript (mode strict)
├── vite.config.ts                       # Configuration Vite avec plugin React & Tailwind CSS
├── metadata.json                        # Métadonnées plateforme et permissions de conteneur
├── DOCUMENTATION.md                     # Guide fonctionnel complet et protocoles cliniques
├── TECHNICAL_DOCUMENTATION.md           # Documentation d'ingénierie logicielle
└── src/
    ├── main.tsx                         # Point d'entrée React (createRoot, StrictMode)
    ├── App.tsx                          # Composant Racine, State Manager global, routage et modales
    ├── index.css                        # Feuille de style globale (@import "tailwindcss";)
    ├── types.ts                         # Schémas TypeScript universels (560+ lignes de définitions)
    ├── data/
    │   ├── mockData.ts                  # Jeux de données initiaux (Patients, Lits, Factures)
    │   └── saasSeedData.ts              # Données socles SaaS (Cliniques, Utilisateurs, RBAC, Chirurgie, Stocks)
    └── components/
        ├── Header.tsx                   # Barre supérieure : recherche globale, sélecteur de rôle/persona, actions rapides
        ├── Sidebar.tsx                  # Barre de navigation latérale, badge temps réel et sélecteur multi-cliniques
        ├── modals/
        │   ├── AmoCheckModal.tsx        # Vérification en direct des droits AMO (CNSS, CNOPS, Tadamon)
        │   ├── NewAdmissionModal.tsx    # Guichet d'admission patient avec détection de doublons CIN
        │   └── CashRegisterModal.tsx    # Gestion de session de caisse, calculatrice d'espèces et écarts
        └── views/
            ├── DashboardView.tsx        # Tour de contrôle : KPIs, file active, affluence horaire, présence praticiens
            ├── PatientFilesView.tsx     # Dossier Médical Partagé 360° : antécédents, constantes, consultations
            ├── PatientFlowView.tsx      # Tableau Kanban de régulation des flux physiques (5 colonnes)
            ├── ExaminationsView.tsx     # Plateau technique : analyses biologiques & radiologie PACS
            ├── OperatingRoomView.tsx    # Bloc opératoire : programmation, Check-list OMS, SSPI & Aldrete
            ├── HospitalizationView.tsx  # Gestion litière (28 lits), passeport de soins et bio-nettoyage
            ├── NursingView.tsx          # Soins infirmiers et cahier d'administration médicamenteuse (e-MAR)
            ├── PharmacyView.tsx         # Pharmacie hospitalière, gestion des lots, péremptions et chaîne du froid
            ├── ReferralsView.tsx        # Évacuations sanitaires et transferts médicalisés SAMU 05
            ├── BillingAmoView.tsx       # Moteur de facturation, ventilation Tiers-Payant AMO et quittances
            ├── AmoPortalView.tsx        # Portail Masar Santé, télétransmission FSE et traitement des rejets
            ├── DocumentsView.tsx        # GED clinique, consentements éclairés numériques CNDP (Loi 09-08)
            ├── AdminView.tsx            # Gestion des comptes, affectation clinique et matrice des droits RBAC
            ├── AuditLogView.tsx         # Journal d'audit WORM forensique avec visualiseur de Diffs
            ├── SettingsView.tsx         # Paramètres système, passerelles API et configuration d'établissement
            ├── DocumentationView.tsx    # Visualiseur interactif de documentation in-app
            └── DemoScenarioModal.tsx    # Scénario de démonstration interactif en 25 étapes séquentielles
```

---

## 3. Modèle de Données & Typage Strict (TypeScript)

### 3.1 Entités Clés (`/src/types.ts`)

#### Patient (`Patient`)
Représente le dossier unifié d'un patient au sein de l'établissement :
```typescript
export interface Patient {
  id: string;
  cin: string;                          // Identifiant national d'identité (clé d'unicité)
  name: string;
  firstName?: string;
  lastName?: string;
  age: number;
  gender: 'M' | 'F';
  birthDate?: string;
  phone: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  chronicDiseases?: string[];           // Affections Longue Durée (ALD)
  allergies?: string[];                 // Contre-indications médicamenteuses
  amoType: 'CNSS' | 'CNOPS' | 'Tadamon' | 'Privé' | 'Saham' | 'Wafa Assurance';
  amoRate: number;                      // Taux de prise en charge conventionnel (ex. 70, 80, 100)
  affiliationNumber?: string;
  balanceDue: number;                   // Reste à charge patient (MAD)
  status: 'consultation' | 'waiting' | 'calling' | 'hospitalized' | 'discharged';
  strictStatus?: PatientStrictStatus;   // État FSM à 13 étapes
  currentLocation?: string;             // Localisation physique temps réel (ex: "Chambre 101 - Lit A")
  vitals?: {
    bloodPressure: string;              // Format "120/80" mmHg
    heartRate: number;                  // bpm
    oxygenSat: number;                  // SpO2 %
    bloodGlucose: string;               // g/L
    temperature?: number;               // °C
    respiratoryRate?: number;           // cycles/min
  };
  isolationStatus?: 'none' | 'contact' | 'respiratory' | 'strict';
  diet?: string;                        // Régime alimentaire (ex: "Hyposodé", "Diabétique")
  mobility?: 'autonomous' | 'assisted' | 'bedridden';
}
```

#### Examen & Plateau Technique (`ExaminationRequest`)
Structure de prescription et de compte-rendu pour la biologie et l'imagerie :
```typescript
export interface ExaminationRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientCin: string;
  type: 'laboratory' | 'radiology';
  category: string;
  examinationName: string;
  modality?: string;                    // Scanner, IRM, Échographie, Radiographie
  requestingDoctor: string;
  requestDate: string;
  sampleId?: string;                    // Identifiant code-barres du prélèvement
  parameters?: ExamParameter[];         // Valeurs biologiques numériques mesurées
  report?: string;                      // Compte-rendu médical signé
  status: 'requested' | 'scheduled' | 'patient_arrived' | 'performed' | 'result_entered' | 'validated';
  urgency: 'normal' | 'urgent' | 'vital';
}
```

#### Chirurgie & Bloc Opératoire (`SurgerySchedule`)
Gestion péri-opératoire et traçabilité anesthésique :
```typescript
export interface SurgerySchedule {
  id: string;
  patientId: string;
  patientName: string;
  patientCin: string;
  procedure: string;
  surgeon: string;
  anesthetist: string;
  operatingRoom: string;               // Salle ISO 5
  scheduledDate: string;
  startTime: string;
  expectedDurationMinutes: number;
  preOpChecklistCompleted: boolean;
  status: 'surgery_requested' | 'pre_op' | 'scheduled' | 'patient_prepared' | 'in_surgery' | 'recovery' | 'completed';
  recoveryAldreteScore?: number;        // Score SSPI (0 à 10)
  anesthesiaType: 'Générale' | 'Rachianesthésie' | 'Péridurale' | 'Locale';
  postOpNotes?: string;
}
```

#### Facture & Tiers-Payant (`Invoice`)
Décomposition financière conforme à la réglementation marocaine :
```typescript
export interface Invoice {
  id: string;
  invoiceNumber: string;                // Format "FACT-2026-XXXX"
  patientName: string;
  patientCin: string;
  items: InvoiceItem[];
  totalAmount: number;                  // Montant total TTC en MAD
  amoCoveragePercent: number;           // Taux de prise en charge (ex: 80%)
  amoAmount: number;                    // Montant pris en charge par l'organisme (MAD)
  patientAmount: number;                // Ticket modérateur à la charge du patient (MAD)
  amountPaid: number;
  remainingBalance: number;
  status: 'paid' | 'pending' | 'partial' | 'refunded' | 'rejected' | 'transmitted';
  insuranceType: 'CNSS' | 'CNOPS' | 'Tadamon' | 'Privé';
  fseNumber?: string;                   // Numéro de Feuille de Soins Électronique Masar
  paymentMethod?: 'cash' | 'card' | 'transfer' | 'cheque';
}
```

---

## 4. Machine à États Finis (FSM) : Cycle de Vie Patient

Le statut strict d'un patient au sein de l'établissement est modélisé par le type énuméré `PatientStrictStatus` (13 états déterministes) :

```
                  ┌─────────────────┐
                  │ 1. REGISTERED   │ ◄── Accueil / Création au Guichet
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   2. WAITING    │ ◄── Salle d'attente générale
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   3. CALLING    │ ◄── Appel audio-visuel déclenché
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │4. IN_CONSULTATION│ ◄── Prise en charge médicale active
                  └────────┬────────┘
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
┌─────────────────┐ ┌───────────────┐ ┌───────────────────────────┐
│ 5. EXAM_REQ.    │ │ 8. SURGERY    │ │ 10. HOSPITALIZATION_REQ.  │
│ 6. EXAM_IN_PROG.│ │    SCHEDULED  │ └─────────────┬─────────────┘
│ 7. EXAM_COMPL.  │ │ 9. SSPI_RECOV.│               ▼
└────────┬────────┘ └───────┬───────┘ ┌───────────────────────────┐
         │                  │         │ 11. HOSPITALIZED (Lit)    │
         └──────────────────┼─────────┴─────────────┬─────────────┘
                            │                       │
                            ▼                       ▼
                  ┌───────────────────────────────────────────────┐
                  │ 12. BILLING (Facturation & Caisse Guichet)    │
                  └───────────────────────┬───────────────────────┘
                                          │
                                          ▼
                  ┌───────────────────────────────────────────────┐
                  │ 13. DISCHARGED (Sortie légale / Clôture)      │
                  └───────────────────────────────────────────────┘
                                          │
                      (Optionnel)         ▼
                  ┌───────────────────────────────────────────────┐
                  │ TRANSFERRED (Évacuation Médicalisée SAMU 05)  │
                  └───────────────────────────────────────────────┘
```

### Règles de Transition :
1. **Admission ➔ Attente** : `REGISTERED` ➔ `WAITING` (affectation d'un ticket horodaté `#U-xxx` ou `#C-xxx`).
2. **Attente ➔ Examen Clinique** : `WAITING` ➔ `CALLING` ➔ `IN_CONSULTATION`.
3. **Bifurcation Plateau Technique** : `IN_CONSULTATION` ➔ `EXAM_REQUESTED` ➔ `EXAM_IN_PROGRESS` ➔ `EXAM_COMPLETED` (retour en consultation avec résultats validés).
4. **Bifurcation Chirurgicale** : `IN_CONSULTATION` ➔ `SURGERY_SCHEDULED` ➔ `IN_SURGERY` ➔ `SSPI_RECOVERY` (Aldrete ≥ 9) ➔ `HOSPITALIZED`.
5. **Clôture & Règlement** : Le passage à l'état `DISCHARGED` requiert l'extinction du solde de facture (`remainingBalance === 0`) ou un accord de tiers-payant validé.

---

## 5. Architecture de Sécurité & Contrôle d'Accès RBAC

Le système implémente une matrice de sécurité à deux dimensions : **11 Rôles Utilisateurs** × **14 Entités Métiers** avec **8 Actions Élémentaires**.

### 5.1 Définition des Rôles (`UserRole`)
1. `super-admin` : Direction Générale & Médicale (contrôle universel).
2. `clinic-admin` : Gestionnaire d'établissement local.
3. `doctor` : Praticien spécialiste / Urgentiste.
4. `nurse` : Infirmier(ère) diplômé(e) d'État.
5. `reception` : Hôtesse d'accueil & Régulatrice guichet.
6. `billing` : Caissier / Gestionnaire de facturation.
7. `insurance-agent` : Spécialiste Tiers-Payant AMO Masar.
8. `laboratory` : Biologiste médical.
9. `radiology` : Radiologue & Manipulateur radio.
10. `pharmacy` : Pharmacien hospitalier.
11. `hygiene-agent` : Agent d'hygiène et bio-nettoyage.

### 5.2 Matrice des Permissions (`RolePermissions`)
Exprimée sous forme de dictionnaire TypeScript dans `src/data/saasSeedData.ts` :
```typescript
export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'validate' | 'export' | 'approve' | 'refund';

export type PermissionEntity = 
  | 'patients' | 'consultations' | 'examinations' | 'hospitalization'
  | 'nursing' | 'operating-room' | 'billing' | 'cash-register'
  | 'insurance' | 'pharmacy' | 'transfers' | 'documents'
  | 'administration' | 'audit';
```

#### Exemple d'Isolation des Droits :
* **Entité `operating-room`** :
  - `doctor` : `['view', 'create', 'edit', 'validate']`
  - `nurse` : `['view', 'edit']` (saisie SSPI)
  - `reception` : `['view']` (visualisation planning)
  - `billing` : `[]` (accès interdit)
* **Entité `cash-register`** :
  - `billing` : `['view', 'create', 'edit', 'validate']`
  - `clinic-admin` : `['view', 'approve', 'refund', 'export']`
  - `doctor` : `[]` (accès interdit)

---

## 6. Moteurs & Algorithmes Métiers

### 6.1 Moteur de Calcul Tiers-Payant AMO & Co-pay
Le calcul de la ventilation financière repose sur le taux conventionnel validé lors de la vérification de droits :

$$\text{Montant Brut} = \sum_{i=1}^{n} \text{item}_i.\text{amount}$$

$$\text{Part Prise en Charge AMO} = \text{Montant Brut} \times \left(\frac{\text{amoRate}}{100}\right)$$

$$\text{Ticket Modérateur Patient} = \text{Montant Brut} - \text{Part Prise en Charge AMO}$$

*Si mutuelle complémentaire active (ex: Saham, Wafa Assurance) :*
$$\text{Part Mutuelle} = \text{Ticket Modérateur} \times \text{Taux Mutuelle}$$
$$\text{Reste à Charge Final} = \text{Ticket Modérateur} - \text{Part Mutuelle}$$

### 6.2 Algorithme SSPI & Score d'Aldrete
En Salle de Surveillance Post-Interventionnelle, la décision de sortie vers une chambre standard est subordonnée au calcul continu du **Score d'Aldrete modifié** (coté sur 10 points) :

| Axe Clinique | Critère 0 point | Critère 1 point | Critère 2 points |
|---|---|---|---|
| **Activité Motrice** | Incapable de bouger les extrémités | Bouge 2 extrémités sur commande | Bouge 4 extrémités spontanément |
| **Respiration** | Apnée / Assistance respiratoire | Dyspnée ou respiration limitée | Respire profondément et tousse |
| **Circulation (TA)** | $\Delta \text{TA} > \pm 50\%$ de la valeur pré-op | $\Delta \text{TA}$ entre $\pm 20\%$ et $50\%$ | $\Delta \text{TA} < \pm 20\%$ de la normale |
| **Conscience** | Non réactif | Réveillable à l'appel verbal | Complètement lucide et orienté |
| **Saturation $O_2$** | $\text{SpO}_2 < 90\%$ avec oxygénothérapie | Nécessite apport $O_2$ pour $\text{SpO}_2 > 90\%$ | $\text{SpO}_2 > 92\%$ à l'air ambiant |

$$\text{Score Total} = \sum (\text{Activité} + \text{Respiration} + \text{Circulation} + \text{Conscience} + \text{Saturation})$$
$$\text{Autorisation de Sortie} \iff \text{Score Total} \ge 9$$

### 6.3 Protocole Check-list Chirurgicale OMS (3 Temps)
Le module `OperatingRoomView` contrôle l'exécution séquentielle bloquante :
1. **Sign-In (Avant induction anesthésique)** :
   - Vérification de l'identité du patient par bracelet code-barres.
   - Confirmation du site opératoire marqué au feutre dermographique.
   - Validation de la machine d'anesthésie et des drogues de réanimation.
   - Alerte sur voie aérienne difficile ou risque d'inhalation.
2. **Time-Out (Avant incision cutanée)** :
   - Présentation de chaque membre de l'équipe chirurgicale (Rôle/Nom).
   - Déclaration orale de l'acte et anticipation des pertes sanguines (> 500 mL).
   - Vérification de l'antibioprophylaxie administrée dans les 60 minutes précédentes.
3. **Sign-Out (Avant sortie de salle d'opération)** :
   - Compte correct des compresses, aiguilles et instruments par l'IBODE.
   - Étiquetage certifié des pièces anatomopathologiques.
   - Enregistrement des consignes de surveillance post-opératoire.

### 6.4 Gestionnaire de Litière & Asepsie Bio-nettoyage
Le cycle d'exploitation d'un lit hospitalier (`Bed`) suit la machine d'états suivante :
* `available` : Lit propre, drapé, prêt pour une admission.
* `occupied` : Patient installé avec passeport de soins actif.
* `cleaning` : Patient sorti ; protocole d'hygiène et bio-nettoyage en cours par l'agent d'hygiène (`hygiene-agent`).
* `reserved` : Bloqué pour une intervention chirurgicale programmée.

*Sécurité d'asepsie* : Un lit ne peut repasser à l'état `available` qu'après validation nominative par l'agent d'hygiène avec enregistrement de l'heure de fin de bio-nettoyage.

### 6.5 Réconciliation et Clôture de Caisse
Lors de la fermeture du guichet caisse (`CashRegisterModal`) :
1. Calcul automatique de l'encaisse théorique :
   $$\text{Solde Théorique} = \text{Fonds Initial} + \sum \text{Espèces} - \sum \text{Remboursements}$$
2. Saisie du comptage physique des coupures (billets de 200 DH, 100 DH, 50 DH, 20 DH et pièces).
3. Détermination de la variance :
   $$\Delta = \text{Comptage Physique} - \text{Solde Théorique}$$
   * Si $\Delta \ne 0$, la modale impose la saisie d'un motif de justification obligatoire avant génération du PV de clôture.

### 6.6 Moteur de Résolution des Rejets Masar FSE
Le module `AmoPortalView` intègre un parseur de codes de rejet officiels ANAM/CNSS :
* **Code `R-12`** : *Contre-signature praticien manquante*. Action : injection de la signature électronique certifiée et renvoi immédiat.
* **Code `R-04`** : *Dépassement du délai d'entente préalable*. Action : formulaire de demande de prorogation d'accord pré-rempli.
* **Code `R-09`** : *Incohérence du code INPE praticien*. Action : synchronisation avec l'annuaire national des professionnels de santé.

---

## 7. Gestion de l'État & Flux Unidirectionnel

### 7.1 Architecture Unidirectionnelle (Top-Down State)
L'application adopte une architecture réactive prédictible sans surcouche externe lourde :
* **Point d'Ancrage Unique (`src/App.tsx`)** :
  - Centralisation des collections principales (`patients`, `rooms`, `invoices`, `currentUserRole`, `activeClinicId`).
  - Définition des mutateurs d'état (`handleAddPatient`, `handleUpdatePatientStatus`, `handleUpdateBedStatus`, `handlePayInvoice`).
* **Propagation par Propriétés (Props Passing)** :
  - Les vues et modales reçoivent les sous-ensembles de données pertinents et des callbacks typés.
  - Immutabilité stricte : chaque mutation produit une nouvelle copie de l'état via l'opérateur de décomposition (`...`) ou la méthode `Array.prototype.map()`.

### 7.2 Isolation Multi-Cliniques
Le changement de la clinique active (`activeClinicId: 'clinic-casa' | 'clinic-rabat' | 'clinic-kech'`) répercute instantanément le filtrage des capacités d'accueil, du personnel présent et des flux d'admission, garantissant l'étanchéité opérationnelle entre établissements du réseau.

---

## 8. Traçabilité Forensique WORM & Conformité CNDP (Loi 09-08)

### 8.1 Principe WORM (Write Once, Read Many)
Conformément aux exigences médico-légales, le journal d'audit (`AuditLogView`) est alimenté par la structure immuable `AuditLogEntry` :
* Horodatage certifié ISO 8601 à la seconde.
* Capture de l'utilisateur, du rôle, du module, de l'entité et de l'adresse IP du terminal.
* Comparateur de différences (Diff View) enregistrant `previousValue` et `newValue` pour toute modification de constante vitale, diagnostic ou tarif.

### 8.2 Dispositions de la Loi n° 09-08
* **Consentement Éclairé Numérique** : Recueil obligatoire du consentement pour le traitement des données de santé dès l'admission du patient (`type: 'data_processing_cndp'`).
* **Archivage Sécurisé des Documents** : Les consentements chirurgicaux et anesthésiques sont horodatés et signés numériquement par le patient ou son représentant légal.
* **Habilitation & Cloisonnement** : L'accès aux antécédents médicaux sensibles est strictement réservé aux rôles cliniques (`doctor`, `nurse`), les agents administratifs ne voyant que les éléments de facturation.

---

## 9. Build, Déploiement & Spécifications de Production

### 9.1 Scripts npm Disponibles (`package.json`)
* `npm run dev` : Lance le serveur de développement local Vite sur le port 3000 (`--port=3000 --host=0.0.0.0`).
* `npm run build` : Compile l'application TypeScript en bundles statiques optimisés dans le répertoire `dist/`.
* `npm run lint` : Exécute le vérificateur de types `tsc --noEmit` en mode strict pour garantir l'absence d'erreurs de typage.
* `npm run preview` : Prévisualise localement les assets générés en mode production.

### 9.2 Contraintes d'Ingénierie & Portée Réseau
* **Port d'Écoute Standardisé** : L'application doit obligatoirement être exposée sur le **port 3000** (mappé par le proxy inverse Cloud Run).
* **Compatibilité Sandbox & iFrame** :
  - Neutralisation des fenêtres popup bloquantes (`window.open`).
  - Utilisation de modales superposées avec capture du focus et fermeture via touche Échap.
* **Performance de Rendu** :
  - Utilisation de clés React stables (`key={patient.id}`) pour éviter les réinstanciations inutiles du DOM virtuel.
  - Découpage modulaire du code pour prévenir les dépassements de mémoire tampon.

---
*Documentation technique certifiée conforme aux normes d'ingénierie logicielle hospitalière — Équipe d'Architecture ClinicFlow.*

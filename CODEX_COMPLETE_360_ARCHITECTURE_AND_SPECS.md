# 📘 ARCHITECTURE MAÎTRESSE & SPÉCIFICATIONS COMPLÈTES 360° — CLINICFLOW SIH
## Guide de Refonte Intégrale pour Codex & Agents Autonomes (Zero-Bug & 100% Fonctionnel)
*Version: 2.0.0 — Production Ready 2026*
*Système d'Information Hospitalier (SIH) Marocain : CNSS, CNOPS, AMO, NGAP, CNDP 09-08*

---

## 1. VISION GLOBALE & OBJECTIF POUR CODEX

Ce document constitue la **spécification fonctionnelle et technique exhaustive** permettant à **Codex** (ou tout agent d'ingénierie logicielle) de transformer le prototype actuel en une **application 360° pleinement opérationnelle où 100% des boutons, flux, calculs et formulaires fonctionnent réellement**, sans simulation ni données éphémères perdues au rechargement.

### Les 4 Piliers Inviolables :
1. **Zéro Bogue & Zéro Crash (`Zero-Bug Policy`)** : Pas de `Cannot read properties of undefined`, pas de promesse non interceptée, typage strict TypeScript 5.8 sans contournement `any`.
2. **Architecture Simple, Sûre et Éprouvée (`The Safe Stack`)** : Éviter la sur-ingénierie. Un **Store Central Déterministe (React Context + Reducer)** adossé à un **Adaptateur de Persistance (LocalStorage / IndexedDB avec schéma de migration)** et une couche de services purs testables unitairement.
3. **Persistance des Données à 100%** : Toute admission, tout soin administré, toute facture encaissée et tout log CNDP survit à l'actualisation du navigateur (`F5`).
4. **Réalité Réglementaire Marocaine** : Implémentation stricte des nomenclatures NGAP, calculs AMO/ticket modérateur (tiers-payant), journal WORM d'audit conforme loi 09-08 et identifiants fiscaux (ICE, IF, CNSS).

---

## 2. L'ARCHITECTURE LA PLUS SIMPLE, ROBUSTE ET SÉCURISÉE (360° SAFE ARCHITECTURE)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COUCHE PRÉSENTATION (UI)                        │
│   16 Vues Métiers (Flux, EHR, Lits, Bloc, Facturation, AMO, Admin...)  │
│   Modales Atomiques (Admission, Caisse, AMO Check, Démo 25 Étapes)     │
│   Composants Communs (ErrorBoundary, Badges d'état, StatCards)        │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │ (useClinicStore - Actions & Sélecteurs)
┌───────────────────────────────────┴────────────────────────────────────┐
│                    COUCHE GESTION D'ÉTAT UNIFIÉE                       │
│                       ClinicContext & Reducer                          │
│   - État immuable normalisé (Patients, Lits, Actes, Factures, WORM)    │
│   - Actions atomiques : DISPATCH(TYPE, PAYLOAD)                        │
│   - Synchronisation automatique & réactive                              │
└───────────────────▲───────────────────────────────▲────────────────────┘
                    │                               │
┌───────────────────┴──────────────────┐ ┌──────────┴───────────────────┐
│     SERVICES MÉTIERS PURS (Pure)     │ │ COUCHE PERSISTANCE & SÉCURITÉ │
│  - amoEngine (Tiers-payant/Rejets)   │ │  - StorageAdapter (IndexedDB) │
│  - aldreteScore (Sortie de SSPI)     │ │  - Schema Migration Manager   │
│  - bedStateMachine (Asepsie lits)    │ │  - WORM SHA-256 Hashing       │
│  - marEngine (Prescription/Soins)    │ │  - Export PDF & Bordereaux    │
└──────────────────────────────────────┘ └───────────────────────────────┘
```

### Pourquoi cette architecture est la MEILLEURE et la PLUS SÛRE :
- **Facile à débugger** : Un flux de données unidirectionnel. Toute modification passe par un `dispatch` typé qui met à jour le store et écrit dans le journal WORM.
- **Aucune dépendance externe lourde** : Pas de crashs liés à des bibliothèques de state-management instables.
- **Résilience déconnectée (Offline-Ready)** : Fonctionne instantanément en clinique même en cas de coupure du réseau local.
- **Évolution Backend fluide** : Les fonctions du `StorageAdapter` et des `services/` ont des signatures asynchrones compatibles à 100% avec de futures API REST / GraphQL / Supabase / Express.

---

## 3. SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES DES 16 MODULES (POUR RENDRE TOUT OPÉRATIONNEL)

Codex doit implémenter la logique complète pour chacun des 16 modules suivants :

---

### MODULE 1 : RÉGULATION DU FLUX PATIENTS & ACCUEIL TRIAGE
*Vue : `src/components/views/PatientFlowView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Création d'admission en direct** : Le bouton `Nouvelle Admission` ouvre la modale, valide la CIN marocaine, attribue un numéro IP (ex: `IP-2026-0891`), détermine le niveau de triage (1 à 5 - Échelle CIMU) et injecte le patient dans la file d'attente active.
  2. **Machine à états des statuts** : Permettre de changer le statut d'un patient d'un simple clic :
     - `EN_ATTENTE_TRIAGE` ➔ `EN_CONSULTATION` ➔ `EN_ATTENTE_EXAMENS` ➔ `HOSPITALISATION` ou `SORTIE_AUTORISÉE`.
  3. **Recherche & Filtrage en temps réel** : Filtrage instantané par nom, CIN, médecin responsable et degré d'urgence (Absolue, Relative, Différée).
  4. **Chronomètre d'attente dynamique** : Calcul automatique du temps passé en salle d'attente avec bascule en rouge au-delà de 30 minutes.

---

### MODULE 2 : DOSSIER PATIENT 360° (ELECTRONIC HEALTH RECORD - EHR)
*Vue : `src/components/views/PatientFilesView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Fiche Patient Intégrale** : Consultation des antécédents médicaux (ATCD), allergies majeures (avec bandeau d'alerte rouge clignotant), groupe sanguin, vaccins et contacts d'urgence.
  2. **Ajout d'Observation Médicale** : Formulaire permettant au médecin connecté (ex: *Dr. Layla Zahiri*) d'ajouter une note clinique datée et signée électroniquement, s'ajoutant chronologiquement à la timeline.
  3. **Générateur d'Ordonnance Médicamenteuse** : Saisie d'une molécule, posologie, durée, et vérification immédiate contre les allergies déclarées du patient (alerte anti-choc anaphylactique).
  4. **Graphique d'évolution des constantes vitales** : Historique visuel de la Tension Artérielle, Fréquence Cardiaque, Température et SpO2.
  5. **Bouton d'impression / Export du Dossier** : Génération d'un résumé médical imprimable standardisé.

---

### MODULE 3 : GESTION DES LITS & HOSPITALISATION
*Vue : `src/components/views/HospitalizationView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Plan de Lits Interactif par Service** (Cardiologie, Chirurgie, Maternité, Réanimation, Urgences).
  2. **Machine à états d'Asepsie du Lit** :
     - `DISPONIBLE` (Vert) : Prêt à recevoir une admission.
     - `OCCUPÉ` (Bleu) : Patient assigné avec date d'entrée, médecin traitant et régime alimentaire.
     - `EN_BIO_NETTOYAGE` (Orange) : Déclenché automatiquement lors de la sortie d'un patient.
     - `MAINTENANCE` (Gris) : Lit temporairement indisponible.
  3. **Attribution & Transfert de Lit** : Possibilité de transférer un patient d'une chambre double vers une suite ou un lit de soins intensifs en mettant à jour le tarif journalier de chambre.
  4. **Décharge & Bon de Sortie** : Bouton d'autorisation de sortie qui libère le lit, bascule son état en "Bio-nettoyage", et transmet le dossier vers la facturation.

---

### MODULE 4 : BLOC OPÉRATOIRE & SURVEILLANCE POST-INTERVENTION (SSPI)
*Vue : `src/components/views/OperatingRoomView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Planning des Salles d'Opération (Salles 1 à 4)** avec statut d'intervention (Programmé, En Cours, Réveil SSPI, Nettoyage).
  2. **Checklist OMS de Sécurité Chirurgicale (3 Phases Actives)** :
     - *Sign-in (Avant induction)* : Identité patient, site chirurgical marqué, consentement, jeûne vérifié.
     - *Time-out (Avant incision)* : Présentation de l'équipe, antibioprophylaxie < 60 min, risques prévisibles.
     - *Sign-out (Avant fermeture)* : Compte des compresses et instruments, étiquetage des prélèvements d'anapath.
     - *Interdiction de clore l'intervention si un élément de sécurité est décoché.*
  3. **Calculateur Dynamique du Score d'Aldrete** : Saisie des 5 critères (Motricité, Respiration, Tension, Conscience, SpO2) avec blocage de la sortie si le score est inférieur à 9/10.

---

### MODULE 5 : SOINS INFIRMIERS & PLAN D'ADMINISTRATION (MAR)
*Vue : `src/components/views/NursingView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Plan d'Administration Médicamenteuse (MAR / Plan de Soins)** :
     - Liste des prises prescrites par patient avec heure programmée (08h00, 12h00, 18h00, 22h00).
     - Boutons d'action réels : `ADMINISTRÉ` (Vert), `REFUSÉ PAR PATIENT` (Orange avec saisie de motif), `REPORTÉ` (Bleu).
  2. **Prise de Constantes Vitales Rapide** : Saisie de Pouls, TA, Température, EVA (Douleur 0-10) avec calcul automatique d'alerte NEWS (National Early Warning Score).
  3. **Cahier de Transmission Infirmière** : Saisie des relèves d'équipes (Matin ➔ Après-midi ➔ Nuit) horodatées et persistées.

---

### MODULE 6 : PHARMACIE CENTRALE & GESTION DES STOCKS
*Vue : `src/components/views/PharmacyView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Gestion des Lots & Dates de Péremption** : Détection automatique des médicaments approchant l'expiration (< 90 jours) avec pastille d'alerte.
  2. **Décrémentation Automatique des Stocks** : Chaque fois qu'un médicament est validé comme "Administré" dans le module Soins ou au Bloc, le stock physique est automatiquement décompté.
  3. **Création d'un Bon de Commande Fournisseur** : Saisie d'une commande d'urgence auprès d'un laboratoire/grossiste répartiteur marocain (ex: Cooper Pharma, Laprophan, Sothema).
  4. **Armoire à Toxiques / Stupéfiants (Tableau A)** : Double authentification requise pour la sortie de Morphine / Fentanyl avec traçabilité du prescripteur.

---

### MODULE 7 : EXAMENS, BIOLOGIE & IMAGERIE MÉDICALE
*Vue : `src/components/views/ExaminationsView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Prescription d'Examens** : Bilan biologique (NFS, Ionogramme, CRP, Troponine), Imagerie (Scanner, IRM, Radio thorax), Explorations (ECG, Échocardiographie).
  2. **Workflow d'Exécution** : `DEMANDÉ` ➔ `PRÉLÈVEMENT EFFECTUÉ` ➔ `RÉSULTAT SAISI` ➔ `VALIDÉ PAR BIOLOGISTE`.
  3. **Saisie des Valeurs Numériques & Alertes de Panique** : Détection automatique si la valeur dépasse la norme physiologique (ex: Troponine I > 0.04 ng/mL mise en évidence en rouge vif avec mention `VALEUR CRITIQUE`).
  4. **Visualiseur de Compte-Rendu avec téléchargement PDF**.

---

### MODULE 8 : SAMU, URGENCES & RÉGULATION DES TRANSFERTS
*Vue : `src/components/views/ReferralsView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Registre des Transferts Entrants / Sortants** (Transferts inter-cliniques ou CHU Ibn Sina / CHU Ibn Rochd).
  2. **Coordination des Ambulances / UMH** : Attribution d'un véhicule, heure d'appel, heure de départ, heure d'arrivée estimée.
  3. **Régulation Médicale SAMU 141** : Motif de transfert (ex: SCA ST+, AVC ischémique, polytraumatisme) avec fiche de liaison médicale intégrée.

---

### MODULE 9 : FACTURATION CLINIQUE & NOMENCLATURE NGAP
*Vue : `src/components/views/BillingAmoView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Cotation automatique des actes selon la nomenclature marocaine (NGAP)** :
     - Lettres-clés : `K` (Chirurgie), `CS` (Consultation Spécialiste), `AMI` (Actes Infirmiers), `B` (Biologie), `P` (Radiologie).
  2. **Calculateur de Quote-Part Tiers-Payant (AMO / Mutuelle / Patient)** :
     - Application automatique des taux : CNSS (70% ou 80% ALD), CNOPS (80% ou 100%), Mutuelle complémentaire, Reste à charge patient.
  3. **Édition de la Feuille de Soins Électronique (FSE)** et de la Facture Globale avec ICE, IF et Patente de l'établissement.
  4. **Génération du reçu d'encaissement**.

---

### MODULE 10 : GESTION DE LA CAISSE & ENCAISSEMENTS
*Modale & Vue : `src/components/modals/CashRegisterModal.tsx` & `BillingAmoView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Journal des Encaissements en Direct** : Saisie d'un règlement par Espèces, Carte Bancaire (TPE), Chèque de caution ou Virement.
  2. **Clôture Journalière de Caisse (Z de Caisse)** :
     - Total encaissé par mode de règlement.
     - Rapprochement du solde théorique vs solde réel avec détection des écarts.
     - Signature électronique du caissier.
  3. **Émission immédiate d'un reçu imprimable** horodaté avec numéro séquentiel inaltérable.

---

### MODULE 11 : PORTAIL AMO MASAR & TÉLÉTRANSMISSION CNSS / CNOPS
*Vue : `src/components/views/AmoPortalView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Contrôle d'Éligibilité des Droits en Direct** : Saisie de l'immatriculation CNSS et de la CIN avec réponse détaillée : *Droits ouverts, ALD active (Exonération 100%), Plafond annuel disponible*.
  2. **Génération et Télétransmission des Bordereaux FSE** :
     - Regroupement des factures validées en un lot de télétransmission (ex: `LOT-2026-09-CNSS-012`).
     - Simulation de l'accusé de réception électronique cryptographique B2B.
  3. **Module de Traitement des Rejets & Litiges** :
     - Liste des rejets avec code motif (ex: *Absence de pli confidentiel, Prescription hors délai, Dépassement plafond*).
     - Bouton de régularisation et re-télétransmission.

---

### MODULE 12 : GED MÉDICALE & SIGNATURE ÉLECTRONIQUE BARID E-SIGN
*Vue : `src/components/views/DocumentsView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Gestionnaire de Documents Classifiés par Patient** : Comptes-rendus opératoires (CRO), Comptes-rendus d'hospitalisation (CRH), Consentements éclairés signés, Fiches de liaison.
  2. **Signature Électronique Certifiée (Barid Al-Maghrib e-Sign)** :
     - Application du cachet numérique et certificat du médecin avec horodatage certifié.
     - Verrouillage du document en lecture seule (`PDF/A`).
  3. **Visionneuse de document intégrée** avec fonction de téléchargement et impression.

---

### MODULE 13 : JOURNAL D'AUDIT FORENSIQUE WORM (CNDP 09-08)
*Vue : `src/components/views/AuditLogView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Traçabilité Immuable (Write Once, Read Many)** : Chaque accès, modification, création ou tentative d'accès non autorisé est consigné avec :
     - Timestamp précis à la milliseconde.
     - Identité et Rôle de l'utilisateur.
     - Adresse IP & Empreinte de hachage SHA-256 de la ligne.
  2. **Garantie de Non-Répudiation** : Empêcher toute suppression ou modification du journal (bouton de purge désactivé avec message de conformité CNDP).
  3. **Filtres d'investigation de sécurité** : Filtrage par criticité (Info, Avertissement, Violation de sécurité), par plage de dates ou par ressource patient.

---

### MODULE 14 : GOUVERNANCE RBAC & PROFILS MÉDICAUX (10 PROFILS ACTIFS)
*Vue : `src/components/views/AdminView.tsx` & Sélecteur Profil*

* **Fonctionnalités requises à 100%** :
  1. **Matrice des 10 Rôles Hospitaliers** :
     - *Médecin Spécialiste / Cardiologue* (Dr. Layla Zahiri)
     - *Chirurgien Chef de Bloc*
     - *Médecin Anesthésiste-Réanimateur (MAR)*
     - *Infirmière Major / Surveillante Générale*
     - *Infirmier de Soins*
     - *Pharmacien Responsable*
     - *Agent d'Accueil & Admissions*
     - *Responsable Facturation & AMO*
     - *Caissier Général*
     - *Directeur Médical / Administrateur CNDP*
  2. **Cloisonnement des Droits (Permissions Strictes)** :
     - Une infirmière ne peut pas valider une ordonnance médicale ni clôturer la caisse.
     - Un caissier ne peut pas accéder aux comptes-rendus opératoires confidentiels.
     - Mise à jour instantanée de l'interface et des autorisations lors du changement de profil.

---

### MODULE 15 : CONFIGURATION DE LA CLINIQUE & PARAMÈTRES
*Vue : `src/components/views/SettingsView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Paramètres de l'Établissement** : Raison sociale (ex: *Clinique Al Bassma Casablanca*), Adresse, Téléphone, ICE (15 chiffres), IF, Numéro d'Agrément Ministère de la Santé.
  2. **Sélecteur Multi-Établissements (Casablanca Oasis, Maarif, Rabat Agdal)** avec bascule instantanée du contexte.
  3. **Configuration des Tarifs & Services** : Personnalisation des forfaits journaliers de réanimation, chirurgie et chambre individuelle.
  4. **Bouton de Réinitialisation / Export JSON de sauvegarde** permettant de sauvegarder ou restaurer l'intégralité des données en 1 clic.

---

### MODULE 16 : MOTEUR DE DÉMONSTRATION GUIDÉE EN 25 ÉTAPES & DASHBOARD KPI
*Vue : `src/components/views/DemoScenarioModal.tsx` & `DashboardView.tsx`*

* **Fonctionnalités requises à 100%** :
  1. **Dérouleur Automatique Interactif** : Permet à un utilisateur de parcourir le flux d'un cas clinique type de A à Z (ex: *M. Mohammed Alami - Syndrome Coronarien Aigu*) :
     - *Acte 1 : Accueil, Triage Urgences & Vérification AMO CNSS*.
     - *Acte 2 : Examen cardiologique, Troponine positive & Transfert Bloc*.
     - *Acte 3 : Coronarographie, Angioplastie, Checklist OMS & Réveil SSPI (Aldrete)*.
     - *Acte 4 : Hospitalisation cardiologique, MAR Soins, Facturation NGAP, FSE & Sortie*.
  2. **Bouton "Exécuter l'étape"** qui modifie réellement l'état du système à chaque clic (le patient avance réellement de service en service dans toute l'application).
  3. **Tableau de Bord Exécutif (KPIs réels)** : Taux d'occupation des lits calculé dynamiquement, temps moyen d'attente aux urgences, chiffre d'affaires du jour ventilé (Part AMO vs Part Patient).

---

## 4. GUIDE D'EXÉCUTION TECHNIQUE POUR CODEX (LE "HOW-TO" ÉTAPE PAR ÉTAPE)

Pour que Codex réalise ce travail **sans générer de bogue**, il doit suivre scrupuleusement cet algorithme de refactorisation :

### Étape 1 : Création du Store Réactif (`src/context/ClinicContext.tsx`)
```typescript
// Structure de l'état global obligatoire
export interface ClinicState {
  patients: PatientRecord[];
  beds: BedStatus[];
  prescriptions: PrescriptionItem[];
  medications: MedicationStock[];
  examinations: ExamOrder[];
  invoices: Invoice[];
  cashTransactions: CashReceipt[];
  auditLogs: WormLogEntry[];
  currentRole: UserRole;
  currentClinicId: string;
}
```

### Étape 2 : Implémentation du `StorageAdapter` avec persistance `localStorage`
- À l'initialisation, charger l'état depuis `localStorage.getItem('CLINICFLOW_STATE_V2')`.
- Si vide, initialiser avec les données complètes de `saasSeedData.ts` et `mockData.ts`.
- À chaque action (`dispatch`), sauvegarder automatiquement l'état sérialisé pour garantir que l'application ne perd jamais rien après actualisation (`F5`).

### Étape 3 : Isolation des Vues et Éradication du Prop-Drilling
- Dans chaque composant de `/src/components/views/`, remplacer la liste de 15 props par l'appel direct :
  ```typescript
  const { state, dispatch, actions } = useClinicStore();
  ```
- Rendre chaque bouton interactif : un clic sur "Valider le soin" déclenche `actions.administerMedication(...)`, met à jour l'écran immédiatement, réduit le stock en pharmacie et enregistre un log WORM.

### Étape 4 : Validation des Portes de Qualité (Quality Gates)
Codex doit obligatoirement exécuter avant de conclure :
1. `npm run lint` (`tsc --noEmit`) ➔ Doit renvoyer `0 errors`.
2. `npm run build` ➔ La compilation Vite/Rollup doit réussir sans avertissement critique.

---

## 5. PROMPT MAÎTRE DIRECT À ENVOYER À CODEX

```text
Tu es CODEX, Ingénieur Principal en Santé Numérique.
Lis attentivement le fichier CODEX_COMPLETE_360_ARCHITECTURE_AND_SPECS.md situé à la racine du projet.

Ton mandat :
1. Implémente l'architecture complète spécifiée dans la Section 2 (ClinicContext, StorageAdapter persistant, Services purs dans /src/services/).
2. Rends 100% des 16 modules opérationnels de bout en bout (chaque bouton, modal, calcul, changement de statut de lit, validation de soin, encaissement caisse et télétransmission AMO doit fonctionner et persister).
3. Connecte le Scénario Démo en 25 étapes pour qu'il mute réellement les données de l'application à chaque clic.
4. Assure une conformité stricte avec TypeScript (aucune erreur tsc --noEmit) et valide le build (npm run build).
```

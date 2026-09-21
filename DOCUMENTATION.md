# Documentation Intégrale du Système ClinicFlow Casablanca
**Clinique Al Bassma — Hub Médical Casablanca**  
*Système Intégré de Régulation Clinique, Dossiers Médicaux 360°, Plateau Technique, Bloc Opératoire, Hospitalisation, Pharmacie, Facturation AMO (CNSS/CNOPS) & Gouvernance CNDP*

---

## Sommaire Exécutif

1. **Présentation & Vision Générale**
2. **Architecture Globale & Multi-Établissements**
3. **Référentiel des 14 Modules Fonctionnels**
   - 3.1 Tableau de Bord & Tour de Contrôle Opérationnelle (`DashboardView`)
   - 3.2 Dossiers Médicaux 360° & Traçabilité Clinique (`PatientFilesView`)
   - 3.3 Régulation Kanban des Flux Patients (`PatientFlowView`)
   - 3.4 Plateau Technique : Laboratoire & Radiologie (`ExaminationsView`)
   - 3.5 Bloc Opératoire, Check-list OMS & Surveillance SSPI (`SurgeryView`)
   - 3.6 Hospitalisation, 28 Lits & Passeport de Soins (`HospitalizationView`)
   - 3.7 Soins Infirmiers & Cahier d'Administration MAR (`NursingView`)
   - 3.8 Pharmacie Hospitalière & Chaîne du Froid (`PharmacyView`)
   - 3.9 Évacuations & Transferts Médicalisés SAMU 05 (`TransfersView`)
   - 3.10 Facturation Guichet, Devis & Quittances (`BillingAmoView`)
   - 3.11 Caisse Journalière & Réconciliation des Écarts (`CashRegisterModal`)
   - 3.12 Portail Tiers-Payant AMO & Gestion des Rejets (`AmoPortalView`)
   - 3.13 GED Clinique & Consentements Signés CNDP (`DocumentsView`)
   - 3.14 Administration Système, RBAC & Multi-Cliniques (`AdminView`)
   - 3.15 Journal d'Audit Immuable WORM (`AuditLogView`)
4. **Matrice de Sécurité & Rôles RBAC (11 Profils)**
5. **Cycle de Vie du Patient (13 États Stricts)**
6. **Cartographie Détaillée des Circuits & Flux Cliniques**
   - Circuit A : Admission Guichet & Vérification AMO Masar
   - Circuit B : Consultation Médicale & Prescription
   - Circuit C : Plateau Technique (Biologie & Radiologie PACS)
   - Circuit D : Programmation Chirurgicale, Bloc & SSPI Aldrete
   - Circuit E : Hospitalisation, Passeport de Soins & MAR
   - Circuit F : Transfert d'Urgence SAMU 05
   - Circuit G : Facturation, Encaissement & Session de Caisse
   - Circuit H : Traitement des Rejets FSE & Télétransmission
7. **Guide du Scénario Démo Interactif (25 Étapes)**
8. **Modèle de Données & Schémas Techniques**
9. **Conformité Réglementaire & Sécurité des Données (Loi 09-08 CNDP)**

---

## 1. Présentation & Vision Générale

**ClinicFlow Casablanca** est la plateforme SaaS de référence pour la gestion clinique, médico-technique, logistique et administrative des établissements hospitaliers privés au Royaume du Maroc. Déployée initialement au sein de la **Clinique Al Bassma** (Quartier Gauthier, Casablanca), elle prend en charge l'intégralité du continuum de soins :

* **Zéro rupture d'information** : Continuité absolue entre l'accueil, la consultation, le laboratoire, le bloc opératoire, l'hospitalisation et la sortie.
* **Sécurisation du Tiers-Payant Marocain** : Éligibilité temps réel CNSS, CNOPS, AMO Tadamon et mutuelles privées partenaires (Wafa Assurance, Saham, RMA).
* **Sécurité Chirurgicale & Qualité des Soins** : Application stricte de la **Check-list de Sécurité de l'OMS** et calcul normé du **Score d'Aldrete** en Salle de Surveillance Post-Interventionnelle (SSPI).
* **Conformité Légale CNDP** : Respect intégral des prérequis de la **Loi n° 09-08** relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel de santé.

---

## 2. Architecture Globale & Multi-Établissements

ClinicFlow est conçu selon une architecture moderne, modulaire et hautement résiliente :
- **Front-end réactif** : React 18+ avec TypeScript, Tailwind CSS, iconographie unifiée Google Material Symbols, et animations contextuelles.
- **Support Multi-Cliniques Réseau** :
  - *Clinique Al Bassma* — Casablanca (Centre d'excellence médico-chirurgical)
  - *Clinique Al Madina* — Rabat (Pôle cardiologique & médecine interne)
  - *Clinique L'Atlas* — Marrakech (Pôle traumatologique & urgences)
- **Isolation des Données & Filtrage Établissement** : Sélection dynamique de l'établissement actif avec synchronisation instantanée des files d'attente, lits, stocks et caisses.

---

## 3. Référentiel des 14 Modules Fonctionnels

### 3.1 Tableau de Bord & Tour de Contrôle Opérationnelle (`DashboardView`)
Le centre névralgique de supervision de la clinique :
* **Indicateurs Clés (KPIs Temps Réel)** :
  - *Flux du jour* : Nombre total d'admissions quotidiennes et delta comparatif J-1.
  - *File d'attente active* : Nombre de patients en attente ou appelés, temps d'attente moyen (~18 min).
  - *Taux d'occupation litière* : Ratio lits occupés / capacité totale (28 lits).
  - *Recettes journalières* : Montant total encaissé en Dirhams marocains (MAD).
* **File d'Attente Dynamique & Appel Patient** :
  - Filtrage sectoriel (*Toutes, Urgences, Cardiologie, Pédiatrie*).
  - Appel sonore et visuel en salle d'attente.
  - Orientation instantanée vers un box de consultation ou lit d'examen.
* **Affluence Horaire & Pic d'Activité** :
  - Histogramme comparatif confrontant le flux réel heure par heure à la moyenne historique.
* **Disponibilité des Praticiens** :
  - Statut en direct des médecins (en consultation, au bloc, de garde).

### 3.2 Dossiers Médicaux 360° & Traçabilité Clinique (`PatientFilesView`)
Le dossier médical partagé électronique (DPI) conforme aux normes marocaines :
* **Fiche Identito-vigilance** :
  - Numéro de CIN, nom, prénom, date de naissance, âge, photo, téléphone, contact d'urgence et groupe sanguin.
  - Alerte de doublon préventive sur le numéro de CIN.
  - Indicateurs de risque : *Allergies majeures*, *Maladies chroniques ALD*, *Score de fragilité*.
* **Relevé des Constantes Vitales** :
  - Tension artérielle (mmHg), fréquence cardiaque (bpm), saturation en oxygène (SpO2 %), glycémie (g/L), température (°C), fréquence respiratoire.
* **Historique des Consultations & Actes Cotés** :
  - Diagnostic principal codifié (CIM-10), diagnostics différentiels, anamnèse, examen physique.
  - Ordonnances électroniques structurées avec mention « Non Substituable » conforme aux bonnes pratiques officinales.
* **Passeport Assurantiel AMO** :
  - Organisme (CNSS, CNOPS, AMO Tadamon, Mutuelle privée), numéro d'affiliation, taux de prise en charge (70% - 100%), statut d'éligibilité.

### 3.3 Régulation Kanban des Flux Patients (`PatientFlowView`)
Visualisation panoramique du parcours physique des patients à travers 5 colonnes d'avancement :
1. **Accueil & Salle d'Attente** : En attente d'orientation ou d'appel.
2. **Consultation / Box Médical** : En cours d'examen par le praticien.
3. **Plateau Technique (Radio & Biologie)** : Prélèvements et imageries en cours.
4. **Hospitalisation & Lits** : Patients en séjour ou observation continue.
5. **Caisse, Facturation & Sortie** : Règlements, ordonnance de sortie et départ.

### 3.4 Plateau Technique : Laboratoire & Radiologie (`ExaminationsView`)
Gestion complète des examens complémentaires prescrits :
* **Laboratoire de Biologie Médicale** :
  - Enregistrement des prélèvements avec génération de code-barres unique.
  - Saisie et validation des résultats paramétriques (ex. *Troponine I Us, NFS, Ionogramme, Créatinine*).
  - Détection automatique des valeurs normales, élevées et **critiques vitales**.
  - Validation électronique par le Médecin Biologiste.
* **Radiologie & Imagerie Médicale** :
  - Modalités prises en charge : Scanner (TDM), IRM, Échographie Doppler, Radiographie standard.
  - Visualiseur de clichés simulé (mode PACS / DICOM) avec manipulation de contraste et zoom.
  - Compte-rendu radiologique officiel signé et téléchargeable.

### 3.5 Bloc Opératoire, Check-list OMS & Surveillance SSPI (`SurgeryView`)
Module chirurgical dédié à la sécurité péri-opératoire :
* **Planning des Salles d'Opération (Norme ISO 5)** :
  - Affectation du patient, de l'équipe chirurgicale, du médecin anesthésiste et du type d'anesthésie (AG, ALR, Rachi).
* **Check-list de Sécurité Chirurgicale de l'OMS (3 Temps)** :
  1. *Sign-In (Avant induction)* : Identité vérifiée, site opératoire marqué, consentement anesthésique validé, matériel d'intubation vérifié.
  2. *Time-Out (Avant incision)* : Présentation de l'équipe, confirmation de l'acte, antibioprophylaxie < 60 min, disponibilité des images.
  3. *Sign-Out (Avant sortie de salle)* : Compte des compresses et instruments, étiquetage des pièces anatomopathologiques, prescriptions post-op.
* **Surveillance en Salle de Réveil (SSPI) & Score d'Aldrete** :
  - Évaluation continue sur 5 critères cotés de 0 à 2 : Motricité, Respiration, Pression artérielle, Conscience, Coloration/SpO2.
  - Autorisation de sortie vers la chambre d'hospitalisation conditionnée par un score ≥ 9/10.

### 3.6 Hospitalisation, 28 Lits & Passeport de Soins (`HospitalizationView`)
Gestion de la capacité litière sectorisée :
* **Sectorisation des Lits** :
  - *Étage 1* : Chirurgie Orthopédique & Viscérale (10 lits).
  - *Étage 2* : Médecine Interne & Cardiologie (8 lits).
  - *Aile Sud* : Suites VIP & Maternité (6 lits individuels haut standing).
  - *RDC* : USIC & Soins Intensifs (4 lits monitorés haute technicité).
* **Cycle de Vie du Lit** : `Disponible` ➔ `Occupé` ➔ `Bio-nettoyage en cours` ➔ `Réservé`.
* **Passeport de Soins Intégré** :
  - Consignes diététiques (*Régime hyposodé, Diabétique, Hyperprotidique, À jeun*).
  - Degré d'autonomie et de mobilité (*Autonome, Assisté, Alité strict*).
  - Précautions d'isolement (*Standard, Contact, Gouttelettes, Protecteur neutropénique*).

### 3.7 Soins Infirmiers & Cahier d'Administration MAR (`NursingView`)
Module infirmier dédié à l'exécution et au traçage des prescriptions :
* **Planificateur de Tâches de Soins** :
  - Réfection de pansements stériles, surveillances glycémiques, nébulisations, bilans hydro-électrolytiques.
  - Horodatage et validation nominative par l'infirmière en poste.
* **e-MAR (Electronic Medication Administration Record)** :
  - Suivi des administrations médicamenteuses par patient.
  - Contrôle des voies d'administration (IV, SC, Per os, Inhalation) et posologies.
  - Horodatage certifié de chaque dose injectée.

### 3.8 Pharmacie Hospitalière & Chaîne du Froid (`PharmacyView`)
Gestion logistique et sécurisée des spécialités pharmaceutiques :
* **Catalogue des Médicaments Hospitaliers** :
  - Dénomination Commune Internationale (DCI), dosage, forme galénique et classe thérapeutique.
  - Traçabilité complète des **numéros de lot** et **dates de péremption**.
  - Respect de la **Chaîne du Froid (2°C - 8°C)** pour les insulines et produits dérivés du sang.
* **Gestion des Niveaux de Stock & Réapprovisionnement** :
  - Alertes automatiques de seuil minimal critique.
  - Modale de réapprovisionnement instantanée avec calcul de valorisation financière en MAD.

### 3.9 Évacuations & Transferts Médicalisés SAMU 05 (`TransfersView`)
Régulation des transferts inter-établissements et évacuations sanitaires d'urgence :
* **Protocoles de Transfert** :
  - Niveaux d'urgence : *Routine*, *Urgent (Ambulance privée)*, *Urgence Vitale (SAMU 05 / SMUR)*.
  - Établissements de destination conventionnés : CHU Ibn Rochd, Hôpital Militaire d'Instruction Mohammed V, Hôpital Cheikh Khalifa.
* **Dossier Médical de Liaison Numérisé** :
  - Synthèse médicale du médecin régulateur, constantes de départ, pièces justificatives jointes (ECG, compte-rendu opératoire).

### 3.10 Facturation Guichet, Devis & Quittances (`BillingAmoView`)
Moteur de calcul tarifaire aux normes de la nomenclature nationale marocaine :
* **Ventilation Automatique Tiers-Payant / Co-pay** :
  - Calcul instantané de la prise en charge AMO (70% à 100%) et du ticket modérateur patient.
* **Génération de Quittances & Factures Officielles** :
  - Présentation détaillée des actes cotés (Consultations, Forfaits bloc, Séjour, Imagerie, Biologie).
  - Émission de la quittance légale avec mentions fiscales, identifiant FSE et QR code de sécurité.

### 3.11 Caisse Journalière & Réconciliation des Écarts (`CashRegisterModal`)
Sécurisation des flux financiers physiques :
* **Ouverture & Clôture de Session de Caisse** :
  - Fonds de caisse initial, encaissements ventilés par moyen de paiement (*Espèces*, *Carte Bancaire CMI*, *Chèques*, *Virements*).
* **Calculateur de Monnaie & Pointage des Espèces** :
  - Comptage physique des billets et pièces confronté au solde théorique.
  - Calcul et justification des écarts de caisse éventuels avant validation du procès-verbal de clôture.

### 3.12 Portail Tiers-Payant AMO & Gestion des Rejets (`AmoPortalView`)
Interconnexion télématique avec la passerelle Masar Santé (CNSS / CNOPS) :
* **Bordereaux de Télétransmission** :
  - Constitution des lots de Feuilles de Soins Électroniques (FSE) et envoi sécurisé.
* **Remédiation Assistée des Rejets FSE** :
  - Diagnostic du code rejet (ex. *R-12 Contre-signature manquante*, *R-04 Entente préalable expirée*, *R-09 Code INPE erroné*).
  - Procédure de correction guidée et réinjection immédiate dans le circuit de télétransmission.

### 3.13 GED Clinique & Consentements Signés CNDP (`DocumentsView`)
Gestion Électronique des Documents et archivage probatoire :
* **Types de Documents Médicaux Gérés** :
  - Ordonnances médicales, comptes-rendus opératoires, lettres de liaison de sortie, bulletins d'admission.
* **Consentements Éclairés & Conformité CNDP** :
  - Recueil du consentement chirurgical, anesthésique et de traitement informatique des données de santé (Loi 09-08).
  - Émargement par signature numérique horodatée.

### 3.14 Administration Système, RBAC & Multi-Cliniques (`AdminView`)
Module de gouvernance globale du système :
* **Annuaire des Utilisateurs** :
  - Création, modification, activation/désactivation de comptes soignants et administratifs.
  - Affectation multi-sites aux cliniques du réseau.
* **Matrice RBAC Granulaire** :
  - Paramétrage fin des droits d'accès sur 14 entités fonctionnelles.
* **Sélecteur Rapide de Persona Clinique** :
  - Permet de tester et d'opérer instantanément sous l'angle de différents métiers (Médecin, Infirmier, Caissier, etc.).

### 3.15 Journal d'Audit Immuable WORM (`AuditLogView`)
Traçabilité forensique et médico-légale :
* **Principe WORM (Write Once, Read Many)** :
  - Enregistrement inaltérable de chaque création, modification, consultation, validation ou suppression.
* **Attributs Auditables** :
  - Horodatage exact à la seconde, identifiant utilisateur, rôle actif, entité ciblée, adresse IP du poste client, résultat.
  - Visualiseur de « Diff » comparant la valeur antérieure et la nouvelle valeur enregistrée.

---

## 4. Matrice de Sécurité & Rôles RBAC (11 Profils)

| Rôle | Libellé Métier | Périmètre & Droits Principaux |
|---|---|---|
| `super-admin` | Directeur Médical & Technique | Accès universel, audit WORM, gestion des cliniques et rôles. |
| `admin` | Administrateur d'Établissement | Gestion des utilisateurs, paramétrage clinique, rapports financiers. |
| `doctor` | Médecin / Spécialiste | Consultations, prescriptions, dossiers 360°, validation médicale. |
| `nurse` | Infirmier(ère) Diplômé(e) d'État | Constantes, soins, e-MAR, surveillance des lits, relève. |
| `reception` | Hôtesse d'Accueil / Régulation | Admissions, vérification AMO, gestion des files d'attente, orientation. |
| `billing` | Agent de Facturation & Caisse | Création de factures, encaissements, clôture de caisse, quittances. |
| `amo-agent` | Gestionnaire Tiers-Payant AMO | Télétransmission Masar, traitement des rejets FSE, bordereaux. |
| `laboratory` | Médecin Biologiste | Saisie et validation des analyses, alertes critiques, étiquetage tubes. |
| `radiology` | Médecin Radiologue | Protocoles d'imagerie, visualiseur PACS, validation comptes-rendus. |
| `pharmacy` | Pharmacien Hospitalier | Dispensation, stocks, gestion des lots/péremptions, chaîne du froid. |
| `hygiene-agent` | Agent d'Hygiène Hospitalière | Bio-nettoyage des chambres, certification d'asepsie des lits. |

---

## 5. Cycle de Vie du Patient (13 États Stricts)

Le parcours patient est encadré par une machine à états finis garantissant l'intégrité du flux opérationnel :

```
[ ARRIVÉE ]
    │
    ▼
1. REGISTERED (Enregistré au guichet)
    │
    ▼
2. WAITING (En salle d'attente générale)
    │
    ▼
3. CALLING (Appelé vers le box de consultation)
    │
    ▼
4. TRIAGED (Constantes prises par l'infirmière)
    │
    ▼
5. IN_CONSULTATION (En cours d'examen médical)
    │
    ├─────────────────────────────┬─────────────────────────────┐
    ▼                             ▼                             ▼
6. EXAMS_PENDING            8. SURGERY_SCHEDULED          9. HOSPITALIZED
   (Plateau technique)         (Programmé au bloc)           (Admis en chambre)
    │                             │                             │
    ▼                             ▼                             │
7. EXAMS_COMPLETED          10. SSPI_RECOVERY                   │
   (Résultats validés)          (Surveillance réveil)           │
    │                             │                             │
    └─────────────────────────────┴─────────────────────────────┘
                                  │
                                  ▼
                    11. PENDING_BILLING (En attente règlement)
                                  │
                                  ▼
                    12. BILLED_PAID (Facture réglée)
                                  │
                                  ▼
                    13. DISCHARGED (Sortie autorisée de la clinique)
```

---

## 6. Cartographie Détaillée des Circuits & Flux Cliniques

### Circuit A : Admission Guichet & Vérification AMO Masar
1. Le patient se présente au guichet de la Clinique Al Bassma.
2. L'hôtesse ouvre la modale **Nouvelle Admission**.
3. Saisie du numéro de CIN (détection automatique de doublon).
4. Clic sur **Vérifier Droits AMO** : la passerelle vérifie l'immatriculation et retourne les taux de couverture conventionnés.
5. Attribution du service d'orientation, du praticien et impression du ticket horodaté.
6. Le patient entre en salle d'attente et apparaît dans la file active du Tableau de Bord.

### Circuit B : Consultation Médicale & Prescription
1. Le médecin appelle le patient depuis son poste de travail (notification sonore et visuelle).
2. L'infirmière valide la prise des constantes dans le DPI 360°.
3. Le médecin réalise l'anamnèse, consigne le diagnostic principal CIM-10 et les diagnostics différentiels.
4. Rédaction de l'e-prescription avec contrôle des contre-indications et mention « Non Substituable ».
5. Si des examens complémentaires sont requis, orientation vers le module d'examens.

### Circuit C : Plateau Technique (Biologie & Radiologie PACS)
1. Les demandes d'analyses sont transmises en temps réel au laboratoire.
2. Le technicien étiquette les tubes avec code-barres et réalise les analyses.
3. Saisie des résultats : si un paramètre critique est détecté (ex. *Troponine I Us > 45 ng/L*), une alerte rouge clignotante est notifiée au médecin traitant.
4. Pour la radiologie : réalisation du cliché, mise à disposition dans le visualiseur PACS/DICOM, rédaction et signature du compte-rendu.

### Circuit D : Programmation Chirurgicale, Bloc & SSPI Aldrete
1. Le chirurgien programme l'intervention en salle d'opération ISO 5.
2. En pré-opératoire : validation de la visite pré-anesthésique et du jeûne.
3. Au bloc opératoire : exécution interactive des 3 étapes de la **Check-list de Sécurité de l'OMS** (*Sign-in, Time-out, Sign-out*).
4. Transfert en SSPI : surveillance continue et calcul du **Score d'Aldrete**. Dès obtention d'un score ≥ 9/10, transfert autorisé vers le lit d'hospitalisation.

### Circuit E : Hospitalisation, Passeport de Soins & MAR
1. Affectation du patient à un lit `Disponible` dans le service adapté.
2. Le lit passe au statut `Occupé` et le passeport de soins est initialisé.
3. Les infirmières exécutent le plan de soins et horodatent les administrations médicamenteuses sur le cahier e-MAR.
4. À la sortie médicale : le lit bascule en `Bio-nettoyage`. L'agent d'hygiène réalise la désinfection et valide le protocole, restituant la disponibilité du lit.

### Circuit F : Transfert d'Urgence SAMU 05
1. Si l'état du patient requiert un plateau technique de recours (ex. défaillance multi-viscérale vers le CHU Ibn Rochd), le médecin déclenche une demande de transfert.
2. Sélection de l'établissement receveur et du niveau d'urgence (*SAMU 05 Vital*).
3. Génération automatique du dossier médical de transfert incluant les constantes, ECG et compte-rendu de régulation.

### Circuit G : Facturation, Encaissement & Session de Caisse
1. Clôture des actes médicaux et génération de la facture dans le module de facturation.
2. Calcul automatique de la ventilation AMO (part prise en charge) et du ticket modérateur patient.
3. Encaissement au guichet caisse :
   - Espèces avec calculatrice de monnaie automatique.
   - Carte Bancaire CMI ou Chèque.
4. Impression de la quittance légale de paiement.
5. En fin de journée : procédure de clôture de caisse avec comptage des espèces, justification des écarts et édition du PV officiel.

### Circuit H : Traitement des Rejets FSE & Télétransmission
1. Télétransmission des FSE par lots vers la passerelle Masar Santé.
2. Suivi des retours : en cas de rejet, notification immédiate avec code d'erreur officiel (ex. *R-12, R-04, R-09*).
3. Application de l'action corrective recommandée par le système (signature numérique, prorogation d'accord, mise à jour INPE).
4. Réexpédition du dossier régularisé.

---

## 7. Guide du Scénario Démo Interactif (25 Étapes)

Le scénario de démonstration interactif est accessible à tout moment depuis le bouton **« Scénario Démo (25 Étapes) »** situé dans la barre latérale et l'en-tête. Il guide pas à pas à travers les 25 moments opérationnels clés de la clinique :

1. **Tour de Contrôle & File d'Attente** : Vue d'ensemble et appel du patient en salle d'attente.
2. **Admission & Vérification AMO** : Contrôle des droits CNSS/CNOPS en direct via CIN.
3. **Prise de Constantes Vitales** : Enregistrement de la tension, fréquence cardiaque et SpO2.
4. **Consultation Médicale** : Diagnostic CIM-10, anamnèse et examen physique.
5. **Prescription Électronique** : Rédaction d'ordonnance avec mention Non Substituable.
6. **Demande d'Analyses de Biologie** : Prescription de troponine et bilan lipidique.
7. **Étiquetage & Code-barres Tubes** : Traçabilité des prélèvements sanguins.
8. **Détection Valeur Critique** : Alerte d'urgence sur résultat de troponine critique.
9. **Validation Biologique** : Signature numérique par le médecin biologiste.
10. **Prescription Imagerie (Scanner TDM)** : Demande d'examen radiologique urgent.
11. **Visualiseur PACS / Cliché Radio** : Analyse du cliché radiologique et compte-rendu.
12. **Programmation Bloc Opératoire** : Affectation en salle ISO 5 et briefing équipe.
13. **Check-list Sécurité OMS (Sign-In)** : Contrôles pré-induction anesthésique.
14. **Check-list Sécurité OMS (Time-Out)** : Validation d'équipe avant incision chirurgicale.
15. **Check-list Sécurité OMS (Sign-Out)** : Compte des compresses et soins post-op.
16. **Surveillance SSPI & Score d'Aldrete** : Évaluation du réveil cotée sur 10.
17. **Affectation Chambre d'Hospitalisation** : Transfert en Chambre 101 (Lit A).
18. **Passeport de Soins & Précautions** : Régimes alimentaires et précautions d'isolement.
19. **Cahier d'Administration e-MAR** : Horodatage d'injection d'anticoagulant Lovenox.
20. **Pharmacie & Chaîne du Froid** : Contrôle du stock et réapprovisionnement sécurisé.
21. **Régulation Transfert SAMU 05** : Évacuation médicalisée vers le CHU de recours.
22. **Consentement CNDP & Signature** : Émargement légal du patient (Loi 09-08).
23. **Facturation Détaillée & AMO** : Décomposition part caisse vs ticket modérateur.
24. **Encaissement & Session de Caisse** : Règlement au guichet et contrôle des espèces.
25. **Audit WORM & Télétransmission Masar** : Vérification des traces immuables et envoi FSE.

---

## 8. Modèle de Données & Schémas Techniques

L'ensemble des structures de données est strictement modélisé en TypeScript (`/src/types.ts`) :

* `Patient` : Identité, CIN, téléphone, organisme AMO, constantes vitales, antécédents, alertes, statut de cycle de vie (13 états), localisation physique.
* `Examination` : Type (biologie / radiologie), nom, catégorie, statut, urgence, prescripteur, paramètres quantitatifs, code-barres, URL image/compte-rendu.
* `SurgeryCase` : Salle de bloc, chirurgien, anesthésiste, statut, check-list OMS (3 étapes booléennes), score d'Aldrete SSPI.
* `NursingTask` & `MedicationAdministration` : Soin, heure planifiée, heure réelle, infirmier exécutant, voie d'administration, lot médicament.
* `MedicationItem` : DCI, dosage, forme, conditionnement chaîne du froid, seuil d'alerte, stock courant, prix unitaire MAD.
* `TransferRequest` : Urgence vitale, hôpital cible, ambulance, médecin régulateur, motif, documents joints.
* `Invoice` & `InvoiceItem` : Cotation des actes, montant global, part AMO, ticket modérateur, statut de paiement, identifiant FSE.
* `AuditLogEntry` : Horodatage immuable, identifiant utilisateur, rôle, action, entité, module, adresse IP, résultat d'exécution.
* `ClinicUser` & `RolePermission` : Profils utilisateurs, établissements rattachés, matrice des droits par entité.

---

## 9. Conformité Réglementaire & Sécurité des Données (Loi 09-08 CNDP)

L'architecture de ClinicFlow Casablanca intègre nativement les exigences déontologiques et juridiques marocaines :

1. **Protection des Données de Santé à Caractère Personnel (Loi 09-08)** :
   - Recueil formalisé du consentement éclairé numérique du patient dès l'admission.
   - Séparation stricte des données médicales confidentielles et des données comptables de facturation.
   - Mention du numéro de déclaration / autorisation de traitement CNDP (`A-M-342/2023`).
2. **Journal d'Audit Immuable (WORM Compliance)** :
   - Aucun enregistrement d'accès ou de modification ne peut être altéré ou supprimé rétroactivement.
   - Conservation des traces avec adresse IP, poste de travail et identifiant du praticien pour toute réquisition judiciaire ou ordinale.
3. **Nomenclature Nationale des Actes Professionnels (NGAP / ANAM)** :
   - Alignement rigoureux des cotations avec les référentiels officiels de remboursement de l'ANAM, de la CNSS et de la CNOPS.

---
*Clinique Al Bassma — Hub Médical Casablanca • Plateforme ClinicFlow certifiée conforme aux exigences du Ministère de la Santé et de la CNDP.*

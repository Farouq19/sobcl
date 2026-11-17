# 🏥 CAHIER DES CHARGES FONCTIONNEL & TECHNIQUE (CDCF/CCTP)
## SYSTÈME D'INFORMATION HOSPITALIER (SIH) UNIFIÉ — CLINICFLOW MAROC
**Version :** 2.4 — Édition Définitive de Production 2026  
**Destinataires :** Direction Générale, Direction Médicale, DSI, Équipe de Développement Full-Stack (Codex / Tech Leads)  
**Périmètre :** Cliniques Médico-Chirurgicales, Hôpitaux Privés & Établissements de Soins (Royaume du Maroc)  
**Conformité Règlementaire :** Loi CNDP 09-08, Décrets AMO / CNSS / CNOPS, Référentiel National de Santé Numérique  

---

## SOMMAIRE EXÉCUTIF

1. [Contexte, Enjeux & Vision Stratégique](#1-contexte-enjeux--vision-stratégique)
2. [Périmètre Fonctionnel Global (16 Modules Métiers)](#2-périmètre-fonctionnel-global-16-modules-métiers)
3. [Spécifications Fonctionnelles Détaillées par Module](#3-spécifications-fonctionnelles-détaillées-par-module)
4. [Exigences Règlementaires & Spécificités Marocaines](#4-exigences-règlementaires--spécificités-marocaines)
5. [Matrice des Rôles & Sécurité d'Accès (RBAC)](#5-matrice-des-rôles--sécurité-daccès-rbac)
6. [Architecture Technique Cible & Performances](#6-architecture-technique-cible--performances)
7. [Modèle de Données & Schéma Relationnel Clé](#7-modèle-de-données--schéma-relationnel-clé)
8. [Exigences Non-Fonctionnelles (SLA, Sécurité, PRA)](#8-exigences-non-fonctionnelles-sla-sécurité-pra)
9. [Plan de Déploiement, Recette & Conduite du Changement](#9-plan-de-déploiement-recette--conduite-du-changement)

---

## 1. CONTEXTE, ENJEUX & VISION STRATÉGIQUE

### 1.1 Contexte du Secteur Hospitalier au Maroc
Le secteur de la santé au Maroc traverse une transformation majeure accélérée par la généralisation de l'**Assurance Maladie Obligatoire (AMO)**, la refonte du système national de santé et les exigences strictes de la **CNDP (Loi 09-08)** relative à la protection des données à caractère personnel. Les cliniques privées et hôpitaux doivent concilier :
- Une prise en charge patient fluide, sans rupture de parcours ni attente déraisonnable.
- Une rigueur médico-légale absolue (traçabilité chirurgicale, dispensation médicamenteuse, tenue du DPI).
- Une sécurisation de la chaîne financière (facturation NGAP complexe, décompte tiers-payant AMO, clôture journalière de caisse sans écart).
- Une collaboration en temps réel entre personnels d'accueil, soignants, chirurgiens, pharmaciens et administratifs.

### 1.2 Objectifs Stratégiques de ClinicFlow
ClinicFlow est conçu pour être le **SIH de référence de nouvelle génération (2026)** :
1. **Zéro Rupture de Flux** : De l'admission d'urgence au bloc opératoire et à la facturation finale, aucune ressaisie n'est tolérée.
2. **Temps Réel Hospitalier (Event-Driven)** : Diffusion instantanée via SSE (Mercure) des états de lits, des alertes vitales et du statut des salles d'opération.
3. **Conformité & Tiers-Payant Natif** : Moteur de calcul automatisé des parts AMO/CNOPS/Mutuelles et blocage préventif des dépassements sans entente préalable (> 5 000 MAD).
4. **Scellement Médico-Légal WORM** : Journalisation inaltérable avec hachage SHA-256 de toute consultation ou altération de données médicales.

---

## 2. PÉRIMÈTRE FONCTIONNEL GLOBAL (16 MODULES MÉTIERS)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               CLINICFLOW SIH - CORE SYSTEM                             │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│    PÔLE ACCUEIL & SOINS  │    PÔLE MÉDICO-TECHNIQUE    │     PÔLE FINANCE & GESTION    │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ M1. Urgences & Triage    │ M5. Bloc & SSPI (Aldrete)   │ M8. Facturation & Cotation    │
│ M2. Admissions & IPP     │ M6. Pharmacie & e-MAR       │ M9. Caisse Centrale & Clôture │
│ M3. Gestion des Lits     │ M7. Plateau Technique/Labo  │ M10. Télétransmission AMO B2B │
│ M4. Dossier Patient DPI  │ M11. GED & Barid e-Sign     │ M13. Tableaux de Bord & BI    │
├──────────────────────────┴─────────────────────────────┴───────────────────────────────┤
│                        PÔLE TRANSVERSE, SÉCURITÉ & AUDIT                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ M12. Audit Légal WORM & CNDP  │ M14. RH & Plannings de Garde  │ M15. Configuration & Réf.   │
│ M16. Moteur de Démonstration Interactive (Scénario 25 étapes)                          │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES PAR MODULE

### MODULE 1 — Urgences & Triage Médico-Infirmier (CIMU 1 à 5)
* **Objectif :** Accueillir, évaluer et orienter les patients urgents sans délai selon le protocole de tri CIMU.
* **Fonctionnalités Requises :**
  - **Grille de Triage CIMU :**
    - `CIMU 1` : Déchoquage immédiat (0 min) — Arrêt cardiorespiratoire, polytraumatisme sévère.
    - `CIMU 2` : Très urgent (SLA < 10 min) — Douleur thoracique aiguë, AVC suspecté, détresse respiratoire.
    - `CIMU 3` : Urgent (SLA < 30 min) — Fracture fermée, douleur abdominale intense, fièvre élevée.
    - `CIMU 4` : Semi-urgent (SLA < 60 min) — Plaie suturable simple, traumatisme isolé stable.
    - `CIMU 5` : Non-urgent (SLA < 120 min) — Consultation générale, renouvellement.
  - **Saisie des Constantes Vitales Initiale :** Tension artérielle (mmHg), Fréquence cardiaque (bpm), SpO2 (%), Température (°C), Score de Glasgow (3-15), EVA douleur (0-10).
  - **Chronomètre Dynamique & Alerte de Dépassement :** Décompte visuel en temps réel ; clignotement rouge si le SLA est dépassé.
  - **Orientation Immédiate :** Boutons d'action rapide vers *Déchoquage*, *Box de consultation*, *Radio express* ou *Hospitalisation directe*.

### MODULE 2 — Bureau des Entrées, Admissions & Identification (IPP)
* **Objectif :** Créer et sécuriser l'identité du patient, vérifier ses droits d'assurance et ouvrir l'épisode de soins.
* **Fonctionnalités Requises :**
  - **Identifiant Permanent Patient (IPP) :** Génération automatique au format `IPP-AAAA-XXXXXX`.
  - **Vérification d'Identité :** Numéro de CIN (Carte d'Identité Nationale), Passeport ou Registre Civil pour mineurs.
  - **Assurances & Organismes Payeurs :**
    - AMO CNSS (Régime salarié et indépendants).
    - CNOPS (Secteur public).
    - Assurances Privées (Wafa Assurance, Saham/Sanlam, AXA, RMA, AtlantaSanad).
    - Privé / Auto-payant (Paiement intégral direct).
  - **Indicateur ALD (Affection de Longue Durée) :** Prise en charge à 100% ou taux majoré selon liste légale des pathologies chroniques.
  - **Consentement Éclairé & RGPD/CNDP :** Enregistrement de l'accord du patient et des personnes à prévenir.

### MODULE 3 — Gestion des Lits & Unités d'Hospitalisation
* **Objectif :** Maximiser le taux d'occupation des lits, éviter les conflits d'attribution et tracer l'hygiène hospitalière.
* **Fonctionnalités Requises :**
  - **Machine à États Finis (State Machine) des Lits :**
    - `DISPONIBLE` : Prêt pour une attribution immédiate.
    - `OCCUPÉ` : Patient assigné avec date/heure d'entrée et médecin traitant.
    - `EN_NETTOYAGE` : Patient sorti ; lit verrouillé pour décontamination et bionettoyage.
    - `HORS_SERVICE` : Maintenance technique ou panne matérielle.
  - **Cartographie par Service :** Soins Intensifs, Réanimation, Cardiologie, Maternité, Chirurgie Ambulatoire, Médecine Interne.
  - **Affectation & Transfert en 1 Clic :** Modal de sélection patient avec réassignation instantanée et mise à jour temps réel (Mercure SSE).

### MODULE 4 — Dossier Patient Informatisé (DPI / EHR)
* **Objectif :** Centraliser l'ensemble de l'historique médical, biologique, thérapeutique et clinique du patient.
* **Fonctionnalités Requises :**
  - **Antécédents & Allergies à Alerte Critique :** Bannières d'alerte rouge clignotante pour allergies majeures (Pénicilline, Latex, Produits de contraste iodés).
  - **Feuille d'Observations Médicales :** Notes d'évolution datées, horodatées et signées par le médecin référent.
  - **Courbes des Constantes :** Visualisation graphique de l'évolution de la tension, saturation et température sur 24h/7j.
  - **Historique des Épisodes :** Liste chronologique des hospitalisations, passages aux urgences et interventions antérieures.

### MODULE 5 — Bloc Opératoire, Checklist OMS & SSPI (Salle de Réveil)
* **Objectif :** Assurer la sécurité chirurgicale, tracer les temps opératoires et garantir les critères de sortie de réveil.
* **Fonctionnalités Requises :**
  - **Checklist Sécurité OMS en 3 Étapes Obligatoires :**
    1. *Sign In (Avant induction)* : Identité confirmée, site marqué, consentement vérifié, matériel anesthésique contrôlé.
    2. *Time Out (Avant incision)* : Présentation de l'équipe, rappel des risques hémorragiques, antibioprophylaxie injectée.
    3. *Sign Out (Avant sortie de salle)* : Compte des compresses et aiguilles exact, étiquetage des pièces anatomiques, prescriptions post-op.
  - **Score d'Aldrete Post-Anesthésique (SSPI) :**
    - Évaluation sur 5 critères (Activité motrice, Respiration, Circulation/Tension, Conscience, Coloration/SpO2) notés de 0 à 2.
    - **Règle Stricte de Décharge :** Score total $\ge 9/10$ obligatoire pour autoriser le transfert de SSPI vers la chambre.

### MODULE 6 — Pharmacie Hospitalière, Stocks & e-MAR
* **Objectif :** Sécuriser le circuit du médicament, appliquer la règle des 5B et prévenir les ruptures de stock.
* **Fonctionnalités Requises :**
  - **Règle des 5B :** Bon patient, Bon médicament, Bonne dose, Bonne voie, Bon moment.
  - **Double Validation des Stupéfiants & Toxiques :** Signature électronique conjointe (Infirmier + Médecin) pour dérivés morphiniques.
  - **Gestion Atomique des Stocks :** Décrémentation automatique des lots (FIFO / FEFO) lors de l'administration avec alerte de péremption.

### MODULE 7 — Plateau Technique (Laboratoire & Imagerie)
* **Objectif :** Prescrire, suivre et récupérer les examens complémentaires avec détection des valeurs d'alerte.
* **Fonctionnalités Requises :**
  - **Prescription Électronique :** Bilans sanguins (NFS, Ionogramme, Troponine, Hémostase), Imagerie (Scanner, IRM, Échographie, RX).
  - **Alerte Valeurs Panique (Critical Values) :** Déclenchement d'un encart visuel prioritaire si résultat critique (ex: Troponine ultra-sensible > seuil).
  - **Liaison PACS/DICOM :** Prévisualisation des comptes-rendus et liens vers les séries d'images radiologiques.

### MODULE 8 — Facturation Hospitalière & Cotation NGAP Marocaine
* **Objectif :** Générer les bordereaux et factures conformes aux nomenclatures des actes professionnels du Maroc.
* **Fonctionnalités Requises :**
  - **Cotation selon Nomenclature Officielle :**
    - Lettre-clé `K` (Actes de chirurgie et spécialités).
    - Lettre-clé `AMI` (Actes propres aux infirmiers).
    - Lettre-clé `CS` / `C` (Consultations spécialistes et généralistes).
  - **Calcul Automatique de la Répartition Tiers-Payant :**
    - *Part Organisme (AMO / Mutuelle)* : Calculée selon le taux conventionnel (70%, 80%, 85% ou 100% si ALD).
    - *Part Patient (Ticket Modérateur)* : Reste à charge net payable à la caisse.
  - **Règle de Blocage — Entente Préalable :** Alerte automatique si le devis dépasse **5 000 MAD** sans accord préalable visé par l'organisme payeur.

### MODULE 9 — Caisse Centrale & Clôture Journalière (Z de Caisse)
* **Objectif :** Encaisser la part patient, émettre des quittances officielles et garantir l'exactitude comptable quotidienne.
* **Fonctionnalités Requises :**
  - **Encaissement Multimode :** Espèces, TPE Carte Bancaire, Chèque certifié, Virement bancaire.
  - **Quittance d'Encaissement :** Émission instantanée avec numéro de reçu unique et mention légale.
  - **Clôture Journalière (Z de Caisse) :** Rapprochement théorique vs réel, détection des écarts de caisse, verrouillage de session avec empreinte horaire.

### MODULE 10 — Télétransmission & B2B AMO (Lots de Factures)
* **Objectif :** Préparer, regrouper et transmettre les dossiers de prise en charge vers la CNSS et la CNOPS.
* **Fonctionnalités Requises :**
  - **Création de Lots (Batches) :** Regroupement de factures validées par caisse d'affiliation.
  - **Génération du Bordereau de Transmission :** Document officiel récapitulatif avec totalisation des montants et nombre d'actes.
  - **Suivi des Rejets & Litiges :** Statuts `Transmis`, `En Traitement`, `Validé`, `Rejeté` (avec motif de rejet et possibilité de re-soumission).

### MODULE 11 — Gestion Électronique des Documents & Barid e-Sign
* **Objectif :** Dématérialiser les pièces médicales avec valeur probante et signature électronique qualifiée marocaine.
* **Fonctionnalités Requises :**
  - **Génération PDF Native :** Comptes-rendus opératoires (CRO), comptes-rendus d'hospitalisation (CRH), ordonnances médicales.
  - **Signature Barid e-Sign / Certificat Qualifié :** Apposition d'une signature numérique cryptographique et QR Code de vérification d'intégrité.

### MODULE 12 — Audit Légal WORM & Conformité CNDP 09-08
* **Objectif :** Garantir la traçabilité inaltérable des accès aux données de santé conformément à la loi marocaine.
* **Fonctionnalités Requises :**
  - **Stockage WORM (Write Once, Read Many) :** Interdiction matérielle et logicielle de tout `UPDATE` ou `DELETE` sur la table des logs.
  - **Chaînage Cryptographique SHA-256 :** Chaque entrée intègre l'empreinte de la précédente, l'horodatage précis, l'identifiant de l'utilisateur, son rôle et la ressource accédée.
  - **Console d'Audit du DPO :** Filtres par période, utilisateur, type d'action et vérification de la chaîne de signature.

### MODULE 13 — Tableaux de Bord & Pilotage Décisionnel (BI)
* **Objectif :** Fournir à la Direction Générale et Médicale les indicateurs clés de performance (KPI) en temps réel.
* **Fonctionnalités Requises :**
  - Taux d'occupation global et par service (%).
  - Durée Moyenne de Séjour (DMS en jours).
  - Délai moyen d'attente aux urgences par code CIMU.
  - Chiffre d'affaires journalier/mensuel réalisé, facturé AMO et encaissé en caisse.
  - Taux de recouvrement des créances organismes.

### MODULE 14 — Ressources Humaines, Gardes & Présences Médicales
* **Objectif :** Gérer les plannings de garde, astreintes chirurgicales et présences infirmières par unité.
* **Fonctionnalités Requises :**
  - Tableau de service des gardes 24h/24 (Urgences, Réanimation, Bloc).
  - Indicateur de présence active en temps réel.
  - Historique des remplacements et vacations.

### MODULE 15 — Paramétrage, Référentiels & Nomenclatures Clinique
* **Objectif :** Administrer les données maîtres de l'établissement sans intervention sur le code source.
* **Fonctionnalités Requises :**
  - Gestion du catalogue des actes NGAP et tarifs associés.
  - Configuration des chambres, lits, étages et blocs.
  - Paramétrage des conventions d'assurances et barèmes mutuelles.

### MODULE 16 — Moteur de Démonstration Interactive & Scénarios Guidés
* **Objectif :** Permettre des présentations commerciales ou des formations immersives sans données fictives destructives.
* **Fonctionnalités Requises :**
  - Scénario guidé en **25 étapes chronologiques** (du patient qui franchit les urgences jusqu'à la télétransmission du lot AMO).
  - Bouton de réinitialisation de l'environnement de démo en 1 clic.

---

## 4. EXIGENCES RÈGLEMENTAIRES & SPÉCIFICITÉS MAROCAINES

| Norme / Règlement | Déclinaison Concrète dans ClinicFlow |
| :--- | :--- |
| **Loi CNDP 09-08** | Consentement explicite patient, anonymisation des exports statistiques, journalisation des consultations médicales. |
| **Nomenclature NGAP Maroc** | Gestion des coefficients $K$, $AMI$, $CS$, respect des plafonds de cotation et majorations de nuit/dimanche. |
| **Réforme de l'AMO (CNSS/CNOPS)** | Intégration du matricule AMO, taux de remboursement légaux (70% standard, 80% ALD, 100% CNOPS ALD). |
| **Seuil d'Entente Préalable** | Blocage automatique des dossiers hospitaliers $> 5\,000\text{ MAD}$ exigeant accord préalable de l'organisme. |
| **Loi 43-20 (Services de Confiance)** | Signature électronique conforme aux normes de Barid Al-Maghrib pour les prescriptions et comptes-rendus. |

---

## 5. MATRICE DES RÔLES & SÉCURITÉ D'ACCÈS (RBAC)

Le système implémente 10 profils d'utilisateurs distincts avec des privilèges hermétiques :

| Rôle | Accès Autorisé | Actions Clés | Restrictions Strictes |
| :--- | :--- | :--- | :--- |
| **1. Médecin Urgentiste** | Urgences, Tri CIMU, DPI | Diagnostic, constantes, admission | Pas d'accès aux clôtures de caisse |
| **2. Chirurgien / Anesthésiste** | Bloc, SSPI, DPI, Checklist OMS | Validation OMS, score Aldrete, CRO | Pas de manipulation des factures |
| **3. Infirmier Major / Équipe** | Lits, e-MAR, Constantes, DPI | Administration médicaments, lits | Pas de modification des cotations |
| **4. Pharmacien Hospitalier** | Pharmacie, Stocks, e-MAR | Validation ordonnances, stupéfiants | Pas d'accès aux dossiers financiers |
| **5. Agent d'Admission** | Bureau des entrées, Lits | Création patient, CIN, mutuelle | Pas de consultation des notes médicales |
| **6. Facturier Hospitalier** | Facturation, Cotation NGAP, AMO | Devis, factures, lots télétrans. | Pas de prescription médicale |
| **7. Caissier Central** | Caisse, Reçus, Z de Caisse | Encaissements, quittances, clôture | Pas de modification des montants facturés |
| **8. Technicien Labo / Radiologue** | Plateau technique, Examens | Saisie résultats, alertes panique | Pas d'accès au dossier financier |
| **9. Directeur Médical / DG** | Tableaux de bord, BI, Global | Supervision, audit global, rapports | Pas de falsification de logs |
| **10. DPO / Auditeur Légal** | Audit WORM, Journal CNDP | Contrôle de conformité SHA-256 | Lecture seule stricte des logs |

---

## 6. ARCHITECTURE TECHNIQUE CIBLE & PERFORMANCES

### 6.1 Pile Technologique de Production
* **Backend API :** PHP 8.3 + Symfony 7.2 + API Platform 4 + Doctrine ORM.
* **Base de Données Principale :** PostgreSQL 16 (Schéma relationnel strict + JSONB pour historiques cliniques).
* **Temps Réel & Événements :** Symfony Mercure Hub (Server-Sent Events via Caddy) pour la diffusion en < 50ms des états de lits et alertes vitales.
* **Cache & Files d'Attente :** Redis 7 + Symfony Messenger (génération asynchrone des lots AMO, PDFs, rappels).
* **Frontend SPA :** React 19 + TypeScript + Tailwind CSS (interface ultra-ergonomique, composants modulaires).
* **Conteneurisation :** Docker & Docker Compose multi-stage pour déploiement ISO en local, staging et production.

### 6.2 Objectifs de Performance (KPI Techniques)
* Temps de réponse moyen de l'API (P95) : $< 120\text{ ms}$.
* Recherche instantanée de patient (CIN / Nom / IPP) : $< 20\text{ ms}$.
* Latence de notification temps réel (changement état de lit, alerte labo) : $< 100\text{ ms}$.
* Disponibilité de service (SLA) : $99.95\%$ (moins de 4h d'arrêt programmé par an).

---

## 7. MODÈLE DE DONNÉES & SCHÉMA RELATIONNEL CLÉ

```
┌─────────────────┐       1..* ┌─────────────────┐       1..* ┌─────────────────┐
│     Patient     ├───────────►│    Admission    ├───────────►│     Invoice     │
│  - ipp (PK)     │            │  - id (PK)      │            │  - id (PK)      │
│  - cin          │            │  - cimuLevel    │            │  - totalAmount  │
│  - fullName     │            │  - status       │            │  - amoShare     │
│  - insuranceType│            │  - bed_id (FK)  │            │  - patientShare │
└────────┬────────┘            └────────┬────────┘            └────────┬────────┘
         │                              │                              │
         │ 1..*                         │ 1..*                         │ 1..*
┌────────▼────────┐            ┌────────▼────────┐            ┌────────▼────────┐
│ MedicalRecord   │            │ SurgerySession  │            │ CashTransaction │
│  - allergies    │            │  - omsChecklist │            │  - amountPaid   │
│  - clinicalNotes│            │  - aldreteScore │            │  - paymentMethod│
└─────────────────┘            └─────────────────┘            └─────────────────┘
```

---

## 8. EXIGENCES NON-FONCTIONNELLES (SLA, SÉCURITÉ, PRA)

1. **Chiffrement des Données :**
   - Données en transit : TLS 1.3 obligatoire avec HSTS.
   - Données au repos : Chiffrement AES-256 de la base PostgreSQL et des volumes de stockage GED.
2. **Sauvegardes & Rétention :**
   - Sauvegarde continue WAL (Write-Ahead Logging) pour restauration point-in-time (PITR).
   - Snapshots quotidiens externalisés avec rétention légale de 10 ans pour les dossiers médicaux.
3. **Plan de Reprise d'Activité (PRA / PCA) :**
   - RPO (Perte de données maximale admissible) : $\le 5\text{ minutes}$.
   - RTO (Temps de rétablissement maximal admissible) : $\le 30\text{ minutes}$.

---

## 9. PLAN DE DÉPLOIEMENT, RECETTE & CONDUITE DU CHANGEMENT

| Phase | Durée Estimée | Livrables Principaux |
| :--- | :--- | :--- |
| **Phase 1 : Socle & Modélisation** | Semaines 1 à 3 | Déploiement Docker, schéma PostgreSQL, entités Doctrine, API Platform de base. |
| **Phase 2 : Moteurs Médicaux** | Semaines 4 à 6 | Triage CIMU, DPI, gestion des lits avec Mercure SSE, Checklist OMS et Aldrete. |
| **Phase 3 : Moteurs Financiers & AMO** | Semaines 7 à 9 | Cotation NGAP, calculs de tiers-payant, Caisse centrale, Z de caisse, lots AMO. |
| **Phase 4 : Sécurité & Audit CNDP** | Semaines 10 à 11 | Journalisation WORM SHA-256, tests d'intrusion, habilitations RBAC strictes. |
| **Phase 5 : Recette & Mise en Pilote** | Semaines 12 à 14 | Formation des personnels soignants et administratifs, migration pilote, Go-Live. |

---

*Document officiel rédigé pour le projet ClinicFlow SIH. Prêt pour transmission aux instances de direction, aux investisseurs et aux équipes techniques de développement.*

# 🏛️ CODEX PRODUCTION BLUEPRINT: SYMFONY 7 (BACKEND) + REACT 19 (FRONTEND)
## Architecture Complète SIH Hospitalier 360° (Morocco Healthtech Production Stack)
*Version: 3.0.0 — Enterprise Production Standard (PHP 8.3 / Symfony 7 / React 19 / PostgreSQL / Redis / Mercure)*

---

## 1. COMPOSITION DE LA STACK TECHNIQUE DE PRODUCTION

| Composant | Technologie Recommandée | Rôle dans l'Architecture SIH |
| :--- | :--- | :--- |
| **Backend Framework** | **PHP 8.3 + Symfony 7.2 (API Platform 4)** | Moteur d'API REST/GraphQL, sécurité RBAC, sérialisation DTO, validation des règles métier médicales. |
| **ORM & Base de Données** | **Doctrine ORM + PostgreSQL 16** | Stockage relationnel ACID, JSONB pour les dossiers médicaux complexes, contraintes d'intégrité strictes. |
| **Frontend SPA** | **React 19 + TypeScript + Tailwind CSS** | Interface soignants/médecins ultra-réactive, 16 modules, formulaires contrôlés, Zéro-dépassement UI. |
| **Temps Réel (WebSockets)** | **Symfony Mercure Hub (SSE)** | Diffusion temps réel de l'état des lits, alertes constantes vitales, arrivées SAMU et notifications sans rafraîchissement. |
| **Cache & Files d'Attente**| **Redis 7 + Symfony Messenger** | Cache de session, décrémentation atomique des stocks pharmacie, file asynchrone de télétransmission AMO CNSS. |
| **Recherche Ultra-Rapide**| **Meilisearch ou PostgreSQL Full-Text** | Recherche instantanée de patients par CIN, Nom, IP, ou molécules médicamenteuses (< 10ms). |
| **GED & Documents** | **MinIO / AWS S3 (Chiffré AES-256)** | Stockage sécurisé des comptes-rendus opératoires (CRO/CRH), ordonnances signées Barid e-Sign et examens. |
| **Sécurité & Auth** | **LexikJWTAuthenticationBundle + Refresh Tokens** | Authentification JWT sans état, contrôle d'accès basé sur les rôles (10 rôles hospitaliers), traçabilité IP. |
| **Audit Légal CNDP 09-08**| **Table Postgre WORM avec triggers SHA-256** | Journalisation inaltérable des accès aux données de santé avec scellement cryptographique. |
| **Conteneurisation & CI/CD**| **Docker Compose + Multi-stage Dockerfiles** | Déploiement reproductible : PHP-FPM, Nginx, Caddy (Mercure), PostgreSQL, Redis, Worker Messenger. |

---

## 2. ARBORESCENCE CIBLE DU REPOSITORY MONOREPO OU MULTI-SERVICES

```
clinicflow/
├── backend/                             # API SYMFONY 7
│   ├── config/
│   │   ├── packages/                    # api_platform.yaml, security.yaml, messenger.yaml, mercure.yaml
│   │   └── routes.yaml
│   ├── src/
│   │   ├── Entity/                      # Modèles de données Doctrine
│   │   │   ├── Patient.php              # Patient, CIN, Mutuelle, ALD, ATCD
│   │   │   ├── Admission.php            # Épisode de soin, triage CIMU 1-5, statut
│   │   │   ├── Bed.php                  # Lits, chambres, statut asepsie (DISPO, OCCUPÉ, NETTOYAGE)
│   │   │   ├── SurgicalIntervention.php # Bloc opératoire, Checklist OMS, Score d'Aldrete
│   │   │   ├── MedicationOrder.php      # Ordonnances, dispensation MAR, toxiques
│   │   │   ├── Examination.php          # Bilans labo, radiologie, valeurs critiques
│   │   │   ├── Invoice.php              # Facturation NGAP, cotations K/AMI/CS, part AMO
│   │   │   ├── CashTransaction.php      # Encaissements caisse, Z de caisse journalier
│   │   │   ├── AmoBatch.php             # Lots de télétransmission B2B CNSS/CNOPS
│   │   │   └── WormAuditLog.php         # Journal légal CNDP 09-08 immuable avec hash SHA-256
│   │   ├── State/                       # State Processors & Providers API Platform
│   │   ├── Service/                     # Moteurs métiers purs
│   │   │   ├── AmoCalculationService.php# Calculs NGAP, tiers-payant, seuil entente préalable
│   │   │   ├── AldreteCalculator.php    # Évaluation réveil SSPI
│   │   │   ├── BedStateMachine.php      # Transitions d'état des lits & hygiène
│   │   │   ├── StockManager.php         # Décrémentation atomique Redis/Postgre des stocks
│   │   │   └── CndpAuditLogger.php      # Scellement SHA-256 des logs
│   │   ├── Security/                    # Voter Symfony pour permissions RBAC (10 profils)
│   │   └── Message/                     # Jobs asynchrones (Télétransmission AMO, Rappels SMS)
│   ├── migrations/                      # Migrations de base de données Doctrine
│   ├── Dockerfile
│   └── composer.json
│
├── frontend/                            # APPLICATION REACT 19 SPA
│   ├── src/
│   │   ├── api/                         # Clients API typés (Axios/Ky/TanStack Query)
│   │   ├── components/
│   │   │   ├── views/                   # Les 16 Vues Métiers (Flux, EHR, Lits, Bloc, Caisse...)
│   │   │   ├── modals/                  # Modales d'actions atomiques
│   │   │   └── common/                  # ErrorBoundary, Badges, Tableaux responsives
│   │   ├── context/                     # Contextes d'authentification et état UI
│   │   ├── hooks/                       # useMercure (realtime SSE), usePatients, useBeds...
│   │   └── types/                       # Interfaces TypeScript générées depuis Symfony
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml                   # Orchestration locale & staging (Nginx, PHP, Postgre, Redis, Mercure)
└── README.md
```

---

## 3. IMPLÉMENTATION DES MOTEURS CLÉS CÔTÉ SYMFONY

### 3.1 Calculateur AMO & Tiers-Payant Marocain (`AmoCalculationService.php`)
```php
<?php
namespace App\Service;

class AmoCalculationService
{
    public function computeCoverage(string $regime, float $montantTotal, bool $isAld = false, bool $hasEntente = false): array
    {
        if ($regime === 'AUCUN' || $montantTotal <= 0) {
            return [
                'total' => $montantTotal,
                'partAmo' => 0.0,
                'partPatient' => $montantTotal,
                'taux' => 0,
                'statut' => 'VALIDE',
                'motif' => 'Patient privé sans couverture'
            ];
        }

        // Taux conventionnels marocains
        $taux = match($regime) {
            'CNOPS' => $isAld ? 1.0 : 0.80,
            'CNSS' => $isAld ? 0.80 : 0.70,
            'MUTUELLE_PRIVEE' => 0.85,
            default => 0.70
        };

        // Règle marocaine : Seuil d'entente préalable à 5 000 MAD
        if ($montantTotal > 5000.0 && !$hasEntente) {
            return [
                'total' => $montantTotal,
                'partAmo' => 0.0,
                'partPatient' => $montantTotal,
                'taux' => 0,
                'statut' => 'BLOCAGE_ENTENTE_PREALABLE',
                'motif' => 'Montant > 5 000 MAD : Entente préalable obligatoire exigée par la caisse'
            ];
        }

        $partAmo = round($montantTotal * $taux, 2);
        $partPatient = round($montantTotal - $partAmo, 2);

        return [
            'total' => $montantTotal,
            'partAmo' => $partAmo,
            'partPatient' => $partPatient,
            'taux' => (int)($taux * 100),
            'statut' => 'VALIDE',
            'motif' => "Prise en charge {$regime} appliquée à " . ($taux * 100) . "%"
        ];
    }
}
```

### 3.2 Journal Légal WORM & CNDP 09-08 (`CndpAuditLogger.php`)
```php
<?php
namespace App\Service;

use App\Entity\WormAuditLog;
use Doctrine\ORM\EntityManagerInterface;

class CndpAuditLogger
{
    public function __construct(private EntityManagerInterface $em) {}

    public function log(string $user, string $role, string $action, string $resourceType, string $resourceId, array $metadata = []): WormAuditLog
    {
        $log = new WormAuditLog();
        $log->setUser($user);
        $log->setRole($role);
        $log->setAction($action);
        $log->setResourceType($resourceType);
        $log->setResourceId($resourceId);
        $log->setMetadata($metadata);
        $log->setCreatedAt(new \DateTimeImmutable());

        // Calcul empreinte SHA-256 inaltérable
        $raw = sprintf('%s|%s|%s|%s|%s|%s',
            $log->getCreatedAt()->format(\DateTimeInterface::ATOM),
            $user,
            $role,
            $action,
            $resourceType,
            $resourceId
        );
        $log->setHashSha256(hash('sha256', $raw));

        $this->em->persist($log);
        $this->em->flush();

        return $log;
    }
}
```

---

## 4. DOCKER-COMPOSE DE PRODUCTION (STACK EXÉCUTABLE)

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: clinicflow_db
    restart: unless-stopped
    environment:
      POSTGRES_DB: clinicflow_db
      POSTGRES_USER: clinic_user
      POSTGRES_PASSWORD: secure_hospital_password_2026
    volumes:
      - db_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    container_name: clinicflow_redis
    restart: unless-stopped
    ports:
      - "6379:6379"

  mercure:
    image: dunglas/mercure
    container_name: clinicflow_mercure
    restart: unless-stopped
    environment:
      SERVER_NAME: ':80'
      MERCURE_PUBLISHER_JWT_KEY: '!ChangeThisSecretMercurePublisher2026!'
      MERCURE_SUBSCRIBER_JWT_KEY: '!ChangeThisSecretMercureSubscriber2026!'
    ports:
      - "1337:80"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: clinicflow_backend
    restart: unless-stopped
    environment:
      DATABASE_URL: "postgresql://clinic_user:secure_hospital_password_2026@db:5432/clinicflow_db?serverVersion=16&charset=utf8"
      MERCURE_URL: "http://mercure/.well-known/mercure"
      MERCURE_PUBLIC_URL: "http://localhost:1337/.well-known/mercure"
      MERCURE_JWT_SECRET: "!ChangeThisSecretMercurePublisher2026!"
      REDIS_URL: "redis://redis:6379"
      APP_ENV: "prod"
      APP_SECRET: "04938a8f15893d9b0493240294b4e72c"
    depends_on:
      - db
      - redis
      - mercure

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: clinicflow_frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  db_data:
```

---

## 5. LE PROMPT MAÎTRE EXÉCUTABLE POUR CODEX (COPY-PASTE READY)

Copiez le prompt ci-dessous directement dans votre agent Codex / Claude Code / Cursor :

```text
You are a Staff Principal Full-Stack Engineer and Hospital Software Architect.
Your task is to refactor and implement the ClinicFlow SIH (Hospital Information System) into a production-ready, zero-bug, enterprise-grade application using the following strict architectural stack:

1. ARCHITECTURE & TECH STACK:
- Backend: PHP 8.3 + Symfony 7.2 + API Platform 4 + Doctrine ORM
- Database: PostgreSQL 16 (Relational schemas, JSONB for medical records, ACID transactions)
- Frontend: React 19 + TypeScript + Tailwind CSS (Single Page Application, responsive, zero-overflow UI)
- Real-time: Symfony Mercure Hub (SSE for bed status, urgent triage alerts, and surgery board updates)
- Asynchronous Tasks & Caching: Redis 7 + Symfony Messenger (AMO teletransmission batches, PDF generation, notification delivery)
- Security & Compliance: LexikJWTAuthenticationBundle, RBAC (10 hospital roles: Emergency Doctor, Surgeon, Head Nurse, Pharmacist, Billing Officer, Cashier, Lab Tech, Radiologist, Medical Director, DPO/Auditor), Moroccan CNDP 09-08 compliance with WORM SHA-256 audit logging.

2. CORE DOMAIN REQUIREMENTS (Moroccan Healthtech Context):
- Patient Registry & EHR: National ID (CIN), Permanent Patient ID (IPP), AMO/CNOPS/CNSS insurance registration, ALD flags (Affections Longue Durée), medical history, allergy alerts.
- Emergency & Triage: French/Moroccan CIMU 1 to 5 triage scoring with automated wait-time SLAs and live Mercure SSE status broadcasting.
- Bed Management: Live bed status machine (DISPONIBLE -> OCCUPÉ -> EN_NETTOYAGE -> HORS_SERVICE), room allocation, transfer logs.
- Operating Room (Bloc Opératoire): WHO 3-stage Surgical Safety Checklist (Sign In, Time Out, Sign Out), SSPI Post-Anesthesia Recovery score (Aldrete >= 9 discharge rule), sterile instrument tracking.
- Pharmacy & MAR: Closed-loop medication administration (e-MAR), batch numbers, expiry dates, controlled substance dual-signature validation, automated stock decrement with Redis optimistic locking.
- Billing & AMO Engine: Moroccan NGAP codification (K, AMI, CS), automatic calculation of Patient co-pay and AMO share (CNSS 70-80%, CNOPS 80-100%), prior authorization (Entente Préalable) threshold alert at > 5 000 MAD.
- Cashier & Treasury: Real-time payment collection (Cash, Card, Check, Wire), daily Z de caisse closing report, cashier reconciliation.
- Teletransmission & B2B AMO: Electronic batch bundling, Bordereau de Transmission generation, dispute/rejet tracking.
- Regulatory WORM Audit Log: Write-Once-Read-Many table where every record update or EHR view calculates a SHA-256 hash chaining timestamp, user, role, action, and resource. No UPDATE or DELETE allowed.

3. EXECUTION WORKFLOW:
Step 1: Set up the Dockerized environment (Nginx, PHP 8.3 FPM, PostgreSQL 16, Redis 7, Mercure Hub).
Step 2: Scaffold Symfony 7.2 with API Platform 4 and generate Doctrine entities with validation attributes and custom State Processors.
Step 3: Implement Moroccan health business services (AmoCalculationService, AldreteCalculator, BedStateMachine, StockManager, CndpAuditLogger).
Step 4: Scaffold the React 19 SPA with TypeScript and TanStack Query / Axios, integrating all 16 clinical views and real-time Mercure SSE subscriptions.
Step 5: Seed the database with realistic Moroccan clinical data (Casablanca Clinic, authentic Moroccan names, CIMU triages, NGAP codes, AMO policies).
Step 6: Run full static analysis (PHPStan level 8 for Symfony, tsc --noEmit for React) and ensure zero compile or runtime errors.

Deliver clean, production-grade, self-documented, and fully operational code.
```

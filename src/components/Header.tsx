import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DOCTOR_PROFILE_URL, CLINIC_LOGO_URL } from '../data/mockData';
import { UserRole, AppNotification, Patient, ViewMode } from '../types';
import { INITIAL_NOTIFICATIONS, INITIAL_CLINICS } from '../data/saasSeedData';

export interface HeaderModuleItem {
  id: ViewMode;
  category: 'clinical' | 'finance' | 'governance';
  categoryTitle: string;
  label: string;
  shortLabel?: string;
  icon: string;
  tagline: string;
  functioning: string;
  badge?: string | number;
  badgeType?: 'count' | 'percentage' | 'tag';
  features: string[];
}

interface HeaderProps {
  onOpenAmoCheck: () => void;
  onOpenNewAdmission: () => void;
  onOpenCashRegister?: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  currentUserRole?: UserRole;
  onChangeRole?: (role: UserRole) => void;
  onOpenDemoScenario?: () => void;
  patients?: Patient[];
  onSelectPatient?: (p: Patient) => void;
  currentView?: ViewMode;
  onNavigate?: (view: ViewMode) => void;
  waitingCount?: number;
  occupancyRate?: number;
  activeClinicId?: string;
  onChangeClinic?: (clinicId: string) => void;
}

const ROLES_CATALOG: { role: UserRole; name: string; title: string; icon: string; badge: string; dept: string }[] = [
  { role: 'doctor', name: 'Dr. Layla Zahiri', title: 'Médecin Cardiologue', icon: 'stethoscope', badge: 'Médecin', dept: 'Cardiologie & Vasculaire' },
  { role: 'super-admin', name: 'Dr. Mehdi Bennani', title: 'Super Administrateur & SIH', icon: 'shield_person', badge: 'Direction', dept: 'Direction Médicale & IT' },
  { role: 'nurse', name: 'Rachid El Mansouri', title: 'Infirmier Major', icon: 'vaccines', badge: 'Soins', dept: 'Unité Hospitalisation' },
  { role: 'reception', name: 'Sara Bennis', title: 'Accueil & Triage Admissions', icon: 'how_to_reg', badge: 'Accueil', dept: 'Bureau des Entrées' },
  { role: 'billing', name: 'Mehdi Chraibi', title: 'Facturation & Caisse Journalière', icon: 'receipt_long', badge: 'Finance', dept: 'Service Facturation' },
  { role: 'insurance-agent', name: 'Khadija Bennani', title: 'Gestionnaire Masar AMO & Mutuelles', icon: 'verified_user', badge: 'AMO', dept: 'Cellule Tiers-Payant' },
  { role: 'laboratory', name: 'Dr. Youssef Berrada', title: 'Biologiste Médical Référent', icon: 'biotech', badge: 'Labo', dept: 'Laboratoire Al Bassma' },
  { role: 'radiology', name: 'Dr. Salma Kabbaj', title: 'Médecin Radiologue', icon: 'radiology', badge: 'Radio', dept: 'Plateau Imagerie PACS' },
  { role: 'pharmacy', name: 'Dr. Anas Benmoussa', title: 'Pharmacien Hospitalier', icon: 'local_pharmacy', badge: 'Pharmacie', dept: 'Pharmacie Centrale' },
  { role: 'hygiene-agent', name: 'Fatima Zahra', title: 'Gouvernante Asepsie & Hygiène', icon: 'cleaning_services', badge: 'Hygiène', dept: 'Bio-Nettoyage & Stérilisation' },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenAmoCheck,
  onOpenNewAdmission,
  onOpenCashRegister,
  searchQuery,
  onSearchChange,
  currentUserRole = 'doctor',
  onChangeRole,
  onOpenDemoScenario,
  patients = [],
  onSelectPatient,
  currentView = 'dashboard',
  onNavigate,
  waitingCount = 7,
  occupancyRate = 78,
  activeClinicId = 'clinic-casa',
  onChangeClinic,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isClinicMenuOpen, setIsClinicMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [moduleSearchQuery, setModuleSearchQuery] = useState('');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<'all' | 'clinical' | 'finance' | 'governance'>('all');
  const [avatarError, setAvatarError] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
  const currentClinic = INITIAL_CLINICS.find((c) => c.id === activeClinicId) || INITIAL_CLINICS[0];
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Complete registry of all 16 modules without any duplication
  const ALL_MODULES: HeaderModuleItem[] = useMemo(() => [
    // DOMAINE 1: PARCOURS CLINIQUE & SOINS (8 modules)
    {
      id: 'dashboard',
      category: 'clinical',
      categoryTitle: 'Clinique & Soins',
      label: 'Tableau de bord',
      shortLabel: 'Dashboard',
      icon: 'grid_view',
      tagline: 'Supervision temps réel & indicateurs cliniques',
      functioning: 'Pilotage panoramique des urgences, constante du flux patient, alertes critiques et télémétrie de la clinique.',
      features: ['Vue globale 360°', 'KPIs d\'admissions', 'Alertes vitales'],
    },
    {
      id: 'patient-flow',
      category: 'clinical',
      categoryTitle: 'Clinique & Soins',
      label: 'Flux Patients & Kanban',
      shortLabel: 'Flux Patients',
      icon: 'view_kanban',
      badge: waitingCount,
      badgeType: 'count',
      tagline: 'File d\'attente intelligente, triage CIM-10 & boxes',
      functioning: 'Régulation dynamique de la file d\'attente, affectation instantanée aux boxes de consultation et convocations.',
      features: ['Triage CIM-10', 'Affectation des boxes', 'Appel écran salle'],
    },
    {
      id: 'patient-files',
      category: 'clinical',
      categoryTitle: 'Clinique & Soins',
      label: 'Dossiers Patients 360°',
      shortLabel: 'Dossiers 360°',
      icon: 'folder_shared',
      tagline: 'Dossier Médical Informatisé (DMI) exhaustif',
      functioning: 'Historique médical complet, antécédents, allergies, ordonnances sécurisées, diagnostics et examens complémentaires.',
      features: ['DMI complet', 'Historique & antécédents', 'Prescriptions DCI'],
    },
    {
      id: 'examinations',
      category: 'clinical',
      categoryTitle: 'Clinique & Soins',
      label: 'Examens & Labo Al Bassma',
      shortLabel: 'Examens & Labo',
      icon: 'biotech',
      tagline: 'Biologie médicale & Imagerie PACS haute résolution',
      functioning: 'Prescriptions d\'analyses, suivi automatique des bilans (NFS, biochimie), radiologie et tracé ECG.',
      features: ['Biologie médicale', 'Imagerie & PACS', 'Validation biologiste'],
    },
    {
      id: 'nursing',
      category: 'clinical',
      categoryTitle: 'Clinique & Soins',
      label: 'Soins Infirmiers & MAR',
      shortLabel: 'Soins & MAR',
      icon: 'vaccines',
      tagline: 'Administration médicamenteuse 5B & Relevé de constantes',
      functioning: 'Validation sécurisée des doses selon la règle des 5B, monitoring des constantes vitales et relève infirmière.',
      features: ['Règle des 5B', 'Courbes de constantes', 'Relève infirmière'],
    },
    {
      id: 'operating-room',
      category: 'clinical',
      categoryTitle: 'Clinique & Soins',
      label: 'Bloc Opératoire & SSPI',
      shortLabel: 'Bloc & Chirurgie',
      icon: 'emergency',
      tagline: 'Checklist de sécurité OMS & Score d\'Aldrete post-op',
      functioning: 'Planification chirurgicale, conformité checklist OMS, surveillance de réveil SSPI et transferts.',
      features: ['Checklist OMS', 'Salles d\'opération', 'Score d\'Aldrete'],
    },
    {
      id: 'hospitalization',
      category: 'clinical',
      categoryTitle: 'Clinique & Soins',
      label: 'Hospitalisation (28 Lits)',
      shortLabel: 'Hospitalisation',
      icon: 'bed',
      badge: `${occupancyRate}%`,
      badgeType: 'percentage',
      tagline: 'Plan interactif des chambres & mouvements de séjour',
      functioning: 'Visualisation des lits actifs, gestion des admissions, transferts internes et formalités de sortie.',
      features: ['Capacité 28 lits', 'Plan des chambres', 'Mouvements & séjours'],
    },
    {
      id: 'referrals',
      category: 'clinical',
      categoryTitle: 'Clinique & Soins',
      label: 'Transferts & SAMU 05',
      shortLabel: 'SAMU 05',
      icon: 'airport_shuttle',
      tagline: 'Évacuations SMUR & Réseau des praticiens',
      functioning: 'Coordination d\'urgence avec le SAMU 05 Casablanca, transferts inter-établissements et régulation.',
      features: ['Régulation SAMU 05', 'Évacuations SMUR', 'Réseau Praticiens'],
    },

    // DOMAINE 2: FINANCE & LOGISTIQUE (3 modules)
    {
      id: 'billing-amo',
      category: 'finance',
      categoryTitle: 'Finance & Logistique',
      label: 'Facturation & Caisse',
      shortLabel: 'Facturation & Caisse',
      icon: 'receipt_long',
      tagline: 'Feuilles de soins, devis & caisse journalière',
      functioning: 'Calcul automatique de la part AMO, facturation des séjours, devis estimatifs et clôture de caisse.',
      features: ['Tiers-Payant AMO', 'Calcul quote-part', 'Journal de caisse'],
    },
    {
      id: 'pharmacy',
      category: 'finance',
      categoryTitle: 'Finance & Logistique',
      label: 'Pharmacie & Stocks DCI',
      shortLabel: 'Pharmacie & Stocks',
      icon: 'local_pharmacy',
      tagline: 'Dispensation nominative, traçabilité des lots & périmés',
      functioning: 'Gestion informatisée des stocks, réassort intelligent, chaîne de froid et alertes de péremption.',
      features: ['Nomenclature DCI', 'Suivi des lots', 'Alertes péremptions'],
    },
    {
      id: 'amo-portal',
      category: 'finance',
      categoryTitle: 'Finance & Logistique',
      label: 'Portail Masar & AMO',
      shortLabel: 'Portail Masar AMO',
      icon: 'verified_user',
      tagline: 'Télétransmission directe CNOPS, CNSS & Tadamon',
      functioning: 'Interconnexion temps réel avec la plateforme nationale Masar Santé, éligibilité et accords préalables.',
      features: ['API Masar Santé', 'CNOPS & CNSS', 'AMO Tadamon'],
    },

    // DOMAINE 3: SÉCURITÉ & GOUVERNANCE (5 modules)
    {
      id: 'documents',
      category: 'governance',
      categoryTitle: 'Sécurité & Gouvernance',
      label: 'GED & Consentements Barid',
      shortLabel: 'GED Barid e-Sign',
      icon: 'description',
      tagline: 'Signature électronique certifiée & Archivage CNDP',
      functioning: 'Archivage des consentements éclairés, signature légale Barid e-Sign des comptes-rendus et certificats.',
      features: ['Barid e-Sign', 'Consentements CNDP', 'Archivage sécurisé'],
    },
    {
      id: 'administration',
      category: 'governance',
      categoryTitle: 'Sécurité & Gouvernance',
      label: 'Administration & RBAC',
      shortLabel: 'Administration RBAC',
      icon: 'admin_panel_settings',
      tagline: 'Gestion des comptes soignants & matrice de droits',
      functioning: 'Gestion des profils professionnels, permissions granulaires et politique de sécurité multi-sites.',
      features: ['10 Rôles soignants', 'Matrice RBAC', 'Sécurité multitenant'],
    },
    {
      id: 'audit',
      category: 'governance',
      categoryTitle: 'Sécurité & Gouvernance',
      label: 'Journal d\'Audit WORM',
      shortLabel: 'Audit WORM CNDP',
      icon: 'history_edu',
      tagline: 'Traçabilité immuable & conformité Loi CNDP 09-08',
      functioning: 'Journalisation cryptographique infalsifiable de chaque accès au dossier médical et modification clinique.',
      features: ['Stockage WORM', 'Loi CNDP 09-08', 'Horodatage certifié'],
    },
    {
      id: 'documentation',
      category: 'governance',
      categoryTitle: 'Sécurité & Gouvernance',
      label: 'Documentation & Référentiels',
      shortLabel: 'Documentation',
      icon: 'menu_book',
      tagline: 'Protocoles thérapeutiques & Guides opératoires Maroc',
      functioning: 'Base de connaissances médicales, guides de bonnes pratiques cliniques et conformité réglementaire.',
      features: ['Protocoles cliniques', 'Manuels soignants', 'Conformité Maroc'],
    },
    {
      id: 'settings',
      category: 'governance',
      categoryTitle: 'Sécurité & Gouvernance',
      label: 'Paramètres SIH & Tarifs',
      shortLabel: 'Paramètres SIH',
      icon: 'tune',
      tagline: 'Barème TNR national, plafonds & configuration',
      functioning: 'Paramétrage des barèmes tarifaires, règles métier d\'établissement et sauvegardes système.',
      features: ['Barème TNR', 'Règles métier', 'Configuration clinique'],
    },
  ], [waitingCount, occupancyRate]);

  // Primary Direct Top Nav Modules (6 most frequently used by clinicians daily)
  const PRIMARY_NAV_IDS: ViewMode[] = useMemo(() => [
    'dashboard',
    'patient-flow',
    'patient-files',
    'examinations',
    'hospitalization',
    'billing-amo',
  ], []);

  const primaryModules = useMemo(() => {
    return PRIMARY_NAV_IDS.map((id) => ALL_MODULES.find((m) => m.id === id)!).filter(Boolean);
  }, [ALL_MODULES, PRIMARY_NAV_IDS]);

  // Filter modules in mega menu
  const filteredModules = useMemo(() => {
    return ALL_MODULES.filter((m) => {
      const matchesCategory = selectedModuleFilter === 'all' || m.category === selectedModuleFilter;
      const q = moduleSearchQuery.trim().toLowerCase();
      if (!q) return matchesCategory;
      return matchesCategory && (
        m.label.toLowerCase().includes(q) ||
        m.tagline.toLowerCase().includes(q) ||
        m.functioning.toLowerCase().includes(q) ||
        m.categoryTitle.toLowerCase().includes(q) ||
        m.features.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [ALL_MODULES, moduleSearchQuery, selectedModuleFilter]);

  const currentModule = useMemo(() => {
    return ALL_MODULES.find((m) => m.id === currentView) || ALL_MODULES[0];
  }, [ALL_MODULES, currentView]);

  const activeRoleData = useMemo(() => {
    return ROLES_CATALOG.find((r) => r.role === currentUserRole) || ROLES_CATALOG[0];
  }, [currentUserRole]);

  // Global search matching
  const query = (searchQuery || '').trim().toLowerCase();
  const matchedPatients = query.length > 1
    ? patients
        .filter(
          (p) =>
            (p?.name || '').toLowerCase().includes(query) ||
            (p?.cin || '').toLowerCase().includes(query) ||
            (p?.phone || '').includes(query)
        )
        .slice(0, 5)
    : [];

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleNav = (view: ViewMode) => {
    if (onNavigate) {
      onNavigate(view);
    }
    setIsMegaMenuOpen(false);
    setIsProfileMenuOpen(false);
    setIsClinicMenuOpen(false);
  };

  // Close menus on outside click or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsClinicMenuOpen(false);
        setIsNotifOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMegaMenuOpen(false);
        setIsProfileMenuOpen(false);
        setIsClinicMenuOpen(false);
        setIsNotifOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="sticky top-0 z-40 w-full max-w-full flex flex-col font-sans" ref={headerRef}>
      {/* 2026 DESIGN SYSTEM: Main Healthtech Navigation Bar */}
      <header className="bg-gradient-to-r from-[#006a61] via-[#0ea58a] to-[#0d9488] text-white px-3 sm:px-4 lg:px-6 h-14 flex items-center justify-between gap-2 sm:gap-4 shadow-sm border-b border-[#0b7a70]/40 w-full min-w-0 max-w-full">
        {/* LEFT SECTION: Logo & Clinic Selector */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Logo Brand Pill */}
          <div
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-2 cursor-pointer select-none group"
            title="ClinicFlow Central - Accueil"
          >
            <div className="w-8 h-8 rounded-lg bg-white text-[#006a61] font-black flex items-center justify-center text-[13px] shadow-sm tracking-tighter group-hover:scale-105 transition-transform">
              CF
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-extrabold tracking-tight text-white leading-tight">
                ClinicFlow
              </span>
              <span className="text-[9px] uppercase tracking-wider text-emerald-100 font-bold leading-none hidden sm:inline">
                Central SIH
              </span>
            </div>
          </div>

          {/* Établissement Actif Switcher (2026 Dropdown Pill) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsClinicMenuOpen(!isClinicMenuOpen);
                setIsMegaMenuOpen(false);
                setIsProfileMenuOpen(false);
                setIsNotifOpen(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="Changer d'établissement ou de site clinique"
            >
              <span className="text-[12px]">🇲🇦</span>
              <span className="font-bold max-w-[130px] sm:max-w-[170px] truncate">
                {currentClinic.city}
              </span>
              <span className="text-[9px] px-1 py-0.2 bg-white/20 text-emerald-100 rounded font-bold hidden md:inline">
                {currentClinic.totalBeds}L
              </span>
              <span className={`material-symbols-outlined text-[15px] transition-transform duration-200 ${isClinicMenuOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* Clinic Switcher Popover */}
            {isClinicMenuOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 bg-white text-[#0b1c30] rounded-xl shadow-xl border border-[#cbd5e1] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-[#f1f5f9]">
                <div className="p-2.5 bg-[#f8f9ff] rounded-t-lg">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#006a61] flex items-center justify-between">
                    <span>Établissements Al Bassma</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#e6f7f5] text-[#006a61] text-[9px] font-bold">
                      3 Sites Actifs
                    </span>
                  </div>
                  <p className="text-[10px] text-[#76777d] mt-0.5">Sélectionnez le site hospitalier d'intervention</p>
                </div>
                <div className="py-1 space-y-1">
                  {INITIAL_CLINICS.map((clinic) => {
                    const isSelected = clinic.id === activeClinicId;
                    return (
                      <button
                        key={clinic.id}
                        type="button"
                        onClick={() => {
                          if (onChangeClinic) onChangeClinic(clinic.id);
                          setIsClinicMenuOpen(false);
                        }}
                        className={`w-full p-2 text-left rounded-lg transition-all flex items-start gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#e6f7f5] text-[#006a61] font-semibold border-l-3 border-[#006a61]'
                            : 'hover:bg-[#f8f9ff] text-[#0b1c30]'
                        }`}
                      >
                        <span className={`p-1.5 rounded-md shrink-0 ${isSelected ? 'bg-[#006a61] text-white' : 'bg-[#f1f5f9] text-[#76777d]'}`}>
                          <span className="material-symbols-outlined text-[16px]">apartment</span>
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-bold truncate">{clinic.name}</span>
                            {isSelected && (
                              <span className="material-symbols-outlined text-[16px] text-[#006a61]">check_circle</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-[#76777d] mt-0.5">
                            <span>{clinic.city}</span>
                            <span>•</span>
                            <span>{clinic.totalBeds} lits</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-medium">{clinic.activePatients} patients</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CENTER SECTION: 2026 Unified Module Hub (Zero Overflow, Responsive & Clean) */}
        <div className="flex items-center gap-1.5 min-w-0">
          {/* Primary "Tous les Modules (16)" Command Hub Button */}
          <button
            type="button"
            onClick={() => {
              setIsMegaMenuOpen(!isMegaMenuOpen);
              setIsProfileMenuOpen(false);
              setIsClinicMenuOpen(false);
              setIsNotifOpen(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs border select-none ${
              isMegaMenuOpen
                ? 'bg-white text-[#006a61] border-white shadow-xs'
                : 'bg-white/15 hover:bg-white/25 text-white border-white/25'
            }`}
            title="Consulter le catalogue exhaustif des 16 modules ClinicFlow"
          >
            <span className="material-symbols-outlined text-[17px]">apps</span>
            <span className="hidden sm:inline">Tous les Modules</span>
            <span className="sm:hidden">Modules</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
              isMegaMenuOpen ? 'bg-[#006a61] text-white' : 'bg-white/25 text-white'
            }`}>
              16
            </span>
            <span className={`material-symbols-outlined text-[15px] transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>

          {/* Quick Direct Module Shortcuts - Restricted to Extra Wide Screens (2XL) to Prevent ANY Overflow */}
          <nav className="hidden 2xl:flex items-center gap-1">
            {primaryModules.slice(0, 3).map((m) => {
              const isActive = currentView === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleNav(m.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                    isActive
                      ? 'bg-white/25 text-white font-bold border border-white/30 shadow-2xs'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  title={m.tagline}
                >
                  <span className="material-symbols-outlined text-[15px]">
                    {m.icon}
                  </span>
                  <span>{m.shortLabel || m.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* RIGHT SECTION: Quick Actions, Notifications, Scénario Démo & 2026 User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 ml-auto">
          {/* Mobile Catalog Trigger (for small screens when center is collapsed) */}
          <button
            type="button"
            onClick={() => {
              setIsMegaMenuOpen(!isMegaMenuOpen);
              setIsProfileMenuOpen(false);
              setIsClinicMenuOpen(false);
              setIsNotifOpen(false);
            }}
            className="sm:hidden p-1.5 rounded-lg text-white/90 hover:bg-white/10 hover:text-white transition-colors"
            title="Catalogue des modules"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isMegaMenuOpen ? 'close' : 'apps'}
            </span>
          </button>

          {/* Scénario Démo Button (25 Étapes) */}
          {onOpenDemoScenario && (
            <button
              type="button"
              onClick={onOpenDemoScenario}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-white/15 hover:bg-white/25 border border-white/25 shadow-2xs transition-all cursor-pointer shrink-0"
              title="Lancer le scénario guidé interactif en 25 étapes"
            >
              <span className="material-symbols-outlined text-[15px] text-emerald-200">route</span>
              <span className="hidden md:inline">Scénario Démo</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 font-extrabold">25</span>
            </button>
          )}

          {/* Notification Center Trigger */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                setIsMegaMenuOpen(false);
                setIsProfileMenuOpen(false);
                setIsClinicMenuOpen(false);
              }}
              className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center relative transition-colors cursor-pointer"
              title="Centre de notifications & alertes cliniques"
            >
              <span className="material-symbols-outlined text-[18px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 bg-[#ef4444] text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-[#0ea58a]">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-white text-[#0b1c30] rounded-xl shadow-xl border border-[#cbd5e1] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150 divide-y divide-[#f1f5f9]">
                <div className="p-3 bg-[#f8f9ff] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[13px] text-[#0b1c30]">Alertes & Notifications</span>
                    <span className="px-1.5 py-0.2 bg-[#fee2e2] text-[#ba1a1a] text-[10px] font-bold rounded-full">
                      {unreadCount} urgentes
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-[#006a61] hover:underline font-bold cursor-pointer"
                    >
                      Tout marquer lu
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[#f1f5f9] max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-[12px] transition-colors ${
                        !n.read ? 'bg-[#f0fdf4]/60' : 'hover:bg-[#f8f9ff]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            n.category === 'clinical'
                              ? 'bg-[#fee2e2] text-[#ba1a1a]'
                              : n.category === 'financial'
                              ? 'bg-[#fef9c3] text-[#854d0e]'
                              : 'bg-[#eff4ff] text-[#188ace]'
                          }`}
                        >
                          {n.category}
                        </span>
                        <span className="text-[10px] text-[#76777d]">{n.createdAt}</span>
                      </div>
                      <div className="font-bold text-[#0b1c30] mt-1">{n.title}</div>
                      <div className="text-[#45464d] text-[11px] mt-0.5 leading-snug">{n.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 2026 ULTRA-CLEAN USER PROFILE & ROLE SWITCHER (FIXES FIRST PICTURE) */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setIsMegaMenuOpen(false);
                setIsClinicMenuOpen(false);
                setIsNotifOpen(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 bg-black/15 hover:bg-black/25 border border-white/20 rounded-full pl-1 sm:pl-1.5 pr-2 sm:pr-3 py-1 transition-all cursor-pointer shadow-2xs select-none shrink-0"
              title="Profil professionnel & Changement de rôle"
            >
              {/* Profile Avatar with fallback and green presence indicator */}
              <div className="relative shrink-0">
                {!avatarError ? (
                  <img
                    src={DOCTOR_PROFILE_URL}
                    alt={activeRoleData.name}
                    onError={() => setAvatarError(true)}
                    className="h-7 w-7 rounded-full object-cover border border-white/60 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-7 w-7 rounded-full bg-emerald-900 text-white flex items-center justify-center text-[10px] font-black border border-white/60">
                    LZ
                  </div>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] rounded-full ring-1.5 ring-[#0ea58a]" />
              </div>

              {/* Name & Role Badge (High-Contrast, No Clashing Styles) */}
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[12px] font-bold text-white leading-tight">
                  {activeRoleData.name}
                </span>
                <span className="text-[10px] text-emerald-100 font-medium leading-none">
                  {activeRoleData.badge} • {activeRoleData.dept.split(' ')[0]}
                </span>
              </div>

              <span className={`material-symbols-outlined text-[16px] text-white/90 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>

            {/* 2026 Floating Profile & Role Popover */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white text-[#0b1c30] rounded-2xl shadow-2xl border border-[#cbd5e1] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* User Identity Header Card */}
                <div className="p-3 bg-gradient-to-r from-[#e6f7f5] to-[#f8f9ff] rounded-xl border border-[#86f2e4]/50 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      {!avatarError ? (
                        <img
                          src={DOCTOR_PROFILE_URL}
                          alt={activeRoleData.name}
                          className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-[#006a61] text-white flex items-center justify-center text-sm font-bold border-2 border-white">
                          LZ
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#22c55e] rounded-full ring-2 ring-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-[14px] text-[#0b1c30] truncate">
                          {activeRoleData.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#006a61] text-white">
                          {activeRoleData.badge}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-[#006a61] mt-0.5">
                        {activeRoleData.title}
                      </p>
                      <p className="text-[10px] text-[#76777d] mt-0.5">
                        INPE: 84920194 • {currentClinic.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#86f2e4]/40 flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-emerald-800 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Statut : En Consultation (Box #02)
                    </span>
                    <span className="text-[#76777d]">Barid e-Sign : Certifié</span>
                  </div>
                </div>

                {/* Role Switcher Section (RBAC Matrix) */}
                <div>
                  <div className="px-1 mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#76777d] uppercase tracking-wider">
                      Basculer de Rôle Médical (RBAC)
                    </span>
                    <span className="text-[9px] text-[#006a61] font-bold">10 Profils Soignants</span>
                  </div>

                  <div className="grid grid-cols-1 gap-1 max-h-56 overflow-y-auto pr-1">
                    {ROLES_CATALOG.map((item) => {
                      const isSelected = item.role === currentUserRole;
                      return (
                        <button
                          key={item.role}
                          type="button"
                          onClick={() => {
                            if (onChangeRole) onChangeRole(item.role);
                            setIsProfileMenuOpen(false);
                          }}
                          className={`w-full p-2 rounded-xl text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'bg-[#e6f7f5] text-[#006a61] font-bold border border-[#86f2e4]'
                              : 'hover:bg-[#f8f9ff] text-[#0b1c30] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`p-1.5 rounded-lg shrink-0 ${
                              isSelected ? 'bg-[#006a61] text-white' : 'bg-[#f1f5f9] text-[#76777d]'
                            }`}>
                              <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                            </span>
                            <div className="min-w-0">
                              <div className="text-[12px] font-bold truncate leading-tight">
                                {item.name}
                              </div>
                              <div className="text-[10px] text-[#76777d] truncate">
                                {item.title}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              {item.badge}
                            </span>
                            {isSelected && (
                              <span className="material-symbols-outlined text-[16px] text-[#006a61]">
                                check_circle
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Popover Footer Links */}
                <div className="mt-3 pt-2.5 border-t border-[#f1f5f9] flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleNav('administration')}
                    className="text-[#006a61] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                    <span>Gestion des Droits</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('audit')}
                    className="text-[#76777d] hover:text-[#0b1c30] flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">history</span>
                    <span>Journal WORM</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* COMPREHENSIVE 2026 MEGA-MENU OVERLAY: "Catalogue des 16 Modules ClinicFlow" (INSPIRATION PHOTO 3) */}
      {isMegaMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white text-[#0b1c30] shadow-2xl border-b border-[#cbd5e1] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 flex flex-col gap-4">
            {/* Mega Menu Top Header: Title, Search & Category Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-3">
                <span className="p-2.5 bg-[#e6f7f5] text-[#006a61] rounded-xl flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">apps</span>
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-bold text-[#0b1c30]">
                      Catalogue des 16 Modules ClinicFlow
                    </h2>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#e6f7f5] text-[#006a61]">
                      SIH Intégré 2026
                    </span>
                  </div>
                  <p className="text-[12px] text-[#76777d]">
                    Accédez à tous les modules opérationnels de la clinique avec leur fonctionnement et leurs détails complets.
                  </p>
                </div>
              </div>

              {/* Module Search Input & Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-72">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#76777d] text-[17px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={moduleSearchQuery}
                    onChange={(e) => setModuleSearchQuery(e.target.value)}
                    placeholder="Filtrer un module, acte ou mot-clé..."
                    className="w-full pl-8 pr-8 py-1.5 bg-[#f8f9ff] text-[12px] rounded-lg border border-[#cbd5e1] focus:border-[#0ea58a] outline-hidden text-[#0b1c30]"
                  />
                  {moduleSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setModuleSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0]">
                  <button
                    type="button"
                    onClick={() => setSelectedModuleFilter('all')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      selectedModuleFilter === 'all'
                        ? 'bg-white text-[#006a61] shadow-2xs'
                        : 'text-[#76777d] hover:text-[#0b1c30]'
                    }`}
                  >
                    Tous (16)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModuleFilter('clinical')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      selectedModuleFilter === 'clinical'
                        ? 'bg-white text-[#006a61] shadow-2xs'
                        : 'text-[#76777d] hover:text-[#0b1c30]'
                    }`}
                  >
                    Clinique (8)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModuleFilter('finance')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      selectedModuleFilter === 'finance'
                        ? 'bg-white text-[#006a61] shadow-2xs'
                        : 'text-[#76777d] hover:text-[#0b1c30]'
                    }`}
                  >
                    Finance (3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModuleFilter('governance')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      selectedModuleFilter === 'governance'
                        ? 'bg-white text-[#006a61] shadow-2xs'
                        : 'text-[#76777d] hover:text-[#0b1c30]'
                    }`}
                  >
                    Sécurité (5)
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Structured Columns of Modules */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[65vh] overflow-y-auto pr-1">
              {/* DOMAINE 1: PARCOURS CLINIQUE & SOINS */}
              {(selectedModuleFilter === 'all' || selectedModuleFilter === 'clinical') && (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between px-1 pb-1 border-b border-[#e2e8f0]">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#006a61]">
                      <span className="material-symbols-outlined text-[16px]">medical_services</span>
                      <span>Parcours Clinique & Soins</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 rounded-full bg-[#e6f7f5] text-[#006a61]">
                      8 modules
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {filteredModules
                      .filter((m) => m.category === 'clinical')
                      .map((m) => {
                        const isActive = currentView === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => handleNav(m.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between gap-1.5 ${
                              isActive
                                ? 'bg-[#e6f7f5]/80 border-[#006a61] shadow-xs ring-1 ring-[#006a61]'
                                : 'bg-white hover:bg-[#f8f9ff] border-[#cbd5e1]/80 hover:border-[#006a61]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                                  isActive ? 'bg-[#006a61] text-white' : 'bg-[#e6f7f5] text-[#006a61] group-hover:bg-[#006a61] group-hover:text-white'
                                }`}>
                                  <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                                </span>
                                <span className="font-bold text-[13px] text-[#0b1c30] truncate">{m.label}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                {m.badge !== undefined && (
                                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#86f2e4] text-[#006f66]">
                                    {m.badge}
                                  </span>
                                )}
                                {isActive && (
                                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#006a61] text-white">
                                    Actif
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] text-[#45464d] leading-snug">
                              {m.functioning}
                            </p>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {m.features.map((f, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-[#f1f5f9] text-[#45464d]"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* DOMAINE 2: FINANCE & LOGISTIQUE */}
              {(selectedModuleFilter === 'all' || selectedModuleFilter === 'finance') && (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between px-1 pb-1 border-b border-[#e2e8f0]">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#006a61]">
                      <span className="material-symbols-outlined text-[16px]">payments</span>
                      <span>Finance & Logistique</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 rounded-full bg-[#e6f7f5] text-[#006a61]">
                      3 modules
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {filteredModules
                      .filter((m) => m.category === 'finance')
                      .map((m) => {
                        const isActive = currentView === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => handleNav(m.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between gap-1.5 ${
                              isActive
                                ? 'bg-[#e6f7f5]/80 border-[#006a61] shadow-xs ring-1 ring-[#006a61]'
                                : 'bg-white hover:bg-[#f8f9ff] border-[#cbd5e1]/80 hover:border-[#006a61]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                                  isActive ? 'bg-[#006a61] text-white' : 'bg-[#e6f7f5] text-[#006a61] group-hover:bg-[#006a61] group-hover:text-white'
                                }`}>
                                  <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                                </span>
                                <span className="font-bold text-[13px] text-[#0b1c30] truncate">{m.label}</span>
                              </div>
                              {isActive && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#006a61] text-white">
                                  Actif
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#45464d] leading-snug">
                              {m.functioning}
                            </p>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {m.features.map((f, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-[#f1f5f9] text-[#45464d]"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* DOMAINE 3: SÉCURITÉ & GOUVERNANCE */}
              {(selectedModuleFilter === 'all' || selectedModuleFilter === 'governance') && (
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between px-1 pb-1 border-b border-[#e2e8f0]">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#006a61]">
                      <span className="material-symbols-outlined text-[16px]">shield</span>
                      <span>Sécurité & Gouvernance</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 rounded-full bg-[#e6f7f5] text-[#006a61]">
                      5 modules
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {filteredModules
                      .filter((m) => m.category === 'governance')
                      .map((m) => {
                        const isActive = currentView === m.id;
                        return (
                          <div
                            key={m.id}
                            onClick={() => handleNav(m.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between gap-1.5 ${
                              isActive
                                ? 'bg-[#e6f7f5]/80 border-[#006a61] shadow-xs ring-1 ring-[#006a61]'
                                : 'bg-white hover:bg-[#f8f9ff] border-[#cbd5e1]/80 hover:border-[#006a61]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                                  isActive ? 'bg-[#006a61] text-white' : 'bg-[#e6f7f5] text-[#006a61] group-hover:bg-[#006a61] group-hover:text-white'
                                }`}>
                                  <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
                                </span>
                                <span className="font-bold text-[13px] text-[#0b1c30] truncate">{m.label}</span>
                              </div>
                              {isActive && (
                                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#006a61] text-white">
                                  Actif
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#45464d] leading-snug">
                              {m.functioning}
                            </p>
                            <div className="flex flex-wrap gap-1 pt-1">
                              {m.features.map((f, i) => (
                                <span
                                  key={i}
                                  className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-[#f1f5f9] text-[#45464d]"
                                >
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>

            {/* Mega Menu Footer with Live Clinic Status & Quick Launch */}
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#cbd5e1] flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px]">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#0ea58a]">apartment</span>
                  <span><strong>{currentClinic.name}</strong> ({currentClinic.city})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Urgences 24/7 : <strong>Taux d'occupation {occupancyRate}%</strong> (22/28 Lits)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-blue-600">verified_user</span>
                  <span>Passerelle Masar Santé Connectée</span>
                </div>
              </div>

              {onOpenDemoScenario && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMegaMenuOpen(false);
                    onOpenDemoScenario();
                  }}
                  className="px-3 py-1.5 bg-[#006a61] text-white rounded-lg text-[11px] font-bold hover:bg-[#00544d] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#86f2e4]">route</span>
                  <span>Exécuter le Scénario Démo (25 Étapes)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-HEADER: Context Breadcrumb, Live Telemetry & Patient Quick Search */}
      <div className="bg-white border-b border-[#e2e8f0] px-3 sm:px-4 lg:px-6 py-2 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-[12px]">
        {/* Left: Active Module Breadcrumb & Live System Telemetry */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active View Pill */}
          <div
            onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1 bg-[#e6f7f5] hover:bg-[#c9f1eb] text-[#006a61] rounded-lg border border-[#86f2e4] cursor-pointer transition-colors shadow-2xs group"
            title="Cliquer pour consulter tous les modules"
          >
            <span className="material-symbols-outlined text-[17px] group-hover:rotate-12 transition-transform">
              {currentModule.icon}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-[#76777d] hidden sm:inline">
                {currentModule.categoryTitle} •
              </span>
              <span className="font-bold text-[12px] text-[#0b1c30]">{currentModule.label}</span>
            </div>
            <span className="material-symbols-outlined text-[15px] text-[#006a61]">tune</span>
          </div>

          <span className="text-slate-300 hidden sm:inline">•</span>

          {/* Live Telemetry Badges */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#45464d] bg-[#f8f9ff] px-2 py-0.5 rounded border border-[#e2e8f0]">
              <span className="material-symbols-outlined text-[14px] text-[#0ea58a]">bed</span>
              <span>Lits : <strong>{occupancyRate}%</strong></span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#45464d] bg-[#f8f9ff] px-2 py-0.5 rounded border border-[#e2e8f0]">
              <span className="material-symbols-outlined text-[14px] text-amber-600">people</span>
              <span>File active : <strong>{waitingCount}</strong></span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Masar Connecté</span>
            </span>
          </div>
        </div>

        {/* Right: Global Patient Search & Fast Action Toolbar */}
        <div className="flex items-center gap-2">
          {/* Global Quick Search */}
          <div className="relative w-48 sm:w-64">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#76777d] text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Recherche globale (CIN, Nom)..."
              className="w-full pl-8 pr-10 py-1 bg-[#f8f9ff] text-[11px] text-[#0b1c30] placeholder-[#76777d] rounded-lg border border-[#cbd5e1] hover:border-[#0ea58a] focus:border-[#0ea58a] outline-hidden transition-all"
            />
            <kbd className="hidden sm:inline-flex absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-semibold text-[#76777d] bg-white border border-[#cbd5e1] rounded px-1 py-0.2 shadow-2xs">
              ⌘K
            </kbd>

            {/* Quick Search Dropdown Results */}
            {isSearchFocused && matchedPatients.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-[#cbd5e1] shadow-lg overflow-hidden z-50 divide-y divide-[#f1f5f9]">
                <div className="p-2 bg-[#f8f9ff] text-[10px] font-bold text-[#76777d] uppercase">
                  Résultats Patients ({matchedPatients.length})
                </div>
                {matchedPatients.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (onSelectPatient) onSelectPatient(p);
                    }}
                    className="p-2 hover:bg-[#eff4ff] cursor-pointer flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <div className="font-bold text-[#0b1c30]">{p.name}</div>
                      <div className="text-[10px] text-[#76777d]">
                        CIN: {p.cin} • {p.specialty}
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#e6f7f5] text-[#006a61]">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action: Vérifier AMO */}
          <button
            type="button"
            onClick={onOpenAmoCheck}
            className="px-2.5 py-1 bg-[#e6f7f5] hover:bg-[#c9f1eb] text-[#006a61] text-[11px] font-bold rounded-lg border border-[#86f2e4] transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
            title="Vérifier éligibilité AMO / CNSS / CNOPS"
          >
            <span className="material-symbols-outlined text-[15px]">verified_user</span>
            <span className="hidden sm:inline">Vérifier AMO</span>
          </button>

          {/* Quick Action: Caisse */}
          {onOpenCashRegister && (
            <button
              type="button"
              onClick={onOpenCashRegister}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-[#0b1c30] text-[11px] font-bold rounded-lg border border-[#cbd5e1] transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
              title="Ouvrir le journal de caisse du jour"
            >
              <span className="material-symbols-outlined text-[15px]">payments</span>
              <span className="hidden sm:inline">Caisse</span>
            </button>
          )}

          {/* Quick Action: Nouvelle Admission */}
          <button
            type="button"
            onClick={onOpenNewAdmission}
            className="px-3 py-1 bg-[#0ea58a] hover:bg-[#0d9488] text-white text-[11px] font-bold rounded-lg shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">person_add</span>
            <span>+ Admission</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import {
  Clinic,
  ClinicUser,
  RolePermissions,
  ConsultationRecord,
  ExaminationRequest,
  ReferralTransfer,
  NursingTask,
  MedicationAdministration,
  MedicationCatalogItem,
  MedicationItem,
  SurgerySchedule,
  MedicalDocument,
  PatientConsent,
  CashRegisterSession,
  InsuranceCoverageRule,
  AuditLogEntry,
  AppNotification
} from '../types';

export const INITIAL_CLINICS: Clinic[] = [
  {
    id: 'clinic-casa',
    name: 'Clinique Al Bassma Casablanca',
    city: 'Casablanca (Maârif)',
    address: '142 Boulevard d\'Anfa & Rue Jean Jaurès, Casablanca',
    phone: '+212 5 22 98 44 00',
    licenseNumber: 'MS-CAS-2018/889',
    totalBeds: 28,
    activePatients: 42
  },
  {
    id: 'clinic-rabat',
    name: 'Clinique Al Bassma Rabat',
    city: 'Rabat (Agdal)',
    address: '28 Avenue de France, Agdal, Rabat',
    phone: '+212 5 37 77 12 00',
    licenseNumber: 'MS-RBT-2020/412',
    totalBeds: 24,
    activePatients: 28
  },
  {
    id: 'clinic-kech',
    name: 'Clinique Al Bassma Marrakech',
    city: 'Marrakech (Guéliz)',
    address: '67 Boulevard Mohammed V, Guéliz, Marrakech',
    phone: '+212 5 24 43 90 00',
    licenseNumber: 'MS-RAK-2022/190',
    totalBeds: 32,
    activePatients: 36
  }
];

export const INITIAL_USERS: ClinicUser[] = [
  {
    id: 'usr-1',
    name: 'Dr. Layla Zahiri',
    email: 'l.zahiri@albassma.ma',
    role: 'super-admin',
    clinicId: 'clinic-casa',
    clinicName: 'Clinique Al Bassma Casablanca',
    department: 'Direction Médicale & Régulation',
    phone: '+212 6 61 12 34 56',
    status: 'active',
    lastLogin: 'Aujourd\'hui 08:15',
    specialty: 'Directrice Médicale'
  },
  {
    id: 'usr-2',
    name: 'Dr. Hicham Amrani',
    email: 'h.amrani@albassma.ma',
    role: 'doctor',
    clinicId: 'clinic-casa',
    clinicName: 'Clinique Al Bassma Casablanca',
    department: 'Cardiologie & Médecine Vasculaire',
    phone: '+212 6 61 78 90 12',
    status: 'active',
    lastLogin: 'Aujourd\'hui 08:30',
    specialty: 'Cardiologue Interventionnel'
  },
  {
    id: 'usr-3',
    name: 'Karima Tazi',
    email: 'k.tazi@albassma.ma',
    role: 'reception',
    clinicId: 'clinic-casa',
    clinicName: 'Clinique Al Bassma Casablanca',
    department: 'Accueil, Admissions & Régulation',
    phone: '+212 6 63 45 67 89',
    status: 'active',
    lastLogin: 'Aujourd\'hui 07:45',
    specialty: 'Chef de Réception'
  },
  {
    id: 'usr-4',
    name: 'Rachid El Mansouri',
    email: 'r.mansouri@albassma.ma',
    role: 'nurse',
    clinicId: 'clinic-casa',
    clinicName: 'Clinique Al Bassma Casablanca',
    department: 'Hospitalisation & Soins Intensifs',
    phone: '+212 6 62 34 56 78',
    status: 'active',
    lastLogin: 'Aujourd\'hui 07:00',
    specialty: 'Infirmier Major'
  },
  {
    id: 'usr-5',
    name: 'Fatima Zahra Chraibi',
    email: 'fz.chraibi@albassma.ma',
    role: 'billing',
    clinicId: 'clinic-casa',
    clinicName: 'Clinique Al Bassma Casablanca',
    department: 'Facturation & Caisse Centrale',
    phone: '+212 6 61 98 76 54',
    status: 'active',
    lastLogin: 'Aujourd\'hui 08:00',
    specialty: 'Responsable Caisse & Facturation'
  },
  {
    id: 'usr-6',
    name: 'Omar Benali',
    email: 'o.benali@albassma.ma',
    role: 'insurance-agent',
    clinicId: 'clinic-casa',
    clinicName: 'Clinique Al Bassma Casablanca',
    department: 'Cellule AMO, CNOPS & Assurances',
    phone: '+212 6 64 23 45 67',
    status: 'active',
    lastLogin: 'Aujourd\'hui 08:20',
    specialty: 'Gestionnaire Tiers-Payant'
  },
  {
    id: 'usr-7',
    name: 'Dr. Youssef Berrada',
    email: 'y.berrada@albassma.ma',
    role: 'laboratory',
    clinicId: 'clinic-casa',
    clinicName: 'Clinique Al Bassma Casablanca',
    department: 'Laboratoire d\'Analyses Médicales',
    phone: '+212 6 65 12 34 56',
    status: 'active',
    lastLogin: 'Aujourd\'hui 07:30',
    specialty: 'Biologiste Médical'
  },
  {
    id: 'usr-8',
    name: 'Dr. Salma Kabbaj',
    email: 's.kabbaj@albassma.ma',
    role: 'radiology',
    clinicId: 'clinic-casa',
    clinicName: 'Clinique Al Bassma Casablanca',
    department: 'Plateau Imagerie & Scanner',
    phone: '+212 6 66 98 76 54',
    status: 'active',
    lastLogin: 'Aujourd\'hui 08:40',
    specialty: 'Radiologue Référente'
  },
  {
    id: 'usr-9',
    name: 'Amina Bennani',
    email: 'a.bennani@albassma.ma',
    role: 'pharmacy',
    clinicId: 'clinic-casa',
    clinicName: 'Clinique Al Bassma Casablanca',
    department: 'Pharmacie Clinique & Stocks',
    phone: '+212 6 67 45 67 89',
    status: 'active',
    lastLogin: 'Aujourd\'hui 08:10',
    specialty: 'Pharmacienne Responsable'
  },
  {
    id: 'usr-10',
    name: 'Hassan Idrissi',
    email: 'h.idrissi@albassma.ma',
    role: 'hygiene-agent',
    clinicId: 'clinic-casa',
    clinicName: 'Clinique Al Bassma Casablanca',
    department: 'Bio-nettoyage & Stérilisation',
    phone: '+212 6 68 11 22 33',
    status: 'active',
    lastLogin: 'Aujourd\'hui 06:45',
    specialty: 'Superviseur Bionettoyage'
  },
  {
    id: 'usr-11',
    name: 'Mehdi Alami',
    email: 'm.alami@albassma.ma',
    role: 'clinic-admin',
    clinicId: 'clinic-casa',
    clinicName: 'Clinique Al Bassma Casablanca',
    department: 'Administration & SI Santé',
    phone: '+212 6 61 55 44 33',
    status: 'active',
    lastLogin: 'Hier 17:30',
    specialty: 'Administrateur Système'
  }
];

export const DEFAULT_ROLE_PERMISSIONS: RolePermissions = {
  'super-admin': {
    patients: ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve'],
    consultations: ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve'],
    examinations: ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve'],
    hospitalization: ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve'],
    nursing: ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve'],
    'operating-room': ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve'],
    billing: ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve', 'refund'],
    'cash-register': ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve', 'refund'],
    insurance: ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve'],
    pharmacy: ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve'],
    transfers: ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve'],
    documents: ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve'],
    administration: ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve'],
    audit: ['view', 'export']
  },
  'clinic-admin': {
    patients: ['view', 'create', 'edit', 'export'],
    consultations: ['view', 'export'],
    examinations: ['view', 'export'],
    hospitalization: ['view', 'create', 'edit', 'export'],
    nursing: ['view', 'export'],
    'operating-room': ['view', 'create', 'edit', 'export'],
    billing: ['view', 'create', 'edit', 'validate', 'export', 'refund'],
    'cash-register': ['view', 'create', 'edit', 'validate', 'export', 'refund'],
    insurance: ['view', 'create', 'edit', 'validate', 'export'],
    pharmacy: ['view', 'create', 'edit', 'export'],
    transfers: ['view', 'create', 'edit', 'export'],
    documents: ['view', 'create', 'edit', 'export'],
    administration: ['view', 'create', 'edit'],
    audit: ['view', 'export']
  },
  reception: {
    patients: ['view', 'create', 'edit', 'export'],
    consultations: ['view'],
    examinations: ['view'],
    hospitalization: ['view'],
    nursing: ['view'],
    'operating-room': ['view'],
    billing: ['view', 'create'],
    'cash-register': ['view', 'create'],
    insurance: ['view', 'create'],
    pharmacy: ['view'],
    transfers: ['view', 'create'],
    documents: ['view', 'create'],
    administration: [],
    audit: []
  },
  doctor: {
    patients: ['view', 'create', 'edit'],
    consultations: ['view', 'create', 'edit', 'validate', 'approve', 'export'],
    examinations: ['view', 'create', 'validate'],
    hospitalization: ['view', 'create', 'edit', 'validate'],
    nursing: ['view', 'create', 'validate'],
    'operating-room': ['view', 'create', 'edit', 'validate'],
    billing: ['view'],
    'cash-register': [],
    insurance: ['view'],
    pharmacy: ['view', 'create'],
    transfers: ['view', 'create', 'validate'],
    documents: ['view', 'create', 'edit', 'validate', 'export'],
    administration: [],
    audit: []
  },
  nurse: {
    patients: ['view'],
    consultations: ['view'],
    examinations: ['view', 'create'],
    hospitalization: ['view', 'edit'],
    nursing: ['view', 'create', 'edit', 'validate'],
    'operating-room': ['view'],
    billing: ['view'],
    'cash-register': [],
    insurance: [],
    pharmacy: ['view', 'create'],
    transfers: ['view'],
    documents: ['view', 'create'],
    administration: [],
    audit: []
  },
  billing: {
    patients: ['view', 'create', 'edit'],
    consultations: ['view'],
    examinations: ['view'],
    hospitalization: ['view'],
    nursing: [],
    'operating-room': ['view'],
    billing: ['view', 'create', 'edit', 'validate', 'export', 'refund'],
    'cash-register': ['view', 'create', 'edit', 'validate', 'export', 'refund'],
    insurance: ['view', 'create', 'edit'],
    pharmacy: ['view'],
    transfers: ['view'],
    documents: ['view', 'create', 'export'],
    administration: [],
    audit: []
  },
  'insurance-agent': {
    patients: ['view', 'edit'],
    consultations: ['view'],
    examinations: ['view'],
    hospitalization: ['view'],
    nursing: [],
    'operating-room': [],
    billing: ['view', 'edit', 'validate', 'export'],
    'cash-register': ['view'],
    insurance: ['view', 'create', 'edit', 'validate', 'approve', 'export'],
    pharmacy: [],
    transfers: [],
    documents: ['view', 'create', 'export'],
    administration: [],
    audit: []
  },
  laboratory: {
    patients: ['view'],
    consultations: ['view'],
    examinations: ['view', 'create', 'edit', 'validate', 'export'],
    hospitalization: ['view'],
    nursing: [],
    'operating-room': [],
    billing: [],
    'cash-register': [],
    insurance: [],
    pharmacy: ['view'],
    transfers: [],
    documents: ['view', 'create', 'export'],
    administration: [],
    audit: []
  },
  radiology: {
    patients: ['view'],
    consultations: ['view'],
    examinations: ['view', 'create', 'edit', 'validate', 'export'],
    hospitalization: ['view'],
    nursing: [],
    'operating-room': ['view'],
    billing: [],
    'cash-register': [],
    insurance: [],
    pharmacy: [],
    transfers: [],
    documents: ['view', 'create', 'export'],
    administration: [],
    audit: []
  },
  pharmacy: {
    patients: ['view'],
    consultations: ['view'],
    examinations: [],
    hospitalization: ['view'],
    nursing: ['view'],
    'operating-room': ['view'],
    billing: ['view'],
    'cash-register': [],
    insurance: [],
    pharmacy: ['view', 'create', 'edit', 'validate', 'export'],
    transfers: [],
    documents: ['view'],
    administration: [],
    audit: []
  },
  'hygiene-agent': {
    patients: ['view'],
    consultations: [],
    examinations: [],
    hospitalization: ['view', 'edit', 'validate'],
    nursing: ['view'],
    'operating-room': ['view', 'edit', 'validate'],
    billing: [],
    'cash-register': [],
    insurance: [],
    pharmacy: [],
    transfers: [],
    documents: [],
    administration: [],
    audit: []
  }
};

export const INITIAL_CONSULTATIONS: ConsultationRecord[] = [
  {
    id: 'cons-101',
    patientId: 'p-1',
    patientName: 'M. Youssef Benjelloun',
    doctorId: 'usr-2',
    doctorName: 'Dr. Hicham Amrani',
    date: 'Aujourd\'hui',
    time: '09:15',
    chiefComplaint: 'Contrôle trimestriel HTA essentielle et céphalées matinales modérées.',
    historyOfPresentIllness: 'Patient hypertendu connu sous monothérapie (Ramipril 5mg). Signale des épisodes occasionnels de céphalées occipitales au réveil depuis 10 jours.',
    medicalHistoryNotes: 'HTA grade 1 diagnostiquée en 2021. Dyslipidémie modérée traitée par règles hygiéno-diététiques.',
    surgicalHistoryNotes: 'Appendicectomie en 1996 sans complication.',
    allergiesList: ['Allergie confirmée à la Pénicilline (urticaire géant)'],
    vitals: {
      bloodPressure: '135/85',
      heartRate: 72,
      oxygenSat: 99,
      bloodGlucose: '0.98',
      temperature: 36.8,
      respiratoryRate: 15
    },
    clinicalExamination: 'Bon état général. Auscultation cardiaque régulière, bruits purs, pas de souffle. Auscultation pulmonaire libre. Pas d\'œdème des membres inférieurs, pouls périphériques bien perçus.',
    diagnosis: 'HTA essentielle bien équilibrée, céphalées de tension associées au surmenage.',
    differentialDiagnosis: 'HTA secondaire, syndrome d\'apnée du sommeil (non retenu).',
    treatmentPlan: 'Poursuite de Ramipril 5mg matin. Ajout Magnésium B6 en cure de 1 mois. Bilan biologique de contrôle rénal et ionogramme prescrit.',
    prescriptions: [
      {
        medication: 'Triatec (Ramipril) 5mg',
        dosage: '1 comprimé',
        route: 'Voie orale',
        frequency: '1 fois par jour le matin',
        duration: '3 mois',
        notes: 'Prendre avec un verre d\'eau avant le petit déjeuner.'
      },
      {
        medication: 'Magné B6',
        dosage: '2 comprimés',
        route: 'Voie orale',
        frequency: 'Matin et soir',
        duration: '30 jours',
        notes: 'Cure anti-fatigue.'
      }
    ],
    requestedExaminations: ['Créatininémie + DFG', 'Ionogramme sanguin (K+, Na+)', 'Microalbuminurie des 24h'],
    followUpInstructions: 'Revoir en consultation de routine dans 3 mois avec résultats du bilan biologique et carnet d\'auto-mesure tensionnelle.',
    status: 'signed',
    version: 'v1.0 (Signé numériquement)'
  },
  {
    id: 'cons-102',
    patientId: 'p-3',
    patientName: 'M. Mohammed El Alami',
    doctorId: 'usr-2',
    doctorName: 'Dr. Hicham Amrani',
    date: 'Aujourd\'hui',
    time: '10:25',
    chiefComplaint: 'Douleur thoracique rétrosternale constrictive irradiant au bras gauche à l\'effort.',
    historyOfPresentIllness: 'Survenue il y a 2 heures lors d\'une marche rapide. Sensation d\'oppression d\'une durée de 20 minutes, régressive au repos relatif.',
    medicalHistoryNotes: 'Tabagisme actif 30 PA. Diabète type 2 sous Metformine.',
    surgicalHistoryNotes: 'Néant.',
    allergiesList: ['Aucune allergie médicamenteuse connue'],
    vitals: {
      bloodPressure: '150/95',
      heartRate: 84,
      oxygenSat: 97,
      bloodGlucose: '1.20',
      temperature: 37.1,
      respiratoryRate: 18
    },
    clinicalExamination: 'Patient angoissé mais lucide. Rythme régulier, galop présystolique B4 inconstant. Pas de râles crépitants.',
    diagnosis: 'Syndrome coronarien aigu sans sus-décalage de ST (SCA ST-) à confirmer.',
    treatmentPlan: 'Conditionnement immédiat, pose VVP, monitoring scope continu, ECG 18 dérivations répété, dosage Troponine ultra-sensible immédiate.',
    prescriptions: [
      {
        medication: 'Aspirine (Kardegic) 300mg',
        dosage: '1 sachet',
        route: 'Voie orale',
        frequency: 'Dose de charge immédiate',
        duration: 'Unique',
        notes: 'À croquer ou dissoudre.'
      },
      {
        medication: 'Clopidogrel (Plavix) 300mg',
        dosage: '4 comprimés 75mg',
        route: 'Voie orale',
        frequency: 'Dose de charge',
        duration: 'Unique',
        notes: 'Après accord cardiologue de garde.'
      }
    ],
    requestedExaminations: ['Troponine I ultra-sensible (T0 et T3h)', 'ECG 18 dérivations', 'Échocardiographie Doppler transthoracique'],
    followUpInstructions: 'Hospitalisation immédiate en Unité de Soins Intensifs Cardiologiques (USIC).',
    status: 'validated',
    version: 'v1.1'
  }
];

export const INITIAL_EXAMINATIONS: ExaminationRequest[] = [
  {
    id: 'exam-lab-01',
    patientId: 'p-3',
    patientName: 'M. Mohammed El Alami',
    patientCin: 'BE489102',
    type: 'laboratory',
    category: 'Biologie Sanguine & Urgence',
    examinationName: 'Troponine I Ultra-sensible + CK-MB + Ionogramme',
    requestingDoctor: 'Dr. Hicham Amrani',
    requestDate: 'Aujourd\'hui 10:35',
    sampleId: 'TUBE-CARDIO-8891',
    collectionTime: 'Aujourd\'hui 10:45',
    technician: 'Y. Berrada (Biologiste)',
    urgency: 'vital',
    parameters: [
      { name: 'Troponine I Us', value: '48.5', unit: 'ng/L', referenceRange: '< 14.0', status: 'critical' },
      { name: 'CK-MB masse', value: '7.8', unit: 'µg/L', referenceRange: '< 5.0', status: 'high' },
      { name: 'Créatinine', value: '11.2', unit: 'mg/L', referenceRange: '7.0 - 13.0', status: 'normal' },
      { name: 'Potassium (K+)', value: '4.2', unit: 'mEq/L', referenceRange: '3.5 - 5.0', status: 'normal' },
      { name: 'Sodium (Na+)', value: '141', unit: 'mEq/L', referenceRange: '136 - 145', status: 'normal' }
    ],
    report: 'Élévation significative et pathologique de la Troponine I ultra-sensible au-delà du 99e percentile. Cinétique enzymatique en faveur d\'une ischémie myocardique aiguë en cours.',
    status: 'validated',
    validatedBy: 'Dr. Youssef Berrada',
    validationDate: 'Aujourd\'hui 11:15'
  },
  {
    id: 'exam-lab-02',
    patientId: 'p-1',
    patientName: 'M. Youssef Benjelloun',
    patientCin: 'BE482910',
    type: 'laboratory',
    category: 'Biochimie & Néphrologie',
    examinationName: 'Bilan Rénal Complet + Microalbuminurie',
    requestingDoctor: 'Dr. Hicham Amrani',
    requestDate: 'Aujourd\'hui 09:25',
    sampleId: 'TUBE-BIO-7720',
    collectionTime: 'Aujourd\'hui 09:40',
    technician: 'Fatima N.',
    urgency: 'normal',
    parameters: [
      { name: 'Créatininémie', value: '9.4', unit: 'mg/L', referenceRange: '7.0 - 12.0', status: 'normal' },
      { name: 'DFG (CKD-EPI)', value: '88', unit: 'mL/min/1.73m²', referenceRange: '> 60', status: 'normal' },
      { name: 'Urée sanguine', value: '0.32', unit: 'g/L', referenceRange: '0.15 - 0.45', status: 'normal' },
      { name: 'Glycémie à jeun', value: '0.98', unit: 'g/L', referenceRange: '0.70 - 1.10', status: 'normal' }
    ],
    report: 'Fonction rénale parfaitement préservée sous IEC. Aucun signe d\'insuffisance rénale fonctionnelle ou organique.',
    status: 'validated',
    validatedBy: 'Dr. Youssef Berrada',
    validationDate: 'Aujourd\'hui 10:15'
  },
  {
    id: 'exam-rad-01',
    patientId: 'p-4',
    patientName: 'M. Karim Mansouri',
    patientCin: 'BK928314',
    type: 'radiology',
    category: 'Radiologie Osseuse Numérique',
    examinationName: 'Radiographie Jambe Droite Face + Profil (Contrôle J+1)',
    modality: 'Radiographie Numérique DR',
    requestingDoctor: 'Dr. Hicham Tazi',
    requestDate: 'Aujourd\'hui 08:30',
    technician: 'S. Belkadi (Manipulateur Radio)',
    radiologist: 'Dr. Salma Kabbaj',
    urgency: 'normal',
    report: 'Contrôle post-opératoire à J+1 d\'un enclouage centro-médullaire verrouillé de la diaphyse tibiale droite. Réduction axiale anatomique satisfaisante. Bon positionnement du matériel d\'ostéosynthèse et des vis de verrouillage proximal et distal.',
    status: 'validated',
    validatedBy: 'Dr. Salma Kabbaj',
    validationDate: 'Aujourd\'hui 09:45'
  },
  {
    id: 'exam-rad-02',
    patientId: 'p-2',
    patientName: 'Mme Fatima Zahra Mansouri',
    patientCin: 'BK723491',
    type: 'radiology',
    category: 'Échographie & Doppler',
    examinationName: 'Échographie Pelvienne et Utéro-annexielle',
    modality: 'Échographe Haute Résolution Voluson E10',
    requestingDoctor: 'Dr. S. Chraibi',
    requestDate: 'Aujourd\'hui 10:10',
    technician: 'Dr. S. Chraibi',
    radiologist: 'Dr. Salma Kabbaj',
    urgency: 'normal',
    report: 'Utérus antéversé de volume normal. Endomètre homogène de 8mm d\'épaisseur en phase proliférative. Ovaires d\'aspect échographique normal sans masse ni kyste suspect. Pas d\'épanchement dans le cul-de-sac de Douglas.',
    status: 'result_entered'
  },
  {
    id: 'exam-rad-03',
    patientId: 'p-3',
    patientName: 'M. Mohammed El Alami',
    patientCin: 'BE489102',
    type: 'radiology',
    category: 'Imagerie Cardiovasculaire',
    examinationName: 'Coronarographie Diagnostique en Urgence',
    modality: 'Salle de Cathétérisme Cardiaque Siemens Artis',
    requestingDoctor: 'Dr. Hicham Amrani',
    requestDate: 'Aujourd\'hui 11:20',
    urgency: 'vital',
    status: 'scheduled'
  }
];

export const INITIAL_REFERRALS: ReferralTransfer[] = [
  {
    id: 'ref-01',
    patientId: 'p-3',
    patientName: 'M. Mohammed El Alami',
    patientCin: 'BE489102',
    destinationFacility: 'CHU Ibn Rochd Casablanca (Pôle Cardiologie / USIC)',
    specialty: 'Cardiologie Interventionnelle d\'Urgence',
    reason: 'SCA ST- à haut risque avec Troponine très élevée nécessitant coronarographie et éventuelle angioplastie primaire immédiate.',
    urgency: 'vital',
    responsibleDoctor: 'Dr. Hicham Amrani',
    ambulanceRequired: true,
    attachedDocuments: ['ECG_10h30.pdf', 'Troponine_Lab_Result.pdf', 'Fiche_Transfert_SAMU05.pdf'],
    status: 'transport_planned',
    createdAt: 'Aujourd\'hui 11:30',
    contactPerson: 'Pr. Chami (Garde USIC CHU Ibn Rochd)'
  },
  {
    id: 'ref-02',
    patientId: 'p-7',
    patientName: 'Mme Nadia Berrada',
    patientCin: 'C839120',
    destinationFacility: 'Centre National de Rééducation et Réadaptation Casablanca',
    specialty: 'Médecine Physique & Réadaptation',
    reason: 'Poursuite de réautonomisation à la marche post-hospitalisation compliquée.',
    urgency: 'routine',
    responsibleDoctor: 'Dr. Layla Zahiri',
    ambulanceRequired: false,
    attachedDocuments: ['Synthese_Clinique_Sortie.pdf', 'Bilan_Kinesitherapie.pdf'],
    status: 'accepted',
    createdAt: 'Hier 16:00'
  }
];

export const INITIAL_NURSING_TASKS: NursingTask[] = [
  {
    id: 'task-01',
    patientId: 'p-4',
    patientName: 'M. Karim Mansouri',
    roomBed: 'Chambre 101 (Lit A)',
    taskType: 'medication',
    title: 'Administration Antalgique IV',
    details: 'Perfusion Perfalgan 1g dans 100ml NaCl 0.9% en 20 min.',
    responsibleNurse: 'Rachid El Mansouri',
    scheduledTime: '12:00',
    status: 'assigned'
  },
  {
    id: 'task-02',
    patientId: 'p-4',
    patientName: 'M. Karim Mansouri',
    roomBed: 'Chambre 101 (Lit A)',
    taskType: 'wound_care',
    title: 'Réfection Pansement Chirurgical J+1',
    details: 'Vérifier l\'absence de suintement sur cicatrice jambe droite, désinfection Bétadine dermique.',
    responsibleNurse: 'Rachid El Mansouri',
    scheduledTime: '14:00',
    status: 'prescribed'
  },
  {
    id: 'task-03',
    patientId: 'p-7',
    patientName: 'Mme Nadia Berrada',
    roomBed: 'Chambre 102 (Lit Unique)',
    taskType: 'vital_signs',
    title: 'Surveillance Glycémie Capillaire & TA',
    details: 'Dextro pré-prandial midi + Prise tensionnelle bras gauche couché.',
    responsibleNurse: 'Rachid El Mansouri',
    scheduledTime: '11:45',
    completionTime: '11:50',
    status: 'completed',
    validatedBy: 'Rachid El Mansouri'
  },
  {
    id: 'task-04',
    patientId: 'p-1',
    patientName: 'M. Youssef Benjelloun',
    roomBed: 'Box Cardio #02',
    taskType: 'vital_signs',
    title: 'Prise de constantes d\'accueil',
    details: 'TA, FC, SpO2, Dextro',
    responsibleNurse: 'Imane B.',
    scheduledTime: '09:00',
    completionTime: '09:05',
    status: 'validated',
    validatedBy: 'Dr. Hicham Amrani'
  },
  {
    id: 'task-05',
    patientId: 'p-4',
    patientName: 'M. Karim Mansouri',
    roomBed: 'Chambre 101 (Lit A)',
    taskType: 'mobility',
    title: 'Premier Lever et transfert au fauteuil',
    details: 'Accompagnement par l\'infirmier et le kinésithérapeute, appui soulagé avec béquilles.',
    responsibleNurse: 'Rachid El Mansouri',
    scheduledTime: '16:00',
    status: 'prescribed'
  }
];

export const INITIAL_MED_ADMINS: MedicationAdministration[] = [
  {
    id: 'adm-01',
    patientId: 'p-4',
    patientName: 'M. Karim Mansouri',
    medication: 'Enoxaparine (Lovenox) 4000 UI / 0.4ml',
    dose: '0.4 ml SC',
    route: 'Sous-cutanée',
    frequency: '1 fois / jour le soir',
    scheduledTime: '20:00',
    nurse: 'Rachid El Mansouri',
    status: 'scheduled'
  },
  {
    id: 'adm-02',
    patientId: 'p-4',
    patientName: 'M. Karim Mansouri',
    medication: 'Paracétamol (Perfalgan) 1g',
    dose: '1g IV',
    route: 'Intraveineuse lente',
    frequency: 'Toutes les 6h',
    scheduledTime: '06:00',
    administeredTime: '06:05',
    nurse: 'Rachid El Mansouri',
    status: 'given'
  },
  {
    id: 'adm-03',
    patientId: 'p-7',
    patientName: 'Mme Nadia Berrada',
    medication: 'Insuline Novorapid',
    dose: '6 Unités SC',
    route: 'Sous-cutanée',
    frequency: 'Avant le déjeuner',
    scheduledTime: '12:00',
    nurse: 'Rachid El Mansouri',
    status: 'scheduled'
  }
];

export const INITIAL_PHARMACY_CATALOG: MedicationCatalogItem[] = [
  {
    id: 'med-01',
    code: 'MED-PAR-1G',
    name: 'Perfalgan (Paracétamol injectable) 1g/100ml',
    category: 'Antalgique / Antipyrétique',
    form: 'Flacon perfusion IV',
    strength: '1g / 100ml',
    stock: 142,
    minStockAlert: 50,
    unit: 'flacons',
    unitPrice: 28.50,
    location: 'Pharmacie Centrale - Rayon A2',
    batchNumber: 'LOT-PERF-24901',
    expiryDate: '12/2026'
  },
  {
    id: 'med-02',
    code: 'MED-LOV-40',
    name: 'Lovenox (Enoxaparine) 4000 UI / 0.4ml',
    category: 'Antithrombotique HBPM',
    form: 'Seringue préremplie SC',
    strength: '4000 UI',
    stock: 24,
    minStockAlert: 30,
    unit: 'seringues',
    unitPrice: 42.00,
    location: 'Frigo 2-8°C Pharmacie - Étagère 1',
    batchNumber: 'LOT-LOV-99321',
    expiryDate: '09/2026'
  },
  {
    id: 'med-03',
    code: 'MED-TRI-5MG',
    name: 'Triatec (Ramipril) 5mg',
    category: 'Cardiovasculaire / IEC',
    form: 'Boîte de 30 comprimés',
    strength: '5mg',
    stock: 85,
    minStockAlert: 20,
    unit: 'boîtes',
    unitPrice: 56.40,
    location: 'Pharmacie Centrale - Rayon C1',
    batchNumber: 'LOT-RAM-1092',
    expiryDate: '03/2027'
  },
  {
    id: 'med-04',
    code: 'MED-CEF-1G',
    name: 'Rocéphine (Ceftriaxone) 1g injectable',
    category: 'Antibiotique Céphalosporine 3G',
    form: 'Flacon poudre + solvant IV/IM',
    strength: '1g',
    stock: 12,
    minStockAlert: 25,
    unit: 'flacons',
    unitPrice: 78.90,
    location: 'Pharmacie Centrale - Rayon B4 (Alerte Stock Bas)',
    batchNumber: 'LOT-ROC-88190',
    expiryDate: '11/2025'
  },
  {
    id: 'med-05',
    code: 'MED-NAC-500',
    name: 'Sérum Physiologique NaCl 0.9% 500ml',
    category: 'Solutés massifs de perfusion',
    form: 'Poche perfusion souple',
    strength: '0.9%',
    stock: 310,
    minStockAlert: 100,
    unit: 'poches',
    unitPrice: 12.00,
    location: 'Réserve Solutés - Zone E',
    batchNumber: 'LOT-NAC-3301',
    expiryDate: '01/2028'
  }
];

export const INITIAL_SURGERY_SCHEDULE: SurgerySchedule[] = [
  {
    id: 'surg-01',
    patientId: 'p-4',
    patientName: 'M. Karim Mansouri',
    patientCin: 'BK928314',
    procedure: 'Enclouage Centro-médullaire Tibia Droit',
    surgeon: 'Dr. Hicham Tazi',
    anesthetist: 'Dr. K. Benjelloun',
    operatingRoom: 'Bloc 2 - Orthopédie & Traumatologie',
    scheduledDate: '23/10/2026',
    startTime: '14:30',
    expectedDurationMinutes: 90,
    preOpChecklistCompleted: true,
    status: 'completed',
    recoveryAldreteScore: 10,
    anesthesiaType: 'Rachianesthésie',
    postOpNotes: 'Intervention déroulée sans incident per-opératoire. Saignement minime (< 150ml). Contrôle radiologique per-opératoire satisfaisant.'
  },
  {
    id: 'surg-02',
    patientId: 'p-11',
    patientName: 'M. Tarik Benmoussa',
    patientCin: 'BE771029',
    procedure: 'Chirurgie Hernie Inguinale sous Coelioscopie',
    surgeon: 'Dr. Hicham Tazi',
    anesthetist: 'Dr. K. Benjelloun',
    operatingRoom: 'Bloc 3 - Chirurgie Ambulatoire',
    scheduledDate: 'Aujourd\'hui',
    startTime: '13:30',
    expectedDurationMinutes: 60,
    preOpChecklistCompleted: true,
    status: 'patient_prepared',
    anesthesiaType: 'Générale'
  },
  {
    id: 'surg-03',
    patientId: 'p-12',
    patientName: 'Mme Souad Kettani',
    patientCin: 'BK110294',
    procedure: 'Pontage Aorto-coronarien x2 sous CEC',
    surgeon: 'Pr. M. Cherkaoui',
    anesthetist: 'Dr. Layla Zahiri',
    operatingRoom: 'Bloc 1 - Chirurgie Cardiaque & Vasculaire',
    scheduledDate: 'Demain',
    startTime: '08:30',
    expectedDurationMinutes: 240,
    preOpChecklistCompleted: false,
    status: 'scheduled',
    anesthesiaType: 'Générale'
  }
];

export const INITIAL_DOCUMENTS: MedicalDocument[] = [
  {
    id: 'doc-01',
    patientId: 'p-1',
    patientName: 'M. Youssef Benjelloun',
    patientCin: 'BE482910',
    type: 'medical-report',
    title: 'Compte-Rendu de Consultation Cardiologique',
    author: 'Dr. Hicham Amrani',
    authorRole: 'Cardiologue Référent',
    date: 'Aujourd\'hui',
    status: 'signed',
    version: 'v1.0',
    confidentiality: 'normal',
    content: 'Patient de 46 ans suivi pour HTA essentielle sous Ramipril 5mg. Évolution clinique favorable, tension artérielle normalisée à 135/85 mmHg. Bilan rénal et ionogramme dans les limites de la normale.',
    fileSize: '145 Ko'
  },
  {
    id: 'doc-02',
    patientId: 'p-1',
    patientName: 'M. Youssef Benjelloun',
    patientCin: 'BE482910',
    type: 'prescription',
    title: 'Ordonnance Médicale - Traitement Anti-HTA',
    author: 'Dr. Hicham Amrani',
    authorRole: 'Cardiologue',
    date: 'Aujourd\'hui',
    status: 'signed',
    version: 'v1.0',
    confidentiality: 'normal',
    content: '1) Triatec 5mg : 1 cp le matin pendant 3 mois.\n2) Magné B6 : 2 cp par jour pendant 30 jours.',
    fileSize: '88 Ko'
  },
  {
    id: 'doc-03',
    patientId: 'p-4',
    patientName: 'M. Karim Mansouri',
    patientCin: 'BK928314',
    type: 'hospitalization-report',
    title: 'Compte-Rendu Opératoire - Ostéosynthèse Diaphyse Tibiale',
    author: 'Dr. Hicham Tazi',
    authorRole: 'Chirurgien Orthopédiste',
    date: 'Hier',
    status: 'validated',
    version: 'v1.1',
    confidentiality: 'normal',
    content: 'Enclouage centro-médullaire verrouillé à foyer fermé jambe droite. Durée intervention 1h15. Réduction anatomique, contrôle radiographique d\'excellente qualité.',
    fileSize: '320 Ko'
  },
  {
    id: 'doc-04',
    patientId: 'p-4',
    patientName: 'M. Karim Mansouri',
    patientCin: 'BK928314',
    type: 'consent',
    title: 'Consentement Éclairé Chirurgical et Anesthésique',
    author: 'Karima Tazi',
    authorRole: 'Admission / Chef Réception',
    date: '23/10/2026',
    status: 'signed',
    version: 'v1.0',
    confidentiality: 'restricted',
    content: 'Consentement libre et éclairé signé par le patient pour l\'intervention chirurgicale et l\'anesthésie locorégionale après entretien médical explicatif.',
    fileSize: '1.2 Mo'
  }
];

export const INITIAL_CONSENTS: PatientConsent[] = [
  {
    id: 'cst-01',
    patientId: 'p-4',
    patientName: 'M. Karim Mansouri',
    patientCin: 'BK928314',
    type: 'surgical',
    title: 'Consentement Éclairé pour Intervention Chirurgicale Orthopédique',
    version: 'v2.1',
    date: '23/10/2026 13:00',
    signedBy: 'M. Karim Mansouri',
    relationship: 'Patient lui-même',
    doctorName: 'Dr. Hicham Tazi',
    status: 'signed',
    notes: 'Explications données sur les risques thrombo-emboliques, infectieux et la nécessité d\'une anticoagulation préventive.'
  },
  {
    id: 'cst-02',
    patientId: 'p-4',
    patientName: 'M. Karim Mansouri',
    patientCin: 'BK928314',
    type: 'anesthesia',
    title: 'Consentement d\'Anesthésie Locorégionale (Rachianesthésie)',
    version: 'v1.0',
    date: '23/10/2026 13:15',
    signedBy: 'M. Karim Mansouri',
    relationship: 'Patient lui-même',
    doctorName: 'Dr. K. Benjelloun',
    status: 'signed'
  },
  {
    id: 'cst-03',
    patientId: 'p-1',
    patientName: 'M. Youssef Benjelloun',
    patientCin: 'BE482910',
    type: 'data_processing_cndp',
    title: 'Consentement au Traitement des Données de Santé (Loi 09-08 CNDP)',
    version: 'v3.0',
    date: 'Aujourd\'hui 08:58',
    signedBy: 'M. Youssef Benjelloun',
    relationship: 'Patient lui-même',
    doctorName: 'Karima Tazi (Réception)',
    status: 'signed',
    notes: 'Dossier électronique sécurisé, partage intra-hospitalier et télétransmission AMO Masar.'
  }
];

export const INITIAL_COVERAGE_RULES: InsuranceCoverageRule[] = [
  {
    id: 'cov-01',
    organism: 'CNOPS',
    actCategory: 'Consultation Spécialisée',
    coverageRate: 80,
    requiresPreAuth: false,
    ceilingAmount: 250,
    notes: 'Tarif National de Référence (TNR) 250 MAD couvert à 80% soit 200 MAD.'
  },
  {
    id: 'cov-02',
    organism: 'CNSS',
    actCategory: 'Consultation Spécialisée',
    coverageRate: 70,
    requiresPreAuth: false,
    ceilingAmount: 250,
    notes: 'Prise en charge standard 70% sur base tarifaire conventionnée.'
  },
  {
    id: 'cov-03',
    organism: 'CNOPS',
    actCategory: 'Hospitalisation Chirurgicale & Bloc',
    coverageRate: 90,
    requiresPreAuth: true,
    notes: 'Entente préalable obligatoire via Masar / CNOPS 72h avant admission programmée.'
  },
  {
    id: 'cov-04',
    organism: 'CNSS',
    actCategory: 'Hospitalisation Chirurgicale & Bloc',
    coverageRate: 80,
    requiresPreAuth: true,
    notes: 'Prise en charge PEC 80% accordée selon nomenclature INPE.'
  },
  {
    id: 'cov-05',
    organism: 'Tadamon',
    actCategory: 'Soins Ambulatoires & Hospitalisation Publique/Agréée',
    coverageRate: 100,
    requiresPreAuth: true,
    notes: 'Couverture intégrale 100% dans le cadre AMO Tadamon avec numéro d\'immatriculation valide.'
  }
];

export const INITIAL_CASH_SESSIONS: CashRegisterSession[] = [
  {
    id: 'cash-sess-today',
    date: 'Aujourd\'hui',
    openedBy: 'Fatima Zahra Chraibi',
    openingBalance: 5000,
    cashTransactions: 14200,
    cardTransactions: 28400,
    chequeTransactions: 5900,
    refunds: 0,
    adjustments: 0,
    expectedBalance: 19200, // opening 5000 + cash 14200
    countedBalance: 19150,
    variance: -50,
    varianceReason: 'Erreur rendu monnaie ticket #C-04 (50 MAD compensé sur bordereau écart caisse)',
    status: 'open'
  },
  {
    id: 'cash-sess-yesterday',
    date: 'Hier',
    openedBy: 'Fatima Zahra Chraibi',
    closedBy: 'Fatima Zahra Chraibi',
    openingBalance: 5000,
    cashTransactions: 18500,
    cardTransactions: 32000,
    chequeTransactions: 7500,
    refunds: 300,
    adjustments: 0,
    expectedBalance: 23200,
    countedBalance: 23200,
    variance: 0,
    status: 'closed',
    closedAt: 'Hier 19:45'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-01',
    timestamp: 'Aujourd\'hui 11:15:32',
    user: 'Dr. Youssef Berrada',
    role: 'laboratory',
    action: 'VALIDATE',
    module: 'Examinations (Laboratoire)',
    entity: 'Troponine I Us - M. Mohammed El Alami (#BE489102)',
    previousValue: 'Statut: result_entered (48.5 ng/L)',
    newValue: 'Statut: validated (Alerte envoyée au prescripteur)',
    ipAddress: '192.168.1.104 (Poste Labo Bio 01)',
    result: 'success'
  },
  {
    id: 'aud-02',
    timestamp: 'Aujourd\'hui 10:45:10',
    user: 'Karima Tazi',
    role: 'reception',
    action: 'CREATE',
    module: 'Admissions & Patient Flow',
    entity: 'Admission patient Mme Amina Tahiri (#C892012)',
    newValue: 'Création admission ticket #G-08 - Box 01',
    ipAddress: '192.168.1.12 (Guichet Accueil Principal)',
    result: 'success'
  },
  {
    id: 'aud-03',
    timestamp: 'Aujourd\'hui 10:12:04',
    user: 'Omar Benali',
    role: 'insurance-agent',
    action: 'EDIT',
    module: 'AMO & Rejets FSE',
    entity: 'FSE #883920 - Motif R-12 Volet 1 non signé',
    previousValue: 'Statut: urgent (bloqué)',
    newValue: 'Statut: resolved (Signature médecin apposée, retransmission Masar)',
    ipAddress: '192.168.1.45 (Cellule Tiers-Payant)',
    result: 'success'
  },
  {
    id: 'aud-04',
    timestamp: 'Aujourd\'hui 09:30:18',
    user: 'Rachid El Mansouri',
    role: 'nurse',
    action: 'VALIDATE',
    module: 'Hospitalisation (28 Lits)',
    entity: 'Lit 101-B - Chambre 101',
    previousValue: 'Statut: cleaning (Bio-nettoyage en cours)',
    newValue: 'Statut: available (Certifié stérile après sortie J-1)',
    ipAddress: '192.168.1.88 (Tablette Soins Étage 1)',
    result: 'success'
  },
  {
    id: 'aud-05',
    timestamp: 'Aujourd\'hui 08:55:00',
    user: 'Dr. Layla Zahiri',
    role: 'super-admin',
    action: 'EXPORT',
    module: 'Reporting Régulation',
    entity: 'Rapport d\'Activité Journalier Casablanca',
    newValue: 'Export PDF sécurisé généré',
    ipAddress: '192.168.1.2 (Direction Médicale)',
    result: 'success'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-01',
    category: 'clinical',
    title: 'Alerte Biologique Critique : Troponine I',
    message: 'Troponine I Us à 48.5 ng/L pour M. Mohammed El Alami (Box 03). Prise en charge urgente requise.',
    timestamp: 'Il y a 10 min',
    isRead: false,
    priority: 'urgent',
    targetView: 'examinations',
    relatedEntityId: 'exam-lab-01'
  },
  {
    id: 'notif-02',
    category: 'insurance',
    title: 'Dossier Rejeté : CNSS FSE #883920',
    message: 'Rejet CNSS motif R-12 : Volet 1 non signé. Échéance de régularisation sous 48 heures.',
    timestamp: 'Il y a 25 min',
    isRead: false,
    priority: 'high',
    targetView: 'amo-portal',
    relatedEntityId: 'rej-1'
  },
  {
    id: 'notif-03',
    category: 'operational',
    title: 'Lit Libéré pour Bio-Nettoyage',
    message: 'Chambre 104 (Lit B) libéré suite à sortie autorisée. Mission attribuée à l\'agent d\'hygiène.',
    timestamp: 'Il y a 40 min',
    isRead: false,
    priority: 'medium',
    targetView: 'hospitalization'
  },
  {
    id: 'notif-04',
    category: 'financial',
    title: 'Clôture de Caisse en attente',
    message: 'Écart de 50 MAD détecté sur la session de caisse en cours. Justification enregistrée.',
    timestamp: 'Il y a 1h',
    isRead: true,
    priority: 'low',
    targetView: 'billing-amo'
  }
];

export interface DemoStep {
  step: number;
  phase: string;
  title: string;
  description: string;
  targetView: import('../types').ViewMode;
  role: import('../types').UserRole;
  actionSummary: string;
}

export const DEMO_WORKFLOW_STEPS: DemoStep[] = [
  {
    step: 1,
    phase: '1. Admission & Réception',
    title: 'Accueil & Détection Doublons',
    description: 'Le patient se présente au guichet. Vérification de la CIN marocaine, détection des doublons automatique et saisie du dossier administratif.',
    targetView: 'patient-flow',
    role: 'reception',
    actionSummary: 'Ouvrir "+ Admission" ou sélectionner un patient en file d\'attente.'
  },
  {
    step: 2,
    phase: '1. Admission & Réception',
    title: 'Vérification Droits AMO Masar',
    description: 'Interrogation directe des serveurs CNSS / CNOPS / Tadamon pour valider l\'éligibilité, le taux de couverture (70% ou 80%) et le reliquat mutuelle.',
    targetView: 'amo-portal',
    role: 'reception',
    actionSummary: 'Cliquer sur "Vérifier AMO" dans l\'en-tête ou le dossier.'
  },
  {
    step: 3,
    phase: '1. Admission & Réception',
    title: 'Émission Ticket & File d\'Attente',
    description: 'Génération du ticket (#C-12), affectation au Box Cardio #02 et aiguillage dans le régulateur de flux Kanban.',
    targetView: 'patient-flow',
    role: 'reception',
    actionSummary: 'Glisser le patient vers "En consultation" ou "Appelé".'
  },
  {
    step: 4,
    phase: '2. Consultation Médicale',
    title: 'Dossier Médical 360° & Constantes',
    description: 'Prise des constantes vitales par l\'infirmière (TA 135/85, Dextro 0.98, Sat 99%) et consultation de l\'historique médical complet.',
    targetView: 'patient-files',
    role: 'doctor',
    actionSummary: 'Visualiser l\'onglet "Consultation & Dossier" avec anamnèse structurée.'
  },
  {
    step: 5,
    phase: '2. Consultation Médicale',
    title: 'Prescription & Ordonnance Électronique',
    description: 'Rédaction du plan de traitement, prescription connectée au catalogue pharmacie avec posologie et durée.',
    targetView: 'patient-files',
    role: 'doctor',
    actionSummary: 'Consulter l\'ordonnance signée Triatec 5mg + Magné B6.'
  },
  {
    step: 6,
    phase: '3. Plateau d\'Examens',
    title: 'Prescription Bilan Labo & Imagerie',
    description: 'Demande en 1 clic d\'une Troponine ultra-sensible et d\'une radiographie de contrôle transmises directement aux plateaux techniques.',
    targetView: 'examinations',
    role: 'doctor',
    actionSummary: 'Basculer sur le module Examens pour suivre l\'acheminement du prélèvement.'
  },
  {
    step: 7,
    phase: '3. Plateau d\'Examens',
    title: 'Validation Biologique & Alerte Critique',
    description: 'Le biologiste valide les résultats numériques. Si une valeur dépasse le seuil d\'alerte, notification immédiate au médecin.',
    targetView: 'examinations',
    role: 'laboratory',
    actionSummary: 'Examiner le paramètre Troponine (48.5 ng/L) marqué "Critique".'
  },
  {
    step: 8,
    phase: '4. Hospitalisation & Soins',
    title: 'Affectation Lit d\'Hospitalisation (28 Lits)',
    description: 'Visualisation temps réel de la grille des 28 lits de la clinique. Affectation d\'un lit propre et traçabilité de l\'entrée.',
    targetView: 'hospitalization',
    role: 'nurse',
    actionSummary: 'Consulter la Chambre 101 ou effectuer un transfert de lit tracé.'
  },
  {
    step: 9,
    phase: '4. Hospitalisation & Soins',
    title: 'Plan de Soins Infirmiers & Administrations',
    description: 'Tableau de bord infirmier : validation des tâches de soins (perfusion, réfection pansement) et des prises médicamenteuses horodatées.',
    targetView: 'nursing',
    role: 'nurse',
    actionSummary: 'Cliquer pour valider une tâche infirmière ou une dose de médicament.'
  },
  {
    step: 10,
    phase: '5. Bloc Opératoire',
    title: 'Check-list Pré-opératoire & Planning Bloc',
    description: 'Planification de l\'intervention, check-list de sécurité anesthésique OMS, équipe chirurgicale et score d\'Aldrete en SSPI.',
    targetView: 'operating-room',
    role: 'doctor',
    actionSummary: 'Consulter les salles de bloc (Orthopédie, Vasculaire, Ambulatoire).'
  },
  {
    step: 11,
    phase: '6. Transfert ou Sortie',
    title: 'Transfert Médicalisé d\'Urgence',
    description: 'Si complication ou réorientation requise, génération du bordereau de transfert SAMU vers le CHU Ibn Rochd avec pièces jointes.',
    targetView: 'referrals',
    role: 'doctor',
    actionSummary: 'Consulter la fiche d\'évacuation SAMU avec dossier médical joint.'
  },
  {
    step: 12,
    phase: '7. Facturation & Clôture',
    title: 'Feuille de Soins FSE & Caisse Centrale',
    description: 'Ventilation automatique AMO (80%) et part patient (20%), encaissement sécurisé et session de caisse avec suivi des écarts.',
    targetView: 'billing-amo',
    role: 'billing',
    actionSummary: 'Visualiser la facture soldée et la réconciliation de caisse.'
  },
  {
    step: 13,
    phase: '8. Sécurité & Gouvernance',
    title: 'Journal d\'Audit Immuable & Rôles',
    description: 'Toutes les actions (qui a vu, créé, modifié, validé quoi) sont scellées dans le journal d\'audit avec adresse IP et horodatage.',
    targetView: 'audit',
    role: 'super-admin',
    actionSummary: 'Inspecter les traces d\'audit immuables pour la conformité CNDP.'
  }
];

export const INITIAL_MEDICATION_STOCK: MedicationItem[] = [
  {
    id: 'med-01',
    name: 'Perfalgan 1g Flacon IV',
    dci: 'Paracétamol',
    dosage: '1000 mg / 100 ml',
    form: 'Solution pour perfusion',
    category: 'Antalgique / Antipyrétique',
    stock: 142,
    minThreshold: 50,
    unitPriceMAD: 28.50,
    batchNumber: 'LOT-PERF-24901',
    expiryDate: '12/2026',
    storageConditions: 'Température ambiante (< 25°C)',
    unit: 'flacons'
  },
  {
    id: 'med-02',
    name: 'Lovenox 4000 UI Seringue SC',
    dci: 'Enoxaparine sodique',
    dosage: '40 mg / 0.4 ml',
    form: 'Seringue préremplie',
    category: 'Antithrombotique HBPM',
    stock: 24,
    minThreshold: 30,
    unitPriceMAD: 42.00,
    batchNumber: 'LOT-LOV-99321',
    expiryDate: '09/2026',
    storageConditions: 'Frigo 2°C - 8°C (Chaîne du froid)',
    unit: 'seringues'
  },
  {
    id: 'med-03',
    name: 'Augmentin 1g/200mg IV',
    dci: 'Amoxicilline + Acide Clavulanique',
    dosage: '1 g / 200 mg',
    form: 'Poudre injectable',
    category: 'Antibiotique bêtalactamine',
    stock: 88,
    minThreshold: 40,
    unitPriceMAD: 35.00,
    batchNumber: 'LOT-AUG-33210',
    expiryDate: '04/2026',
    storageConditions: 'Température ambiante (< 25°C)',
    unit: 'flacons'
  },
  {
    id: 'med-04',
    name: 'Novorapid FlexPen 100 U/ml',
    dci: 'Insuline Asparte',
    dosage: '100 U/ml',
    form: 'Stylo prérempli SC',
    category: 'Antidiabétique injectable',
    stock: 12,
    minThreshold: 20,
    unitPriceMAD: 110.00,
    batchNumber: 'LOT-NOVO-88124',
    expiryDate: '11/2025',
    storageConditions: 'Frigo 2°C - 8°C',
    unit: 'stylos'
  },
  {
    id: 'med-05',
    name: 'Ceftriaxone 1g Injectable IV/IM',
    dci: 'Ceftriaxone sodique',
    dosage: '1 g',
    form: 'Poudre + solvant',
    category: 'Antibiotique céphalosporine C3G',
    stock: 65,
    minThreshold: 35,
    unitPriceMAD: 45.00,
    batchNumber: 'LOT-CEF-76211',
    expiryDate: '01/2027',
    storageConditions: 'Température ambiante (< 25°C)',
    unit: 'flacons'
  },
  {
    id: 'med-06',
    name: 'Atropine Sulfate 1mg/ml',
    dci: 'Sulfate d\'Atropine',
    dosage: '1 mg / 1 ml',
    form: 'Ampoule injectable IV',
    category: 'Chariot d\'urgence / Réanimation',
    stock: 45,
    minThreshold: 25,
    unitPriceMAD: 12.00,
    batchNumber: 'LOT-ATR-11002',
    expiryDate: '08/2027',
    storageConditions: 'Chariot d\'urgence scellé',
    unit: 'ampoules'
  },
  {
    id: 'med-07',
    name: 'Adrénaline 1mg/1ml',
    dci: 'Adrénaline',
    dosage: '1 mg / 1 ml',
    form: 'Ampoule injectable IV',
    category: 'Chariot d\'urgence / Réanimation',
    stock: 8,
    minThreshold: 15,
    unitPriceMAD: 18.00,
    batchNumber: 'LOT-ADR-09923',
    expiryDate: '06/2025',
    storageConditions: 'À l\'abri de la lumière (< 25°C)',
    unit: 'ampoules'
  }
];

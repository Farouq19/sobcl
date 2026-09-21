import { Patient, Room, Invoice, AmoRejection, DoctorStaff } from '../types';

export const CLINIC_LOGO_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1X_mtNdEL3V5BwjYeTCxq6aEOTQRAsj8nHb3TUOI-E0Y29q5HGIhCTK89R8HmCy0j-IE1BTTzsS3jw1_I2NdapXBF80V-QX0BaL92CB8ZG1etSOzStd6VhZ3vZLBCx-CzroID2S_s5KYB5NU6jKolyxTxUaqQeyK5JSL_Amk525q21FrsKUZtAUZmPRIuzCPGhqRbyyMb-wDDHXkKDiPNz6RenUHsF673mcMOExtUW1z2Y0BgYYAvzIRzE';
export const DOCTOR_PROFILE_URL = 'https://lh3.googleusercontent.com/aida/AEtjO1VtUPE_LFsPx_jmxH6eXjJAPqUWUGlRE1eki8kXwinHgZQbUME-FtWFhhOkrmOrTqUVF7Ayv553sn2NhQHNO38tNW7mfYLxHEo-CaYq8rjBIR7WUXRFt2dWTkSg5ncyOuk7rFgkQunfAx98HAwFogncy3BTdKKAwownszZVOXn-NXv5ZpMQk72Jb1KJ2y67bNYV0lZaWAvkZVtp_4r3fWzseeu6TThk8ml9Exkx3LZJWIFwZKl605kWSOs';

export const PATIENT_PHOTOS = {
  benjelloun: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtuUiuJcEONCNXG4rjfTUDdDZpckMWuHwdymSUETffTcwhHsIJ-C6GHyrG88OMfX0Yw8bsYDzc7Yb3UcKbnLY7RP3DQxcvFquHG4BiSxK6yPbQkxUY9-7UaOtEDbaaytt3XwJTklSk8wVTKkipioERHE9JorkivT9MAmVzyk45n1v3sjdE8_5Pv6CKMNTcvMg8tdyE6QWTqWFj14hAYW_nII3p456ba-3QpOZn68V-vc1Y-SodYEyU',
  elFassi: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzExYZssoekMN6MQehI0oSik29lFLqWUkNpKMnQ0kWHf7i1mqzsShPxaPfuNksHB054WMD0V_BSlw66p5Ze4BWHAXOFvm5BZL7iyE6g6Bkmz0ELcWVR6uI3ZVw6ZLunrOslcw0EjEQl5789tSR0_6vcgdlr-O15iv7AEbjv988n9ceOWVuI7DeJQ_ZN0fvggSxG1an_O4nj77V3o0LZwYefq6qCbx_hKhHV8ANNgkVinYnGJzStoLI',
  mansouri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdOdH1t2hixW83Tydonxj2p3dNDiepve0YyAjCFrhkmmix_HdAOHO3yAbXb10GmNS4f8XnJZpLtBt8XuKDHPQoG-YF_z4OSTMuZfqBgJq4dbivBrvvrGqrWKwjJ5yDevFXcTBzjLJEV3d_PsPwBG9AT53oNcwy89vBKzxE96_rVsXEgeEzoLmbDyCvyywA0XmGzQ2PatV4LI0lx3uwptZ9xd1mQFjDBSg0ziTh_NkjNQleFV0tppRN',
  tahiri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBRQMV7bCcE5sdWhJwWQf7-04qp68Rw9JjeRhRNPFswINGSxBPVDWkxjsy1c-O4UD08kwlvtFxx1ADzMxn9mL2P8_CWY9DscTmRxbkEAbHf_gsg0xyl8-yc5sIfLSI--pZq6KUuWHe7faRNGCW8OY04AJrsws4egCUlQLgj8rrdeT9KAa5WWl4V0n4l6iqwMv5l5I3pNTYaY6yD8JoAZP57TuwRVstbNtaAs7tu4kxIMoJ2vsB15zb',
  kenzaBerrada: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBi8j5aI2DLwxFP28UieSuhniCKnOh8MHeKo6Y5ZTW-gxU8mxBYGelJewd4FYor93fkmZhfvFMhYyHbpvNMcCYeH_wsO5EhpTm1vl8z3bTmpqv93HNjouCObRr_8dkiK5jpKlfeMmfJG2Lasjb3daLAdFJ72iiLeLujU06UVTCPpUYc0OVuYWj8Q4Q2_psA4brNQRVcT2zdeEXYsEy1Q7MUXC_LpVHCe7geTrAEcrNYYrIucynI_yFj',
  nurseMajor: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAeTfIX-G17yfmRmZ1bfZR4Qq-t3dmFWe5H8yKH2NbqwfDvhLoQ_hqu8uufEtbExag9FFBmVIQnTL9XOdCX_GPesW9qP6nZXh5S4_Qyv1n1W9tUlcS66ZzUkFkPlzSFcokEWaMmS4YjPBM61qBTfDuTRHOKxxNjEvjnEsBi_pFrrTiXZwBqzZbLhqe3gKQ5XdC1w1lgSrVF-IQQ7TnsiHC0lv6Kq6FZG6hB6flnR3LpvOiLMLC0nJN'
};

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-1',
    cin: 'BE482910',
    name: 'M. Youssef Benjelloun',
    firstName: 'Youssef',
    lastName: 'Benjelloun',
    age: 46,
    gender: 'M',
    birthDate: '14/05/1978',
    phone: '+212 6 61 24 88 92',
    email: 'youssef.benjelloun@gmail.com',
    address: '34 Rue Jean Jaurès, Maârif, Casablanca',
    emergencyContact: {
      name: 'Salma Benjelloun',
      relation: 'Épouse',
      phone: '+212 6 61 99 88 77'
    },
    bloodGroup: 'O+',
    chronicDiseases: ['Hypertension Artérielle (HTA)', 'Dyslipidémie modérée'],
    medicalHistory: ['HTA essentielle depuis 2021', 'Rhumatismes articulaires intermittents'],
    surgicalHistory: ['Appendicectomie (1996)'],
    amoType: 'CNOPS',
    amoRate: 80,
    affiliationNumber: '8492019482',
    secondaryInsurance: 'Saham / Sanlam (20% reliquat)',
    eligibilityStatus: 'valid',
    balanceDue: 0,
    allergies: ['Allergie confirmée Pénicilline'],
    medicalAlerts: ['HTA Stade 1', 'Suivi Cardiologie'],
    status: 'waiting',
    strictStatus: 'WAITING',
    currentLocation: 'Box Cardio #02',
    arrivalTime: '08:55',
    assignedDoctor: 'Dr. Hicham Amrani',
    specialty: 'Cardiologie & Médecine Vasculaire',
    ticketNumber: '#C-12',
    waitingMinutes: 22,
    photoUrl: PATIENT_PHOTOS.benjelloun,
    vitals: {
      bloodPressure: '135/85',
      heartRate: 72,
      oxygenSat: 99,
      bloodGlucose: '0.98',
      temperature: 36.8,
      respiratoryRate: 15
    },
    diet: 'Régime hyposodé modéré',
    mobility: 'autonomous',
    isolationStatus: 'none',
    notes: "Patient vu pour consultation de contrôle trimestriel HTA essentielle. Bonne tolérance clinique du traitement par IEC. Pas de palpitations ni d'œdèmes des membres inférieurs rapportés. Auscultation cardio-pulmonaire normale, bruits du cœur réguliers sans souffle surajouté."
  },
  {
    id: 'p-2',
    cin: 'BK723491',
    name: 'Mme Fatima Zahra Mansouri',
    firstName: 'Fatima Zahra',
    lastName: 'Mansouri',
    age: 34,
    gender: 'F',
    birthDate: '22/09/1990',
    phone: '+212 6 72 10 44 89',
    email: 'fz.mansouri@hotmail.com',
    address: 'Gauthier, Casablanca',
    emergencyContact: {
      name: 'Adil Mansouri',
      relation: 'Époux',
      phone: '+212 6 63 11 22 33'
    },
    bloodGroup: 'A+',
    chronicDiseases: ['Syndrome des ovaires polykystiques (SOPK)'],
    medicalHistory: ['Surveillance échographique gynécologique semestrielle'],
    surgicalHistory: ['Aucun'],
    amoType: 'CNSS',
    amoRate: 70,
    affiliationNumber: '10982341-90',
    secondaryInsurance: 'Wafa Assurance Mutuelle',
    eligibilityStatus: 'valid',
    balanceDue: 0,
    allergies: ['Néant'],
    status: 'calling',
    strictStatus: 'CALLING',
    currentLocation: 'Salle A',
    arrivalTime: '10:32',
    assignedDoctor: 'Dr. S. Chraibi',
    specialty: 'Gynécologie',
    ticketNumber: '#G-04',
    waitingMinutes: 14,
    photoUrl: PATIENT_PHOTOS.elFassi,
    mobility: 'autonomous'
  },
  {
    id: 'p-3',
    cin: 'BE489102',
    name: 'M. Mohammed El Alami',
    firstName: 'Mohammed',
    lastName: 'El Alami',
    age: 62,
    gender: 'M',
    birthDate: '03/01/1962',
    phone: '+212 6 61 90 22 11',
    email: 'm.alami.casablanca@gmail.com',
    address: 'Ain Diab, Casablanca',
    emergencyContact: {
      name: 'Nawal El Alami',
      relation: 'Fille',
      phone: '+212 6 61 44 55 66'
    },
    bloodGroup: 'B+',
    chronicDiseases: ['Diabète type 2', 'Dyslipidémie mixte', 'Tabagisme sevré'],
    medicalHistory: ['Infarctus du myocarde inférieur en 2018 avec angioplastie'],
    surgicalHistory: ['Stent coronaire CD (2018)'],
    amoType: 'CNOPS',
    amoRate: 80,
    affiliationNumber: '3920194811',
    eligibilityStatus: 'valid',
    balanceDue: 0,
    allergies: ['Allergie aux produits de contraste iodés (prémédication requise)'],
    medicalAlerts: ['Urgence Coronarienne', 'Surveillance Scope Continu', 'Troponine Critique'],
    status: 'consultation',
    strictStatus: 'IN_CONSULTATION',
    currentLocation: 'Box 03',
    arrivalTime: '10:15',
    assignedDoctor: 'Dr. M. Amrani',
    specialty: 'Cardiologie',
    ticketNumber: '#U-01',
    vitals: {
      bloodPressure: '150/95',
      heartRate: 84,
      oxygenSat: 97,
      bloodGlucose: '1.20',
      temperature: 37.1,
      respiratoryRate: 18
    },
    diet: 'Sans sel strict, sans sucre rapide',
    mobility: 'bedridden',
    isolationStatus: 'none'
  },
  {
    id: 'p-4',
    cin: 'BK928314',
    name: 'M. Karim Mansouri',
    firstName: 'Karim',
    lastName: 'Mansouri',
    age: 42,
    gender: 'M',
    birthDate: '11/11/1982',
    phone: '+212 6 63 44 98 12',
    address: 'Bourgogne, Casablanca',
    emergencyContact: {
      name: 'Leila Mansouri',
      relation: 'Épouse',
      phone: '+212 6 64 00 11 22'
    },
    bloodGroup: 'AB+',
    chronicDiseases: ['Néant'],
    medicalHistory: ['Accident de sport (football) le 22/10'],
    surgicalHistory: ['Ostéosynthèse tibia droit par enclouage (23/10)'],
    amoType: 'CNSS',
    amoRate: 80,
    affiliationNumber: '10982341-90',
    eligibilityStatus: 'valid',
    balanceDue: 160,
    allergies: ['Aucune allergie connue'],
    medicalAlerts: ['Fracture diaphyse tibiale', 'J+1 Post-op', 'Anticoagulation HBPM'],
    status: 'hospitalized',
    strictStatus: 'HOSPITALIZED',
    currentLocation: 'Chambre 101 (Lit A)',
    arrivalTime: '23/10 14:10',
    assignedDoctor: 'Dr. H. Tazi',
    specialty: 'Chirurgie Orthopédique',
    photoUrl: PATIENT_PHOTOS.mansouri,
    diet: 'Régime hyperprotidique de cicatrisation',
    mobility: 'assisted',
    isolationStatus: 'none'
  },
  {
    id: 'p-5',
    cin: 'C892012',
    name: 'Mme Amina Tahiri',
    age: 29,
    gender: 'F',
    phone: '+212 6 68 33 21 00',
    amoType: 'CNSS',
    amoRate: 70,
    balanceDue: 0,
    status: 'waiting',
    currentLocation: 'Salle d\'Attente',
    arrivalTime: '09:35',
    assignedDoctor: 'Dr. Bennani',
    specialty: 'Médecine Générale',
    ticketNumber: '#G-08',
    waitingMinutes: 8,
    photoUrl: PATIENT_PHOTOS.tahiri
  },
  {
    id: 'p-6',
    cin: 'BK554102',
    name: 'Mme Kenza Berrada',
    age: 38,
    gender: 'F',
    phone: '+212 6 61 77 88 99',
    amoType: 'CNSS',
    amoRate: 70,
    affiliationNumber: '109823441 90',
    balanceDue: 435,
    status: 'waiting',
    currentLocation: 'Guichet Caisse',
    arrivalTime: '10:40',
    assignedDoctor: 'Dr. Bennani',
    specialty: 'Gynécologie & Échographie',
    photoUrl: PATIENT_PHOTOS.kenzaBerrada
  },
  {
    id: 'p-7',
    cin: 'C839120',
    name: 'Mme Nadia Berrada',
    age: 62,
    gender: 'F',
    phone: '+212 6 61 11 22 33',
    amoType: 'Wafa Assurance',
    amoRate: 85,
    balanceDue: 0,
    status: 'hospitalized',
    currentLocation: 'Chambre 102 (Lit Unique)',
    arrivalTime: '22/10 09:30',
    assignedDoctor: 'Dr. Layla Zahiri',
    specialty: 'Médecine Interne / Diabète'
  },
  {
    id: 'p-8',
    cin: 'A982310',
    name: 'M. Yassine Bennani',
    age: 45,
    gender: 'M',
    phone: '+212 6 62 89 00 12',
    amoType: 'Saham',
    amoRate: 80,
    balanceDue: 0,
    status: 'waiting',
    currentLocation: 'Attente Box 01',
    arrivalTime: '10:45',
    assignedDoctor: 'Dr. Layla Zahiri',
    specialty: 'Médecine Interne',
    waitingMinutes: 12
  },
  {
    id: 'p-9',
    cin: 'T309112',
    name: 'Rania Berrada (Enfant)',
    age: 6,
    gender: 'F',
    phone: '+212 6 65 40 30 20',
    amoType: 'CNSS',
    amoRate: 80,
    balanceDue: 0,
    status: 'waiting',
    currentLocation: 'Box 05',
    arrivalTime: '10:50',
    assignedDoctor: 'Dr. K. Benjelloun',
    specialty: 'Pédiatrie Garde',
    waitingMinutes: 5
  },
  {
    id: 'p-10',
    cin: 'CD119842',
    name: 'M. Abderrahim Chaoui',
    age: 51,
    gender: 'M',
    phone: '+212 6 61 70 80 90',
    amoType: 'Privé',
    amoRate: 0,
    balanceDue: 0,
    status: 'waiting',
    currentLocation: 'Salle Attente B',
    arrivalTime: '11:02',
    assignedDoctor: 'Dr. M. Amrani',
    specialty: 'Cardiologie',
    waitingMinutes: 22
  }
];

export const INITIAL_ROOMS: Room[] = [
  {
    id: 'r-101',
    number: '101',
    name: 'Chambre 101',
    floor: 'Étage 1',
    department: 'Chirurgie Orthopédique',
    type: 'double',
    beds: [
      {
        id: 'b-101-a',
        code: 'Lit A',
        status: 'occupied',
        patientId: 'p-4',
        patientName: 'M. Karim Mansouri',
        patientAge: 42,
        patientCin: 'BK928314',
        diagnosis: 'Fracture diaphyse tibiale fermée (Ostéosynthèse)',
        doctor: 'Dr. Hicham Tazi',
        coverage: 'AMO CNSS 80%',
        stayDay: 'J+1 Post-op',
        notes: 'Perfusion IV NaCl 500ml + Paracétamol 1g toutes les 6h. Surveillance pansement propre.'
      },
      {
        id: 'b-101-b',
        code: 'Lit B',
        status: 'available',
        notes: 'Bio-nettoyage certifié à 09:45. Prêt pour admission chirurgicale programmée.'
      }
    ]
  },
  {
    id: 'r-102',
    number: '102',
    name: 'Chambre 102',
    floor: 'Étage 1',
    department: 'Médecine / Diabétologie',
    type: 'single',
    beds: [
      {
        id: 'b-102-single',
        code: 'Lit Unique',
        status: 'occupied',
        patientId: 'p-7',
        patientName: 'Mme Nadia Berrada',
        patientAge: 62,
        patientCin: 'C839120',
        diagnosis: 'Équilibre Acido-cétosique & Diabète',
        doctor: 'Dr. Layla Zahiri',
        coverage: 'Wafa Assurance',
        stayDay: 'J+3 Surveillance',
        notes: 'Glycémie 1.12 g/L. Bilan biologique prévu à 14:00.'
      }
    ]
  },
  {
    id: 'r-108',
    number: 'Suite VIP 108',
    name: 'Suite VIP 108',
    floor: 'Aile Sud',
    department: 'Suite Privilège & Accompagnant',
    type: 'vip',
    isVip: true,
    beds: [
      {
        id: 'b-108-vip',
        code: 'Lit King Médicalisé',
        status: 'occupied',
        patientName: 'Mme Salma Alami',
        patientAge: 34,
        diagnosis: 'Post-Césarienne & Accouchement',
        doctor: 'Dr. Amrani',
        coverage: 'RMA Watanya',
        stayDay: 'Aldrete 9/10',
        aldreteScore: '9/10',
        notes: 'Nouveau-né Berceau C-1. Ronde pédiatrique à 13:00.'
      }
    ]
  },
  {
    id: 'r-104',
    number: '104',
    name: 'Chambre 104',
    floor: 'Étage 1',
    department: 'Chirurgie Générale',
    type: 'double',
    beds: [
      {
        id: 'b-104-a',
        code: 'Lit A',
        status: 'cleaning',
        cleaningEstimatedEnd: '12h15',
        notes: 'Libéré à 10h30 par Mme Idrissi. Agent d\'hygiène Fatima Z. en protocole niveau 2.'
      },
      {
        id: 'b-104-b',
        code: 'Lit B',
        status: 'reserved',
        patientName: 'M. Hassan Bennani (55 ans)',
        diagnosis: 'Cholecystectomie',
        doctor: 'Dr. Tazi',
        coverage: 'CNOPS',
        reservedForTime: '11h30',
        notes: 'Lit préparé & équipé O2 pour sortie bloc.'
      }
    ]
  },
  {
    id: 'r-201',
    number: '201',
    name: 'Chambre 201',
    floor: 'Étage 2',
    department: 'Cardiologie & Télémétrie',
    type: 'double',
    beds: [
      {
        id: 'b-201-a',
        code: 'Lit A',
        status: 'occupied',
        patientName: 'M. Omar Chraibi (71 ans)',
        diagnosis: 'HTA sévère en titration',
        doctor: 'Dr. Amrani',
        coverage: 'CNOPS 80%',
        vitalsSummary: 'FC: 68 bpm • TA: 135/85',
        notes: 'Scope actif relié à la centrale de télémétrie.'
      },
      {
        id: 'b-201-b',
        code: 'Lit B',
        status: 'available',
        notes: 'Accueil Urgences. Moniteur ECG calibré, chariot de soin stérilisé à disposition.'
      }
    ]
  },
  {
    id: 'r-usic',
    number: 'Box USIC 01',
    name: 'Box USIC 01',
    floor: 'Rez-de-chaussée',
    department: 'Surveillance Continue & USIC',
    type: 'icu',
    beds: [
      {
        id: 'b-usic-1',
        code: 'Lit Réa 1',
        status: 'occupied',
        patientName: 'Post-Angioplastie (Stent J0)',
        diagnosis: 'Syndrome Coronarien Aigu révascularisé',
        doctor: 'Dr. Benjelloun & Inf. Réa',
        coverage: 'AMO CNOPS',
        vitalsSummary: 'O2 98% • 74 BPM',
        notes: 'Seringue auto Hép Flush. Constantes télédéclarées.'
      },
      {
        id: 'b-usic-2',
        code: 'Lit Réa 2',
        status: 'available',
        notes: 'Ventilateur testé. Prêt pour accueil transfert SMUR ou déchocage post-bloc.'
      }
    ]
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: '#FAC-2024-1104',
    patientName: 'Mme Kenza Berrada',
    patientCin: 'BK554102',
    patientPhoto: PATIENT_PHOTOS.kenzaBerrada,
    date: 'Aujourd\'hui',
    time: '11:15',
    items: [
      { id: 'it-1', description: 'Consultation Spécialiste Dr. Bennani', amount: 300, doctor: 'Dr. Bennani' },
      { id: 'it-2', description: 'Bilan Biologique NFS + Glycémie à jeun', amount: 450, doctor: 'Labo Central' },
      { id: 'it-3', description: 'Échographie Pelvienne Haute Résolution', amount: 700, doctor: 'Dr. Bennani' }
    ],
    totalAmount: 1450,
    amoCoveragePercent: 70,
    amoAmount: 1015,
    patientAmount: 435,
    amountPaid: 0,
    remainingBalance: 435,
    status: 'pending',
    insuranceType: 'CNSS',
    fseNumber: 'FSE #883920'
  },
  {
    id: 'inv-2',
    invoiceNumber: '#FAC-2024-1103',
    patientName: 'M. Mehdi Amrani',
    patientCin: 'BE890123',
    date: 'Aujourd\'hui',
    time: '10:50',
    items: [
      { id: 'it-4', description: 'Cardiologie ECG + Holter tensionnel', amount: 2100, doctor: 'Dr. Tazi' }
    ],
    totalAmount: 2100,
    amoCoveragePercent: 80,
    amoAmount: 1680,
    patientAmount: 420,
    amountPaid: 420,
    remainingBalance: 0,
    status: 'paid',
    insuranceType: 'CNOPS',
    paymentMethod: 'card',
    fseNumber: 'FSE #883919'
  },
  {
    id: 'inv-3',
    invoiceNumber: '#FAC-2024-1102',
    patientName: 'Mme Salma Cherkaoui',
    patientCin: 'A741289',
    date: 'Aujourd\'hui',
    time: '10:20',
    items: [
      { id: 'it-5', description: 'Radiologie Thoracique Face + Profil', amount: 850, doctor: 'Dr. Zahiri' }
    ],
    totalAmount: 850,
    amoCoveragePercent: 70,
    amoAmount: 595,
    patientAmount: 255,
    amountPaid: 255,
    remainingBalance: 0,
    status: 'rejected',
    insuranceType: 'CNSS',
    paymentMethod: 'cash',
    fseNumber: 'FSE #883918'
  },
  {
    id: 'inv-4',
    invoiceNumber: '#FAC-2024-1101',
    patientName: 'M. Youssef Idrissi',
    patientCin: 'T224091',
    date: 'Aujourd\'hui',
    time: '09:40',
    items: [
      { id: 'it-6', description: 'Chirurgie Ambulatoire Bloc 03', amount: 5800, doctor: 'Dr. Tazi' }
    ],
    totalAmount: 5800,
    amoCoveragePercent: 80,
    amoAmount: 4640,
    patientAmount: 1160,
    amountPaid: 1160,
    remainingBalance: 0,
    status: 'transmitted',
    insuranceType: 'Privé',
    paymentMethod: 'cheque',
    fseNumber: 'FSE #883917'
  }
];

export const INITIAL_REJECTIONS: AmoRejection[] = [
  {
    id: 'rej-1',
    code: '#REJ-492',
    dossierNumber: '#DOS-8812',
    patientName: 'M. Tariq Alami',
    patientCin: 'BE492014',
    doctorName: 'Dr. Layla Zahiri',
    organism: 'CNSS',
    amount: 850,
    totalAmount: 1200,
    deadlineDays: 2,
    reasonCode: 'Motif R-12 CNSS AMO',
    reasonTitle: 'Volet 1 FSE Non Signé',
    reasonDescription: 'Signature et cachet du médecin prescripteur manquants sur le volet 1 de la Feuille de Soins Électronique (FSE #883920).',
    batchNumber: '#B-9921',
    status: 'urgent'
  },
  {
    id: 'rej-2',
    code: '#REJ-488',
    dossierNumber: '#DOS-8740',
    patientName: 'Mme Salwa Chraibi',
    patientCin: 'BK554102',
    doctorName: 'Dr. Hicham Amrani',
    organism: 'CNOPS',
    amount: 1250,
    totalAmount: 1250,
    deadlineDays: 5,
    reasonCode: 'Motif R-04 CNOPS',
    reasonTitle: 'Prise en Charge (PEC #48102) périmée',
    reasonDescription: 'Prise en Charge (PEC #48102) périmée de 48 heures lors de la réalisation de l\'acte radiologique.',
    batchNumber: '#B-9920',
    status: 'pending'
  },
  {
    id: 'rej-3',
    code: '#REJ-479',
    dossierNumber: '#DOS-8695',
    patientName: 'M. Omar Mansour',
    patientCin: 'A749201',
    doctorName: 'Dr. Bennani (Gastro)',
    organism: 'CNSS',
    amount: 380,
    totalAmount: 380,
    deadlineDays: 14,
    reasonCode: 'Motif R-09 ANAM',
    reasonTitle: 'Code INPE Prescripteur Non Reconnu',
    reasonDescription: 'Code INPE prescripteur non reconnu ou obsolète dans la nomenclature nationale ANAM. L\'INPE vérifié 104928371 est prêt à être appliqué.',
    batchNumber: '#B-9918',
    status: 'pending'
  }
];

export const ACTIVE_DOCTORS: DoctorStaff[] = [
  { id: 'doc-1', name: 'Dr. M. Amrani', specialty: 'Cardiologie', location: 'Box 3', status: 'active', color: '#006a61' },
  { id: 'doc-2', name: 'Dr. S. Chraibi', specialty: 'Gynécologie', location: 'Salle A', status: 'active', color: '#006a61' },
  { id: 'doc-3', name: 'Dr. H. Tazi', specialty: 'Chirurgie', location: 'Bloc Chir 2', status: 'in_surgery', color: '#ba1a1a' },
  { id: 'doc-4', name: 'Dr. L. Zahiri', specialty: 'Dir. Médicale', location: 'Bureau Régulation', status: 'active', color: '#006a61' },
  { id: 'doc-5', name: 'Dr. K. Benjelloun', specialty: 'Pédiatrie & Réa', location: 'Box 5 (Garde)', status: 'on_duty', color: '#188ace' }
];

export const HOURLY_ACTIVITY_DATA = [
  { hour: '08h', actual: 40, history: 30 },
  { hour: '09h', actual: 65, history: 50 },
  { hour: '10h', actual: 94, history: 75, isPeak: true, label: '22 pts' },
  { hour: '11h', actual: 82, history: 70, isCurrent: true },
  { hour: '12h', actual: 45, history: 55 },
  { hour: '13h', actual: 30, history: 40 },
  { hour: '14h', actual: 50, history: 60 },
  { hour: '15h', actual: 20, history: 68 },
  { hour: '16h', actual: 10, history: 80 },
  { hour: '17h', actual: 5, history: 85 },
  { hour: '18h', actual: 0, history: 60 },
  { hour: '20h', actual: 0, history: 35 }
];

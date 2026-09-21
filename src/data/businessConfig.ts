export interface AppBusinessConfig {
  // 1. Identité Établissement
  clinicInfo: {
    name: string;
    tagline: string;
    city: string;
    address: string;
    phone: string;
    emergencyPhone: string;
    ice: string;
    taxId: string;
    cnssAffiliation: string;
    medicalDirector: string;
    directorInpe: string;
    cndpAuthNumber: string;
    currency: string;
  };

  // 2. Tarifs & Prestations Médicales
  tariffs: {
    consultationGeneral: number;
    consultationSpecialist: number;
    consultationEmergency: number;
    consultationControl: number;
    bedRates: {
      standardDouble: number;
      standardSingle: number;
      suiteVip: number;
      intensiveCareUsic: number;
    };
    surgery: {
      orHourRateIso5: number;
      anesthesiaBaseRate: number;
      preOpAssessmentRate: number;
    };
    surcharges: {
      nightSurchargePercent: number;
      weekendSurchargePercent: number;
      nightStartHour: number; // 20 for 20:00
      nightEndHour: number;   // 8 for 08:00
    };
  };

  // 3. Taux & Règles Tiers-Payant AMO / Masar
  amoRules: {
    cnssRatePercent: number;
    cnopsRatePercent: number;
    tadamonRatePercent: number;
    privateInsuranceRatePercent: number;
    priorAgreementThresholdMad: number;
    maxClaimSubmissionDays: number;
    autoDeductMutualTopUp: boolean;
  };

  // 4. Seuils d'Alertes Physiologiques
  clinicalThresholds: {
    systolicAlertMax: number;
    systolicCriticalMax: number;
    systolicCriticalMin: number;
    diastolicAlertMax: number;
    heartRateMin: number;
    heartRateMax: number;
    heartRateCritical: number;
    oxygenSatWarning: number;
    oxygenSatCritical: number;
    glucoseHyperAlert: number;
    glucoseHyperCritical: number;
    glucoseHypoCritical: number;
    troponinAlert: number;
    troponinCritical: number;
  };

  // 5. Bloc Opératoire & SSPI
  surgeryConfig: {
    minAldreteScoreForDischarge: number; // 8, 9 or 10
    mandatoryPreOpChecklist: boolean;
    narcoticsDualSignOff: boolean;
    defaultSurgeryDurationMinutes: number;
  };

  // 6. Litière & Asepsie Bio-Nettoyage
  hospitalizationConfig: {
    standardCleaningTimeMinutes: number;
    septicCleaningTimeMinutes: number;
    requireHygieneAgentCertification: boolean;
    approvedDisinfectant: string;
  };

  // 7. File d'Attente & Triage
  triageConfig: {
    maxWaitingTimeMinutes: number;
    audioCallingEnabled: boolean;
    vitalEmergencyBypass: boolean;
  };

  // 8. Pharmacie & Chaîne du Froid
  pharmacyConfig: {
    coldChainMinTemp: number;
    coldChainMaxTemp: number;
    ambientMaxTemp: number;
    expiryWarningDays: number;
    defaultReorderSafetyStock: number;
  };
}

export const DEFAULT_BUSINESS_CONFIG: AppBusinessConfig = {
  clinicInfo: {
    name: 'Clinique Al Bassma Casablanca',
    tagline: 'Centre Médico-Chirurgical & Urgences 24/7',
    city: 'Casablanca',
    address: "Angle Bd Zerktouni & Rue d'Alger, Casablanca",
    phone: '+212 5 22 98 45 00',
    emergencyPhone: '15 / +212 5 22 98 45 01',
    ice: '002847592000045',
    taxId: '38472910',
    cnssAffiliation: '7849302',
    medicalDirector: 'Dr. Mohamed Tazi',
    directorInpe: '104829',
    cndpAuthNumber: 'A-M-342/2023',
    currency: 'MAD'
  },
  tariffs: {
    consultationGeneral: 300,
    consultationSpecialist: 450,
    consultationEmergency: 500,
    consultationControl: 150,
    bedRates: {
      standardDouble: 600,
      standardSingle: 900,
      suiteVip: 1500,
      intensiveCareUsic: 2500
    },
    surgery: {
      orHourRateIso5: 2500,
      anesthesiaBaseRate: 1200,
      preOpAssessmentRate: 400
    },
    surcharges: {
      nightSurchargePercent: 30,
      weekendSurchargePercent: 50,
      nightStartHour: 20,
      nightEndHour: 8
    }
  },
  amoRules: {
    cnssRatePercent: 70,
    cnopsRatePercent: 80,
    tadamonRatePercent: 100,
    privateInsuranceRatePercent: 85,
    priorAgreementThresholdMad: 3000,
    maxClaimSubmissionDays: 60,
    autoDeductMutualTopUp: true
  },
  clinicalThresholds: {
    systolicAlertMax: 140,
    systolicCriticalMax: 180,
    systolicCriticalMin: 90,
    diastolicAlertMax: 90,
    heartRateMin: 50,
    heartRateMax: 110,
    heartRateCritical: 130,
    oxygenSatWarning: 94,
    oxygenSatCritical: 90,
    glucoseHyperAlert: 1.40,
    glucoseHyperCritical: 2.50,
    glucoseHypoCritical: 0.60,
    troponinAlert: 14,
    troponinCritical: 45
  },
  surgeryConfig: {
    minAldreteScoreForDischarge: 9,
    mandatoryPreOpChecklist: true,
    narcoticsDualSignOff: true,
    defaultSurgeryDurationMinutes: 60
  },
  hospitalizationConfig: {
    standardCleaningTimeMinutes: 30,
    septicCleaningTimeMinutes: 60,
    requireHygieneAgentCertification: true,
    approvedDisinfectant: 'Aniosyme DD1 / Surfanios Premium (Norme EN 14476)'
  },
  triageConfig: {
    maxWaitingTimeMinutes: 25,
    audioCallingEnabled: true,
    vitalEmergencyBypass: true
  },
  pharmacyConfig: {
    coldChainMinTemp: 2.0,
    coldChainMaxTemp: 8.0,
    ambientMaxTemp: 25.0,
    expiryWarningDays: 60,
    defaultReorderSafetyStock: 15
  }
};

const STORAGE_KEY = 'clinicflow_business_config_v1';

export function loadBusinessConfig(): AppBusinessConfig {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_BUSINESS_CONFIG;
    const parsed = JSON.parse(saved);
    // Deep merge with default to ensure any new keys exist
    return {
      ...DEFAULT_BUSINESS_CONFIG,
      ...parsed,
      clinicInfo: { ...DEFAULT_BUSINESS_CONFIG.clinicInfo, ...(parsed.clinicInfo || {}) },
      tariffs: {
        ...DEFAULT_BUSINESS_CONFIG.tariffs,
        ...(parsed.tariffs || {}),
        bedRates: { ...DEFAULT_BUSINESS_CONFIG.tariffs.bedRates, ...(parsed.tariffs?.bedRates || {}) },
        surgery: { ...DEFAULT_BUSINESS_CONFIG.tariffs.surgery, ...(parsed.tariffs?.surgery || {}) },
        surcharges: { ...DEFAULT_BUSINESS_CONFIG.tariffs.surcharges, ...(parsed.tariffs?.surcharges || {}) }
      },
      amoRules: { ...DEFAULT_BUSINESS_CONFIG.amoRules, ...(parsed.amoRules || {}) },
      clinicalThresholds: { ...DEFAULT_BUSINESS_CONFIG.clinicalThresholds, ...(parsed.clinicalThresholds || {}) },
      surgeryConfig: { ...DEFAULT_BUSINESS_CONFIG.surgeryConfig, ...(parsed.surgeryConfig || {}) },
      hospitalizationConfig: { ...DEFAULT_BUSINESS_CONFIG.hospitalizationConfig, ...(parsed.hospitalizationConfig || {}) },
      triageConfig: { ...DEFAULT_BUSINESS_CONFIG.triageConfig, ...(parsed.triageConfig || {}) },
      pharmacyConfig: { ...DEFAULT_BUSINESS_CONFIG.pharmacyConfig, ...(parsed.pharmacyConfig || {}) }
    };
  } catch {
    return DEFAULT_BUSINESS_CONFIG;
  }
}

export function saveBusinessConfig(config: AppBusinessConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save business config', e);
  }
}

export function resetBusinessConfig(): AppBusinessConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to reset business config', e);
  }
  return DEFAULT_BUSINESS_CONFIG;
}

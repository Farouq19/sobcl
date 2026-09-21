import React, { useState } from 'react';
import { Patient } from '../../types';
import {
  AppBusinessConfig,
  DEFAULT_BUSINESS_CONFIG,
  resetBusinessConfig
} from '../../data/businessConfig';

interface SettingsViewProps {
  patientsCount?: number;
  roomsCount?: number;
  invoicesCount?: number;
  patients?: Patient[];
  businessConfig: AppBusinessConfig;
  onUpdateBusinessConfig: (newConfig: AppBusinessConfig) => void;
  onResetData?: () => void;
}

type ConfigTab = 
  | 'tariffs'
  | 'amo'
  | 'clinical'
  | 'surgery'
  | 'hospitalization'
  | 'triage'
  | 'pharmacy'
  | 'clinic'
  | 'backup';

export const SettingsView: React.FC<SettingsViewProps> = ({
  patientsCount = 0,
  roomsCount = 0,
  invoicesCount = 0,
  patients = [],
  businessConfig,
  onUpdateBusinessConfig,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<ConfigTab>('tariffs');
  const [localConfig, setLocalConfig] = useState<AppBusinessConfig>(businessConfig);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfigChange = <K extends keyof AppBusinessConfig>(
    section: K,
    subField: keyof AppBusinessConfig[K],
    value: any
  ) => {
    setLocalConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subField]: value
      }
    }));
    setIsSaved(false);
  };

  const handleDeepConfigChange = (
    section: 'tariffs',
    category: 'bedRates' | 'surgery' | 'surcharges',
    field: string,
    value: any
  ) => {
    setLocalConfig(prev => ({
      ...prev,
      tariffs: {
        ...prev.tariffs,
        [category]: {
          ...prev.tariffs[category],
          [field]: value
        }
      }
    }));
    setIsSaved(false);
  };

  const handleSaveConfig = () => {
    onUpdateBusinessConfig(localConfig);
    setIsSaved(true);
    showToast('Paramètres métier enregistrés avec succès et appliqués à la clinique');
  };

  const handleResetDefaultConfig = () => {
    if (confirm('Voulez-vous rétablir l\'ensemble des règles métier aux valeurs standard marocaines ?')) {
      const def = resetBusinessConfig();
      setLocalConfig(def);
      onUpdateBusinessConfig(def);
      setIsSaved(true);
      showToast('Configuration rétablie aux normes par défaut');
    }
  };

  const handleExportConfig = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(localConfig, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `clinicflow_config_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Export de la configuration téléchargé');
    } catch {
      showToast('Export impossible sur ce navigateur');
    }
  };

  const handleExportPatientsData = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(patients, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `clinicflow_patients_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Base patients téléchargée au format JSON');
    } catch {
      showToast('Export impossible sur ce navigateur');
    }
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setLocalConfig(imported);
        onUpdateBusinessConfig(imported);
        setIsSaved(true);
        showToast('Configuration importée et appliquée avec succès');
      } catch {
        showToast('Erreur : Fichier de configuration invalide');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-5 pb-16 max-w-6xl">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#dae2fd]/30 flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-[#86f2e4] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Save status */}
      <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#e2e8f0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#eff4ff] text-[#006a61] rounded-xl">
            <span className="material-symbols-outlined text-[26px]">tune</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-headline text-lg font-bold text-[#0b1c30]">
                Hub de Configuration & Règles Métiers
              </h1>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isSaved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 animate-pulse'
              }`}>
                {isSaved ? 'Modifications Appliquées' : 'Modifications Non Enregistrées'}
              </span>
            </div>
            <p className="text-[12px] text-[#45464d]">
              {localConfig.clinicInfo.name} • Tarification, AMO, Seuils Cliniques, SSPI & Protocoles Hospitaliers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaultConfig}
            className="px-3 py-2 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#45464d] text-[12px] font-semibold rounded-lg border border-[#cbd5e1] transition-colors flex items-center gap-1.5"
            title="Rétablir la configuration d'usine par défaut"
          >
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            <span>Valeurs Standard</span>
          </button>
          <button
            onClick={handleSaveConfig}
            className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            <span>Enregistrer la Configuration</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-[#f1f5f9] rounded-xl border border-[#e2e8f0]">
        {[
          { id: 'tariffs', label: '1. Tarifs & Prestations', icon: 'payments' },
          { id: 'amo', label: '2. Conventions AMO', icon: 'health_and_safety' },
          { id: 'clinical', label: '3. Seuils Physiologiques', icon: 'ecg_heart' },
          { id: 'surgery', label: '4. Bloc & SSPI Aldrete', icon: 'medical_services' },
          { id: 'hospitalization', label: '5. Litière & Asepsie', icon: 'bed' },
          { id: 'triage', label: '6. Triage & Files Attente', icon: 'hourglass_top' },
          { id: 'pharmacy', label: '7. Pharmacie & Frigo', icon: 'vaccines' },
          { id: 'clinic', label: '8. Identité Clinique', icon: 'apartment' },
          { id: 'backup', label: '9. Sauvegardes & Données', icon: 'database' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ConfigTab)}
            className={`px-3 py-2 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-white text-[#006a61] shadow-2xs border border-[#cbd5e1]/50'
                : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-white/60'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-4">
        {/* TAB 1: TARIFS & PRESTATIONS */}
        {activeTab === 'tariffs' && (
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-6">
            <div className="border-b border-[#f1f5f9] pb-3">
              <h2 className="text-base font-bold text-[#0b1c30]">Grille Tarifaire des Actes & Prestations (en MAD)</h2>
              <p className="text-[12px] text-[#76777d]">
                Configurez les prix de base facturés aux patients et aux mutuelles. Ces tarifs sont automatiquement injectés dans le module de facturation.
              </p>
            </div>

            {/* Consultations */}
            <div>
              <h3 className="text-[13px] font-bold text-[#006a61] uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">stethoscope</span>
                <span>Honoraires de Consultations</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[12px]">
                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Médecine Générale (MAD)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.consultationGeneral}
                    onChange={(e) => handleConfigChange('tariffs', 'consultationGeneral', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">Tarif standard patient externe</span>
                </div>

                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Médecine Spécialisée (MAD)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.consultationSpecialist}
                    onChange={(e) => handleConfigChange('tariffs', 'consultationSpecialist', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">Cardio, Pneumo, Orthopédie</span>
                </div>

                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Consultation Urgences 24/7 (MAD)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.consultationEmergency}
                    onChange={(e) => handleConfigChange('tariffs', 'consultationEmergency', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#ba1a1a] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">Triage immédiat au box</span>
                </div>

                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Consultation de Contrôle (MAD)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.consultationControl}
                    onChange={(e) => handleConfigChange('tariffs', 'consultationControl', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">Dans les 15 jours post-consult</span>
                </div>
              </div>
            </div>

            {/* Nuitées Hospitalières */}
            <div>
              <h3 className="text-[13px] font-bold text-[#006a61] uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">hotel</span>
                <span>Frais de Séjour & Nuitée Hospitalière (MAD / 24 heures)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[12px]">
                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Chambre Double Standard (MAD)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.bedRates.standardDouble}
                    onChange={(e) => handleDeepConfigChange('tariffs', 'bedRates', 'standardDouble', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">Prise en charge AMO standard</span>
                </div>

                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Chambre Individuelle Simple (MAD)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.bedRates.standardSingle}
                    onChange={(e) => handleDeepConfigChange('tariffs', 'bedRates', 'standardSingle', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">Sanitaires privés + TV</span>
                </div>

                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Suite VIP Clinique (MAD)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.bedRates.suiteVip}
                    onChange={(e) => handleDeepConfigChange('tariffs', 'bedRates', 'suiteVip', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">Salon accompagnant + room service</span>
                </div>

                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Lit Monitoré USIC / Réa (MAD)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.bedRates.intensiveCareUsic}
                    onChange={(e) => handleDeepConfigChange('tariffs', 'bedRates', 'intensiveCareUsic', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">Monitoring continu + scope</span>
                </div>
              </div>
            </div>

            {/* Bloc & Chirurgie + Majorations */}
            <div>
              <h3 className="text-[13px] font-bold text-[#006a61] uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">emergency</span>
                <span>Forfaits Bloc & Majorations d'Urgence</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[12px]">
                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Vacation Bloc ISO 5 (MAD / h)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.surgery.orHourRateIso5}
                    onChange={(e) => handleDeepConfigChange('tariffs', 'surgery', 'orHourRateIso5', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">Instrumentation & flux laminaire</span>
                </div>

                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Base Anesthésie (MAD)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.surgery.anesthesiaBaseRate}
                    onChange={(e) => handleDeepConfigChange('tariffs', 'surgery', 'anesthesiaBaseRate', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">Drogues & surveillance per-op</span>
                </div>

                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Majoration Nuit (%)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.surcharges.nightSurchargePercent}
                    onChange={(e) => handleDeepConfigChange('tariffs', 'surcharges', 'nightSurchargePercent', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">De 20h00 à 08h00 du matin</span>
                </div>

                <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Majoration Dimanche & Férié (%)</label>
                  <input
                    type="number"
                    value={localConfig.tariffs.surcharges.weekendSurchargePercent}
                    onChange={(e) => handleDeepConfigChange('tariffs', 'surcharges', 'weekendSurchargePercent', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                  />
                  <span className="text-[10px] text-[#76777d] mt-1 block">Application automatique au calendrier</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONVENTIONS AMO & TIERS-PAYANT */}
        {activeTab === 'amo' && (
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-6">
            <div className="border-b border-[#f1f5f9] pb-3">
              <h2 className="text-base font-bold text-[#0b1c30]">Taux Conventionnels & Règles Tiers-Payant AMO / Masar</h2>
              <p className="text-[12px] text-[#76777d]">
                Définissez les pourcentages de prise en charge par organisme d'assurance maladie obligatoire et les seuils de télétransmission FSE.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[12px]">
              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dae2fd]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#006a61]">CNSS Salariés</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">Régime Général</span>
                </div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Taux de Prise en Charge (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={localConfig.amoRules.cnssRatePercent}
                    onChange={(e) => handleConfigChange('amoRules', 'cnssRatePercent', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-lg"
                  />
                  <span className="font-bold text-[#76777d]">%</span>
                </div>
                <span className="text-[10px] text-[#76777d] mt-1.5 block">Ticket modérateur patient : {100 - localConfig.amoRules.cnssRatePercent}%</span>
              </div>

              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dae2fd]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#006a61]">CNOPS Fonctionnaires</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Secteur Public</span>
                </div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Taux de Prise en Charge (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={localConfig.amoRules.cnopsRatePercent}
                    onChange={(e) => handleConfigChange('amoRules', 'cnopsRatePercent', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-lg"
                  />
                  <span className="font-bold text-[#76777d]">%</span>
                </div>
                <span className="text-[10px] text-[#76777d] mt-1.5 block">Ticket modérateur patient : {100 - localConfig.amoRules.cnopsRatePercent}%</span>
              </div>

              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dae2fd]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#006a61]">AMO Tadamon</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">Solidarité d'État</span>
                </div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Taux de Prise en Charge (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={localConfig.amoRules.tadamonRatePercent}
                    onChange={(e) => handleConfigChange('amoRules', 'tadamonRatePercent', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-lg"
                  />
                  <span className="font-bold text-[#76777d]">%</span>
                </div>
                <span className="text-[10px] text-[#76777d] mt-1.5 block">Gratuité totale selon nomenclature</span>
              </div>

              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dae2fd]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-[#006a61]">Mutuelles Privées</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Saham, RMA, Wafa</span>
                </div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Taux Moyen Garanti (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={localConfig.amoRules.privateInsuranceRatePercent}
                    onChange={(e) => handleConfigChange('amoRules', 'privateInsuranceRatePercent', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-lg"
                  />
                  <span className="font-bold text-[#76777d]">%</span>
                </div>
                <span className="text-[10px] text-[#76777d] mt-1.5 block">Couverture complémentaire</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-[#f1f5f9] text-[12px]">
              <div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Seuil Déclencheur Entente Préalable (MAD)</label>
                <input
                  type="number"
                  value={localConfig.amoRules.priorAgreementThresholdMad}
                  onChange={(e) => handleConfigChange('amoRules', 'priorAgreementThresholdMad', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold"
                />
                <span className="text-[10px] text-[#76777d] mt-1 block">Accord médical préalable requis au-delà</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Délai Forclusion Télétransmission (Jours)</label>
                <input
                  type="number"
                  value={localConfig.amoRules.maxClaimSubmissionDays}
                  onChange={(e) => handleConfigChange('amoRules', 'maxClaimSubmissionDays', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold"
                />
                <span className="text-[10px] text-[#76777d] mt-1 block">Délai légal pour déposer les bordereaux</span>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                <div>
                  <div className="font-semibold text-[#0b1c30]">Déduction Automatique Mutuelle</div>
                  <div className="text-[10px] text-[#76777d]">Calcule le co-pay après mutuelle</div>
                </div>
                <input
                  type="checkbox"
                  checked={localConfig.amoRules.autoDeductMutualTopUp}
                  onChange={(e) => handleConfigChange('amoRules', 'autoDeductMutualTopUp', e.target.checked)}
                  className="h-5 w-5 text-[#006a61] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SEUILS D'ALERTES PHYSIOLOGIQUES */}
        {activeTab === 'clinical' && (
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-6">
            <div className="border-b border-[#f1f5f9] pb-3">
              <h2 className="text-base font-bold text-[#0b1c30]">Bornes & Seuils d'Alertes Physiologiques Vitales</h2>
              <p className="text-[12px] text-[#76777d]">
                Ces seuils déclenchent instantanément les alertes visuelles (badges jaunes de vigilance ou rouges d'urgence vitale) dans le Dossier Médical Partagé et aux Urgences.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-[12px]">
              {/* Tension Artérielle */}
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] space-y-3">
                <div className="flex items-center gap-2 text-[#006a61] font-bold">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                  <span>Pression Artérielle Systolique (PAS)</span>
                </div>
                <div>
                  <label className="block text-[11px] text-[#45464d] mb-1">Alerte HTA Modérée (mmHg)</label>
                  <input
                    type="number"
                    value={localConfig.clinicalThresholds.systolicAlertMax}
                    onChange={(e) => handleConfigChange('clinicalThresholds', 'systolicAlertMax', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#d97706]"
                  />
                  <span className="text-[10px] text-[#76777d]">Seuil vigilance (jaune)</span>
                </div>
                <div>
                  <label className="block text-[11px] text-[#45464d] mb-1">Crise Hypertensive Critique (mmHg)</label>
                  <input
                    type="number"
                    value={localConfig.clinicalThresholds.systolicCriticalMax}
                    onChange={(e) => handleConfigChange('clinicalThresholds', 'systolicCriticalMax', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#dc2626]"
                  />
                  <span className="text-[10px] text-[#76777d]">Urgence vitale cardiologique (rouge)</span>
                </div>
                <div>
                  <label className="block text-[11px] text-[#45464d] mb-1">Hypotension Sévère / Choc (mmHg)</label>
                  <input
                    type="number"
                    value={localConfig.clinicalThresholds.systolicCriticalMin}
                    onChange={(e) => handleConfigChange('clinicalThresholds', 'systolicCriticalMin', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#dc2626]"
                  />
                  <span className="text-[10px] text-[#76777d]">Alerte collapsus circulatoire</span>
                </div>
              </div>

              {/* Saturation O2 & Rythme */}
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] space-y-3">
                <div className="flex items-center gap-2 text-[#006a61] font-bold">
                  <span className="material-symbols-outlined text-[18px]">air</span>
                  <span>Oxygénation SpO2 & Fréquence</span>
                </div>
                <div>
                  <label className="block text-[11px] text-[#45464d] mb-1">SpO2 Seuil Vigilance (%)</label>
                  <input
                    type="number"
                    value={localConfig.clinicalThresholds.oxygenSatWarning}
                    onChange={(e) => handleConfigChange('clinicalThresholds', 'oxygenSatWarning', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#d97706]"
                  />
                  <span className="text-[10px] text-[#76777d]">Besoins en O2 nasal</span>
                </div>
                <div>
                  <label className="block text-[11px] text-[#45464d] mb-1">SpO2 Hypoxie Critique (%)</label>
                  <input
                    type="number"
                    value={localConfig.clinicalThresholds.oxygenSatCritical}
                    onChange={(e) => handleConfigChange('clinicalThresholds', 'oxygenSatCritical', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#dc2626]"
                  />
                  <span className="text-[10px] text-[#76777d]">Mise sous masque haute concentration</span>
                </div>
                <div>
                  <label className="block text-[11px] text-[#45464d] mb-1">Fréquence Cardiaque Tachycardie (bpm)</label>
                  <input
                    type="number"
                    value={localConfig.clinicalThresholds.heartRateMax}
                    onChange={(e) => handleConfigChange('clinicalThresholds', 'heartRateMax', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#d97706]"
                  />
                  <span className="text-[10px] text-[#76777d]">Normal: 60 à 100 bpm</span>
                </div>
              </div>

              {/* Biologie : Glycémie & Troponine */}
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] space-y-3">
                <div className="flex items-center gap-2 text-[#006a61] font-bold">
                  <span className="material-symbols-outlined text-[18px]">lab_profile</span>
                  <span>Glycémie & Marqueurs Cardiaques</span>
                </div>
                <div>
                  <label className="block text-[11px] text-[#45464d] mb-1">Hyperglycémie Critique (g/L)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={localConfig.clinicalThresholds.glucoseHyperCritical}
                    onChange={(e) => handleConfigChange('clinicalThresholds', 'glucoseHyperCritical', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#dc2626]"
                  />
                  <span className="text-[10px] text-[#76777d]">Alerte acidocétose diabétique</span>
                </div>
                <div>
                  <label className="block text-[11px] text-[#45464d] mb-1">Hypoglycémie Sévère (g/L)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={localConfig.clinicalThresholds.glucoseHypoCritical}
                    onChange={(e) => handleConfigChange('clinicalThresholds', 'glucoseHypoCritical', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#dc2626]"
                  />
                  <span className="text-[10px] text-[#76777d]">Perfusion G30% immédiate</span>
                </div>
                <div>
                  <label className="block text-[11px] text-[#45464d] mb-1">Troponine I Us Critique (ng/L)</label>
                  <input
                    type="number"
                    value={localConfig.clinicalThresholds.troponinCritical}
                    onChange={(e) => handleConfigChange('clinicalThresholds', 'troponinCritical', Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-[#cbd5e1] rounded-lg font-bold text-[#dc2626]"
                  />
                  <span className="text-[10px] text-[#76777d]">Suspicion Infarctus (SCA) - Coronaro</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: BLOC OPERATOIRE & SSPI */}
        {activeTab === 'surgery' && (
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-6">
            <div className="border-b border-[#f1f5f9] pb-3">
              <h2 className="text-base font-bold text-[#0b1c30]">Paramètres du Bloc Opératoire & Protocole de Réveil SSPI</h2>
              <p className="text-[12px] text-[#76777d]">
                Configurez le seuil du score d'Aldrete requis pour autoriser le transfert du patient vers sa chambre d'hospitalisation et les règles médico-légales de chirurgie.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-[12px]">
              {/* Score d'Aldrete */}
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#006a61] text-[13px]">Score d'Aldrete Minimal de Décharge</div>
                  <span className="text-base font-bold bg-[#006a61] text-white px-3 py-1 rounded-lg">
                    {localConfig.surgeryConfig.minAldreteScoreForDischarge} / 10
                  </span>
                </div>
                <p className="text-[11px] text-[#45464d] leading-relaxed">
                  L'algorithme SSPI empêche l'infirmier ou le médecin anesthésiste de libérer le patient tant que le score total (Activité, Respiration, TA, Conscience, SpO2) n'a pas atteint ce seuil strict.
                </p>
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-2">Choisir le seuil requis :</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[8, 9, 10].map((score) => (
                      <button
                        key={score}
                        type="button"
                        onClick={() => handleConfigChange('surgeryConfig', 'minAldreteScoreForDischarge', score)}
                        className={`py-2 px-3 rounded-lg font-bold border transition-all text-center ${
                          localConfig.surgeryConfig.minAldreteScoreForDischarge === score
                            ? 'bg-[#006a61] text-white border-[#006a61] shadow-2xs'
                            : 'bg-white text-[#0b1c30] border-[#cbd5e1] hover:bg-[#eff4ff]'
                        }`}
                      >
                        {score} / 10
                        <span className="block text-[9px] font-normal opacity-80">
                          {score === 10 ? 'Sécurité Maximale' : score === 9 ? 'Standard International' : 'Ambulatoire'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Règles Médico-Légales Chirurgicales */}
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] space-y-4">
                <div className="font-bold text-[#006a61] text-[13px]">Règles de Sécurité au Bloc</div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#dae2fd]">
                  <div>
                    <div className="font-semibold text-[#0b1c30]">Check-list OMS en 3 Temps Obligatoire</div>
                    <div className="text-[10px] text-[#76777d]">Sign-In, Time-Out et Sign-Out bloquants</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localConfig.surgeryConfig.mandatoryPreOpChecklist}
                    onChange={(e) => handleConfigChange('surgeryConfig', 'mandatoryPreOpChecklist', e.target.checked)}
                    className="h-5 w-5 text-[#006a61] rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#dae2fd]">
                  <div>
                    <div className="font-semibold text-[#0b1c30]">Double Signature Stupéfiants & Morphine</div>
                    <div className="text-[10px] text-[#76777d]">Médecin anesthésiste + IADE obligatoire</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={localConfig.surgeryConfig.narcoticsDualSignOff}
                    onChange={(e) => handleConfigChange('surgeryConfig', 'narcoticsDualSignOff', e.target.checked)}
                    className="h-5 w-5 text-[#006a61] rounded cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Durée Standard Programmée au Bloc (Minutes)</label>
                  <input
                    type="number"
                    value={localConfig.surgeryConfig.defaultSurgeryDurationMinutes}
                    onChange={(e) => handleConfigChange('surgeryConfig', 'defaultSurgeryDurationMinutes', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: LITIERE & ASEPSIE */}
        {activeTab === 'hospitalization' && (
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-6">
            <div className="border-b border-[#f1f5f9] pb-3">
              <h2 className="text-base font-bold text-[#0b1c30]">Gestion Litière, Temps de Bio-Nettoyage & Asepsie</h2>
              <p className="text-[12px] text-[#76777d]">
                Configurez le protocole d'hygiène hospitalière régissant la remise en disponibilité des lits après la sortie d'un patient.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-[12px]">
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Temps Standard Bio-Nettoyage (Minutes)</label>
                <input
                  type="number"
                  value={localConfig.hospitalizationConfig.standardCleaningTimeMinutes}
                  onChange={(e) => handleConfigChange('hospitalizationConfig', 'standardCleaningTimeMinutes', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                />
                <span className="text-[10px] text-[#76777d] mt-1.5 block">Chambre médecine et chirurgie simple</span>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Nettoyage Isolement Septique (Minutes)</label>
                <input
                  type="number"
                  value={localConfig.hospitalizationConfig.septicCleaningTimeMinutes}
                  onChange={(e) => handleConfigChange('hospitalizationConfig', 'septicCleaningTimeMinutes', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                />
                <span className="text-[10px] text-[#76777d] mt-1.5 block">Bactéries multi-résistantes (BMR)</span>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-[#0b1c30]">Certification Nominative Agent d'Hygiène</div>
                  <div className="text-[10px] text-[#76777d] mt-1">Interdit la réadmission tant que l'agent d'hygiène n'a pas validé</div>
                </div>
                <div className="pt-3">
                  <input
                    type="checkbox"
                    checked={localConfig.hospitalizationConfig.requireHygieneAgentCertification}
                    onChange={(e) => handleConfigChange('hospitalizationConfig', 'requireHygieneAgentCertification', e.target.checked)}
                    className="h-5 w-5 text-[#006a61] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Produit Désinfectant Homologué & Norme Clinique</label>
              <input
                type="text"
                value={localConfig.hospitalizationConfig.approvedDisinfectant}
                onChange={(e) => handleConfigChange('hospitalizationConfig', 'approvedDisinfectant', e.target.value)}
                className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-semibold text-[13px]"
              />
              <span className="text-[10px] text-[#76777d] mt-1 block">Renseigné sur le bon de certification d'asepsie du lit</span>
            </div>
          </div>
        )}

        {/* TAB 6: TRIAGE & FILES D'ATTENTE */}
        {activeTab === 'triage' && (
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-6">
            <div className="border-b border-[#f1f5f9] pb-3">
              <h2 className="text-base font-bold text-[#0b1c30]">SLA d'Attente & Régulation des Flux</h2>
              <p className="text-[12px] text-[#76777d]">
                Configurez les engagements de service et les alertes visuelles/sonores dans la salle d'attente générale et le flux de consultation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-[12px]">
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Délai Maximal d'Attente Cible (Minutes)</label>
                <input
                  type="number"
                  value={localConfig.triageConfig.maxWaitingTimeMinutes}
                  onChange={(e) => handleConfigChange('triageConfig', 'maxWaitingTimeMinutes', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                />
                <span className="text-[10px] text-[#76777d] mt-1.5 block">Passage en clignotement rouge si dépassé</span>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-[#0b1c30]">Synthèse Vocale & Appel Sonore</div>
                  <div className="text-[10px] text-[#76777d] mt-1">Annonce vocale du numéro de ticket en salle d'attente</div>
                </div>
                <div className="pt-3">
                  <input
                    type="checkbox"
                    checked={localConfig.triageConfig.audioCallingEnabled}
                    onChange={(e) => handleConfigChange('triageConfig', 'audioCallingEnabled', e.target.checked)}
                    className="h-5 w-5 text-[#006a61] rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-[#0b1c30]">Priorité Absolue Urgences Vitales</div>
                  <div className="text-[10px] text-[#76777d] mt-1">Bypass immédiat de la file d'attente pour le box de déchocage</div>
                </div>
                <div className="pt-3">
                  <input
                    type="checkbox"
                    checked={localConfig.triageConfig.vitalEmergencyBypass}
                    onChange={(e) => handleConfigChange('triageConfig', 'vitalEmergencyBypass', e.target.checked)}
                    className="h-5 w-5 text-[#006a61] rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PHARMACIE & CHAINE DU FROID */}
        {activeTab === 'pharmacy' && (
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-6">
            <div className="border-b border-[#f1f5f9] pb-3">
              <h2 className="text-base font-bold text-[#0b1c30]">Pharmacie Hospitalière & Tolérances Thermiques</h2>
              <p className="text-[12px] text-[#76777d]">
                Configurez les plages de températures des réfrigérateurs à vaccins/insulines et les règles d'alerte de péremption des stocks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-[12px]">
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Frigo Chaîne du Froid Min (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={localConfig.pharmacyConfig.coldChainMinTemp}
                  onChange={(e) => handleConfigChange('pharmacyConfig', 'coldChainMinTemp', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                />
                <span className="text-[10px] text-[#76777d] mt-1 block">Alerte gelée si température inférieure</span>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Frigo Chaîne du Froid Max (°C)</label>
                <input
                  type="number"
                  step="0.5"
                  value={localConfig.pharmacyConfig.coldChainMaxTemp}
                  onChange={(e) => handleConfigChange('pharmacyConfig', 'coldChainMaxTemp', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                />
                <span className="text-[10px] text-[#76777d] mt-1 block">Rupture chaîne du froid au-delà</span>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Alerte Péremption (Jours avant)</label>
                <input
                  type="number"
                  value={localConfig.pharmacyConfig.expiryWarningDays}
                  onChange={(e) => handleConfigChange('pharmacyConfig', 'expiryWarningDays', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                />
                <span className="text-[10px] text-[#76777d] mt-1 block">Notification pour rotation FEFO</span>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Stock de Sécurité Minimal (Boîtes)</label>
                <input
                  type="number"
                  value={localConfig.pharmacyConfig.defaultReorderSafetyStock}
                  onChange={(e) => handleConfigChange('pharmacyConfig', 'defaultReorderSafetyStock', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold text-base"
                />
                <span className="text-[10px] text-[#76777d] mt-1 block">Seuil de commande suggérée</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: IDENTITE CLINIQUE */}
        {activeTab === 'clinic' && (
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-6">
            <div className="border-b border-[#f1f5f9] pb-3">
              <h2 className="text-base font-bold text-[#0b1c30]">Identité Légale, Fiscale & Passerelles Télématiques</h2>
              <p className="text-[12px] text-[#76777d]">
                Renseignez les coordonnées de l'établissement qui figureront sur les ordonnances, factures, quittances de caisse et télétransmissions Masar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[12px]">
              <div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Raison Sociale de l'Établissement</label>
                <input
                  type="text"
                  value={localConfig.clinicInfo.name}
                  onChange={(e) => handleConfigChange('clinicInfo', 'name', e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Slogan / Sous-titre</label>
                <input
                  type="text"
                  value={localConfig.clinicInfo.tagline}
                  onChange={(e) => handleConfigChange('clinicInfo', 'tagline', e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Ville</label>
                <input
                  type="text"
                  value={localConfig.clinicInfo.city}
                  onChange={(e) => handleConfigChange('clinicInfo', 'city', e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Adresse Complète</label>
                <input
                  type="text"
                  value={localConfig.clinicInfo.address}
                  onChange={(e) => handleConfigChange('clinicInfo', 'address', e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Téléphone Standard</label>
                <input
                  type="text"
                  value={localConfig.clinicInfo.phone}
                  onChange={(e) => handleConfigChange('clinicInfo', 'phone', e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Ligne Urgences / SAMU</label>
                <input
                  type="text"
                  value={localConfig.clinicInfo.emergencyPhone}
                  onChange={(e) => handleConfigChange('clinicInfo', 'emergencyPhone', e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] text-[#ba1a1a] border border-[#cbd5e1] rounded-lg font-bold font-mono"
                />
              </div>
            </div>

            {/* Identifiants Fiscaux Marocains */}
            <div className="pt-4 border-t border-[#f1f5f9]">
              <h3 className="text-[13px] font-bold text-[#006a61] uppercase tracking-wide mb-3">
                Identifiants Fiscaux & Réglementaires Marocains
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[12px]">
                <div>
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Identifiant Commun Entreprise (ICE)</label>
                  <input
                    type="text"
                    value={localConfig.clinicInfo.ice}
                    onChange={(e) => handleConfigChange('clinicInfo', 'ice', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Identifiant Fiscal (IF)</label>
                  <input
                    type="text"
                    value={localConfig.clinicInfo.taxId}
                    onChange={(e) => handleConfigChange('clinicInfo', 'taxId', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Affiliation CNSS Employeur</label>
                  <input
                    type="text"
                    value={localConfig.clinicInfo.cnssAffiliation}
                    onChange={(e) => handleConfigChange('clinicInfo', 'cnssAffiliation', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">N° Déclaration CNDP (Loi 09-08)</label>
                  <input
                    type="text"
                    value={localConfig.clinicInfo.cndpAuthNumber}
                    onChange={(e) => handleConfigChange('clinicInfo', 'cndpAuthNumber', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Direction Médicale */}
            <div className="pt-4 border-t border-[#f1f5f9]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[12px]">
                <div>
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Médecin Directeur de l'Établissement</label>
                  <input
                    type="text"
                    value={localConfig.clinicInfo.medicalDirector}
                    onChange={(e) => handleConfigChange('clinicInfo', 'medicalDirector', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Code INPE National du Praticien Directeur</label>
                  <input
                    type="text"
                    value={localConfig.clinicInfo.directorInpe}
                    onChange={(e) => handleConfigChange('clinicInfo', 'directorInpe', e.target.value)}
                    className="w-full px-3 py-2 bg-[#f8f9ff] text-[#0b1c30] border border-[#cbd5e1] rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: SAUVEGARDES & DONNEES */}
        {activeTab === 'backup' && (
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-6">
            <div className="border-b border-[#f1f5f9] pb-3">
              <h2 className="text-base font-bold text-[#0b1c30]">Sauvegarde, Exportation & Portabilité des Données</h2>
              <p className="text-[12px] text-[#76777d]">
                Exportez vos règles métiers et vos dossiers patients au format JSON standardisé ou restaurez les paramètres d'origine.
              </p>
            </div>

            {/* Statistiques en mémoire */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                <div className="text-[11px] text-[#76777d]">Base Dossiers Patients</div>
                <div className="text-xl font-bold text-[#0b1c30] mt-1">{patientsCount} dossiers</div>
                <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Persistance active</div>
              </div>
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                <div className="text-[11px] text-[#76777d]">Chambres & Lits</div>
                <div className="text-xl font-bold text-[#0b1c30] mt-1">{roomsCount} lits sectorisés</div>
                <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Statuts asepsie persistés</div>
              </div>
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]">
                <div className="text-[11px] text-[#76777d]">Factures & Règlements</div>
                <div className="text-xl font-bold text-[#0b1c30] mt-1">{invoicesCount} factures</div>
                <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Caisse & Quittances synchronisées</div>
              </div>
            </div>

            {/* Actions de sauvegarde & Import */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 border border-[#e2e8f0] rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-bold text-[#0b1c30] text-[13px]">
                  <span className="material-symbols-outlined text-blue-600 text-[20px]">download</span>
                  <span>Export des Données & Configuration</span>
                </div>
                <p className="text-[11px] text-[#76777d]">
                  Téléchargez une copie de sauvegarde complète de votre paramétrage métier ou de votre base patientèle.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleExportConfig}
                    className="px-3.5 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0b1c30] text-[12px] font-semibold rounded-lg border border-[#cbd5e1] transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">file_download</span>
                    <span>Exporter Configuration (JSON)</span>
                  </button>
                  <button
                    onClick={handleExportPatientsData}
                    className="px-3.5 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0b1c30] text-[12px] font-semibold rounded-lg border border-[#cbd5e1] transition-colors flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                    <span>Exporter Patients (JSON)</span>
                  </button>
                </div>
              </div>

              <div className="p-4 border border-[#e2e8f0] rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-bold text-[#0b1c30] text-[13px]">
                  <span className="material-symbols-outlined text-purple-600 text-[20px]">upload</span>
                  <span>Importer une Configuration Existante</span>
                </div>
                <p className="text-[11px] text-[#76777d]">
                  Chargez un fichier de règles métier pour appliquer instantanément une grille tarifaire d'un autre établissement.
                </p>
                <div className="pt-1">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-[12px] font-semibold rounded-lg border border-purple-200 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">folder_open</span>
                    <span>Sélectionner Fichier JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportConfig}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Zone de Danger */}
            {onResetData && (
              <div className="p-4 border border-red-200 bg-red-50/40 rounded-xl flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-red-900 text-[13px]">Zone de Réinitialisation d'Usine</div>
                  <div className="text-[11px] text-red-700 mt-0.5">
                    Restaure les dossiers patients, factures et lits d'hospitalisation aux valeurs de démonstration d'origine.
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Attention : Voulez-vous vraiment réinitialiser toutes les données patientèle aux valeurs de démonstration ?')) {
                      onResetData();
                      showToast('Données réinitialisées aux valeurs initiales');
                    }
                  }}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[12px] font-bold rounded-lg shadow-2xs transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">delete_forever</span>
                  <span>Réinitialiser la Base</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

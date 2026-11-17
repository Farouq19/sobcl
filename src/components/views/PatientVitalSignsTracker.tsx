import React, { useState, useMemo } from 'react';
import { Patient, VitalSignRecord } from '../../types';

interface PatientVitalSignsTrackerProps {
  patient: Patient;
  onUpdatePatient: (updatedPatient: Patient) => void;
  showToast?: (message: string) => void;
}

// Clinical evaluation helper utilities
export const evaluateTemperature = (temp: number) => {
  if (temp < 36.0) return { label: 'Hypothermie', level: 'warning', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' };
  if (temp <= 37.5) return { label: 'Normothermie', level: 'normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (temp < 38.0) return { label: 'Subfébrile', level: 'warning', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: 'Hyperthermie / Fièvre', level: 'critical', color: 'text-rose-700 bg-rose-50 border-rose-200' };
};

export const evaluateBloodPressure = (sys: number, dia: number) => {
  if (sys < 90 || dia < 60) return { label: 'Hypotension', level: 'warning', color: 'text-blue-700 bg-blue-50 border-blue-200' };
  if (sys < 120 && dia < 80) return { label: 'Optimale', level: 'normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (sys <= 129 && dia <= 84) return { label: 'Normale', level: 'normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (sys <= 139 || dia <= 89) return { label: 'Pré-HTA (Normale Haute)', level: 'warning', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  if (sys <= 159 || dia <= 99) return { label: 'HTA Stade 1 (Légère)', level: 'warning', color: 'text-amber-800 bg-amber-100 border-amber-300' };
  if (sys <= 179 || dia <= 109) return { label: 'HTA Stade 2 (Modérée)', level: 'critical', color: 'text-rose-800 bg-rose-100 border-rose-300' };
  return { label: 'Crise Hypertensive (Urgence)', level: 'critical', color: 'text-red-900 bg-red-100 border-red-300' };
};

export const evaluateHeartRate = (hr: number) => {
  if (hr < 50) return { label: 'Bradycardie sévère', level: 'critical', color: 'text-blue-800 bg-blue-100 border-blue-300' };
  if (hr < 60) return { label: 'Bradycardie modérée', level: 'warning', color: 'text-sky-700 bg-sky-50 border-sky-200' };
  if (hr <= 100) return { label: 'Normocardie', level: 'normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (hr <= 120) return { label: 'Tachycardie modérée', level: 'warning', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: 'Tachycardie sévère', level: 'critical', color: 'text-rose-700 bg-rose-50 border-rose-200' };
};

export const evaluateSpO2 = (spo2: number) => {
  if (spo2 >= 95) return { label: 'Normoxie', level: 'normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  if (spo2 >= 90) return { label: 'Hypoxie modérée', level: 'warning', color: 'text-amber-700 bg-amber-50 border-amber-200' };
  return { label: 'Désaturation sévère', level: 'critical', color: 'text-rose-700 bg-rose-50 border-rose-200' };
};

export const PatientVitalSignsTracker: React.FC<PatientVitalSignsTrackerProps> = ({
  patient,
  onUpdatePatient,
  showToast
}) => {
  // Ensure we have a vitalsHistory list even if older mock didn't have it
  const history: VitalSignRecord[] = useMemo(() => {
    if (patient.vitalsHistory && patient.vitalsHistory.length > 0) {
      return patient.vitalsHistory;
    }
    const currentBP = patient.vitals?.bloodPressure || '120/80';
    const [sysStr, diaStr] = currentBP.split('/');
    const sys = parseInt(sysStr, 10) || 120;
    const dia = parseInt(diaStr, 10) || 80;
    const temp = patient.vitals?.temperature || 36.8;
    const hr = patient.vitals?.heartRate || 72;
    const spo2 = patient.vitals?.oxygenSat || 98;
    const resp = patient.vitals?.respiratoryRate || 16;
    const glucose = patient.vitals?.bloodGlucose || '0.95';

    return [
      {
        id: `vs-init-${patient.id}`,
        patientId: patient.id,
        timestamp: new Date().toISOString(),
        displayDate: `Aujourd'hui à ${patient.arrivalTime || '09:00'}`,
        temperature: temp,
        systolicBP: sys,
        diastolicBP: dia,
        bloodPressure: `${sys}/${dia}`,
        heartRate: hr,
        oxygenSat: spo2,
        respiratoryRate: resp,
        bloodGlucose: glucose,
        recordedBy: patient.assignedDoctor || 'Dr. Hicham Amrani',
        context: 'Consultation initiale',
        notes: patient.notes || 'Constantes relevées à l\'accueil clinique.',
        status: sys >= 140 || temp >= 38 || hr > 100 ? 'warning' : 'normal',
        alerts: sys >= 140 ? ['HTA à surveiller'] : []
      }
    ];
  }, [patient]);

  // Ergonomic Sub-view State: allows instant access without scrolling
  const [activeSubView, setActiveSubView] = useState<'saisie' | 'courbes' | 'historique' | 'tous'>('saisie');

  // Form input state initialized with latest reading or standard default
  const latestRecord = history[0];

  const [temperature, setTemperature] = useState<number>(() => latestRecord ? latestRecord.temperature : 37.0);
  const [systolicBP, setSystolicBP] = useState<number>(() => latestRecord ? latestRecord.systolicBP : 120);
  const [diastolicBP, setDiastolicBP] = useState<number>(() => latestRecord ? latestRecord.diastolicBP : 80);
  const [heartRate, setHeartRate] = useState<number>(() => latestRecord ? latestRecord.heartRate : 72);
  const [oxygenSat, setOxygenSat] = useState<number>(() => latestRecord?.oxygenSat || 98);
  const [respiratoryRate, setRespiratoryRate] = useState<number>(() => latestRecord?.respiratoryRate || 16);
  const [bloodGlucose, setBloodGlucose] = useState<string>(() => latestRecord?.bloodGlucose || '0.98');
  const [context, setContext] = useState<string>('Consultation de suivi');
  const [recordedBy, setRecordedBy] = useState<string>(patient.assignedDoctor || 'Dr. Hicham Amrani');
  const [notes, setNotes] = useState<string>('');
  const [showAdvancedParams, setShowAdvancedParams] = useState<boolean>(false);
  const [filterChartMode, setFilterChartMode] = useState<'all' | 'bp' | 'hr' | 'temp'>('all');
  const [justSavedId, setJustSavedId] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Live evaluations
  const tempEval = evaluateTemperature(temperature);
  const bpEval = evaluateBloodPressure(systolicBP, diastolicBP);
  const hrEval = evaluateHeartRate(heartRate);
  const spo2Eval = evaluateSpO2(oxygenSat);
  const meanArterialPressure = Math.round((2 * diastolicBP + systolicBP) / 3);

  // Check if any current input triggers an alert
  const currentAlerts: string[] = [];
  if (tempEval.level !== 'normal') currentAlerts.push(`Température: ${tempEval.label} (${temperature}°C)`);
  if (bpEval.level !== 'normal') currentAlerts.push(`Tension: ${bpEval.label} (${systolicBP}/${diastolicBP} mmHg)`);
  if (hrEval.level !== 'normal') currentAlerts.push(`Fréquence Cardiaque: ${hrEval.label} (${heartRate} bpm)`);
  if (spo2Eval.level !== 'normal') currentAlerts.push(`Saturation: ${spo2Eval.label} (${oxygenSat}%)`);

  // Fast preset application for busy doctors
  const handleApplyPreset = (preset: 'normal' | 'febril' | 'hta') => {
    if (preset === 'normal') {
      setTemperature(36.8);
      setSystolicBP(120);
      setDiastolicBP(80);
      setHeartRate(72);
      setOxygenSat(99);
      setContext('Contrôle au repos');
    } else if (preset === 'febril') {
      setTemperature(38.6);
      setSystolicBP(125);
      setDiastolicBP(82);
      setHeartRate(98);
      setOxygenSat(97);
      setContext('Syndrome fébrile');
    } else if (preset === 'hta') {
      setTemperature(36.9);
      setSystolicBP(155);
      setDiastolicBP(95);
      setHeartRate(84);
      setOxygenSat(98);
      setContext('Poussée hypertensive');
    }
    if (showToast) showToast('Preset appliqué aux champs de saisie.');
  };

  // Handle saving new vital signs
  const handleSaveVitals = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (temperature < 33 || temperature > 44) {
      if (showToast) showToast('Température hors limites (33°C - 44°C).');
      return;
    }
    if (systolicBP < 50 || systolicBP > 280 || diastolicBP < 30 || diastolicBP > 180) {
      if (showToast) showToast('Veuillez vérifier les valeurs de tension.');
      return;
    }
    if (heartRate < 30 || heartRate > 250) {
      if (showToast) showToast('Fréquence cardiaque anormale (30 - 250 bpm).');
      return;
    }

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} à ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newRecordId = `vs-${Date.now()}`;

    const alertsList: string[] = [];
    if (tempEval.level === 'critical') alertsList.push(`Fièvre ${temperature}°C`);
    if (bpEval.level === 'critical') alertsList.push(`HTA sévère ${systolicBP}/${diastolicBP}`);
    else if (bpEval.level === 'warning') alertsList.push(`HTA ${systolicBP}/${diastolicBP}`);
    if (hrEval.level === 'critical') alertsList.push(`Anomalie rythme ${heartRate} bpm`);

    const newRecord: VitalSignRecord = {
      id: newRecordId,
      patientId: patient.id,
      timestamp: now.toISOString(),
      displayDate: formattedDate,
      temperature,
      systolicBP,
      diastolicBP,
      bloodPressure: `${systolicBP}/${diastolicBP}`,
      heartRate,
      oxygenSat,
      respiratoryRate,
      bloodGlucose,
      recordedBy: recordedBy.trim() || patient.assignedDoctor || 'Dr. Hicham Amrani',
      context,
      notes: notes.trim() || undefined,
      status: alertsList.length > 0 ? (alertsList.some(a => a.includes('sévère') || a.includes('Fièvre')) ? 'critical' : 'warning') : 'normal',
      alerts: alertsList
    };

    const updatedHistory = [newRecord, ...history];

    const updatedPatient: Patient = {
      ...patient,
      vitals: {
        bloodPressure: `${systolicBP}/${diastolicBP}`,
        heartRate,
        oxygenSat,
        bloodGlucose,
        temperature,
        respiratoryRate
      },
      vitalsHistory: updatedHistory
    };

    onUpdatePatient(updatedPatient);
    setJustSavedId(newRecordId);
    setTimeout(() => setJustSavedId(null), 4000);

    if (showToast) {
      showToast(`Constantes enregistrées avec succès : ${systolicBP}/${diastolicBP} mmHg • ${temperature}°C • ${heartRate} bpm`);
    }

    setNotes('');
  };

  // Delete a record from history
  const handleDeleteRecord = (recordId: string) => {
    if (history.length <= 1) {
      if (showToast) showToast('Impossible de supprimer la seule mesure de référence.');
      return;
    }
    const updatedHistory = history.filter(r => r.id !== recordId);
    const newest = updatedHistory[0];
    const updatedPatient: Patient = {
      ...patient,
      vitals: newest ? {
        bloodPressure: newest.bloodPressure,
        heartRate: newest.heartRate,
        temperature: newest.temperature,
        oxygenSat: newest.oxygenSat || 98,
        respiratoryRate: newest.respiratoryRate || 16,
        bloodGlucose: newest.bloodGlucose || '0.98'
      } : patient.vitals,
      vitalsHistory: updatedHistory
    };
    onUpdatePatient(updatedPatient);
    if (showToast) showToast('Mesure supprimée de l\'historique.');
  };

  // Data points for trend chart (ordered chronologically from oldest to newest)
  const chartData = useMemo(() => {
    return [...history].reverse();
  }, [history]);

  // -------------------------------------------------------------
  // REUSABLE SUB-COMPONENTS FOR HIGH ERGONOMICS & ZERO-SCROLL
  // -------------------------------------------------------------

  // 1. Compact Current Vitals KPI Cards
  const renderKpiCards = (isVerticalLayout = false) => (
    <div className={isVerticalLayout ? 'space-y-2.5' : 'grid grid-cols-2 sm:grid-cols-4 gap-2.5'}>
      {/* Temperature KPI */}
      <div className="bg-[#f8f9ff] p-2.5 rounded-xl border border-[#dae2fd]/70 flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider block">
            Température
          </span>
          <div className="text-[18px] font-bold text-[#0b1c30] flex items-baseline gap-1 mt-0.5">
            <span>{(latestRecord?.temperature ?? 37.0).toFixed(1)}</span>
            <span className="text-[11px] font-normal text-[#76777d]">°C</span>
          </div>
          <span className={`inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${evaluateTemperature(latestRecord?.temperature ?? 37.0).color}`}>
            {evaluateTemperature(latestRecord?.temperature ?? 37.0).label}
          </span>
        </div>
        <div className="p-1.5 rounded-lg bg-white border border-[#cbd5e1]/50 text-rose-500 shadow-2xs">
          <span className="material-symbols-outlined text-[17px]">device_thermostat</span>
        </div>
      </div>

      {/* Blood Pressure KPI */}
      <div className="bg-[#f8f9ff] p-2.5 rounded-xl border border-[#dae2fd]/70 flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider block">
            Tension Artérielle
          </span>
          <div className="text-[18px] font-bold text-[#0b1c30] flex items-baseline gap-1 mt-0.5">
            <span>{latestRecord?.bloodPressure || '120/80'}</span>
            <span className="text-[10px] font-normal text-[#76777d]">mmHg</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${evaluateBloodPressure(latestRecord?.systolicBP ?? 120, latestRecord?.diastolicBP ?? 80).color}`}>
              {evaluateBloodPressure(latestRecord?.systolicBP ?? 120, latestRecord?.diastolicBP ?? 80).label}
            </span>
            <span className="text-[9px] text-[#76777d] font-mono">
              PAM {Math.round((2 * (latestRecord?.diastolicBP ?? 80) + (latestRecord?.systolicBP ?? 120)) / 3)}
            </span>
          </div>
        </div>
        <div className="p-1.5 rounded-lg bg-white border border-[#cbd5e1]/50 text-[#006a61] shadow-2xs">
          <span className="material-symbols-outlined text-[17px]">cardiology</span>
        </div>
      </div>

      {/* Heart Rate KPI */}
      <div className="bg-[#f8f9ff] p-2.5 rounded-xl border border-[#dae2fd]/70 flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider block">
            Fréquence Cardiaque
          </span>
          <div className="text-[18px] font-bold text-[#006a61] flex items-baseline gap-1 mt-0.5">
            <span>{latestRecord?.heartRate ?? 72}</span>
            <span className="text-[10px] font-normal text-[#76777d]">bpm</span>
          </div>
          <span className={`inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${evaluateHeartRate(latestRecord?.heartRate ?? 72).color}`}>
            {evaluateHeartRate(latestRecord?.heartRate ?? 72).label}
          </span>
        </div>
        <div className="p-1.5 rounded-lg bg-white border border-[#cbd5e1]/50 text-red-500 shadow-2xs">
          <span className="material-symbols-outlined text-[17px] animate-pulse">favorite</span>
        </div>
      </div>

      {/* SpO2 & Respiratory KPI */}
      <div className="bg-[#f8f9ff] p-2.5 rounded-xl border border-[#dae2fd]/70 flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider block">
            SpO2 & Fréquence
          </span>
          <div className="text-[18px] font-bold text-emerald-700 flex items-baseline gap-1 mt-0.5">
            <span>{latestRecord?.oxygenSat ?? 98}%</span>
            <span className="text-[9px] font-normal text-[#76777d]">O2</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${evaluateSpO2(latestRecord?.oxygenSat ?? 98).color}`}>
              {evaluateSpO2(latestRecord?.oxygenSat ?? 98).label}
            </span>
            <span className="text-[9px] text-[#45464d] font-semibold">
              {latestRecord?.respiratoryRate ?? 16} cpm
            </span>
          </div>
        </div>
        <div className="p-1.5 rounded-lg bg-white border border-[#cbd5e1]/50 text-emerald-600 shadow-2xs">
          <span className="material-symbols-outlined text-[17px]">air</span>
        </div>
      </div>
    </div>
  );

  // 2. Doctor Saisie Form (Compact & Ergonomic)
  const renderDoctorForm = () => (
    <form
      onSubmit={handleSaveVitals}
      className="bg-white rounded-xl border border-[#006a61]/30 p-4 shadow-2xs space-y-3"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-[#e6f7f5] text-[#006a61] rounded-lg">
            <span className="material-symbols-outlined text-[17px]">edit_note</span>
          </span>
          <div>
            <h4 className="font-bold text-[13px] text-[#0b1c30] flex items-center gap-1.5">
              <span>Saisie Prise de Constantes</span>
              <span className="text-[10px] font-semibold text-[#006a61] bg-[#e6f7f5] px-1.5 py-0.2 rounded">
                Direct Médecin
              </span>
            </h4>
            <p className="text-[10px] text-[#76777d]">
              Température, Tension artérielle (PAS/PAD) et Pouls.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[10px] text-[#76777d] font-semibold mr-1">Presets :</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('normal')}
            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            Normal (120/80)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('febril')}
            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
          >
            Fébrile (38.6°)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('hta')}
            className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 transition-colors"
          >
            HTA (155/95)
          </button>
        </div>
      </div>

      {/* Core Inputs: Temperature, Blood Pressure, Heart Rate */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* 1. Température */}
        <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#dae2fd] space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#0b1c30] flex items-center gap-1">
              <span className="material-symbols-outlined text-rose-500 text-[16px]">device_thermostat</span>
              <span>Température (°C)</span>
            </label>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${tempEval.color}`}>
              {tempEval.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTemperature((prev) => parseFloat((Math.max(34, prev - 0.1)).toFixed(1)))}
              className="w-7 h-7 rounded-lg bg-white border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f1f5f9] font-bold flex items-center justify-center shrink-0 text-sm"
            >
              -
            </button>
            <div className="relative flex-1">
              <input
                type="number"
                step="0.1"
                min="34"
                max="43"
                required
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value) || 37.0)}
                className="w-full text-center py-1.5 px-2 bg-white text-[16px] font-bold text-[#0b1c30] rounded-lg border border-[#dae2fd] focus:border-[#006a61] outline-hidden"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#76777d]">
                °C
              </span>
            </div>
            <button
              type="button"
              onClick={() => setTemperature((prev) => parseFloat((Math.min(43, prev + 0.1)).toFixed(1)))}
              className="w-7 h-7 rounded-lg bg-white border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f1f5f9] font-bold flex items-center justify-center shrink-0 text-sm"
            >
              +
            </button>
          </div>

          <div className="flex items-center justify-between text-[9px] text-[#76777d] px-0.5">
            <span>Normal: 36.5 - 37.5°C</span>
            <span>Fièvre: &ge; 38°C</span>
          </div>
        </div>

        {/* 2. Tension Artérielle */}
        <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#dae2fd] space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#0b1c30] flex items-center gap-1">
              <span className="material-symbols-outlined text-[#006a61] text-[16px]">cardiology</span>
              <span>Tension Artérielle</span>
            </label>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${bpEval.color}`}>
              {bpEval.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <div>
              <div className="text-[9px] text-[#76777d] font-semibold mb-0.5">Systolique (PAS)</div>
              <input
                type="number"
                step="1"
                min="60"
                max="260"
                required
                value={systolicBP}
                onChange={(e) => setSystolicBP(parseInt(e.target.value, 10) || 120)}
                placeholder="120"
                className="w-full text-center py-1.5 px-1 bg-white text-[15px] font-bold text-[#0b1c30] rounded-lg border border-[#dae2fd] focus:border-[#006a61] outline-hidden"
              />
            </div>

            <div>
              <div className="text-[9px] text-[#76777d] font-semibold mb-0.5">Diastolique (PAD)</div>
              <input
                type="number"
                step="1"
                min="40"
                max="160"
                required
                value={diastolicBP}
                onChange={(e) => setDiastolicBP(parseInt(e.target.value, 10) || 80)}
                placeholder="80"
                className="w-full text-center py-1.5 px-1 bg-white text-[15px] font-bold text-[#0b1c30] rounded-lg border border-[#dae2fd] focus:border-[#006a61] outline-hidden"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[9px] text-[#76777d] px-0.5">
            <span>Rendu: <strong className="text-[#0b1c30]">{systolicBP}/{diastolicBP}</strong></span>
            <span className="font-mono bg-white px-1 rounded border border-[#cbd5e1]/60">
              PAM: {meanArterialPressure} mmHg
            </span>
          </div>
        </div>

        {/* 3. Fréquence Cardiaque */}
        <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#dae2fd] space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[#0b1c30] flex items-center gap-1">
              <span className="material-symbols-outlined text-red-500 text-[16px]">favorite</span>
              <span>Pouls / FC (BPM)</span>
            </label>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${hrEval.color}`}>
              {hrEval.label}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setHeartRate((prev) => Math.max(35, prev - 2))}
              className="w-7 h-7 rounded-lg bg-white border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f1f5f9] font-bold flex items-center justify-center shrink-0 text-sm"
            >
              -
            </button>
            <div className="relative flex-1">
              <input
                type="number"
                step="1"
                min="35"
                max="220"
                required
                value={heartRate}
                onChange={(e) => setHeartRate(parseInt(e.target.value, 10) || 72)}
                className="w-full text-center py-1.5 px-2 bg-white text-[16px] font-bold text-[#006a61] rounded-lg border border-[#dae2fd] focus:border-[#006a61] outline-hidden"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#76777d]">
                bpm
              </span>
            </div>
            <button
              type="button"
              onClick={() => setHeartRate((prev) => Math.min(220, prev + 2))}
              className="w-7 h-7 rounded-lg bg-white border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f1f5f9] font-bold flex items-center justify-center shrink-0 text-sm"
            >
              +
            </button>
          </div>

          <div className="flex items-center justify-between text-[9px] text-[#76777d] px-0.5">
            <span>Normal: 60 - 100 bpm</span>
            <span>Rythme sinusal</span>
          </div>
        </div>
      </div>

      {/* Advanced Parameters Toggle */}
      <div className="flex items-center justify-between text-[11px] pt-1">
        <button
          type="button"
          onClick={() => setShowAdvancedParams(!showAdvancedParams)}
          className="text-[11px] font-semibold text-[#006a61] hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[15px]">
            {showAdvancedParams ? 'remove_circle_outline' : 'add_circle_outline'}
          </span>
          <span>{showAdvancedParams ? 'Masquer paramètres complémentaires' : '+ SpO2, FR & Glycémie'}</span>
        </button>

        <span className="text-[10px] text-[#76777d]">
          Praticien : <strong className="text-[#0b1c30]">{recordedBy}</strong>
        </span>
      </div>

      {showAdvancedParams && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-2.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd]/70 animate-in fade-in duration-150">
          <div>
            <label className="block text-[10px] font-bold text-[#0b1c30] mb-0.5">
              Saturation SpO2 (%)
            </label>
            <input
              type="number"
              min="70"
              max="100"
              value={oxygenSat}
              onChange={(e) => setOxygenSat(parseInt(e.target.value, 10) || 98)}
              className="w-full py-1.5 px-2 bg-white text-[12px] rounded-lg border border-[#dae2fd] text-center font-bold text-emerald-700 outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#0b1c30] mb-0.5">
              Fréquence Respiratoire (cpm)
            </label>
            <input
              type="number"
              min="8"
              max="60"
              value={respiratoryRate}
              onChange={(e) => setRespiratoryRate(parseInt(e.target.value, 10) || 16)}
              className="w-full py-1.5 px-2 bg-white text-[12px] rounded-lg border border-[#dae2fd] text-center font-bold text-[#0b1c30] outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#0b1c30] mb-0.5">
              Glycémie Capillaire (g/L)
            </label>
            <input
              type="text"
              value={bloodGlucose}
              onChange={(e) => setBloodGlucose(e.target.value)}
              placeholder="0.98"
              className="w-full py-1.5 px-2 bg-white text-[12px] rounded-lg border border-[#dae2fd] text-center font-bold text-[#0b1c30] outline-hidden"
            />
          </div>
        </div>
      )}

      {/* Context & Notes Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        <div>
          <label className="block text-[10px] font-bold text-[#0b1c30] mb-1">
            Contexte de Prise
          </label>
          <select
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full py-1.5 px-2.5 bg-white text-[11px] text-[#0b1c30] rounded-lg border border-[#dae2fd] focus:border-[#006a61] outline-hidden"
          >
            <option value="Consultation de suivi">Consultation de suivi</option>
            <option value="Contrôle au repos">Contrôle au repos (10 min)</option>
            <option value="Admission / Accueil">Admission / Accueil</option>
            <option value="Surveillance post-médication">Surveillance post-médication</option>
            <option value="Pré-opératoire">Bilan Pré-opératoire</option>
            <option value="Post-opératoire immédiat">Post-opératoire immédiat</option>
            <option value="Urgences">Urgences / Déchoquage</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-[#0b1c30] mb-1">
            Note Clinique / Remarque
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="ex: Patient calme, bonne tolérance hémodynamique..."
            className="w-full py-1.5 px-2.5 bg-white text-[11px] text-[#0b1c30] rounded-lg border border-[#dae2fd] focus:border-[#006a61] outline-hidden"
          />
        </div>
      </div>

      {/* Live Warning Alerts */}
      {currentAlerts.length > 0 && (
        <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900">
          <span className="material-symbols-outlined text-amber-600 text-[16px] shrink-0 mt-0.5">
            warning
          </span>
          <div>
            <span className="font-bold">Alerte Clinique sur cette mesure : </span>
            <span className="text-amber-800">{currentAlerts.join(' • ')}</span>
          </div>
        </div>
      )}

      {/* Action Submit */}
      <div className="pt-2 flex items-center justify-between gap-3 border-t border-[#f1f5f9]">
        <span className="text-[10px] text-[#76777d] hidden sm:inline">
          Horodatage automatique • Sauvegarde persistante au dossier
        </span>

        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 hover:scale-[1.01]"
        >
          <span className="material-symbols-outlined text-[16px]">save</span>
          <span>Enregistrer dans le profil ({temperature}°C • {systolicBP}/{diastolicBP} • {heartRate} bpm)</span>
        </button>
      </div>
    </form>
  );

  // 3. Interactive Evolution Curves & Trends
  const renderEvolutionCharts = () => (
    <div className="bg-white rounded-xl border border-[#dae2fd]/80 p-4 shadow-2xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#f1f5f9]">
        <div>
          <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006a61] text-[17px]">show_chart</span>
            <span>Courbes d'Évolution Clinique</span>
          </h4>
          <p className="text-[10px] text-[#76777d]">
            Historique graphique de la Température, Tension et Fréquence cardiaque
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#f1f5f9] p-0.5 rounded-lg border border-[#e2e8f0]">
          <button
            onClick={() => setFilterChartMode('all')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
              filterChartMode === 'all' ? 'bg-[#006a61] text-white shadow-2xs' : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilterChartMode('bp')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
              filterChartMode === 'bp' ? 'bg-[#006a61] text-white shadow-2xs' : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            Tension
          </button>
          <button
            onClick={() => setFilterChartMode('hr')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
              filterChartMode === 'hr' ? 'bg-[#006a61] text-white shadow-2xs' : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            Pouls
          </button>
          <button
            onClick={() => setFilterChartMode('temp')}
            className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
              filterChartMode === 'temp' ? 'bg-[#006a61] text-white shadow-2xs' : 'text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            Température
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Temp Curve */}
        {(filterChartMode === 'all' || filterChartMode === 'temp') && (
          <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#dae2fd]/70 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#0b1c30] flex items-center gap-1 text-rose-600">
                <span className="material-symbols-outlined text-[15px]">device_thermostat</span>
                <span>Température (°C)</span>
              </span>
              <span className="text-[9px] text-[#76777d]">Cible &le; 37.5°</span>
            </div>

            <div className="h-28 flex items-end gap-1.5 pt-3 px-1 border-b border-[#cbd5e1]/40">
              {chartData.map((rec, idx) => {
                const minT = 36.0;
                const maxT = 40.0;
                const percentage = Math.min(100, Math.max(12, ((rec.temperature - minT) / (maxT - minT)) * 100));
                const isFever = rec.temperature >= 38.0;

                return (
                  <div key={rec.id || idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <span className="text-[9px] font-bold text-[#0b1c30]">
                      {rec.temperature.toFixed(1)}°
                    </span>
                    <div
                      style={{ height: `${percentage}%` }}
                      className={`w-full max-w-[24px] rounded-t-sm transition-all ${
                        isFever ? 'bg-rose-500' : 'bg-rose-300 group-hover:bg-rose-400'
                      }`}
                    />
                    <span className="text-[8px] text-[#76777d] truncate max-w-[32px]">
                      {rec.displayDate.split('à')[1]?.trim() || `P${idx + 1}`}
                    </span>

                    <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 bg-[#131b2e] text-white text-[10px] p-1.5 rounded shadow-lg whitespace-nowrap">
                      <div><strong>{rec.temperature}°C</strong> ({rec.displayDate})</div>
                      <div className="text-slate-300">Par {rec.recordedBy}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[9px] text-[#76777d] flex justify-between">
              <span>Dernière : {latestRecord?.temperature.toFixed(1)}°C</span>
              <span>Moy : {(chartData.reduce((acc, c) => acc + c.temperature, 0) / chartData.length).toFixed(1)}°C</span>
            </div>
          </div>
        )}

        {/* BP Curve */}
        {(filterChartMode === 'all' || filterChartMode === 'bp') && (
          <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#dae2fd]/70 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#0b1c30] flex items-center gap-1 text-[#006a61]">
                <span className="material-symbols-outlined text-[15px]">cardiology</span>
                <span>Tension (PAS/PAD)</span>
              </span>
              <span className="text-[9px] text-[#76777d]">Cible &le; 130/80</span>
            </div>

            <div className="h-28 flex items-end gap-1.5 pt-3 px-1 border-b border-[#cbd5e1]/40">
              {chartData.map((rec, idx) => {
                const sysPct = Math.min(100, Math.max(15, ((rec.systolicBP - 60) / 120) * 100));
                const diaPct = Math.min(100, Math.max(10, ((rec.diastolicBP - 40) / 100) * 100));
                const isHigh = rec.systolicBP >= 140 || rec.diastolicBP >= 90;

                return (
                  <div key={rec.id || idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <span className="text-[8px] font-bold text-[#0b1c30]">
                      {rec.systolicBP}/{rec.diastolicBP}
                    </span>
                    <div className="w-full max-w-[24px] flex items-end justify-center gap-0.5">
                      <div
                        style={{ height: `${sysPct}%` }}
                        className={`w-1/2 rounded-t-xs transition-all ${
                          isHigh ? 'bg-amber-600' : 'bg-[#006a61]'
                        }`}
                        title={`PAS: ${rec.systolicBP}`}
                      />
                      <div
                        style={{ height: `${diaPct}%` }}
                        className="w-1/2 rounded-t-xs bg-sky-400 transition-all"
                        title={`PAD: ${rec.diastolicBP}`}
                      />
                    </div>
                    <span className="text-[8px] text-[#76777d] truncate max-w-[32px]">
                      {rec.displayDate.split('à')[1]?.trim() || `P${idx + 1}`}
                    </span>

                    <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 bg-[#131b2e] text-white text-[10px] p-1.5 rounded shadow-lg whitespace-nowrap">
                      <div><strong>{rec.bloodPressure} mmHg</strong> ({rec.displayDate})</div>
                      <div className="text-slate-300">PAM : {Math.round((2 * rec.diastolicBP + rec.systolicBP) / 3)} mmHg</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[9px] text-[#76777d] flex justify-between">
              <span>Dernière : {latestRecord?.bloodPressure} mmHg</span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-xs bg-[#006a61]" /> PAS
                <span className="inline-block w-2 h-2 rounded-xs bg-sky-400 ml-1" /> PAD
              </span>
            </div>
          </div>
        )}

        {/* HR Curve */}
        {(filterChartMode === 'all' || filterChartMode === 'hr') && (
          <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#dae2fd]/70 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#0b1c30] flex items-center gap-1 text-red-600">
                <span className="material-symbols-outlined text-[15px]">favorite</span>
                <span>Pouls (bpm)</span>
              </span>
              <span className="text-[9px] text-[#76777d]">Normal: 60 - 100</span>
            </div>

            <div className="h-28 flex items-end gap-1.5 pt-3 px-1 border-b border-[#cbd5e1]/40">
              {chartData.map((rec, idx) => {
                const hrPct = Math.min(100, Math.max(15, ((rec.heartRate - 40) / 100) * 100));
                const isTachy = rec.heartRate > 100;
                const isBrady = rec.heartRate < 60;

                return (
                  <div key={rec.id || idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <span className="text-[9px] font-bold text-[#0b1c30]">
                      {rec.heartRate}
                    </span>
                    <div
                      style={{ height: `${hrPct}%` }}
                      className={`w-full max-w-[24px] rounded-t-sm transition-all ${
                        isTachy ? 'bg-rose-500' : isBrady ? 'bg-sky-500' : 'bg-red-400 group-hover:bg-red-500'
                      }`}
                    />
                    <span className="text-[8px] text-[#76777d] truncate max-w-[32px]">
                      {rec.displayDate.split('à')[1]?.trim() || `P${idx + 1}`}
                    </span>

                    <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 bg-[#131b2e] text-white text-[10px] p-1.5 rounded shadow-lg whitespace-nowrap">
                      <div><strong>{rec.heartRate} bpm</strong> ({rec.displayDate})</div>
                      <div className="text-slate-300">Contexte : {rec.context || 'Repos'}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="text-[9px] text-[#76777d] flex justify-between">
              <span>Dernier : {latestRecord?.heartRate} bpm</span>
              <span>Moy : {Math.round(chartData.reduce((acc, c) => acc + c.heartRate, 0) / chartData.length)} bpm</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 4. Historical Log Table
  const renderHistoryTable = () => (
    <div className="bg-white rounded-xl border border-[#dae2fd]/80 shadow-2xs overflow-hidden">
      <div className="p-3 bg-[#f8f9ff] border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006a61] text-[17px]">history</span>
            <span>Historique Chronologique des Relevés</span>
          </h4>
          <p className="text-[10px] text-[#76777d]">
            Traçabilité médicale • Profil {patient.name} ({patient.cin})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-[#006a61] bg-white px-2 py-0.5 rounded border border-[#dae2fd]">
            {history.length} relevé{history.length > 1 ? 's' : ''}
          </span>
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="px-2.5 py-1 bg-white hover:bg-[#e6f7f5] text-[#006a61] text-[10px] font-bold rounded border border-[#86f2e4] flex items-center gap-1 shadow-2xs transition-colors"
          >
            <span className="material-symbols-outlined text-[13px]">print</span>
            <span>Imprimer</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-[11px]">
          <thead>
            <tr className="bg-slate-50 border-b border-[#cbd5e1]/60 text-[10px] font-bold text-[#45464d] uppercase tracking-wider">
              <th className="py-2 px-3">Date & Heure</th>
              <th className="py-2 px-2.5">Praticien & Contexte</th>
              <th className="py-2 px-2.5">Température</th>
              <th className="py-2 px-2.5">Tension (TA)</th>
              <th className="py-2 px-2.5">Pouls (FC)</th>
              <th className="py-2 px-2.5">SpO2 / FR</th>
              <th className="py-2 px-2.5">Remarques</th>
              <th className="py-2 px-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {history.map((record) => {
              const tEval = evaluateTemperature(record.temperature);
              const bEval = evaluateBloodPressure(record.systolicBP, record.diastolicBP);
              const hEval = evaluateHeartRate(record.heartRate);
              const isHighlighted = justSavedId === record.id;

              return (
                <tr
                  key={record.id}
                  className={`transition-colors hover:bg-[#f8f9ff] ${
                    isHighlighted ? 'bg-emerald-50/70 border-l-4 border-emerald-600' : ''
                  }`}
                >
                  <td className="py-2 px-3 whitespace-nowrap">
                    <div className="font-bold text-[#0b1c30]">{record.displayDate}</div>
                    <div className="text-[9px] text-[#76777d]">{record.id}</div>
                  </td>

                  <td className="py-2 px-2.5">
                    <div className="font-semibold text-[#0b1c30]">{record.recordedBy}</div>
                    <div className="text-[10px] text-[#76777d]">{record.context || 'Consultation'}</div>
                  </td>

                  <td className="py-2 px-2.5 whitespace-nowrap">
                    <div className="font-bold text-[#0b1c30]">
                      {record.temperature.toFixed(1)} <span className="text-[9px] font-normal text-[#76777d]">°C</span>
                    </div>
                    <span className={`inline-block text-[8px] font-bold px-1 rounded border ${tEval.color}`}>
                      {tEval.label}
                    </span>
                  </td>

                  <td className="py-2 px-2.5 whitespace-nowrap">
                    <div className="font-bold text-[#0b1c30]">
                      {record.bloodPressure} <span className="text-[9px] font-normal text-[#76777d]">mmHg</span>
                    </div>
                    <span className={`inline-block text-[8px] font-bold px-1 rounded border ${bEval.color}`}>
                      {bEval.label}
                    </span>
                  </td>

                  <td className="py-2 px-2.5 whitespace-nowrap">
                    <div className="font-bold text-[#006a61]">
                      {record.heartRate} <span className="text-[9px] font-normal text-[#76777d]">bpm</span>
                    </div>
                    <span className={`inline-block text-[8px] font-bold px-1 rounded border ${hEval.color}`}>
                      {hEval.label}
                    </span>
                  </td>

                  <td className="py-2 px-2.5 whitespace-nowrap">
                    <div className="text-[10px] font-semibold text-[#0b1c30]">
                      {record.oxygenSat ? `${record.oxygenSat}%` : '--'}
                      {record.respiratoryRate ? ` • ${record.respiratoryRate} cpm` : ''}
                    </div>
                    {record.bloodGlucose && (
                      <div className="text-[9px] text-[#76777d]">
                        Gly: {record.bloodGlucose} g/L
                      </div>
                    )}
                  </td>

                  <td className="py-2 px-2.5 max-w-xs">
                    {record.notes ? (
                      <p className="text-[10px] text-[#45464d] truncate" title={record.notes}>
                        {record.notes}
                      </p>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">R.A.S.</span>
                    )}
                  </td>

                  <td className="py-2 px-2.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(record.id)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Supprimer cette mesure"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Top Ergonomic Control Header: Zero-Scroll Sub-view Navigation */}
      <div className="bg-white rounded-xl border border-[#dae2fd]/80 p-3 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Sub-view switcher pills */}
          <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-lg overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveSubView('saisie')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSubView === 'saisie'
                  ? 'bg-white text-[#006a61] shadow-2xs'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-[#006a61]">edit_square</span>
              <span>⚡ Saisie & Constantes</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubView('courbes')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSubView === 'courbes'
                  ? 'bg-white text-[#006a61] shadow-2xs'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-teal-600">show_chart</span>
              <span>📈 Courbes d'Évolution</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubView('historique')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSubView === 'historique'
                  ? 'bg-white text-[#006a61] shadow-2xs'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-[#006a61]">history</span>
              <span>📋 Historique ({history.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubView('tous')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeSubView === 'tous'
                  ? 'bg-white text-[#006a61] shadow-2xs'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">dashboard</span>
              <span>🔍 Vue Panoramique</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {justSavedId && (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-md flex items-center gap-1 animate-pulse">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                Enregistré !
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-2.5 py-1.5 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#006a61] text-[11px] font-semibold rounded-lg border border-[#dae2fd] transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">print</span>
              <span>Feuille de Surveillance</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: 'saisie' -> ZERO-SCROLL ERGONOMIC LAYOUT */}
      {activeSubView === 'saisie' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* Left: Current Active KPIs */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white rounded-xl border border-[#dae2fd]/80 p-3 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
                <span className="text-[11px] font-bold text-[#0b1c30] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#006a61] text-[16px]">monitor_heart</span>
                  <span>Constantes Actuelles</span>
                </span>
                <span className="text-[9px] font-mono text-[#76777d]">
                  {latestRecord?.displayDate}
                </span>
              </div>
              {renderKpiCards(true)}
            </div>

            {/* Quick Summary Card */}
            <div className="bg-[#eff4ff]/60 rounded-xl border border-[#dae2fd] p-3 text-[11px] space-y-1.5">
              <div className="font-bold text-[#006a61] flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                <span>Statut Hémodynamique Patient</span>
              </div>
              <p className="text-[#45464d] text-[10px] leading-relaxed">
                Tension {latestRecord?.bloodPressure} mmHg (PAM {Math.round((2 * (latestRecord?.diastolicBP ?? 80) + (latestRecord?.systolicBP ?? 120)) / 3)}), FC {latestRecord?.heartRate} bpm, Temp {latestRecord?.temperature.toFixed(1)}°C.
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px]">
                <button
                  type="button"
                  onClick={() => setActiveSubView('courbes')}
                  className="text-[#006a61] font-bold hover:underline flex items-center gap-0.5"
                >
                  Voir les courbes &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubView('historique')}
                  className="text-[#76777d] hover:text-[#0b1c30] font-medium"
                >
                  {history.length} mesures passées
                </button>
              </div>
            </div>
          </div>

          {/* Right: Focused Doctor Input Form */}
          <div className="lg:col-span-8">
            {renderDoctorForm()}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: 'courbes' -> EVOLUTION CHARTS */}
      {activeSubView === 'courbes' && (
        <div className="space-y-3">
          {renderKpiCards(false)}
          {renderEvolutionCharts()}
        </div>
      )}

      {/* VIEW MODE 3: 'historique' -> TABLE & LOG */}
      {activeSubView === 'historique' && (
        <div className="space-y-3">
          {renderHistoryTable()}
        </div>
      )}

      {/* VIEW MODE 4: 'tous' -> PANORAMIC 360° DASHBOARD */}
      {activeSubView === 'tous' && (
        <div className="space-y-3">
          {renderKpiCards(false)}
          {renderDoctorForm()}
          {renderEvolutionCharts()}
          {renderHistoryTable()}
        </div>
      )}

      {/* Printable Surveillance Sheet Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-[#cbd5e1] space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a61] text-[24px]">local_hospital</span>
                <div>
                  <h3 className="font-bold text-[16px] text-[#0b1c30]">
                    Feuille de Surveillance des Constantes Vitales
                  </h3>
                  <p className="text-[11px] text-[#76777d]">
                    Clinique Al Bassma Casablanca • Dossier Médical #{patient.cin}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Patient Info */}
            <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] text-[12px] grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div>
                <span className="text-[#76777d] block text-[10px]">Patient</span>
                <strong className="text-[#0b1c30]">{patient.name}</strong>
              </div>
              <div>
                <span className="text-[#76777d] block text-[10px]">CIN / Âge</span>
                <strong>{patient.cin} • {patient.age} ans</strong>
              </div>
              <div>
                <span className="text-[#76777d] block text-[10px]">Couverture</span>
                <strong>{patient.amoType} ({patient.amoRate}%)</strong>
              </div>
              <div>
                <span className="text-[#76777d] block text-[10px]">Médecin Référent</span>
                <strong>{patient.assignedDoctor || 'Dr. Hicham Amrani'}</strong>
              </div>
              <div>
                <span className="text-[#76777d] block text-[10px]">Dernière Tension</span>
                <strong className="text-[#006a61]">{latestRecord?.bloodPressure} mmHg</strong>
              </div>
              <div>
                <span className="text-[#76777d] block text-[10px]">Dernière Température</span>
                <strong className="text-rose-600">{latestRecord?.temperature.toFixed(1)}°C</strong>
              </div>
            </div>

            {/* Historical Entries Tabular */}
            <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-[#f1f5f9] font-bold text-[#45464d] border-b border-[#cbd5e1]">
                  <tr>
                    <th className="p-2">Date / Heure</th>
                    <th className="p-2">Temp (°C)</th>
                    <th className="p-2">TA (mmHg)</th>
                    <th className="p-2">Pouls (bpm)</th>
                    <th className="p-2">SpO2</th>
                    <th className="p-2">Praticien</th>
                    <th className="p-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {history.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50">
                      <td className="p-2 font-semibold">{h.displayDate}</td>
                      <td className="p-2">{h.temperature.toFixed(1)}°C</td>
                      <td className="p-2 font-bold">{h.bloodPressure}</td>
                      <td className="p-2">{h.heartRate} bpm</td>
                      <td className="p-2">{h.oxygenSat ? `${h.oxygenSat}%` : '--'}</td>
                      <td className="p-2">{h.recordedBy}</td>
                      <td className="p-2 text-[#45464d]">{h.notes || h.context || 'R.A.S.'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#76777d]">
              <div>Document médico-légal officiel • Conforme CNDP 09-08</div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3 py-1.5 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0b1c30] rounded-lg font-semibold"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    setIsPrintModalOpen(false);
                    if (showToast) showToast('Feuille de surveillance envoyée à l\'impression.');
                    window.print();
                  }}
                  className="px-3.5 py-1.5 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg font-bold flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">print</span>
                  <span>Imprimer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

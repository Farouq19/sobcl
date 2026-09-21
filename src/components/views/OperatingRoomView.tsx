import React, { useState } from 'react';
import { SurgerySchedule, Patient } from '../../types';
import { INITIAL_SURGERY_SCHEDULE } from '../../data/saasSeedData';
import { ClinicalSelect, SelectOption } from '../common/ClinicalSelect';
import { DataTable, Column, TableBadge } from '../common/DataTable';

const OPERATING_ROOM_OPTIONS: SelectOption[] = [
  { value: 'Bloc 1 - Chirurgie Cardiaque & Vasculaire', label: 'Bloc 1 - Cardiaque & Vasculaire', badge: 'Bloc 1' },
  { value: 'Bloc 2 - Orthopédie & Traumatologie', label: 'Bloc 2 - Orthopédie & Traumatologie', badge: 'Bloc 2' },
  { value: 'Bloc 3 - Chirurgie Ambulatoire', label: 'Bloc 3 - Chirurgie Ambulatoire', badge: 'Bloc 3' },
];

const ANESTHESIA_OPTIONS: SelectOption[] = [
  { value: 'Générale', label: 'Générale', badge: 'AG' },
  { value: 'Rachianesthésie', label: 'Rachianesthésie', badge: 'Rachi' },
  { value: 'Péridurale', label: 'Péridurale', badge: 'Péri' },
  { value: 'Locale', label: 'Locale', badge: 'AL' },
];

interface OperatingRoomViewProps {
  patients: Patient[];
  minAldreteScore?: number;
}

export const OperatingRoomView: React.FC<OperatingRoomViewProps> = ({ patients, minAldreteScore = 9 }) => {
  const [surgeries, setSurgeries] = useState<SurgerySchedule[]>(INITIAL_SURGERY_SCHEDULE);
  const [selectedSurgery, setSelectedSurgery] = useState<SurgerySchedule>(INITIAL_SURGERY_SCHEDULE[0]);
  const [activeBlocFilter, setActiveBlocFilter] = useState<string>('all');
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New Surgery Form State
  const [newSurgery, setNewSurgery] = useState({
    patientId: patients[0]?.id || '',
    procedure: '',
    surgeon: 'Dr. Hicham Tazi',
    anesthetist: 'Dr. K. Benjelloun',
    operatingRoom: 'Bloc 2 - Orthopédie & Traumatologie',
    scheduledDate: 'Aujourd\'hui',
    startTime: '15:00',
    expectedDurationMinutes: 75,
    anesthesiaType: 'Générale' as SurgerySchedule['anesthesiaType']
  });

  const surgeryStatuses: Record<SurgerySchedule['status'], { label: string; color: string }> = {
    surgery_requested: { label: 'Demande Chirurgicale', color: 'bg-[#eff4ff] text-[#188ace]' },
    pre_op: { label: 'Check-list Pré-Op', color: 'bg-[#fef9c3] text-[#854d0e]' },
    scheduled: { label: 'Programmé au Bloc', color: 'bg-[#e0e7ff] text-[#4338ca]' },
    patient_prepared: { label: 'Patient Prêt / Au Sas', color: 'bg-[#ffedd5] text-[#c2410c]' },
    in_surgery: { label: 'En Cours d\'Intervention', color: 'bg-[#fee2e2] text-[#ba1a1a] animate-pulse' },
    recovery: { label: 'En SSPI (Salle de Réveil)', color: 'bg-[#fae8ff] text-[#86198f]' },
    completed: { label: 'Intervention Clôturée', color: 'bg-[#dcfce7] text-[#15803d]' }
  };

  const handleAdvanceSurgery = (surgeryId: string, nextStatus: SurgerySchedule['status']) => {
    setSurgeries(surgeries.map(s => {
      if (s.id === surgeryId) {
        const updated = {
          ...s,
          status: nextStatus,
          recoveryAldreteScore: nextStatus === 'recovery' || nextStatus === 'completed' ? 10 : s.recoveryAldreteScore
        };
        if (selectedSurgery.id === surgeryId) setSelectedSurgery(updated);
        return updated;
      }
      return s;
    }));
  };

  const handleValidateChecklist = (surgeryId: string) => {
    setSurgeries(surgeries.map(s => {
      if (s.id === surgeryId) {
        const updated = { ...s, preOpChecklistCompleted: true, status: 'patient_prepared' as const };
        if (selectedSurgery.id === surgeryId) setSelectedSurgery(updated);
        return updated;
      }
      return s;
    }));
    setIsChecklistModalOpen(false);
  };

  const handleCreateSurgery = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find(p => p.id === newSurgery.patientId);
    if (!patientObj) return;

    const created: SurgerySchedule = {
      id: `surg-${Date.now()}`,
      patientId: patientObj.id,
      patientName: patientObj.name,
      patientCin: patientObj.cin,
      procedure: newSurgery.procedure,
      surgeon: newSurgery.surgeon,
      anesthetist: newSurgery.anesthetist,
      operatingRoom: newSurgery.operatingRoom,
      scheduledDate: newSurgery.scheduledDate,
      startTime: newSurgery.startTime,
      expectedDurationMinutes: newSurgery.expectedDurationMinutes,
      preOpChecklistCompleted: false,
      status: 'scheduled',
      anesthesiaType: newSurgery.anesthesiaType
    };

    setSurgeries([created, ...surgeries]);
    setSelectedSurgery(created);
    setIsScheduleModalOpen(false);
  };

  const filteredSurgeries = surgeries.filter(s => {
    return activeBlocFilter === 'all' || s.operatingRoom.includes(activeBlocFilter);
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-[#dae2fd]/70 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#e6f7f5] text-[#006a61]">
            <span className="material-symbols-outlined text-[26px]">emergency</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-[#0b1c30]">Bloc Opératoire & Salles de Chirurgie</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#fae8ff] text-[#86198f] border border-[#f5d0fe]">
                3 Salles d'Opération ISO 5
              </span>
            </div>
            <p className="text-[13px] text-[#45464d]">
              Planning des interventions chirurgicales, check-lists OMS pré-anesthésie et surveillance post-opératoire (SSPI).
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsScheduleModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white text-[13px] font-semibold rounded-lg shadow-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ Programmer Intervention</span>
        </button>
      </div>

      {/* 3 Rooms Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#dae2fd]/70 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[13px] text-[#0b1c30]">Bloc 1 - Cardiaque & Vasculaire</span>
            <span className="h-2 w-2 rounded-full bg-[#15803d]" />
          </div>
          <div className="text-[11px] text-[#76777d]">Équipement CEC, Scialytique HD, Flux laminaire stérile</div>
          <div className="text-[12px] font-semibold text-[#006a61] pt-1">
            Intervention : Pontage Aorto-coronarien (Demain)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dae2fd]/70 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[13px] text-[#0b1c30]">Bloc 2 - Orthopédie & Traumatologie</span>
            <span className="h-2 w-2 rounded-full bg-[#188ace]" />
          </div>
          <div className="text-[11px] text-[#76777d]">Amplificateur de brillance 3D, Moteurs chirurgicaux</div>
          <div className="text-[12px] font-semibold text-[#188ace] pt-1">
            Ostéosynthèse Tibia — Terminé en SSPI
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#dae2fd]/70 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[13px] text-[#0b1c30]">Bloc 3 - Chirurgie Ambulatoire</span>
            <span className="h-2 w-2 rounded-full bg-[#c2410c]" />
          </div>
          <div className="text-[11px] text-[#76777d]">Colonne de cœlioscopie 4K, Bipolaire ligasure</div>
          <div className="text-[12px] font-semibold text-[#c2410c] pt-1">
            Cœlioscopie Hernie (13:30) — Patient préparé
          </div>
        </div>
      </div>

      {/* Main Grid: Surgery List and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Schedule Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-[#f8f9ff] border-b border-[#e2e8f0] flex items-center justify-between">
            <span className="font-bold text-[13px] text-[#0b1c30]">Programme Opératoire</span>
            <div className="flex gap-1.5 text-[11px]">
              <button
                onClick={() => setActiveBlocFilter('all')}
                className={`px-2 py-0.5 rounded ${activeBlocFilter === 'all' ? 'bg-[#006a61] text-white' : 'bg-white text-[#45464d]'}`}
              >
                Tous
              </button>
              <button
                onClick={() => setActiveBlocFilter('Bloc 1')}
                className={`px-2 py-0.5 rounded ${activeBlocFilter === 'Bloc 1' ? 'bg-[#006a61] text-white' : 'bg-white text-[#45464d]'}`}
              >
                Bloc 1
              </button>
              <button
                onClick={() => setActiveBlocFilter('Bloc 2')}
                className={`px-2 py-0.5 rounded ${activeBlocFilter === 'Bloc 2' ? 'bg-[#006a61] text-white' : 'bg-white text-[#45464d]'}`}
              >
                Bloc 2
              </button>
              <button
                onClick={() => setActiveBlocFilter('Bloc 3')}
                className={`px-2 py-0.5 rounded ${activeBlocFilter === 'Bloc 3' ? 'bg-[#006a61] text-white' : 'bg-white text-[#45464d]'}`}
              >
                Bloc 3
              </button>
            </div>
          </div>

          <DataTable<SurgerySchedule>
            columns={[
              {
                key: 'procedure',
                header: 'Intervention & Patient',
                width: '42%',
                render: (s) => (
                  <div>
                    <div className="font-bold text-[#0b1c30] truncate">{s.procedure}</div>
                    <div className="text-[11px] text-[#76777d] truncate">
                      Patient : <strong className="text-[#0b1c30]">{s.patientName}</strong> ({s.patientCin})
                    </div>
                  </div>
                ),
              },
              {
                key: 'room',
                header: 'Salle de Bloc',
                width: '26%',
                render: (s) => (
                  <div>
                    <div className="font-medium text-[#0b1c30] truncate">{s.operatingRoom.split('-')[0]}</div>
                    <div className="text-[10px] text-[#76777d] truncate">{s.operatingRoom.split('-')[1] || ''}</div>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Statut',
                width: '18%',
                render: (s) => {
                  const statusInfo = surgeryStatuses[s.status];
                  const variantMap: Record<SurgerySchedule['status'], 'blue' | 'amber' | 'emerald' | 'purple' | 'red' | 'neutral'> = {
                    surgery_requested: 'blue',
                    pre_op: 'amber',
                    scheduled: 'purple',
                    patient_prepared: 'amber',
                    in_surgery: 'red',
                    recovery: 'purple',
                    completed: 'emerald',
                  };
                  return (
                    <TableBadge variant={variantMap[s.status] || 'neutral'}>
                      {statusInfo.label}
                    </TableBadge>
                  );
                },
              },
              {
                key: 'time',
                header: 'Horaire & Durée',
                width: '14%',
                align: 'right',
                render: (s) => (
                  <div className="text-right">
                    <div className="font-bold text-[#0b1c30]">{s.startTime}</div>
                    <div className="text-[10px] text-[#76777d]">{s.expectedDurationMinutes} min</div>
                  </div>
                ),
              },
            ]}
            data={filteredSurgeries}
            onRowClick={(s) => setSelectedSurgery(s)}
            emptyMessage="Aucune intervention programmée pour ce bloc."
            rowHeight="h-14"
          />
        </div>

        {/* Right: Surgery Dossier & Checklist Inspector */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs p-5 space-y-4">
          <div className="pb-3 border-b border-[#e2e8f0]">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${surgeryStatuses[selectedSurgery.status].color}`}>
              {surgeryStatuses[selectedSurgery.status].label}
            </span>
            <h2 className="text-[16px] font-bold text-[#0b1c30] mt-2">{selectedSurgery.procedure}</h2>
            <div className="text-[12px] text-[#006a61] font-semibold">{selectedSurgery.operatingRoom}</div>
          </div>

          {/* Team and Surgical Specs */}
          <div className="bg-[#f8f9ff] p-3.5 rounded-lg border border-[#dae2fd]/60 space-y-2 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[#76777d]">Chirurgien Principal :</span>
              <span className="font-bold text-[#0b1c30]">{selectedSurgery.surgeon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#76777d]">Médecin Anesthésiste :</span>
              <span className="font-semibold text-[#0b1c30]">{selectedSurgery.anesthetist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#76777d]">Mode d'Anesthésie :</span>
              <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#188ace] font-mono text-[11px]">
                {selectedSurgery.anesthesiaType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#76777d]">Check-list OMS :</span>
              <span className={`font-bold ${selectedSurgery.preOpChecklistCompleted ? 'text-[#15803d]' : 'text-[#ba1a1a]'}`}>
                {selectedSurgery.preOpChecklistCompleted ? 'Validée & Conforme' : 'Non Validée'}
              </span>
            </div>
            {selectedSurgery.recoveryAldreteScore !== undefined && (
              <div className="flex justify-between">
                <span className="text-[#76777d]">Score d'Aldrete SSPI :</span>
                <span className={`font-bold ${
                  (selectedSurgery.recoveryAldreteScore ?? 0) >= minAldreteScore ? 'text-[#15803d]' : 'text-[#ba1a1a]'
                }`}>
                  {selectedSurgery.recoveryAldreteScore} / 10 (Seuil requis : ≥ {minAldreteScore}/10)
                </span>
              </div>
            )}
          </div>

          {/* Notes */}
          {selectedSurgery.postOpNotes && (
            <div className="space-y-1">
              <div className="text-[11px] font-bold text-[#76777d] uppercase">Compte-rendu opératoire per-op :</div>
              <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#dae2fd]/60 text-[12px] text-[#0b1c30]">
                {selectedSurgery.postOpNotes}
              </div>
            </div>
          )}

          {/* Actions Bar */}
          <div className="pt-3 border-t border-[#e2e8f0] space-y-2">
            <div className="text-[11px] font-semibold text-[#76777d] uppercase">Transitions de Flux Chirurgical :</div>
            <div className="flex flex-wrap gap-2 items-center">
              {!selectedSurgery.preOpChecklistCompleted && (
                <button
                  onClick={() => setIsChecklistModalOpen(true)}
                  className="px-3 py-1.5 bg-[#854d0e] hover:bg-[#713f12] text-white text-[11px] font-semibold rounded-lg shadow-2xs flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">checklist</span>
                  <span>Remplir la Check-list Sécurité OMS</span>
                </button>
              )}

              {selectedSurgery.status === 'patient_prepared' && (
                <button
                  onClick={() => handleAdvanceSurgery(selectedSurgery.id, 'in_surgery')}
                  className="px-3 py-1.5 bg-[#ba1a1a] hover:bg-[#991b1b] text-white text-[11px] font-semibold rounded-lg shadow-2xs"
                >
                  Démarrer l'Intervention (Au Bloc)
                </button>
              )}

              {selectedSurgery.status === 'in_surgery' && (
                <button
                  onClick={() => handleAdvanceSurgery(selectedSurgery.id, 'recovery')}
                  className="px-3 py-1.5 bg-[#86198f] hover:bg-[#701a75] text-white text-[11px] font-semibold rounded-lg shadow-2xs"
                >
                  Transférer en Salle de Réveil (SSPI)
                </button>
              )}

              {selectedSurgery.status === 'recovery' && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      const score = selectedSurgery.recoveryAldreteScore ?? 8;
                      if (score < minAldreteScore) {
                        alert(`Attention : Le score d'Aldrete (${score}/10) n'atteint pas le seuil minimal fixé par le protocole clinique (≥ ${minAldreteScore}/10). Décharge refusée.`);
                        return;
                      }
                      handleAdvanceSurgery(selectedSurgery.id, 'completed');
                    }}
                    className="px-3 py-1.5 bg-[#006a61] hover:bg-[#00544d] text-white text-[11px] font-semibold rounded-lg shadow-2xs flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    <span>Autoriser Sortie SSPI vers Chambre (Seuil ≥ {minAldreteScore}/10)</span>
                  </button>
                  <div className="flex items-center gap-1 bg-[#f1f5f9] px-2 py-1 rounded-lg border border-[#cbd5e1] text-[11px]">
                    <span className="text-[#45464d] font-medium">Évaluer Aldrete :</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newScore = Math.max(0, (selectedSurgery.recoveryAldreteScore ?? 9) - 1);
                        setSelectedSurgery({ ...selectedSurgery, recoveryAldreteScore: newScore });
                        setSurgeries(surgeries.map(s => s.id === selectedSurgery.id ? { ...s, recoveryAldreteScore: newScore } : s));
                      }}
                      className="w-5 h-5 bg-white rounded border border-[#cbd5e1] font-bold text-[#ba1a1a] flex items-center justify-center hover:bg-red-50"
                      title="Diminuer score"
                    >
                      -
                    </button>
                    <span className="font-bold text-[#0b1c30] px-1">{selectedSurgery.recoveryAldreteScore ?? 9}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const newScore = Math.min(10, (selectedSurgery.recoveryAldreteScore ?? 9) + 1);
                        setSelectedSurgery({ ...selectedSurgery, recoveryAldreteScore: newScore });
                        setSurgeries(surgeries.map(s => s.id === selectedSurgery.id ? { ...s, recoveryAldreteScore: newScore } : s));
                      }}
                      className="w-5 h-5 bg-white rounded border border-[#cbd5e1] font-bold text-[#006a61] flex items-center justify-center hover:bg-emerald-50"
                      title="Augmenter score"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {selectedSurgery.status === 'completed' && (
                <div className="text-[11px] text-[#15803d] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Intervention clôturée, retour en hospitalisation validé.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WHO Checklist Modal */}
      {isChecklistModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-[16px] text-[#0b1c30]">Check-list Sécurité du Bloc (OMS / HAS)</h3>
              <button
                onClick={() => setIsChecklistModalOpen(false)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 pt-4 text-[12px]">
              <div className="flex items-center gap-2 p-2 bg-[#f8f9ff] rounded border border-[#e2e8f0]">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-[#006a61] rounded" />
                <span>1. Confirmation identité patient, site opératoire et procédure</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#f8f9ff] rounded border border-[#e2e8f0]">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-[#006a61] rounded" />
                <span>2. Vérification matériel anesthésie et médicaments d'urgence</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#f8f9ff] rounded border border-[#e2e8f0]">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-[#006a61] rounded" />
                <span>3. Oxymètre de pouls en place et fonctionnel</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#f8f9ff] rounded border border-[#e2e8f0]">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-[#006a61] rounded" />
                <span>4. Risque allergique connu évalué (Pénicilline, Iode...)</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-[#f8f9ff] rounded border border-[#e2e8f0]">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-[#006a61] rounded" />
                <span>5. Antibioprophylaxie administrée dans les 60 min</span>
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
                <button
                  onClick={() => setIsChecklistModalOpen(false)}
                  className="px-4 py-2 text-[#45464d] hover:bg-[#f1f5f9] rounded-lg font-semibold"
                >
                  Fermer
                </button>
                <button
                  onClick={() => handleValidateChecklist(selectedSurgery.id)}
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg font-semibold shadow-xs"
                >
                  Valider & Autoriser l'Entrée en Salle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Surgery Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-[16px] text-[#0b1c30]">Programmer une Intervention au Bloc</h3>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateSurgery} className="space-y-4 pt-4 text-[12px]">
              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Patient</label>
                <ClinicalSelect
                  value={newSurgery.patientId}
                  onChange={(val) => setNewSurgery({ ...newSurgery, patientId: val })}
                  options={patients.map(p => ({
                    value: p.id,
                    label: `${p.name} (CIN: ${p.cin})`,
                    sublabel: `${p.specialty || 'Chirurgie'} • ${p.roomNumber ? `Chambre ${p.roomNumber}` : 'Non assigné'}`
                  }))}
                  fullWidth
                  size="lg"
                  searchable={true}
                  searchPlaceholder="Rechercher patient par nom ou CIN..."
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Intitulé de l'intervention</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Arthroscopie du genou, Cholécystectomie cœlio..."
                  value={newSurgery.procedure}
                  onChange={(e) => setNewSurgery({ ...newSurgery, procedure: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Salle d'Opération</label>
                  <ClinicalSelect
                    value={newSurgery.operatingRoom}
                    onChange={(val) => setNewSurgery({ ...newSurgery, operatingRoom: val })}
                    options={OPERATING_ROOM_OPTIONS}
                    fullWidth
                    size="lg"
                    searchable={false}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Mode d'Anesthésie</label>
                  <ClinicalSelect
                    value={newSurgery.anesthesiaType}
                    onChange={(val) => setNewSurgery({ ...newSurgery, anesthesiaType: val as SurgerySchedule['anesthesiaType'] })}
                    options={ANESTHESIA_OPTIONS}
                    fullWidth
                    size="lg"
                    searchable={false}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Heure de début</label>
                  <input
                    type="time"
                    value={newSurgery.startTime}
                    onChange={(e) => setNewSurgery({ ...newSurgery, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Durée estimée (min)</label>
                  <input
                    type="number"
                    value={newSurgery.expectedDurationMinutes}
                    onChange={(e) => setNewSurgery({ ...newSurgery, expectedDurationMinutes: parseInt(e.target.value) || 60 })}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 text-[#45464d] hover:bg-[#f1f5f9] rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg font-semibold shadow-xs"
                >
                  Programmer au planning
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

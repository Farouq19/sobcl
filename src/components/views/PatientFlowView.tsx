import React, { useState } from 'react';
import { Patient, ViewMode } from '../../types';
import { ServiceSelectDropdown } from '../ServiceSelectDropdown';
import { DataTable, Column, ActionGroup, ActionButton, TableBadge } from '../common/DataTable';

interface PatientFlowViewProps {
  patients: Patient[];
  onNavigate: (view: ViewMode) => void;
  onSelectPatient: (patient: Patient) => void;
  onOpenNewAdmission: () => void;
  onUpdateStatus: (patientId: string, newStatus: Patient['status'], newLocation?: string) => void;
}

export const PatientFlowView: React.FC<PatientFlowViewProps> = ({
  patients,
  onNavigate,
  onSelectPatient,
  onOpenNewAdmission,
  onUpdateStatus
}) => {
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedDeptLabel, setSelectedDeptLabel] = useState('Tous les services (Cardio, Urgences, Bloc...)');
  const [flowViewMode, setFlowViewMode] = useState<'kanban' | 'table'>('kanban');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper matching patient against selected department
  const isPatientInSelectedDept = (p: Patient) => {
    if (selectedDept === 'all') return true;

    const idLower = selectedDept.toLowerCase().trim();
    const labelLower = selectedDeptLabel.toLowerCase().trim();
    const specialty = (p.specialty || '').toLowerCase().trim();
    const location = (p.currentLocation || '').toLowerCase().trim();
    const doc = (p.assignedDoctor || '').toLowerCase().trim();
    const ticket = (p.ticketNumber || '').toLowerCase().trim();

    // Specific shortcuts for historical values
    if (idLower === 'cardio' || idLower === 'cardiologie') {
      return specialty.includes('cardio') || location.includes('cardio') || doc.includes('amrani');
    }
    if (idLower === 'urgences' || idLower === 'urgences 24/7') {
      return specialty.includes('urg') || location.includes('urg') || ticket.startsWith('#u');
    }
    if (idLower === 'pediatrie' || idLower === 'pédiatrie') {
      return specialty.includes('péd') || p.name.toLowerCase().includes('enfant') || (p.age !== undefined && p.age < 16);
    }

    // Dynamic matches
    return (
      specialty.includes(idLower) ||
      idLower.includes(specialty) ||
      specialty.includes(labelLower) ||
      labelLower.includes(specialty) ||
      location.includes(idLower) ||
      location.includes(labelLower) ||
      doc.includes(idLower)
    );
  };

  // Filtered patients
  const filteredPatients = patients.filter(isPatientInSelectedDept);

  // Group patients into columns
  const waitingList = filteredPatients.filter((p) => p.status === 'waiting' || p.status === 'calling');
  const consultationList = filteredPatients.filter((p) => p.status === 'consultation');
  const hospitalizedList = filteredPatients.filter((p) => p.status === 'hospitalized');

  return (
    <div className="space-y-4 pb-12">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#dae2fd]/30 flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-[#86f2e4] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Ticker & Metric Strip */}
      <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#e6f7f5] text-[#006a61] rounded-lg">
            <span className="material-symbols-outlined text-[24px]">view_kanban</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-lg font-bold text-[#0b1c30]">
                Régulation des Flux Patients
              </h1>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[12px] text-[#45464d]">
              {selectedDept === 'all'
                ? '42 patients tracés simultanément dans les circuits ambulatoires et hospitaliers'
                : `${filteredPatients.length} patient${filteredPatients.length > 1 ? 's' : ''} filtré${filteredPatients.length > 1 ? 's' : ''} pour : ${selectedDeptLabel}`}
            </p>
          </div>
        </div>

        {/* Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0]">
            <button
              onClick={() => setFlowViewMode('kanban')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all ${
                flowViewMode === 'kanban'
                  ? 'bg-white text-[#006a61] shadow-2xs'
                  : 'text-[#76777d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">view_kanban</span>
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setFlowViewMode('table')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all ${
                flowViewMode === 'table'
                  ? 'bg-white text-[#006a61] shadow-2xs'
                  : 'text-[#76777d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">table_rows</span>
              <span>Liste Standard</span>
            </button>
          </div>

          <ServiceSelectDropdown
            value={selectedDept}
            onChange={(val, label) => {
              setSelectedDept(val);
              setSelectedDeptLabel(label);
            }}
            patients={patients}
          />

          <button
            onClick={() => showToast('Scanner CIN connecté en bluetooth')}
            className="px-3 py-1.5 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] font-semibold rounded-lg border border-[#dae2fd] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">document_scanner</span>
            <span>Scanner CIN</span>
          </button>

          <button
            onClick={onOpenNewAdmission}
            className="px-3.5 py-1.5 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Admission Rapide</span>
          </button>
        </div>
      </div>

      {flowViewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-2xs border border-[#e2e8f0] overflow-hidden">
          <div className="p-4 border-b border-[#f1f5f9] flex justify-between items-center">
            <div>
              <h3 className="font-headline text-base font-bold text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a61] text-[20px]">format_list_bulleted</span>
                Liste Globale des Flux Patients
              </h3>
              <span className="text-[11px] text-[#76777d]">
                {filteredPatients.length} patients dans le circuit en temps réel
              </span>
            </div>
            <div className="flex gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                {waitingList.length} en attente
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                {consultationList.length} en consultation
              </span>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold">
                {hospitalizedList.length} hospitalisés
              </span>
            </div>
          </div>

          <DataTable<Patient>
            columns={[
              {
                key: 'patient',
                header: 'Patient & CIN',
                width: '28%',
                render: (p) => (
                  <div className="flex items-center gap-2.5">
                    {p.photoUrl ? (
                      <img
                        src={p.photoUrl}
                        alt={p.name}
                        className="h-8 w-8 rounded-full object-cover border border-[#cbd5e1] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#dae2fd] text-[#006a61] font-bold flex items-center justify-center text-[11px] shrink-0">
                        {p.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-semibold text-[#0b1c30] flex items-center gap-1.5 truncate">
                        <span className="truncate">{p.name}</span>
                        {p.ticketNumber && (
                          <span className="text-[10px] font-mono bg-[#eff4ff] text-[#006a61] px-1.5 py-0.2 rounded font-bold shrink-0">
                            {p.ticketNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#76777d] truncate">
                        CIN : {p.cin} • {p.age} ans
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Étape du Flux',
                width: '18%',
                render: (p) => {
                  if (p.status === 'consultation') {
                    return (
                      <TableBadge variant="emerald" dot pulse>
                        En Consultation
                      </TableBadge>
                    );
                  }
                  if (p.status === 'calling') {
                    return (
                      <TableBadge variant="blue" icon="volume_up">
                        Appelé en Box
                      </TableBadge>
                    );
                  }
                  if (p.status === 'waiting') {
                    return (
                      <TableBadge variant="amber" icon="schedule">
                        Attente ({p.waitingMinutes || 12}m)
                      </TableBadge>
                    );
                  }
                  if (p.status === 'hospitalized') {
                    return (
                      <TableBadge variant="purple" icon="bed">
                        Hospitalisé
                      </TableBadge>
                    );
                  }
                  return <TableBadge variant="neutral">{p.status}</TableBadge>;
                },
              },
              {
                key: 'location',
                header: 'Box / Emplacement',
                width: '16%',
                render: (p) => (
                  <span className="font-medium text-[#0b1c30]">
                    {p.currentLocation || "Salle d'Attente"}
                  </span>
                ),
              },
              {
                key: 'doctor',
                header: 'Médecin & Spécialité',
                width: '18%',
                render: (p) => (
                  <div>
                    <div className="font-medium text-[#0b1c30] truncate">{p.assignedDoctor}</div>
                    <div className="text-[10px] text-[#76777d] truncate">{p.specialty}</div>
                  </div>
                ),
              },
              {
                key: 'amo',
                header: 'Régime AMO',
                width: '10%',
                render: (p) => (
                  <TableBadge
                    variant={p.amoType === 'CNOPS' ? 'blue' : p.amoType === 'CNSS' ? 'emerald' : 'neutral'}
                  >
                    {p.amoType} {p.amoRate ? `${p.amoRate}%` : ''}
                  </TableBadge>
                ),
              },
              {
                key: 'actions',
                header: 'Actions',
                width: '10%',
                align: 'right',
                render: (p) => (
                  <ActionGroup align="right" onClick={(e) => e.stopPropagation()}>
                    <ActionButton
                      icon="volume_up"
                      variant="blue"
                      title="Diffuser appel"
                      onClick={() => {
                        onUpdateStatus(p.id, 'calling');
                        showToast(`Appel vocal diffusé pour ${p.name}`);
                      }}
                    />
                    <ActionButton
                      icon="meeting_room"
                      variant="teal"
                      title="Orienter vers Box Consultation"
                      onClick={() => {
                        onUpdateStatus(p.id, 'consultation', 'Box 02');
                        showToast(`${p.name} orienté vers Box Consultation`);
                      }}
                    />
                    <ActionButton
                      icon="chevron_right"
                      variant="ghost"
                      title="Ouvrir dossier médical"
                      onClick={() => {
                        onSelectPatient(p);
                        onNavigate('patient-files');
                      }}
                    />
                  </ActionGroup>
                ),
              },
            ]}
            data={filteredPatients}
            onRowClick={(p) => {
              onSelectPatient(p);
              onNavigate('patient-files');
            }}
            emptyMessage="Aucun patient ne correspond aux critères de sélection"
            rowHeight="h-14"
          />
        </div>
      ) : (
      /* 5-Column Fluid Kanban Workflow */
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Column 1: Salle d'Attente */}
        <div className="bg-[#f8f9ff] rounded-xl border border-[#dae2fd] p-3 flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#cbd5e1]/60">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <h3 className="font-headline text-[13px] font-bold text-[#0b1c30]">
                1. Salle d'Attente
              </h3>
            </div>
            <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {waitingList.length} pts
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {waitingList.length === 0 ? (
              <div className="text-center py-10 px-3 bg-white/60 rounded-lg border border-dashed border-[#cbd5e1] text-[#76777d]">
                <span className="material-symbols-outlined text-[24px] text-slate-400 mb-1 block">hourglass_empty</span>
                <span className="text-[11px] font-medium">Aucun patient en attente dans ce service</span>
              </div>
            ) : (
              waitingList.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectPatient(p);
                    onNavigate('patient-files');
                  }}
                  className="bg-white p-3 rounded-lg border border-[#cbd5e1]/80 shadow-2xs hover:border-[#006a61] cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="font-bold text-[12px] text-[#0b1c30]">{p.name}</div>
                    <span className="text-[10px] font-mono bg-[#eff4ff] text-[#006a61] px-1.5 py-0.2 rounded font-bold">
                      {p.ticketNumber || '#C-12'}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#76777d] flex items-center justify-between">
                    <span>CIN: {p.cin}</span>
                    <span className="text-amber-700 font-medium">Attente {p.waitingMinutes || 12} min</span>
                  </div>

                  <div className="text-[11px] text-[#45464d] bg-[#f8f9ff] p-1.5 rounded flex items-center justify-between">
                    <span>{p.assignedDoctor}</span>
                    <span className="font-bold text-[#006a61]">{p.amoType}</span>
                  </div>

                  <div className="flex gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        onUpdateStatus(p.id, 'calling');
                        showToast(`Appel diffusé pour ${p.name}`);
                      }}
                      className="flex-1 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">volume_up</span>
                      <span>Appeler</span>
                    </button>
                    <button
                      onClick={() => {
                        onUpdateStatus(p.id, 'consultation', 'Box 02');
                        showToast(`${p.name} orienté vers Box Consultation`);
                      }}
                      className="flex-1 py-1 text-[11px] font-semibold text-[#006a61] bg-[#e6f7f5] hover:bg-[#c9f1eb] rounded flex items-center justify-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                      <span>Orienter Box</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: En Consultation */}
        <div className="bg-[#f8f9ff] rounded-xl border border-[#dae2fd] p-3 flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#cbd5e1]/60">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-headline text-[13px] font-bold text-[#0b1c30]">
                2. En Consultation
              </h3>
            </div>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              {consultationList.length + ((selectedDept === 'all' || isPatientInSelectedDept({ specialty: 'Cardiologie' } as any)) ? 1 : 0) + ((selectedDept === 'all' || isPatientInSelectedDept({ specialty: 'Gynécologie' } as any)) ? 1 : 0)} actifs
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {/* Dynamic Consultation Patients */}
            {consultationList.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelectPatient(p);
                  onNavigate('patient-files');
                }}
                className="bg-white p-3 rounded-lg border border-[#cbd5e1]/80 shadow-2xs hover:border-[#006a61] transition-all space-y-2 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-[12px] text-[#0b1c30]">{p.name}</div>
                    <div className="text-[10px] text-[#76777d]">CIN: {p.cin} • {p.age} ans</div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    {p.currentLocation || 'Box'}
                  </span>
                </div>

                <div className="bg-[#e6f7f5] p-2 rounded text-[11px] text-[#006a61] space-y-0.5">
                  <div className="font-semibold">{p.assignedDoctor} ({p.specialty})</div>
                  <div>TA: {p.vitals?.bloodPressure || '120/80'} • Pouls: {p.vitals?.heartRate || 75} bpm</div>
                </div>

                <div className="flex gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => showToast(`Prescription transmise à la pharmacie pour ${p.name}`)}
                    className="flex-1 py-1 text-[11px] font-semibold text-[#006a61] bg-[#eff4ff] hover:bg-[#dce9ff] rounded flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">prescriptions</span>
                    <span>Prescrire</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('billing-amo');
                      showToast('Orientation vers le guichet caisse pour clôture');
                    }}
                    className="flex-1 py-1 text-[11px] font-semibold text-[#0b1c30] bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">payments</span>
                    <span>Caisse &gt;</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Card 1: Mohammed El Alami (Cardiologie) */}
            {(selectedDept === 'all' || isPatientInSelectedDept({ specialty: 'Cardiologie' } as any)) && (
              <div className="bg-white p-3 rounded-lg border border-[#cbd5e1]/80 shadow-2xs hover:border-[#006a61] transition-all space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-[12px] text-[#0b1c30]">M. Mohammed El Alami</div>
                    <div className="text-[10px] text-[#76777d]">CIN: BE489102 • 62 ans</div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    Box 03
                  </span>
                </div>

                <div className="bg-[#e6f7f5] p-2 rounded text-[11px] text-[#006a61] space-y-0.5">
                  <div className="font-semibold">Dr. M. Amrani (Cardiologie)</div>
                  <div>TA: 150/95 mmHg • Pouls: 84 bpm • Scope actif</div>
                </div>

                <div className="flex gap-1.5 pt-1">
                  <button
                    onClick={() => showToast('Prescription transmise à la pharmacie')}
                    className="flex-1 py-1 text-[11px] font-semibold text-[#006a61] bg-[#eff4ff] hover:bg-[#dce9ff] rounded flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">prescriptions</span>
                    <span>Prescrire</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('billing-amo');
                      showToast('Orientation vers le guichet caisse pour clôture');
                    }}
                    className="flex-1 py-1 text-[11px] font-semibold text-[#0b1c30] bg-[#f1f5f9] hover:bg-[#e2e8f0] rounded flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[13px]">payments</span>
                    <span>Caisse &gt;</span>
                  </button>
                </div>
              </div>
            )}

            {/* Card 2: Fatima Z. Mansouri (Gynécologie) */}
            {(selectedDept === 'all' || isPatientInSelectedDept({ specialty: 'Gynécologie' } as any)) && (
              <div className="bg-white p-3 rounded-lg border border-[#cbd5e1]/80 shadow-2xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-[12px] text-[#0b1c30]">Mme Fatima Z. Mansouri</div>
                    <div className="text-[10px] text-[#76777d]">CIN: BK723491 • 34 ans</div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    Salle A
                  </span>
                </div>

                <div className="bg-[#eff4ff] p-2 rounded text-[11px] text-[#0b1c30] space-y-0.5">
                  <div className="font-semibold text-[#006a61]">Dr. S. Chraibi (Gynécologie)</div>
                  <div>Échographie pelvienne en cours d'enregistrement</div>
                </div>

                <button
                  onClick={() => showToast('Compte-rendu d\'échographie joint au dossier')}
                  className="w-full py-1 text-[11px] font-semibold text-white bg-[#006a61] hover:bg-[#00544d] rounded flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  <span>Valider Consultation</span>
                </button>
              </div>
            )}

            {consultationList.length === 0 &&
              !(selectedDept === 'all' || isPatientInSelectedDept({ specialty: 'Cardiologie' } as any)) &&
              !(selectedDept === 'all' || isPatientInSelectedDept({ specialty: 'Gynécologie' } as any)) && (
                <div className="text-center py-10 px-3 bg-white/60 rounded-lg border border-dashed border-[#cbd5e1] text-[#76777d]">
                  <span className="material-symbols-outlined text-[24px] text-slate-400 mb-1 block">stethoscope</span>
                  <span className="text-[11px] font-medium">Aucune consultation active dans ce service</span>
                </div>
              )}
          </div>
        </div>

        {/* Column 3: Plateaux Examens */}
        <div className="bg-[#f8f9ff] rounded-xl border border-[#dae2fd] p-3 flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#cbd5e1]/60">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              <h3 className="font-headline text-[13px] font-bold text-[#0b1c30]">
                3. Plateaux Examens
              </h3>
            </div>
            <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
              6 pts
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {/* Card 1 */}
            <div className="bg-white p-3 rounded-lg border border-[#cbd5e1]/80 shadow-2xs space-y-2">
              <div className="flex items-start justify-between">
                <div className="font-bold text-[12px] text-[#0b1c30]">M. Omar Kabbaj</div>
                <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded">
                  Radio
                </span>
              </div>
              <div className="text-[11px] text-[#45464d]">
                Radio Numérique Thorax Face
              </div>
              <div className="text-[10px] text-[#76777d] flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">person</span>
                <span>Manipulatrice : Mme Saidi</span>
              </div>
              <button
                onClick={() => showToast('Clichés PACS télétransmis au poste médical')}
                className="w-full py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">cloud_upload</span>
                <span>Transmettre Clichés PACS</span>
              </button>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-3 rounded-lg border border-[#cbd5e1]/80 shadow-2xs space-y-2">
              <div className="flex items-start justify-between">
                <div className="font-bold text-[12px] text-[#0b1c30]">Mme Nezha Idrissi</div>
                <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded">
                  Biologie
                </span>
              </div>
              <div className="text-[11px] text-[#45464d]">
                Bilan Pré-opératoire (TP, INR, NFS)
              </div>
              <div className="text-[10px] text-[#76777d]">
                Analyseur Cobas 6000 • Prélèvement 10:15
              </div>
              <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Centrifugation en cours (~15 min)
              </span>
            </div>
          </div>
        </div>

        {/* Column 4: Hospitalisation */}
        <div className="bg-[#f8f9ff] rounded-xl border border-[#dae2fd] p-3 flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#cbd5e1]/60">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
              <h3 className="font-headline text-[13px] font-bold text-[#0b1c30]">
                4. Hospitalisation
              </h3>
            </div>
            <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
              9 lits
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {hospitalizedList.map((p) => (
              <div
                key={p.id}
                onClick={() => onNavigate('hospitalization')}
                className="bg-white p-3 rounded-lg border border-[#cbd5e1]/80 shadow-2xs hover:border-purple-400 cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="font-bold text-[12px] text-[#0b1c30]">{p.name}</div>
                  <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded">
                    {p.currentLocation?.split(' ')[1] || 'Ch. 101'}
                  </span>
                </div>
                <div className="text-[11px] text-[#45464d]">{p.medicalAlerts?.[0] || 'Surveillance active'}</div>
                <div className="text-[10px] text-[#76777d] flex items-center justify-between">
                  <span>{p.assignedDoctor}</span>
                  <span className="font-bold text-[#006a61]">{p.amoType}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate('hospitalization');
                  }}
                  className="w-full py-1 text-[11px] font-semibold text-purple-800 bg-purple-50 hover:bg-purple-100 rounded flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">bed</span>
                  <span>Gérer Lit & Soins</span>
                </button>
              </div>
            ))}

            {/* Extra Room Card: Mme Salma Alami (Gynécologie & Obstétrique) */}
            {(selectedDept === 'all' || isPatientInSelectedDept({ specialty: 'Gynécologie', currentLocation: 'Suite 108' } as any)) && (
              <div
                onClick={() => onNavigate('hospitalization')}
                className="bg-white p-3 rounded-lg border border-[#cbd5e1]/80 shadow-2xs hover:border-purple-400 cursor-pointer space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="font-bold text-[12px] text-[#0b1c30]">Mme Salma Alami</div>
                  <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-1.5 py-0.2 rounded">
                    Suite 108
                  </span>
                </div>
                <div className="text-[11px] text-[#45464d]">Post-Césarienne • Aldrete 9/10</div>
                <div className="text-[10px] text-[#76777d]">Nouveau-né Berceau C-1</div>
                <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Ronde pédiatrique à 13h00
                </span>
              </div>
            )}

            {hospitalizedList.length === 0 &&
              !(selectedDept === 'all' || isPatientInSelectedDept({ specialty: 'Gynécologie', currentLocation: 'Suite 108' } as any)) && (
                <div className="text-center py-10 px-3 bg-white/60 rounded-lg border border-dashed border-[#cbd5e1] text-[#76777d]">
                  <span className="material-symbols-outlined text-[24px] text-slate-400 mb-1 block">bed</span>
                  <span className="text-[11px] font-medium">Aucun patient hospitalisé dans ce service</span>
                </div>
              )}
          </div>
        </div>

        {/* Column 5: Caisse & Sortie */}
        <div className="bg-[#f8f9ff] rounded-xl border border-[#dae2fd] p-3 flex flex-col min-h-[580px]">
          <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-[#cbd5e1]/60">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#006a61]" />
              <h3 className="font-headline text-[13px] font-bold text-[#0b1c30]">
                5. Caisse & Sortie
              </h3>
            </div>
            <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              5 en attente
            </span>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto">
            {/* Card 1: Kenza Berrada */}
            <div
              onClick={() => onNavigate('billing-amo')}
              className="bg-white p-3 rounded-lg border border-[#cbd5e1]/80 shadow-2xs hover:border-[#006a61] cursor-pointer space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="font-bold text-[12px] text-[#0b1c30]">Mme Kenza Berrada</div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                  Guichet 1
                </span>
              </div>
              <div className="text-[11px] text-[#76777d]">Consultation + Bilan + Écho</div>
              <div className="p-2 bg-[#eff4ff] rounded text-[11px] space-y-0.5">
                <div className="flex justify-between">
                  <span className="text-[#76777d]">Total Actes :</span>
                  <span className="font-semibold text-[#0b1c30]">1 450 MAD</span>
                </div>
                <div className="flex justify-between text-[#006a61]">
                  <span>AMO CNSS 70% :</span>
                  <span>- 1 015 MAD</span>
                </div>
                <div className="flex justify-between font-bold text-[#ba1a1a] pt-1 border-t border-[#dae2fd]">
                  <span>Reste Patient :</span>
                  <span>435 MAD</span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('billing-amo');
                }}
                className="w-full py-1 text-[11px] font-semibold text-white bg-[#006a61] hover:bg-[#00544d] rounded flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">payments</span>
                <span>Encaisser & Clôturer</span>
              </button>
            </div>

            {/* Card 2: Rachid Berrada */}
            <div className="bg-white p-3 rounded-lg border border-[#cbd5e1]/80 shadow-2xs space-y-2">
              <div className="flex items-start justify-between">
                <div className="font-bold text-[12px] text-[#0b1c30]">M. Rachid Berrada</div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  Réglé
                </span>
              </div>
              <div className="text-[11px] text-[#76777d]">
                650 MAD réglé par TPE CMI • FSE #883916
              </div>
              <button
                onClick={() => showToast('Quittance de règlement et volet patient imprimés')}
                className="w-full py-1 text-[11px] font-semibold text-[#006a61] bg-[#e6f7f5] hover:bg-[#c9f1eb] rounded flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[13px]">print</span>
                <span>Imprimer Quittance</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Bottom Operational Intelligence Bar */}
      <div className="bg-[#131b2e] text-white rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-medium">Fluidité Globale</span>
            <span className="font-headline text-lg font-bold text-[#86f2e4]">82% (Optimale)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-medium">Temps Moyen Séjour</span>
            <span className="font-headline text-lg font-bold text-white">48 minutes</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-medium">Attente Moyenne</span>
            <span className="font-headline text-lg font-bold text-amber-400">16 minutes</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block uppercase font-medium">Cadence de Traitement</span>
            <span className="font-headline text-lg font-bold text-white">19.4 consult/h</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => showToast('Plan de régulation automatique rééquilibré vers les box 4 et 5')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-[12px] font-semibold rounded-lg transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Ajuster Flux & Renforts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

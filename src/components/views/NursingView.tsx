import React, { useState } from 'react';
import { NursingTask, MedicationAdministration, Patient } from '../../types';
import { INITIAL_NURSING_TASKS, INITIAL_MED_ADMINS } from '../../data/saasSeedData';
import { ClinicalSelect, SelectOption } from '../common/ClinicalSelect';
import { DataTable, Column, TableBadge, ActionButton, ActionGroup } from '../common/DataTable';
import { PatientVitalSignsTracker } from './PatientVitalSignsTracker';

const CARE_TYPE_OPTIONS: SelectOption[] = [
  { value: 'medication', label: 'Médicament', badge: 'Rx' },
  { value: 'vital_signs', label: 'Prise de constantes', badge: 'Constantes' },
  { value: 'wound_care', label: 'Pansement / Cicatrice', badge: 'Pansement' },
  { value: 'iv_therapy', label: 'Perfusion IV', badge: 'Perf' },
  { value: 'mobility', label: 'Aide au lever / Kiné', badge: 'Mobilité' },
  { value: 'hygiene', label: 'Toilette / Hygiène', badge: 'Hygiène' },
];

interface NursingViewProps {
  patients: Patient[];
  onSelectPatient?: (patient: Patient) => void;
  onUpdatePatient?: (patient: Patient) => void;
}

export const NursingView: React.FC<NursingViewProps> = ({ patients, onSelectPatient, onUpdatePatient }) => {
  const [tasks, setTasks] = useState<NursingTask[]>(INITIAL_NURSING_TASKS);
  const [medAdmins, setMedAdmins] = useState<MedicationAdministration[]>(INITIAL_MED_ADMINS);
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'mar' | 'vitals'>('tasks');
  const [taskFilter, setTaskFilter] = useState<'all' | 'prescribed' | 'assigned' | 'completed' | 'validated'>('all');
  const [taskViewMode, setTaskViewMode] = useState<'table' | 'cards'>('table');
  
  // Selected hospitalized patient for deep dive
  const hospitalizedPatients = patients.filter(p => p.status === 'hospitalized');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(hospitalizedPatients[0]?.id || 'p-4');

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Modals / Actions
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    taskType: 'medication' as NursingTask['taskType'],
    details: '',
    scheduledTime: '12:00'
  });

  const taskTypeIcons: Record<NursingTask['taskType'], { icon: string; label: string }> = {
    vital_signs: { icon: 'vital_signs', label: 'Constantes' },
    medication: { icon: 'medication', label: 'Médicaments' },
    iv_therapy: { icon: 'water_drop', label: 'Perfusion IV' },
    wound_care: { icon: 'healing', label: 'Pansement' },
    hygiene: { icon: 'cleaning_services', label: 'Hygiène' },
    nutrition: { icon: 'restaurant', label: 'Nutrition' },
    mobility: { icon: 'directions_walk', label: 'Mobilité' },
    observation: { icon: 'visibility', label: 'Surveillance' }
  };

  const handleUpdateTaskStatus = (taskId: string, nextStatus: NursingTask['status']) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: nextStatus,
          completionTime: nextStatus === 'completed' || nextStatus === 'validated' ? 'À l\'instant' : t.completionTime,
          validatedBy: nextStatus === 'validated' ? 'Rachid El Mansouri (Major)' : t.validatedBy
        };
      }
      return t;
    }));
  };

  const handleAdministerMed = (adminId: string, status: 'given' | 'skipped' | 'refused') => {
    setMedAdmins(medAdmins.map(m => {
      if (m.id === adminId) {
        return {
          ...m,
          status,
          administeredTime: status === 'given' ? 'À l\'instant' : undefined,
          reasonForOmission: status !== 'given' ? 'Refus patient / avis médical' : undefined
        };
      }
      return m;
    }));
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const created: NursingTask = {
      id: `task-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      roomBed: selectedPatient.currentLocation || 'Chambre Hospitalisation',
      taskType: newTaskData.taskType,
      title: newTaskData.title,
      details: newTaskData.details,
      responsibleNurse: 'Rachid El Mansouri',
      scheduledTime: newTaskData.scheduledTime,
      status: 'assigned'
    };
    setTasks([created, ...tasks]);
    setIsNewTaskOpen(false);
  };

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = taskFilter === 'all' || t.status === taskFilter;
    return matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-[#dae2fd]/70 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#e6f7f5] text-[#006a61]">
            <span className="material-symbols-outlined text-[26px]">vaccines</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-[#0b1c30]">Soins Infirmiers & Plan Thérapeutique</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]">
                Poste Central Infirmier
              </span>
            </div>
            <p className="text-[13px] text-[#45464d]">
              Pilotage des soins programmés, administration des médicaments (MAR) et surveillance des lits d'hospitalisation.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white text-[13px] font-semibold rounded-lg shadow-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add_task</span>
          <span>+ Planifier un Soin</span>
        </button>
      </div>

      {/* Hospitalized Patients Selector Ribbon */}
      <div className="bg-white p-4 rounded-xl border border-[#dae2fd]/70 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-[12px]">
          <span className="font-bold text-[#0b1c30]">Patients Actuellement Hospitalisés (Surveillance Active) :</span>
          <span className="text-[#76777d]">Sélectionnez un patient pour restreindre les feuilles de soins</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {hospitalizedPatients.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPatientId(p.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-[12px] font-medium border transition-all text-left ${
                selectedPatientId === p.id
                  ? 'bg-[#006a61] text-white border-[#006a61] shadow-xs'
                  : 'bg-[#f8f9ff] text-[#0b1c30] border-[#dae2fd]/80 hover:bg-[#eff4ff]'
              }`}
            >
              <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-[10px]">
                {p.gender === 'M' ? 'H' : 'F'}
              </div>
              <div>
                <div className="font-bold leading-tight">{p.name}</div>
                <div className={`text-[10px] ${selectedPatientId === p.id ? 'text-white/80' : 'text-[#76777d]'}`}>
                  {p.currentLocation || 'Hospitalisé'} • {p.cin}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Patient Medical Mini-Passport */}
      {selectedPatient && (
        <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dae2fd]/70 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-[12px]">
          <div>
            <div className="text-[10px] text-[#76777d] uppercase font-bold">Régime Alimentaire</div>
            <div className="font-semibold text-[#0b1c30]">{selectedPatient.diet || 'Normal équilibré'}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#76777d] uppercase font-bold">Mobilité</div>
            <div className="font-semibold text-[#0b1c30]">
              {selectedPatient.mobility === 'bedridden' ? 'Alité strict' : selectedPatient.mobility === 'assisted' ? 'Aide requise' : 'Autonome'}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#76777d] uppercase font-bold">Isolement</div>
            <div className="font-semibold text-[#0b1c30]">
              {selectedPatient.isolationStatus === 'none' || !selectedPatient.isolationStatus ? 'Standard (Aucun)' : 'Isolement Requis'}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#76777d] uppercase font-bold">Groupe Sanguin</div>
            <div className="font-bold text-[#ba1a1a]">{selectedPatient.bloodGroup || 'O+'}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#76777d] uppercase font-bold">Médecin Traitant</div>
            <div className="font-semibold text-[#0b1c30]">{selectedPatient.assignedDoctor}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#76777d] uppercase font-bold">Allergies</div>
            <div className="font-bold text-[#ba1a1a]">
              {selectedPatient.allergies?.join(', ') || 'Aucune connue'}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#e2e8f0] gap-3">
        <button
          onClick={() => setActiveSubTab('tasks')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors ${
            activeSubTab === 'tasks' ? 'border-[#006a61] text-[#006a61]' : 'border-transparent text-[#76777d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">checklist</span>
          <span>Tâches & Plan de Soins ({tasks.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('mar')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors ${
            activeSubTab === 'mar' ? 'border-[#006a61] text-[#006a61]' : 'border-transparent text-[#76777d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">medication</span>
          <span>Administration Médicamenteuse (MAR)</span>
        </button>
        <button
          onClick={() => setActiveSubTab('vitals')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors ${
            activeSubTab === 'vitals' ? 'border-[#006a61] text-[#006a61]' : 'border-transparent text-[#76777d]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">vital_signs</span>
          <span>Constantes & Vitals ({selectedPatient.vitalsHistory?.length || 1})</span>
        </button>
      </div>

      {/* SUBTAB 1: CARE TASKS */}
      {activeSubTab === 'tasks' && (
        <div className="space-y-4">
          {/* Status Filters & View Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {(['all', 'prescribed', 'assigned', 'completed', 'validated'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTaskFilter(f)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                    taskFilter === f
                      ? 'bg-[#006a61] text-white'
                      : 'bg-white text-[#45464d] border border-[#cbd5e1]'
                  }`}
                >
                  {f === 'all' && `Toutes (${tasks.length})`}
                  {f === 'prescribed' && 'Prescrites'}
                  {f === 'assigned' && 'Attribuées'}
                  {f === 'completed' && 'Réalisées'}
                  {f === 'validated' && 'Validées par Major'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0]">
                <button
                  onClick={() => setTaskViewMode('table')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all ${
                    taskViewMode === 'table'
                      ? 'bg-white text-[#006a61] shadow-2xs'
                      : 'text-[#76777d] hover:text-[#0b1c30]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">table_rows</span>
                  <span>Tableau</span>
                </button>
                <button
                  onClick={() => setTaskViewMode('cards')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all ${
                    taskViewMode === 'cards'
                      ? 'bg-white text-[#006a61] shadow-2xs'
                      : 'text-[#76777d] hover:text-[#0b1c30]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">grid_view</span>
                  <span>Cartes</span>
                </button>
              </div>
              <div className="hidden lg:block text-[11px] text-[#76777d]">
                Chaque soin réalisé est horodaté et associé à l'infirmier connecté.
              </div>
            </div>
          </div>

          {taskViewMode === 'table' ? (
            <div className="bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs overflow-hidden">
              <DataTable<NursingTask>
                columns={[
                  {
                    key: 'task',
                    header: 'Soin / Tâche',
                    width: '32%',
                    render: (t) => {
                      const typeInfo = taskTypeIcons[t.taskType];
                      return (
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-md bg-[#e6f7f5] text-[#006a61] shrink-0">
                            <span className="material-symbols-outlined text-[16px]">{typeInfo.icon}</span>
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-[#0b1c30] truncate">{t.title}</div>
                            <div className="text-[11px] text-[#76777d] truncate">{t.details}</div>
                          </div>
                        </div>
                      );
                    },
                  },
                  {
                    key: 'patient',
                    header: 'Patient & Lit',
                    width: '24%',
                    render: (t) => (
                      <div>
                        <div className="font-semibold text-[#0b1c30] truncate">{t.patientName}</div>
                        <div className="text-[11px] text-[#76777d]">{t.roomBed}</div>
                      </div>
                    ),
                  },
                  {
                    key: 'status',
                    header: 'Statut',
                    width: '16%',
                    render: (t) => {
                      if (t.status === 'validated') {
                        return <TableBadge variant="emerald" icon="verified">Validé Major</TableBadge>;
                      }
                      if (t.status === 'completed') {
                        return <TableBadge variant="blue" icon="done">Réalisé</TableBadge>;
                      }
                      return <TableBadge variant="amber" icon="schedule">À Faire</TableBadge>;
                    },
                  },
                  {
                    key: 'time',
                    header: 'Heure & Infirmier',
                    width: '16%',
                    render: (t) => (
                      <div>
                        <div className="font-bold text-[#0b1c30]">{t.scheduledTime}</div>
                        <div className="text-[11px] text-[#76777d] truncate">{t.responsibleNurse}</div>
                      </div>
                    ),
                  },
                  {
                    key: 'actions',
                    header: 'Action',
                    width: '12%',
                    align: 'right',
                    render: (t) => (
                      <ActionGroup align="right" onClick={(e) => e.stopPropagation()}>
                        {t.status !== 'completed' && t.status !== 'validated' && (
                          <ActionButton
                            icon="done"
                            variant="teal"
                            title="Marquer Réalisé"
                            onClick={() => handleUpdateTaskStatus(t.id, 'completed')}
                          />
                        )}
                        {t.status === 'completed' && (
                          <ActionButton
                            icon="verified"
                            variant="emerald"
                            title="Validation Major"
                            onClick={() => handleUpdateTaskStatus(t.id, 'validated')}
                          />
                        )}
                        {t.status === 'validated' && (
                          <span className="text-emerald-600 text-[11px] font-semibold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[15px]">verified</span>
                            Scellé
                          </span>
                        )}
                      </ActionGroup>
                    ),
                  },
                ]}
                data={filteredTasks}
                emptyMessage="Aucune tâche de soin pour ce filtre."
                rowHeight="h-14"
              />
            </div>
          ) : (
          /* Tasks Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map(task => {
              const typeInfo = taskTypeIcons[task.taskType];
              return (
                <div
                  key={task.id}
                  className="bg-white rounded-xl border border-[#dae2fd]/70 p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-lg bg-[#e6f7f5] text-[#006a61]">
                        <span className="material-symbols-outlined text-[20px]">{typeInfo.icon}</span>
                      </span>
                      <div>
                        <div className="font-bold text-[13px] text-[#0b1c30]">{task.title}</div>
                        <div className="text-[11px] text-[#76777d]">
                          {task.patientName} • {task.roomBed}
                        </div>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      task.status === 'validated'
                        ? 'bg-[#dcfce7] text-[#15803d]'
                        : task.status === 'completed'
                        ? 'bg-[#eff4ff] text-[#188ace]'
                        : 'bg-[#fef9c3] text-[#854d0e]'
                    }`}>
                      {task.status === 'validated' ? 'Validé Major' : task.status === 'completed' ? 'Réalisé' : 'À Faire'}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#45464d] bg-[#f8f9ff] p-2.5 rounded-lg border border-[#dae2fd]/50">
                    {task.details}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-[#76777d] pt-2 border-t border-[#f1f5f9]">
                    <span>Prévu à : <strong className="text-[#0b1c30]">{task.scheduledTime}</strong></span>
                    <span>Infirmier : {task.responsibleNurse}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {task.status !== 'completed' && task.status !== 'validated' && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                        className="px-3 py-1.5 bg-[#006a61] hover:bg-[#00544d] text-white text-[11px] font-semibold rounded-lg shadow-2xs flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">done</span>
                        <span>Marquer Réalisé</span>
                      </button>
                    )}

                    {task.status === 'completed' && (
                      <button
                        onClick={() => handleUpdateTaskStatus(task.id, 'validated')}
                        className="px-3 py-1.5 bg-[#15803d] hover:bg-[#166534] text-white text-[11px] font-semibold rounded-lg shadow-2xs flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        <span>Validation Major</span>
                      </button>
                    )}

                    {task.status === 'validated' && (
                      <span className="text-[11px] text-[#15803d] font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Soin scellé dans le dossier</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: MEDICATION ADMINISTRATION (MAR) */}
      {activeSubTab === 'mar' && (
        <div className="bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs overflow-hidden">
          <div className="p-4 bg-[#f8f9ff] border-b border-[#e2e8f0] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[14px] text-[#0b1c30]">Plan d'Administration Thérapeutique (MAR)</h3>
              <p className="text-[11px] text-[#76777d]">Traçabilité des prises médicamenteuses prescrites par voie IV, SC et orale.</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#e6f7f5] text-[#006a61] text-[11px] font-bold">
              Règle des 5B (Bon patient, Bon médicament, Bonne dose, Bonne voie, Bon moment)
            </span>
          </div>

          <DataTable<MedicationAdministration>
            columns={[
              {
                key: 'patient',
                header: 'Patient',
                width: '18%',
                render: (med) => <span className="font-semibold text-[#0b1c30]">{med.patientName}</span>,
              },
              {
                key: 'medication',
                header: 'Médicament & Forme',
                width: '24%',
                render: (med) => (
                  <div>
                    <div className="font-semibold text-[#006a61] truncate">{med.medication}</div>
                    <div className="text-[11px] text-[#76777d] truncate">{med.frequency}</div>
                  </div>
                ),
              },
              {
                key: 'dose',
                header: 'Dose & Voie',
                width: '16%',
                render: (med) => (
                  <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#188ace] font-mono text-[11px]">
                    {med.dose} • {med.route}
                  </span>
                ),
              },
              {
                key: 'scheduledTime',
                header: 'Heure Programmée',
                width: '12%',
                render: (med) => <span className="font-bold text-[#0b1c30]">{med.scheduledTime}</span>,
              },
              {
                key: 'status',
                header: 'Statut Prise',
                width: '14%',
                render: (med) => {
                  if (med.status === 'given') return <TableBadge variant="emerald" icon="check">Administré</TableBadge>;
                  if (med.status === 'skipped') return <TableBadge variant="red" icon="close">Omis</TableBadge>;
                  if (med.status === 'refused') return <TableBadge variant="red" icon="block">Refusé</TableBadge>;
                  return <TableBadge variant="amber" icon="schedule">À Administrer</TableBadge>;
                },
              },
              {
                key: 'nurse',
                header: 'Infirmier',
                width: '12%',
                render: (med) => <span className="text-[#45464d] text-[11px]">{med.nurse}</span>,
              },
              {
                key: 'actions',
                header: 'Action Administration',
                width: '14%',
                align: 'right',
                render: (med) => (
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {med.status === 'scheduled' ? (
                      <>
                        <button
                          onClick={() => handleAdministerMed(med.id, 'given')}
                          className="px-2.5 py-1 bg-[#15803d] hover:bg-[#166534] text-white text-[11px] font-semibold rounded-md shadow-2xs"
                        >
                          Donné
                        </button>
                        <button
                          onClick={() => handleAdministerMed(med.id, 'refused')}
                          className="px-2 py-1 bg-[#f1f5f9] hover:bg-[#fee2e2] text-[#b91c1c] text-[11px] rounded-md"
                        >
                          Non administré
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-[#76777d] italic">
                        {med.status === 'given' ? `Horodaté ${med.administeredTime}` : med.reasonForOmission}
                      </span>
                    )}
                  </div>
                ),
              },
            ]}
            data={medAdmins}
            emptyMessage="Aucune administration programmée."
            rowHeight="h-14"
          />
        </div>
      )}

      {/* SUBTAB 3: VITALS SIGNS TRACKING */}
      {activeSubTab === 'vitals' && (
        <PatientVitalSignsTracker
          patient={selectedPatient}
          onUpdatePatient={(updated) => {
            if (onUpdatePatient) onUpdatePatient(updated);
            if (onSelectPatient) onSelectPatient(updated);
          }}
        />
      )}

      {/* Plan New Care Task Modal */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-[16px] text-[#0b1c30]">Planifier une Tâche Infirmière</h3>
              <button
                onClick={() => setIsNewTaskOpen(false)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 pt-4 text-[12px]">
              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Patient</label>
                <div className="p-2.5 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg font-semibold text-[#006a61]">
                  {selectedPatient.name} ({selectedPatient.currentLocation})
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Type de soin</label>
                  <ClinicalSelect
                    value={newTaskData.taskType}
                    onChange={(val) => setNewTaskData({ ...newTaskData, taskType: val as NursingTask['taskType'] })}
                    options={CARE_TYPE_OPTIONS}
                    fullWidth
                    size="lg"
                    searchable={false}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Heure prévue</label>
                  <input
                    type="time"
                    value={newTaskData.scheduledTime}
                    onChange={(e) => setNewTaskData({ ...newTaskData, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Intitulé du soin</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Perfusion antalgique IV, Changement pansement J+1..."
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Consignes et détails infirmiers</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Précisez la posologie, les recommandations de surveillance..."
                  value={newTaskData.details}
                  onChange={(e) => setNewTaskData({ ...newTaskData, details: e.target.value })}
                  className="w-full p-2.5 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                />
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-4 py-2 text-[#45464d] hover:bg-[#f1f5f9] rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg font-semibold shadow-xs"
                >
                  Enregistrer la tâche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

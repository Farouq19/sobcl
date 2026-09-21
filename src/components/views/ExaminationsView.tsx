import React, { useState } from 'react';
import { ExaminationRequest, Patient, UserRole } from '../../types';
import { INITIAL_EXAMINATIONS } from '../../data/saasSeedData';
import { ClinicalSelect, SelectOption } from '../common/ClinicalSelect';
import { DataTable, Column, TableBadge } from '../common/DataTable';

const STATUS_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Tous statuts' },
  { value: 'requested', label: 'Demande émise', badge: 'Émis' },
  { value: 'scheduled', label: 'Planifié', badge: 'RDV' },
  { value: 'performed', label: 'Réalisé', badge: 'Fait' },
  { value: 'result_entered', label: 'Résultat saisi', badge: 'Saisi' },
  { value: 'validated', label: 'Validé', badge: 'Validé' },
];

const TYPE_OPTIONS: SelectOption[] = [
  { value: 'laboratory', label: "Laboratoire d'analyses", badge: 'Bio' },
  { value: 'radiology', label: 'Radiologie / Imagerie', badge: 'Radio' },
];

const URGENCY_OPTIONS: SelectOption[] = [
  { value: 'normal', label: 'Normal / Routine' },
  { value: 'urgent', label: 'Urgent (< 2h)', badge: 'Urgent' },
  { value: 'vital', label: 'VITAL / Immédiat', badge: 'Vital' },
];

interface ExaminationsViewProps {
  patients: Patient[];
  currentUserRole: UserRole;
  onSelectPatient?: (patient: Patient) => void;
}

export const ExaminationsView: React.FC<ExaminationsViewProps> = ({
  patients,
  currentUserRole
}) => {
  const [examinations, setExaminations] = useState<ExaminationRequest[]>(INITIAL_EXAMINATIONS);
  const [activeTab, setActiveTab] = useState<'all' | 'laboratory' | 'radiology' | 'critical'>('all');
  const [selectedExam, setSelectedExam] = useState<ExaminationRequest | null>(INITIAL_EXAMINATIONS[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isResultEntryOpen, setIsResultEntryOpen] = useState(false);

  // New Request Form State
  const [newRequest, setNewRequest] = useState({
    patientId: patients[0]?.id || '',
    type: 'laboratory' as 'laboratory' | 'radiology',
    category: 'Biologie Sanguine',
    examinationName: '',
    modality: 'Scanner',
    urgency: 'normal' as 'normal' | 'urgent' | 'vital'
  });

  // Result entry state
  const [resultReport, setResultReport] = useState('');

  const statusBadges: Record<ExaminationRequest['status'], { label: string; color: string }> = {
    requested: { label: 'Demande Émise', color: 'bg-[#eff4ff] text-[#188ace] border-[#dae2fd]' },
    scheduled: { label: 'Planifié', color: 'bg-[#fef9c3] text-[#854d0e] border-[#fef08a]' },
    patient_arrived: { label: 'Patient Arrivé', color: 'bg-[#e0e7ff] text-[#4338ca] border-[#c7d2fe]' },
    performed: { label: 'Réalisé / Prélevé', color: 'bg-[#fae8ff] text-[#86198f] border-[#f5d0fe]' },
    result_entered: { label: 'Résultats Saisis', color: 'bg-[#ffedd5] text-[#c2410c] border-[#fed7aa]' },
    validated: { label: 'Validé Biologiquement / Radio', color: 'bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]' }
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find(p => p.id === newRequest.patientId);
    if (!patientObj) return;

    const created: ExaminationRequest = {
      id: `exam-${Date.now()}`,
      patientId: patientObj.id,
      patientName: patientObj.name,
      patientCin: patientObj.cin,
      type: newRequest.type,
      category: newRequest.category,
      examinationName: newRequest.examinationName,
      modality: newRequest.type === 'radiology' ? newRequest.modality : undefined,
      requestingDoctor: 'Dr. Layla Zahiri',
      requestDate: 'Aujourd\'hui (À l\'instant)',
      sampleId: newRequest.type === 'laboratory' ? `TUBE-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
      urgency: newRequest.urgency,
      status: 'requested'
    };

    setExaminations([created, ...examinations]);
    setSelectedExam(created);
    setIsRequestModalOpen(false);
  };

  const handleAdvanceStatus = (examId: string, nextStatus: ExaminationRequest['status']) => {
    setExaminations(examinations.map(ex => {
      if (ex.id === examId) {
        const updated: ExaminationRequest = {
          ...ex,
          status: nextStatus,
          validatedBy: nextStatus === 'validated' ? (ex.type === 'laboratory' ? 'Dr. Youssef Berrada' : 'Dr. Salma Kabbaj') : ex.validatedBy,
          validationDate: nextStatus === 'validated' ? 'Aujourd\'hui (Validé)' : ex.validationDate
        };
        if (selectedExam?.id === examId) setSelectedExam(updated);
        return updated;
      }
      return ex;
    }));
  };

  const handleSaveResult = () => {
    if (!selectedExam) return;
    const updated: ExaminationRequest = {
      ...selectedExam,
      report: resultReport,
      status: 'result_entered'
    };
    setExaminations(examinations.map(e => e.id === selectedExam.id ? updated : e));
    setSelectedExam(updated);
    setIsResultEntryOpen(false);
  };

  const filteredExams = examinations.filter(ex => {
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'laboratory' && ex.type === 'laboratory') ||
      (activeTab === 'radiology' && ex.type === 'radiology') ||
      (activeTab === 'critical' && (ex.urgency === 'vital' || ex.parameters?.some(p => p.status === 'critical')));

    const matchesStatus = statusFilter === 'all' || ex.status === statusFilter;
    const q = (searchQuery || '').toLowerCase();
    const matchesSearch =
      (ex.patientName || '').toLowerCase().includes(q) ||
      (ex.patientCin || '').toLowerCase().includes(q) ||
      (ex.examinationName || '').toLowerCase().includes(q) ||
      (ex.category || '').toLowerCase().includes(q);

    return matchesTab && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-[#dae2fd]/70 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#e6f7f5] text-[#006a61]">
            <span className="material-symbols-outlined text-[26px]">biotech</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-[#0b1c30]">Plateau Technique des Examens</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#188ace] border border-[#cbd5e1]">
                Laboratoire & Imagerie
              </span>
            </div>
            <p className="text-[13px] text-[#45464d]">
              Gestion du flux complet : Prescription médicale → Acheminement → Réalisation → Saisie → Validation biologique & radiologique.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsRequestModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#006a61] hover:bg-[#00544d] transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Prescrire un Examen</span>
        </button>
      </div>

      {/* Stats Quick Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[12px]">
        <div className="bg-white p-3.5 rounded-xl border border-[#dae2fd]/70 shadow-2xs">
          <div className="text-[#76777d] text-[11px] font-medium">Demandes en attente</div>
          <div className="text-[18px] font-bold text-[#188ace]">
            {examinations.filter(e => e.status === 'requested' || e.status === 'scheduled').length}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#dae2fd]/70 shadow-2xs">
          <div className="text-[#76777d] text-[11px] font-medium">En cours de réalisation</div>
          <div className="text-[18px] font-bold text-[#c2410c]">
            {examinations.filter(e => e.status === 'performed' || e.status === 'patient_arrived').length}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#dae2fd]/70 shadow-2xs">
          <div className="text-[#76777d] text-[11px] font-medium">Résultats à valider</div>
          <div className="text-[18px] font-bold text-[#854d0e]">
            {examinations.filter(e => e.status === 'result_entered').length}
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#dae2fd]/70 shadow-2xs">
          <div className="text-[#76777d] text-[11px] font-medium">Alertes Critiques / Vital</div>
          <div className="text-[18px] font-bold text-[#ba1a1a] flex items-center gap-1">
            <span>{examinations.filter(e => e.urgency === 'vital').length}</span>
            <span className="material-symbols-outlined text-[16px] animate-pulse">warning</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-[#e2e8f0] pb-2">
        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors ${
              activeTab === 'all' ? 'bg-[#006a61] text-white' : 'bg-white text-[#45464d] border border-[#cbd5e1]'
            }`}
          >
            Tous les Examens ({examinations.length})
          </button>
          <button
            onClick={() => setActiveTab('laboratory')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors ${
              activeTab === 'laboratory' ? 'bg-[#006a61] text-white' : 'bg-white text-[#45464d] border border-[#cbd5e1]'
            }`}
          >
            Laboratoire ({examinations.filter(e => e.type === 'laboratory').length})
          </button>
          <button
            onClick={() => setActiveTab('radiology')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors ${
              activeTab === 'radiology' ? 'bg-[#006a61] text-white' : 'bg-white text-[#45464d] border border-[#cbd5e1]'
            }`}
          >
            Radiologie ({examinations.filter(e => e.type === 'radiology').length})
          </button>
          <button
            onClick={() => setActiveTab('critical')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors ${
              activeTab === 'critical' ? 'bg-[#ba1a1a] text-white' : 'bg-white text-[#ba1a1a] border border-[#ba1a1a]/40'
            }`}
          >
            Critiques & Urgences
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#76777d] text-[16px]">
              search
            </span>
            <input
              type="text"
              placeholder="Patient, CIN, Examen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-[12px] bg-white border border-[#cbd5e1] rounded-lg outline-hidden focus:border-[#006a61]"
            />
          </div>

          <ClinicalSelect
            value={statusFilter}
            onChange={(val) => setStatusFilter(val)}
            options={STATUS_OPTIONS}
            size="md"
            className="min-w-[170px]"
            searchable={false}
          />
        </div>
      </div>

      {/* Main Content: Split List and Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Examination Requests Table */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs overflow-hidden flex flex-col">
          <div className="p-3.5 bg-[#f8f9ff] border-b border-[#e2e8f0] font-bold text-[13px] text-[#0b1c30] flex items-center justify-between">
            <span>Demandes d'Examens ({filteredExams.length})</span>
            <span className="text-[11px] font-normal text-[#76777d]">Sélectionnez un examen pour inspecter</span>
          </div>

          <DataTable<ExaminationRequest>
            columns={[
              {
                key: 'exam',
                header: 'Examen & Type',
                width: '38%',
                render: (exam) => (
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                        exam.type === 'laboratory' ? 'bg-[#eff4ff] text-[#188ace]' : 'bg-[#fae8ff] text-[#86198f]'
                      }`}>
                        {exam.type === 'laboratory' ? 'Labo' : 'Radio'}
                      </span>
                      <span className="font-bold text-[#0b1c30] truncate">{exam.examinationName}</span>
                      {exam.urgency === 'vital' && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#fee2e2] text-[#ba1a1a] animate-pulse">
                          VITAL
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#76777d] truncate">
                      {exam.category}
                    </div>
                  </div>
                ),
              },
              {
                key: 'patient',
                header: 'Patient & CIN',
                width: '28%',
                render: (exam) => (
                  <div>
                    <div className="font-semibold text-[#0b1c30] truncate">{exam.patientName}</div>
                    <div className="text-[11px] text-[#76777d]">CIN: {exam.patientCin}</div>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Statut',
                width: '18%',
                render: (exam) => {
                  const statusInfo = statusBadges[exam.status];
                  const variantMap: Record<ExaminationRequest['status'], 'blue' | 'amber' | 'emerald' | 'purple' | 'neutral'> = {
                    requested: 'blue',
                    scheduled: 'amber',
                    patient_arrived: 'purple',
                    performed: 'purple',
                    result_entered: 'amber',
                    validated: 'emerald',
                  };
                  return (
                    <TableBadge variant={variantMap[exam.status] || 'neutral'}>
                      {statusInfo.label}
                    </TableBadge>
                  );
                },
              },
              {
                key: 'doctor',
                header: 'Prescripteur & Date',
                width: '16%',
                align: 'right',
                render: (exam) => (
                  <div className="text-right">
                    <div className="text-[11px] font-medium text-[#0b1c30] truncate">{exam.requestingDoctor}</div>
                    <div className="text-[10px] text-[#76777d]">{exam.requestDate}</div>
                  </div>
                ),
              },
            ]}
            data={filteredExams}
            onRowClick={(exam) => setSelectedExam(exam)}
            emptyMessage="Aucun examen ne correspond aux filtres sélectionnés."
            rowHeight="h-14"
          />
        </div>

        {/* Right Column: Detailed Exam Inspector & Workflow Actions */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs p-5 space-y-4">
          {selectedExam ? (
            <>
              {/* Header */}
              <div className="pb-3 border-b border-[#e2e8f0]">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadges[selectedExam.status].color}`}>
                    {statusBadges[selectedExam.status].label}
                  </span>
                  <span className="text-[11px] text-[#76777d]">ID : {selectedExam.id}</span>
                </div>
                <h2 className="text-[16px] font-bold text-[#0b1c30] mt-2">{selectedExam.examinationName}</h2>
                <div className="text-[12px] text-[#45464d] mt-0.5">
                  Catégorie : <span className="font-semibold text-[#0b1c30]">{selectedExam.category}</span>
                </div>
              </div>

              {/* Patient and Sample Meta */}
              <div className="bg-[#f8f9ff] p-3.5 rounded-lg border border-[#dae2fd]/60 space-y-1.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#76777d]">Patient :</span>
                  <span className="font-bold text-[#0b1c30]">{selectedExam.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76777d]">CIN :</span>
                  <span className="font-mono text-[#0b1c30]">{selectedExam.patientCin}</span>
                </div>
                {selectedExam.sampleId && (
                  <div className="flex justify-between">
                    <span className="text-[#76777d]">Échantillon Tube :</span>
                    <span className="font-mono font-bold text-[#006a61]">{selectedExam.sampleId}</span>
                  </div>
                )}
                {selectedExam.modality && (
                  <div className="flex justify-between">
                    <span className="text-[#76777d]">Modalité Imagerie :</span>
                    <span className="font-semibold text-[#86198f]">{selectedExam.modality}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#76777d]">Médecin Prescripteur :</span>
                  <span className="text-[#0b1c30]">{selectedExam.requestingDoctor}</span>
                </div>
              </div>

              {/* Parameters Table if Lab */}
              {selectedExam.type === 'laboratory' && selectedExam.parameters && selectedExam.parameters.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[12px] font-bold text-[#0b1c30]">Résultats Paramétriques :</div>
                  <div className="border border-[#e2e8f0] rounded-lg overflow-hidden text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-[#f8f9ff] text-[#76777d] font-semibold border-b border-[#e2e8f0]">
                        <tr>
                          <th className="py-2 px-2.5">Paramètre</th>
                          <th className="py-2 px-2 text-right">Valeur</th>
                          <th className="py-2 px-2 text-right">Norme</th>
                          <th className="py-2 px-2 text-center">Statut</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9]">
                        {selectedExam.parameters.map((p, idx) => (
                          <tr key={idx} className={p.status === 'critical' ? 'bg-[#fee2e2]/60' : ''}>
                            <td className="py-2 px-2.5 font-medium text-[#0b1c30]">{p.name}</td>
                            <td className="py-2 px-2 text-right font-bold text-[#0b1c30]">
                              {p.value} {p.unit}
                            </td>
                            <td className="py-2 px-2 text-right text-[#76777d]">{p.referenceRange}</td>
                            <td className="py-2 px-2 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                p.status === 'critical'
                                  ? 'bg-[#ba1a1a] text-white animate-pulse'
                                  : p.status === 'high' || p.status === 'low'
                                  ? 'bg-[#fef08a] text-[#854d0e]'
                                  : 'bg-[#dcfce7] text-[#15803d]'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Report Text if available */}
              {selectedExam.report && (
                <div className="space-y-1.5">
                  <div className="text-[12px] font-bold text-[#0b1c30]">Compte-Rendu & Interprétation :</div>
                  <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#dae2fd]/60 text-[12px] text-[#0b1c30] leading-relaxed">
                    {selectedExam.report}
                  </div>
                </div>
              )}

              {/* Validation Stamp */}
              {selectedExam.validatedBy && (
                <div className="p-3 rounded-lg bg-[#e6f7f5] border border-[#86f2e4]/70 flex items-center gap-2.5 text-[11px] text-[#006a61]">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <div>
                    <div className="font-bold">Validation Électronique Certifiée</div>
                    <div>Signé par {selectedExam.validatedBy} — {selectedExam.validationDate}</div>
                  </div>
                </div>
              )}

              {/* Workflow Action Buttons */}
              <div className="pt-3 border-t border-[#e2e8f0] space-y-2">
                <div className="text-[11px] font-semibold text-[#76777d] uppercase">Actions du Cycle d'Examen :</div>
                <div className="flex flex-wrap gap-2">
                  {selectedExam.status === 'requested' && (
                    <button
                      onClick={() => handleAdvanceStatus(selectedExam.id, 'scheduled')}
                      className="px-3 py-1.5 bg-[#188ace] hover:bg-[#0070ba] text-white text-[11px] font-semibold rounded-lg shadow-xs"
                    >
                      Planifier le prélèvement / RDV
                    </button>
                  )}

                  {selectedExam.status === 'scheduled' && (
                    <button
                      onClick={() => handleAdvanceStatus(selectedExam.id, 'performed')}
                      className="px-3 py-1.5 bg-[#86198f] hover:bg-[#701a75] text-white text-[11px] font-semibold rounded-lg shadow-xs"
                    >
                      Confirmer la réalisation / Tube prélevé
                    </button>
                  )}

                  {selectedExam.status === 'performed' && (
                    <button
                      onClick={() => {
                        setResultReport(selectedExam.report || '');
                        setIsResultEntryOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#c2410c] hover:bg-[#9a3412] text-white text-[11px] font-semibold rounded-lg shadow-xs"
                    >
                      Saisir les Résultats & Compte-Rendu
                    </button>
                  )}

                  {selectedExam.status === 'result_entered' && (
                    <button
                      onClick={() => handleAdvanceStatus(selectedExam.id, 'validated')}
                      className="px-3 py-1.5 bg-[#006a61] hover:bg-[#00544d] text-white text-[11px] font-semibold rounded-lg shadow-xs flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Valider Définitivement (Signature Numérique)</span>
                    </button>
                  )}

                  {selectedExam.status === 'validated' && (
                    <div className="text-[11px] text-[#15803d] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      <span>Examen clôturé et transmis au dossier médical du patient.</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-[#76777d]">
              Sélectionnez un examen pour afficher les détails.
            </div>
          )}
        </div>
      </div>

      {/* MODAL: Prescribe Exam */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-[16px] text-[#0b1c30]">Prescrire un Examen Médical</h3>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 pt-4 text-[12px]">
              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Patient concerné</label>
                <ClinicalSelect
                  value={newRequest.patientId}
                  onChange={(val) => setNewRequest({ ...newRequest, patientId: val })}
                  options={patients.map(p => ({
                    value: p.id,
                    label: `${p.name} (CIN: ${p.cin})`,
                    sublabel: `${p.specialty || 'Général'} • ${p.currentLocation || 'Box'}`
                  }))}
                  fullWidth
                  searchable={true}
                  searchPlaceholder="Rechercher un patient ou CIN..."
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Type d'examen</label>
                  <ClinicalSelect
                    value={newRequest.type}
                    onChange={(val) => setNewRequest({ ...newRequest, type: val as 'laboratory' | 'radiology' })}
                    options={TYPE_OPTIONS}
                    fullWidth
                    size="lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Degré d'urgence</label>
                  <ClinicalSelect
                    value={newRequest.urgency}
                    onChange={(val) => setNewRequest({ ...newRequest, urgency: val as 'normal' | 'urgent' | 'vital' })}
                    options={URGENCY_OPTIONS}
                    fullWidth
                    size="lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Libellé de l'examen</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Troponine ultra-sensible, Scanner TAP, Écho Doppler..."
                  value={newRequest.examinationName}
                  onChange={(e) => setNewRequest({ ...newRequest, examinationName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Catégorie technique</label>
                <input
                  type="text"
                  placeholder="ex: Biochimie, Hématologie, Scanner Numérique"
                  value={newRequest.category}
                  onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                />
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 text-[#45464d] hover:bg-[#f1f5f9] rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg font-semibold shadow-xs"
                >
                  Émettre la demande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Enter Results */}
      {isResultEntryOpen && selectedExam && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-[16px] text-[#0b1c30]">
                Saisie des Résultats : {selectedExam.examinationName}
              </h3>
              <button
                onClick={() => setIsResultEntryOpen(false)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4 pt-4 text-[12px]">
              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Compte-rendu d'interprétation / Valeurs</label>
                <textarea
                  rows={4}
                  value={resultReport}
                  onChange={(e) => setResultReport(e.target.value)}
                  placeholder="Saisir l'analyse biologique ou le compte-rendu radiologique détaillé..."
                  className="w-full p-3 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                />
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
                <button
                  onClick={() => setIsResultEntryOpen(false)}
                  className="px-4 py-2 text-[#45464d] hover:bg-[#f1f5f9] rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveResult}
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg font-semibold shadow-xs"
                >
                  Enregistrer les résultats
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

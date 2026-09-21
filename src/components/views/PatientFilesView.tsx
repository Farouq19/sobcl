import React, { useState } from 'react';
import { Patient, ViewMode } from '../../types';
import { DataTable, Column, TableBadge, ActionButton, ActionGroup } from '../common/DataTable';

interface PatientFilesViewProps {
  patients: Patient[];
  selectedPatient: Patient;
  onSelectPatient: (patient: Patient) => void;
  onNavigate: (view: ViewMode) => void;
  onOpenAmoCheck: () => void;
}

export const PatientFilesView: React.FC<PatientFilesViewProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onNavigate,
  onOpenAmoCheck
}) => {
  const [activeTab, setActiveTab] = useState<'consultations' | 'hospitalisations' | 'examens' | 'ordonnances' | 'factures'>('consultations');
  const [filterTag, setFilterTag] = useState<'all' | 'active' | 'amo' | 'hosp'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [patientViewMode, setPatientViewMode] = useState<'dossier' | 'table'>('table');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const filteredPatients = patients.filter((p) => {
    const q = (searchFilter || '').toLowerCase();
    const matchesSearch = (p?.name || '').toLowerCase().includes(q) ||
      (p?.cin || '').toLowerCase().includes(q) ||
      (p?.phone || '').includes(searchFilter);
    if (!matchesSearch) return false;
    if (filterTag === 'active') return p.status === 'consultation' || p.status === 'waiting' || p.status === 'calling';
    if (filterTag === 'hosp') return p.status === 'hospitalized';
    if (filterTag === 'amo') return p.amoType !== 'Privé';
    return true;
  });

  return (
    <div className="space-y-4 pb-12">
      {/* Toast */}
      {feedbackToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#dae2fd]/30 flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-[#86f2e4] text-[18px]">check_circle</span>
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Top Banner & View Mode Toggle */}
      <div className="bg-white rounded-xl border border-[#dae2fd]/70 p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#e6f7f5] text-[#006a61]">
            <span className="material-symbols-outlined text-[24px]">folder_shared</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[16px] font-bold text-[#0b1c30]">Dossiers Médicaux Partagés & Annuaire</h1>
              <span className="text-[10px] font-bold bg-[#eff4ff] text-[#188ace] px-2 py-0.5 rounded-full">
                {patients.length} patients actifs
              </span>
            </div>
            <p className="text-[11px] text-[#76777d]">
              Recherche instantanée CIN, suivi clinique 360°, conformité CNDP & éligibilité AMO.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0]">
            <button
              onClick={() => setPatientViewMode('table')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-md flex items-center gap-1.5 transition-all ${
                patientViewMode === 'table'
                  ? 'bg-white text-[#006a61] shadow-2xs'
                  : 'text-[#76777d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              <span>Tableau Annuaire</span>
            </button>
            <button
              onClick={() => setPatientViewMode('dossier')}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-md flex items-center gap-1.5 transition-all ${
                patientViewMode === 'dossier'
                  ? 'bg-white text-[#006a61] shadow-2xs'
                  : 'text-[#76777d] hover:text-[#0b1c30]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">contact_page</span>
              <span>Fiche Dossier 360°</span>
            </button>
          </div>

          <button
            onClick={() => showToast('Scanner CIN ou téléversement de la pièce d\'identité')}
            className="px-3 py-1.5 bg-[#e6f7f5] hover:bg-[#c9f1eb] text-[#006a61] text-[11px] font-semibold rounded-lg border border-[#86f2e4]/70 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[15px]">document_scanner</span>
            <span>Scanner CIN</span>
          </button>
        </div>
      </div>

      {patientViewMode === 'table' ? (
        <div className="bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-[#f8f9ff] border-b border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#76777d] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Rechercher par Nom, CIN, N° Téléphone..."
                className="w-full pl-8.5 pr-3 py-1.5 bg-white text-[12px] text-[#0b1c30] placeholder-[#76777d] rounded-lg border border-[#dae2fd] focus:border-[#006a61] outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterTag('all')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                  filterTag === 'all' ? 'bg-[#131b2e] text-white' : 'bg-white text-[#45464d] border border-[#cbd5e1]'
                }`}
              >
                Tous ({patients.length})
              </button>
              <button
                onClick={() => setFilterTag('active')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                  filterTag === 'active' ? 'bg-[#006a61] text-white' : 'bg-white text-[#45464d] border border-[#cbd5e1]'
                }`}
              >
                Actifs ce jour
              </button>
              <button
                onClick={() => setFilterTag('amo')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                  filterTag === 'amo' ? 'bg-[#006a61] text-white' : 'bg-white text-[#45464d] border border-[#cbd5e1]'
                }`}
              >
                AMO Validée
              </button>
              <button
                onClick={() => setFilterTag('hosp')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                  filterTag === 'hosp' ? 'bg-purple-800 text-white' : 'bg-white text-[#45464d] border border-[#cbd5e1]'
                }`}
              >
                Hospitalisés
              </button>
            </div>
          </div>

          <DataTable<Patient>
            columns={[
              {
                key: 'patient',
                header: 'Patient (Nom & Ticket)',
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
                      <div className="h-8 w-8 rounded-full bg-[#e6f7f5] text-[#006a61] font-bold text-[12px] flex items-center justify-center shrink-0">
                        {p.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-[#0b1c30] truncate flex items-center gap-1.5">
                        <span>{p.name}</span>
                        {p.ticketNumber && (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded font-bold bg-[#eff4ff] text-[#006a61]">
                            {p.ticketNumber}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#76777d] truncate">
                        {p.gender === 'F' ? 'Femme' : 'Homme'} • {p.age} ans
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'cin',
                header: 'CIN & Contact',
                width: '18%',
                render: (p) => (
                  <div>
                    <div className="font-mono font-bold text-[#0b1c30]">{p.cin}</div>
                    <div className="text-[11px] text-[#76777d]">{p.phone || '0661-000000'}</div>
                  </div>
                ),
              },
              {
                key: 'amo',
                header: 'Couverture AMO',
                width: '16%',
                render: (p) => (
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    p.amoType === 'CNSS'
                      ? 'bg-blue-100 text-blue-800'
                      : p.amoType === 'CNOPS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : p.amoType === 'Tadamon'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {p.amoType}
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Statut Clinique',
                width: '16%',
                render: (p) => {
                  if (p.status === 'hospitalized') return <TableBadge variant="purple" dot>Hospitalisé</TableBadge>;
                  if (p.status === 'consultation') return <TableBadge variant="emerald" dot>En Consultation</TableBadge>;
                  if (p.status === 'waiting' || p.status === 'calling') return <TableBadge variant="amber" dot>En Attente</TableBadge>;
                  return <TableBadge variant="neutral">Enregistré</TableBadge>;
                },
              },
              {
                key: 'doctor',
                header: 'Médecin Traitant',
                width: '14%',
                render: (p) => (
                  <span className="text-[12px] text-[#0b1c30] font-medium truncate block">
                    {p.assignedDoctor || 'Dr. El Alami'}
                  </span>
                ),
              },
              {
                key: 'actions',
                header: 'Dossier',
                width: '8%',
                align: 'right',
                render: (p) => (
                  <ActionGroup align="right" onClick={(e) => e.stopPropagation()}>
                    <ActionButton
                      icon="folder_open"
                      variant="teal"
                      title="Ouvrir Fiche 360°"
                      onClick={() => {
                        onSelectPatient(p);
                        setPatientViewMode('dossier');
                      }}
                    />
                  </ActionGroup>
                ),
              },
            ]}
            data={filteredPatients}
            onRowClick={(p) => {
              onSelectPatient(p);
              setPatientViewMode('dossier');
            }}
            emptyMessage="Aucun patient trouvé avec ces critères de recherche."
            rowHeight="h-14"
          />
        </div>
      ) : (
      /* Main Grid: Left Directory (1/3) + Right 360 File (2/3) */
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Directory Panel */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-2xs border border-[#e2e8f0] flex flex-col h-[calc(100vh-140px)] min-h-[640px]">
          {/* Header */}
          <div className="p-4 border-b border-[#f1f5f9] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline text-base font-bold text-[#0b1c30] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#006a61] text-[20px]">folder_shared</span>
                  Annuaire Médical
                </h2>
                <span className="text-[11px] text-[#76777d]">1 428 dossiers enregistrés</span>
              </div>
              <button
                onClick={() => showToast('Scanner CIN ou téléversement de la pièce d\'identité')}
                className="px-2.5 py-1.5 bg-[#e6f7f5] hover:bg-[#c9f1eb] text-[#006a61] text-[11px] font-semibold rounded-lg border border-[#86f2e4]/70 transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">document_scanner</span>
                <span>Scanner CIN</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#76777d] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Nom, CIN, N° Téléphone..."
                className="w-full pl-8.5 pr-3 py-1.5 bg-[#f8f9ff] text-[12px] text-[#0b1c30] placeholder-[#76777d] rounded-lg border border-[#dae2fd] focus:border-[#006a61] outline-hidden"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              <button
                onClick={() => setFilterTag('all')}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-md whitespace-nowrap transition-colors ${
                  filterTag === 'all' ? 'bg-[#131b2e] text-white' : 'bg-[#f1f5f9] text-[#45464d] hover:bg-[#e2e8f0]'
                }`}
              >
                Tous ({patients.length})
              </button>
              <button
                onClick={() => setFilterTag('active')}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-md whitespace-nowrap transition-colors ${
                  filterTag === 'active' ? 'bg-[#006a61] text-white' : 'bg-[#f1f5f9] text-[#45464d] hover:bg-[#e2e8f0]'
                }`}
              >
                Actifs ce jour
              </button>
              <button
                onClick={() => setFilterTag('amo')}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-md whitespace-nowrap transition-colors ${
                  filterTag === 'amo' ? 'bg-[#006a61] text-white' : 'bg-[#f1f5f9] text-[#45464d] hover:bg-[#e2e8f0]'
                }`}
              >
                AMO validée
              </button>
              <button
                onClick={() => setFilterTag('hosp')}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-md whitespace-nowrap transition-colors ${
                  filterTag === 'hosp' ? 'bg-purple-800 text-white' : 'bg-[#f1f5f9] text-[#45464d] hover:bg-[#e2e8f0]'
                }`}
              >
                Hospitalisés
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#f1f5f9] p-2 space-y-1">
            {filteredPatients.map((p) => {
              const isSelected = p.id === selectedPatient.id;
              return (
                <div
                  key={p.id}
                  onClick={() => onSelectPatient(p)}
                  className={`px-3.5 py-3 rounded-lg cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-[#131b2e] text-white shadow-xs border-[#131b2e]'
                      : 'hover:bg-[#f8f9ff] text-[#0b1c30] border-transparent hover:border-[#dae2fd]/60'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      {p.photoUrl ? (
                        <img
                          src={p.photoUrl}
                          alt={p.name}
                          className="h-9 w-9 rounded-full object-cover border border-white/20"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div
                          className={`h-9 w-9 rounded-full font-bold flex items-center justify-center text-[12px] ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-[#eff4ff] text-[#006a61]'
                          }`}
                        >
                          {p.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-[13px] leading-tight flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {p.ticketNumber && (
                            <span
                              className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold ${
                                isSelected ? 'bg-white/20 text-[#86f2e4]' : 'bg-[#eff4ff] text-[#006a61]'
                              }`}
                            >
                              {p.ticketNumber}
                            </span>
                          )}
                        </div>
                        <div className={`text-[11px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-[#76777d]'}`}>
                          CIN: <span className="font-semibold">{p.cin}</span> • {p.age} ans
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSelected
                          ? 'bg-[#86f2e4] text-[#006f66]'
                          : p.amoType === 'CNOPS'
                          ? 'bg-blue-50 text-blue-700'
                          : p.amoType === 'CNSS'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-slate-100 text-[#45464d]'
                      }`}
                    >
                      {p.amoType} {p.amoRate ? `${p.amoRate}%` : ''}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] pt-1.5 border-t border-white/10">
                    <span className={isSelected ? 'text-slate-300' : 'text-[#76777d]'}>
                      {p.currentLocation || 'Ambulatoire'}
                    </span>
                    <span className={isSelected ? 'text-[#86f2e4]' : 'text-[#006a61] font-medium'}>
                      {p.assignedDoctor}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 360° Patient View Panel */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-2xs border border-[#e2e8f0] flex flex-col h-[calc(100vh-140px)] min-h-[640px] overflow-hidden">
          {/* Top Patient Profile Banner */}
          <div className="p-5 border-b border-[#f1f5f9] bg-linear-to-b from-[#f8f9ff] to-white">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Identity & Avatar */}
              <div className="flex items-start gap-4">
                {selectedPatient.photoUrl ? (
                  <img
                    src={selectedPatient.photoUrl}
                    alt={selectedPatient.name}
                    className="h-16 w-16 rounded-xl object-cover border-2 border-white shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-[#006a61] text-white text-2xl font-bold flex items-center justify-center shadow-sm">
                    {selectedPatient.name.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-headline text-lg sm:text-xl font-bold text-[#0b1c30]">
                      {selectedPatient.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                      Actif en clinique
                    </span>
                    <span className="text-[11px] font-mono font-semibold bg-[#eff4ff] text-[#006a61] px-2 py-0.5 rounded">
                      Dossier #9420
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#45464d] mt-1.5">
                    <span>CIN : <strong className="text-[#0b1c30]">{selectedPatient.cin}</strong></span>
                    <span className="text-slate-300">•</span>
                    <span>{selectedPatient.age} ans ({selectedPatient.birthDate || '14/05/1978'})</span>
                    <span className="text-slate-300">•</span>
                    <span>Tél : {selectedPatient.phone}</span>
                  </div>

                  <div className="text-[11px] text-[#76777d] mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">home_pin</span>
                    <span>{selectedPatient.address || '34 Rue Jean Jaurès, Maârif, Casablanca'}</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                <button
                  onClick={() => showToast(`Feuille de Soins Électronique générée pour ${selectedPatient.name}`)}
                  className="px-3 py-1.5 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>Émettre FSE Tiers-Payant</span>
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={onOpenAmoCheck}
                    className="flex-1 px-2.5 py-1.5 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#006a61] text-[11px] font-semibold rounded-lg border border-[#dae2fd] transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    <span>Vérifier AMO</span>
                  </button>
                  <button
                    onClick={() => onNavigate('hospitalization')}
                    className="flex-1 px-2.5 py-1.5 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#0b1c30] text-[11px] font-semibold rounded-lg border border-[#dae2fd] transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[15px]">bed</span>
                    <span>Hospitaliser</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Coverage & Clinical Badges Strip */}
            <div className="mt-4 pt-3 border-t border-[#dae2fd]/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#eff4ff] p-2.5 rounded-lg border border-[#dae2fd]/60">
                <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider block">
                  Couverture Maladie
                </span>
                <div className="text-[12px] font-bold text-[#006a61] flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">health_and_safety</span>
                  <span>{selectedPatient.amoType} ({selectedPatient.amoRate}%) Tiers-Payant</span>
                </div>
                <span className="text-[11px] text-[#45464d] block mt-0.5">
                  {selectedPatient.secondaryInsurance || 'Mutuelle Saham / Sanlam (20%)'}
                </span>
              </div>

              <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200/60">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Situation Comptable
                </span>
                <div className="text-[12px] font-bold text-emerald-800 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>{selectedPatient.balanceDue.toFixed(2)} MAD • Dossier à jour</span>
                </div>
                <span className="text-[11px] text-emerald-700 block mt-0.5">
                  Aucun impayé guichet
                </span>
              </div>

              <div className="bg-red-50/60 p-2.5 rounded-lg border border-red-200/60">
                <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
                  Alertes Cliniques & Allergies
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(selectedPatient.allergies || ['Allergie Pénicilline']).map((al, idx) => (
                    <span key={idx} className="text-[10px] font-bold bg-red-100 text-red-800 px-1.5 py-0.2 rounded">
                      {al}
                    </span>
                  ))}
                  {(selectedPatient.medicalAlerts || ['HTA Stade 1']).map((ma, idx) => (
                    <span key={idx} className="text-[10px] font-semibold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                      {ma}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 border-b border-[#f1f5f9] flex items-center gap-2 overflow-x-auto bg-white">
            <button
              onClick={() => setActiveTab('consultations')}
              className={`py-3 px-3 text-[12px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'consultations'
                  ? 'border-[#006a61] text-[#006a61]'
                  : 'border-transparent text-[#76777d] hover:text-[#0b1c30]'
              }`}
            >
              Consultations (3)
            </button>
            <button
              onClick={() => setActiveTab('examens')}
              className={`py-3 px-3 text-[12px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'examens'
                  ? 'border-[#006a61] text-[#006a61]'
                  : 'border-transparent text-[#76777d] hover:text-[#0b1c30]'
              }`}
            >
              Examens & Imagerie (2)
            </button>
            <button
              onClick={() => setActiveTab('ordonnances')}
              className={`py-3 px-3 text-[12px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'ordonnances'
                  ? 'border-[#006a61] text-[#006a61]'
                  : 'border-transparent text-[#76777d] hover:text-[#0b1c30]'
              }`}
            >
              Ordonnances (4)
            </button>
            <button
              onClick={() => setActiveTab('hospitalisations')}
              className={`py-3 px-3 text-[12px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'hospitalisations'
                  ? 'border-[#006a61] text-[#006a61]'
                  : 'border-transparent text-[#76777d] hover:text-[#0b1c30]'
              }`}
            >
              Hospitalisations (0)
            </button>
            <button
              onClick={() => setActiveTab('factures')}
              className={`py-3 px-3 text-[12px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'factures'
                  ? 'border-[#006a61] text-[#006a61]'
                  : 'border-transparent text-[#76777d] hover:text-[#0b1c30]'
              }`}
            >
              Factures & Tiers-Payant (3)
            </button>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activeTab === 'consultations' && (
              <>
                {/* Active Consultation Block */}
                <div className="bg-[#eff4ff]/60 border border-[#dae2fd] rounded-xl p-4.5 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#dae2fd]">
                    <div>
                      <div className="text-[13px] font-bold text-[#0b1c30]">
                        Consultation Spécialisée de Contrôle Cardiologie
                      </div>
                      <div className="text-[11px] text-[#76777d]">
                        Aujourd'hui, 24 Octobre 2024 à 09:15 • Par {selectedPatient.assignedDoctor}
                      </div>
                    </div>
                    <span className="text-[11px] font-bold bg-[#006a61] text-white px-2 py-0.5 rounded">
                      Box Cardio #02
                    </span>
                  </div>

                  {/* Vitals Ribbon */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="bg-white p-2.5 rounded-lg border border-[#cbd5e1]/60">
                      <span className="text-[10px] text-[#76777d] uppercase font-bold">Tension Artérielle</span>
                      <div className="text-[14px] font-bold text-[#0b1c30] mt-0.5">
                        {selectedPatient.vitals?.bloodPressure || '135/85'} <span className="text-[10px] font-normal text-[#76777d]">mmHg</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-[#cbd5e1]/60">
                      <span className="text-[10px] text-[#76777d] uppercase font-bold">Fréquence Cardiaque</span>
                      <div className="text-[14px] font-bold text-[#006a61] mt-0.5">
                        {selectedPatient.vitals?.heartRate || 72} <span className="text-[10px] font-normal text-[#76777d]">bpm</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-[#cbd5e1]/60">
                      <span className="text-[10px] text-[#76777d] uppercase font-bold">Saturation O2</span>
                      <div className="text-[14px] font-bold text-emerald-700 mt-0.5">
                        {selectedPatient.vitals?.oxygenSat || 99} <span className="text-[10px] font-normal text-[#76777d]">%</span>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-[#cbd5e1]/60">
                      <span className="text-[10px] text-[#76777d] uppercase font-bold">Glycémie à jeun</span>
                      <div className="text-[14px] font-bold text-[#0b1c30] mt-0.5">
                        {selectedPatient.vitals?.bloodGlucose || '0.98'} <span className="text-[10px] font-normal text-[#76777d]">g/L</span>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Observations */}
                  <div className="bg-white p-3.5 rounded-lg border border-[#cbd5e1]/60 space-y-1.5">
                    <span className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider block">
                      Observations & Examen Clinique
                    </span>
                    <p className="text-[12px] text-[#0b1c30] leading-relaxed">
                      {selectedPatient.notes || "Patient vu pour consultation de contrôle trimestriel HTA essentielle. Bonne tolérance clinique du traitement par IEC. Pas de palpitations ni d'œdèmes des membres inférieurs rapportés. Auscultation cardio-pulmonaire normale, bruits du cœur réguliers sans souffle surajouté."}
                    </p>
                  </div>

                  {/* Prescription Section */}
                  <div className="bg-white p-3.5 rounded-lg border border-[#cbd5e1]/60 space-y-2">
                    <span className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider block">
                      Traitement Prescrit (Ordonnance n° ORD-2024-8841)
                    </span>
                    <div className="space-y-1.5 text-[12px]">
                      <div className="flex items-center justify-between p-1.5 bg-[#f8f9ff] rounded">
                        <span className="font-semibold text-[#0b1c30]">1. Amlor 5mg (Amlodipine)</span>
                        <span className="text-[11px] text-[#76777d]">1 comprimé le matin au petit-déjeuner (3 mois)</span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 bg-[#f8f9ff] rounded">
                        <span className="font-semibold text-[#0b1c30]">2. Co-Renitec 20mg/12.5mg</span>
                        <span className="text-[11px] text-[#76777d]">1 comprimé le soir (3 mois)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => showToast('Ordonnance imprimée avec signature électronique')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#0b1c30] text-[11px] font-semibold rounded-lg border border-[#cbd5e1] transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">print</span>
                      <span>Imprimer Ordonnance</span>
                    </button>
                    <button
                      onClick={() => showToast('Compte-rendu validé et enregistré dans le DMP')}
                      className="px-3.5 py-1.5 bg-[#006a61] hover:bg-[#00544d] text-white text-[11px] font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[15px]">check</span>
                      <span>Compléter Compte-rendu</span>
                    </button>
                  </div>
                </div>

                {/* Historical Acts */}
                <div className="space-y-2">
                  <h4 className="font-headline text-[13px] font-bold text-[#0b1c30]">
                    Historique des Actes Antérieurs
                  </h4>
                  <div className="border border-[#e2e8f0] rounded-xl overflow-hidden divide-y divide-[#f1f5f9]">
                    <div className="p-3 bg-white hover:bg-[#f8f9ff] flex items-center justify-between text-[12px]">
                      <div>
                        <div className="font-semibold text-[#0b1c30]">Écho-Doppler Transthoracique (ETT)</div>
                        <div className="text-[11px] text-[#76777d]">15 Septembre 2024 • Dr. Hicham Amrani • Clinique Al Bassma</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#006a61]">900 MAD</span>
                        <span className="block text-[10px] text-emerald-700">Remboursé AMO CNOPS</span>
                      </div>
                    </div>
                    <div className="p-3 bg-white hover:bg-[#f8f9ff] flex items-center justify-between text-[12px]">
                      <div>
                        <div className="font-semibold text-[#0b1c30]">Consultation Médecine Générale & Bilan NFS</div>
                        <div className="text-[11px] text-[#76777d]">02 Juin 2024 • Dr. Bennani</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#006a61]">300 MAD</span>
                        <span className="block text-[10px] text-emerald-700">Pris en charge 80%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'examens' && (
              <div className="space-y-2">
                <div className="h-14 px-4 bg-white border border-[#cbd5e1]/70 rounded-xl flex items-center justify-between hover:border-[#006a61] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="p-1.5 bg-[#e6f7f5] text-[#006a61] rounded-lg shrink-0">
                      <span className="material-symbols-outlined text-[18px]">monitor_heart</span>
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-[13px] text-[#0b1c30] truncate">Électrocardiogramme (ECG 12 dérivations)</div>
                      <div className="text-[11px] text-[#76777d] truncate">24/10/2024 à 09:20 • Rythme sinusal régulier à 72 bpm</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <TableBadge variant="emerald" dot>Normal</TableBadge>
                    <button
                      type="button"
                      onClick={() => showToast('Tracé ECG haute résolution affiché')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#006a61] hover:bg-[#e6f7f5] transition-colors"
                      title="Voir Tracé PDF"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                  </div>
                </div>

                <div className="h-14 px-4 bg-white border border-[#cbd5e1]/70 rounded-xl flex items-center justify-between hover:border-[#006a61] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="p-1.5 bg-blue-50 text-blue-700 rounded-lg shrink-0">
                      <span className="material-symbols-outlined text-[18px]">biotechnology</span>
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-[13px] text-[#0b1c30] truncate">Bilan Biologique Sanguin (NFS, Urée, Créatinine)</div>
                      <div className="text-[11px] text-[#76777d] truncate">Laboratoire Central Al Bassma • Validé biologiste Dr. Lahlou</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <TableBadge variant="sky" dot>Validé</TableBadge>
                    <button
                      type="button"
                      onClick={() => showToast('Résultats du laboratoire affichés')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#006a61] hover:bg-[#e6f7f5] transition-colors"
                      title="Consulter Résultats"
                    >
                      <span className="material-symbols-outlined text-[18px]">lab_profile</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ordonnances' && (
              <div className="space-y-2">
                <div className="min-h-[56px] px-4 py-2.5 bg-white border border-[#cbd5e1]/70 rounded-xl flex items-center justify-between hover:border-[#006a61] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="p-1.5 bg-[#e6f7f5] text-[#006a61] rounded-lg shrink-0">
                      <span className="material-symbols-outlined text-[18px]">prescriptions</span>
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[13px] text-[#0b1c30]">Ordonnance #ORD-2024-8841</span>
                        <TableBadge variant="emerald">Active</TableBadge>
                      </div>
                      <p className="text-[11px] text-[#45464d] truncate">Amlor 5mg (1 cp/j) + Co-Renitec 20/12.5mg (1 cp/j le soir) • 3 mois</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-[#76777d]">24/10/2024</span>
                    <button
                      type="button"
                      onClick={() => showToast('Ordonnance imprimée')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#45464d] hover:text-[#006a61] hover:bg-[#e6f7f5] transition-colors"
                      title="Imprimer"
                    >
                      <span className="material-symbols-outlined text-[18px]">print</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hospitalisations' && (
              <div className="p-8 text-center text-[#76777d] space-y-2">
                <span className="material-symbols-outlined text-[36px] text-slate-400">bed</span>
                <p className="text-[13px]">Aucun séjour d'hospitalisation antérieur répertorié pour ce patient.</p>
                <button
                  onClick={() => onNavigate('hospitalization')}
                  className="px-3 py-1.5 bg-[#006a61] text-white text-[11px] font-semibold rounded-lg mt-2 inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">add</span>
                  Initier une admission d'hospitalisation
                </button>
              </div>
            )}

            {activeTab === 'factures' && (
              <div className="space-y-2">
                <div className="h-14 px-4 bg-white border border-[#cbd5e1]/70 rounded-xl flex items-center justify-between hover:border-[#006a61] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="p-1.5 bg-[#eff4ff] text-[#188ace] rounded-lg shrink-0">
                      <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-[13px] text-[#0b1c30]">Facture #FAC-2024-1104</div>
                      <div className="text-[11px] text-[#76777d] truncate">Total : 1 450 MAD • Part AMO : 1 015 MAD (70%) • Ticket : 435 MAD</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <TableBadge variant="emerald" dot>Tiers-Payant CNOPS</TableBadge>
                    <button
                      type="button"
                      onClick={() => showToast('Détails facture affichés')}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[#006a61] hover:bg-[#e6f7f5] transition-colors"
                      title="Voir Facture"
                    >
                      <span className="material-symbols-outlined text-[18px]">visibility</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Legal & CNDP Compliance Footer */}
            <div className="p-3.5 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-[#45464d]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                <span>
                  <strong>Protection des données de santé (Loi 09-08 CNDP)</strong> • Consentement éclairé du patient signé électroniquement.
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-[#76777d]">
                <span>Certificat Masar #ANAM-2024-9182</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

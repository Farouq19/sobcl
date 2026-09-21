import React, { useState } from 'react';
import { Patient, ViewMode } from '../../types';
import { HOURLY_ACTIVITY_DATA, ACTIVE_DOCTORS } from '../../data/mockData';
import { DataTable, Column, ActionGroup, ActionButton, TableBadge } from '../common/DataTable';

interface DashboardViewProps {
  patients: Patient[];
  onNavigate: (view: ViewMode) => void;
  onOpenAmoCheck: () => void;
  onOpenNewAdmission: () => void;
  onOpenCashRegister: () => void;
  onSelectPatient: (patient: Patient) => void;
  onUpdatePatientStatus: (patientId: string, newStatus: Patient['status'], newLocation?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  patients,
  onNavigate,
  onOpenAmoCheck,
  onOpenNewAdmission,
  onOpenCashRegister,
  onSelectPatient,
  onUpdatePatientStatus
}) => {
  const [filterDept, setFilterDept] = useState<'all' | 'urgences' | 'cardio' | 'pediatrie'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredQueue = patients.filter((p) => {
    const specialty = (p?.specialty || '').toLowerCase();
    if (filterDept === 'urgences') return specialty.includes('urg') || Boolean(p?.ticketNumber?.startsWith('#U'));
    if (filterDept === 'cardio') return specialty.includes('cardio');
    if (filterDept === 'pediatrie') return specialty.includes('péd') || Boolean(p?.name?.includes('Enfant'));
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#dae2fd]/30 flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-[#86f2e4] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Command Strip */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-2xs border border-[#e2e8f0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="font-headline text-lg sm:text-xl font-bold text-[#0b1c30]">
              Poste Central de Régulation <span className="text-[#006a61] uppercase text-sm font-semibold tracking-wider ml-1">EN DIRECT</span>
            </h1>
          </div>
          <p className="text-[12px] text-[#45464d] mt-1 flex flex-wrap items-center gap-2">
            <span>Aujourd'hui, 24 Octobre 2024</span>
            <span className="text-slate-300">•</span>
            <span>Garde Réa/Urgences : <strong>Dr. K. Benjelloun & Dr. H. Tazi</strong></span>
            <span className="text-slate-300">•</span>
            <span className="text-emerald-700 font-medium">Passerelle AMO Masar Connectée</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAmoCheck}
            className="px-3 py-1.5 bg-[#e6f7f5] hover:bg-[#c9f1eb] text-[#006a61] text-[12px] font-semibold rounded-lg border border-[#86f2e4]/70 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Vérifier Éligibilité AMO</span>
          </button>
          <button
            onClick={() => onNavigate('billing-amo')}
            className="px-3 py-1.5 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] font-semibold rounded-lg border border-[#cbd5e1] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Créer Facture</span>
          </button>
          <button
            onClick={() => showToast('Export du rapport d\'activité généré au format PDF')}
            className="px-3 py-1.5 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#0b1c30] text-[12px] font-semibold rounded-lg border border-[#cbd5e1] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Exporter Rapport</span>
          </button>
          <button
            onClick={onOpenNewAdmission}
            className="px-3.5 py-1.5 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>+ Nouvelle Admission</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Patients pris en charge */}
        <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between hover:border-[#86f2e4] transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-medium text-[#45464d]">Patients Pris en Charge</span>
            <span className="p-1.5 rounded-lg bg-[#e6f7f5] text-[#006a61]">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-bold text-[#0b1c30]">84</span>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +12% vs J-1
              </span>
            </div>
            <div className="w-full bg-[#f1f5f9] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-[#006a61] h-full rounded-full" style={{ width: '68%' }} />
            </div>
            <div className="flex justify-between text-[11px] text-[#76777d] mt-1.5">
              <span>58 Consultations</span>
              <span>26 Urgences</span>
            </div>
          </div>
        </div>

        {/* KPI 2: File d'Attente Active */}
        <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between hover:border-[#86f2e4] transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-medium text-[#45464d]">File d'Attente Active</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <span className="material-symbols-outlined text-[18px]">timer</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-bold text-[#0b1c30]">14</span>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                Flux Régulé
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#45464d] mt-3">
              <span className="material-symbols-outlined text-[14px] text-[#76777d]">schedule</span>
              <span>Délai moyen estimé : <strong>~18 min</strong></span>
            </div>
          </div>
        </div>

        {/* KPI 3: Occupation des Lits */}
        <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between hover:border-[#86f2e4] transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-medium text-[#45464d]">Occupation des Lits</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <span className="material-symbols-outlined text-[18px]">bed</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-2xl font-bold text-[#0b1c30]">22 / 28</span>
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                78%
              </span>
            </div>
            <div className="w-full bg-[#f1f5f9] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '78%' }} />
            </div>
            <div className="flex justify-between text-[11px] text-[#76777d] mt-1.5">
              <span>6 lits disponibles</span>
              <span className="font-medium text-[#0b1c30]">Chirurgie (4) • Réa (2)</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Recettes Journalières */}
        <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between hover:border-[#86f2e4] transition-all">
          <div className="flex items-start justify-between">
            <span className="text-[12px] font-medium text-[#45464d]">Recettes Journalières Validées</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1">
              <span className="font-headline text-2xl font-bold text-[#006a61]">48 500</span>
              <span className="text-[12px] font-bold text-[#45464d]">MAD</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#76777d] mt-2 pt-1 border-t border-[#f1f5f9]">
              <span>Prise en charge AMO : <strong>31 200 MAD</strong></span>
              <span>Ticket : <strong>17 300 MAD</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live Queue & Hourly Activity Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* File d'Attente & Box en Direct */}
          <div className="bg-white rounded-xl shadow-2xs border border-[#e2e8f0] overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-headline text-base font-bold text-[#0b1c30] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a61] text-[20px]">dynamic_feed</span>
                  File d'Attente & Box en Direct
                </h2>
                <p className="text-[11px] text-[#76777d]">Mise à jour en continu des flux ambulatoires</p>
              </div>

              {/* Filter chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterDept('all')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                    filterDept === 'all'
                      ? 'bg-[#131b2e] text-white'
                      : 'bg-[#f1f5f9] text-[#45464d] hover:bg-[#e2e8f0]'
                  }`}
                >
                  Tous ({patients.length})
                </button>
                <button
                  onClick={() => setFilterDept('urgences')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                    filterDept === 'urgences'
                      ? 'bg-[#ba1a1a] text-white'
                      : 'bg-[#f1f5f9] text-[#45464d] hover:bg-[#e2e8f0]'
                  }`}
                >
                  Urgences (4)
                </button>
                <button
                  onClick={() => setFilterDept('cardio')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                    filterDept === 'cardio'
                      ? 'bg-[#006a61] text-white'
                      : 'bg-[#f1f5f9] text-[#45464d] hover:bg-[#e2e8f0]'
                  }`}
                >
                  Cardiologie (3)
                </button>
                <button
                  onClick={() => setFilterDept('pediatrie')}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                    filterDept === 'pediatrie'
                      ? 'bg-[#188ace] text-white'
                      : 'bg-[#f1f5f9] text-[#45464d] hover:bg-[#e2e8f0]'
                  }`}
                >
                  Pédiatrie (2)
                </button>
              </div>
            </div>

            {/* Standardized DataTable */}
            <DataTable<Patient>
              columns={[
                {
                  key: 'patient',
                  header: 'Patient & CIN',
                  width: '32%',
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
                        <div className="text-[11px] text-[#76777d] flex items-center gap-2 truncate">
                          <span>CIN : {p.cin}</span>
                          <span>•</span>
                          <span className="text-[#006a61] font-medium">{p.amoType} ({p.amoRate}%)</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'status',
                  header: 'Statut Flux',
                  width: '20%',
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
                  header: 'Box / Salle',
                  width: '18%',
                  render: (p) => (
                    <span className="font-medium text-[#0b1c30]">
                      {p.currentLocation || "Salle d'Attente"}
                    </span>
                  ),
                },
                {
                  key: 'doctor',
                  header: 'Médecin en charge',
                  width: '18%',
                  render: (p) => (
                    <div>
                      <div className="font-medium text-[#0b1c30] truncate">{p.assignedDoctor}</div>
                      <div className="text-[10px] text-[#76777d] truncate">{p.specialty}</div>
                    </div>
                  ),
                },
                {
                  key: 'actions',
                  header: 'Actions Régulation',
                  width: '12%',
                  align: 'right',
                  render: (p) => (
                    <ActionGroup align="right" onClick={(e) => e.stopPropagation()}>
                      <ActionButton
                        icon="meeting_room"
                        variant="teal"
                        title="Orienter vers Box Consultation"
                        onClick={() => {
                          onUpdatePatientStatus(p.id, 'consultation', 'Box 02');
                          showToast(`${p.name} orienté vers Box 02`);
                        }}
                      />
                      <ActionButton
                        icon="volume_up"
                        variant="blue"
                        title="Diffuser appel au guichet d'attente"
                        onClick={() => {
                          onUpdatePatientStatus(p.id, 'calling');
                          showToast(`Appel vocal diffusé pour ${p.name}`);
                        }}
                      />
                      <ActionButton
                        icon="chevron_right"
                        variant="ghost"
                        title="Ouvrir le dossier médical 360°"
                        onClick={() => {
                          onSelectPatient(p);
                          onNavigate('patient-files');
                        }}
                      />
                    </ActionGroup>
                  ),
                },
              ]}
              data={filteredQueue.slice(0, 5)}
              onRowClick={(p) => {
                onSelectPatient(p);
                onNavigate('patient-files');
              }}
              emptyMessage="Aucun patient dans cette file d'attente"
              rowHeight="h-14"
            />

            <div className="p-3 bg-[#f8f9ff] border-t border-[#f1f5f9] flex justify-between items-center text-[12px]">
              <span className="text-[#76777d]">Affichage de 5 sur 14 patients en transit</span>
              <button
                onClick={() => onNavigate('patient-flow')}
                className="text-[#006a61] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Accéder au Kanban des Flux Complets</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Activité & Affluence par Tranche Horaire */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-2xs border border-[#e2e8f0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-headline text-base font-bold text-[#0b1c30]">
                  Activité & Affluence par Tranche Horaire
                </h3>
                <p className="text-[11px] text-[#76777d]">
                  Comparatif entrées effectives vs moyenne historique (Pic constaté : 10h00 - 11h00)
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-[#006a61]" />
                  <span className="text-[#45464d] font-medium">Flux Réel</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-xs bg-[#cbd5e1]" />
                  <span className="text-[#76777d]">Moyenne Historique</span>
                </div>
              </div>
            </div>

            {/* Interactive Custom Bar Chart */}
            <div className="pt-2 pb-2">
              <div className="h-44 flex items-end justify-between gap-1 sm:gap-2 px-2 border-b border-[#cbd5e1]">
                {HOURLY_ACTIVITY_DATA.map((item) => (
                  <div key={item.hour} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-[#131b2e] text-white text-[10px] py-1 px-2 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                      {item.hour} : {item.actual} entrées ({item.history} moy.)
                    </div>

                    {item.isPeak && (
                      <span className="text-[10px] font-bold text-[#ba1a1a] bg-red-100 px-1.5 py-0.2 rounded-full absolute -top-6">
                        {item.label}
                      </span>
                    )}

                    <div className="w-full max-w-[28px] flex items-end justify-center gap-0.5 h-36">
                      {/* Actual bar */}
                      <div
                        className={`w-1/2 rounded-t-xs transition-all duration-500 ${
                          item.isPeak
                            ? 'bg-[#ba1a1a]'
                            : item.isCurrent
                            ? 'bg-[#006a61]'
                            : 'bg-[#006a61]/75'
                        }`}
                        style={{ height: `${Math.max(item.actual, 4)}%` }}
                      />
                      {/* History bar */}
                      <div
                        className="w-1/2 bg-[#cbd5e1] rounded-t-xs"
                        style={{ height: `${item.history}%` }}
                      />
                    </div>

                    <span className={`text-[10px] mt-1 ${item.isCurrent ? 'font-bold text-[#006a61]' : 'text-[#76777d]'}`}>
                      {item.hour}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Immediate attention, Cash summary, Active team */}
        <div className="space-y-6">
          {/* Points d'Attention Immédiats */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-2xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline text-[14px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[18px]">error</span>
                Points d'Attention Immédiats
              </h3>
              <span className="text-[10px] font-bold bg-red-100 text-red-800 px-1.5 py-0.5 rounded">
                3 Critiques
              </span>
            </div>

            <div className="space-y-3">
              {/* Alert 1 */}
              <div className="p-3 bg-red-50/70 rounded-lg border border-red-200/80">
                <div className="flex items-start justify-between">
                  <span className="text-[12px] font-bold text-red-900">
                    Délai CNSS Entente Préalable
                  </span>
                  <span className="text-[10px] font-bold text-red-700 bg-white px-1.5 py-0.2 rounded border border-red-200">
                    &lt; 14h restantes
                  </span>
                </div>
                <p className="text-[11px] text-red-800/90 mt-1">
                  Dossier #DOS-8812 (M. Tariq Alami) nécessite la contre-signature du Dr. Zahiri pour validation télétransmise.
                </p>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => onNavigate('amo-portal')}
                    className="text-[11px] font-semibold text-red-800 hover:underline flex items-center gap-1"
                  >
                    <span>Signer et régulariser</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Alert 2 */}
              <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-200/80">
                <div className="flex items-start justify-between">
                  <span className="text-[12px] font-bold text-amber-900">
                    Box 3 Dr. Amrani (+25 min retard)
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-white px-1.5 py-0.2 rounded border border-amber-200">
                    Cardio
                  </span>
                </div>
                <p className="text-[11px] text-amber-800/90 mt-1">
                  3 patients en attente devant la porte. Proposition de basculer 1 consultation vers Box 04 Dr. Bennani.
                </p>
              </div>

              {/* Alert 3 */}
              <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200/80">
                <div className="flex items-start justify-between">
                  <span className="text-[12px] font-bold text-blue-900">
                    Lit Surveillance B2
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-white px-1.5 py-0.2 rounded border border-blue-200">
                    En libération
                  </span>
                </div>
                <p className="text-[11px] text-blue-800/90 mt-1">
                  Bio-nettoyage programmé fin estimée 12h15. Réservé pour la sortie du bloc opératoire de 12h30.
                </p>
              </div>
            </div>
          </div>

          {/* Caisse & Encaissements */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-2xs border border-[#e2e8f0]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-headline text-[14px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006a61] text-[18px]">account_balance_wallet</span>
                Caisse & Encaissements
              </h3>
              <span className="text-[11px] font-bold text-[#006a61]">48 500,00 MAD</span>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#45464d] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">payments</span>
                  Espèces en coffre
                </span>
                <span className="font-semibold text-[#0b1c30]">24 100 MAD</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#45464d] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">credit_card</span>
                  TPE Bancaire CMI
                </span>
                <span className="font-semibold text-[#0b1c30]">18 400 MAD</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f1f5f9]">
                <span className="text-[#45464d] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">receipt</span>
                  Chèques certifiés
                </span>
                <span className="font-semibold text-[#0b1c30]">6 000 MAD</span>
              </div>
            </div>

            <button
              onClick={onOpenCashRegister}
              className="w-full mt-4 py-2 px-3 bg-[#eff4ff] hover:bg-[#dce9ff] text-[#006a61] text-[12px] font-semibold rounded-lg border border-[#dae2fd] transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">lock_clock</span>
              <span>Clôture de Caisse Journalière</span>
            </button>
          </div>

          {/* Équipe Médicale en Poste */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-2xs border border-[#e2e8f0]">
            <h3 className="font-headline text-[14px] font-bold text-[#0b1c30] mb-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#006a61] text-[18px]">badge</span>
              Équipe Médicale en Poste
            </h3>

            <div className="space-y-2.5">
              {ACTIVE_DOCTORS.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f8f9ff] transition-colors">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: doc.status === 'in_surgery' ? '#ba1a1a' : '#006a61' }}
                    />
                    <div>
                      <div className="text-[12px] font-semibold text-[#0b1c30]">{doc.name}</div>
                      <div className="text-[10px] text-[#76777d]">{doc.specialty}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-[#45464d] bg-[#f1f5f9] px-2 py-0.5 rounded">
                    {doc.location}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { AmoRejection } from '../../types';
import { INITIAL_REJECTIONS } from '../../data/mockData';

interface AmoPortalViewProps {
  onOpenAmoCheck: () => void;
}

export const AmoPortalView: React.FC<AmoPortalViewProps> = ({ onOpenAmoCheck }) => {
  const [rejections, setRejections] = useState<AmoRejection[]>(INITIAL_REJECTIONS);
  const [selectedRejection, setSelectedRejection] = useState<AmoRejection>(INITIAL_REJECTIONS[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleResolve = (id: string, actionName: string) => {
    setRejections(
      rejections.map((r) =>
        r.id === id ? { ...r, status: 'resolved' } : r
      )
    );
    if (selectedRejection.id === id) {
      setSelectedRejection({ ...selectedRejection, status: 'resolved' });
    }
    showToast(`Dossier ${selectedRejection.code} régularisé via : ${actionName}. Télétransmission effectuée.`);
  };

  return (
    <div className="space-y-5 pb-12">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#dae2fd]/30 flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-[#86f2e4] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-2xs border border-[#e2e8f0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#e6f7f5] text-[#006a61] rounded-xl">
            <span className="material-symbols-outlined text-[26px]">verified_user</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-lg sm:text-xl font-bold text-[#0b1c30]">
                Portail Tiers-Payant AMO, CNSS & CNOPS
              </h1>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[12px] text-[#45464d]">
              Passerelle Masar Santé ANAM opérationnelle • Clé de télétransmission active : #CERT-CAS-2024
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAmoCheck}
            className="px-3.5 py-2 bg-[#e6f7f5] hover:bg-[#c9f1eb] text-[#006a61] text-[12px] font-semibold rounded-lg border border-[#86f2e4]/70 transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Vérifier Droits ANAM</span>
          </button>
          <button
            onClick={() => showToast('Lot #BDR-44 télétransmis en bloc à la CNSS')}
            className="px-3.5 py-2 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
            <span>Télétransmission par Lot</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0]">
          <span className="text-[12px] font-medium text-[#45464d]">Bordereaux en Attente de Règlement</span>
          <div className="mt-2">
            <div className="font-headline text-2xl font-bold text-[#006a61]">112 400 MAD</div>
            <span className="text-[11px] text-[#76777d]">Lot #BDR-2024-CAS-44 (18 dossiers)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0]">
          <div className="flex justify-between items-start">
            <span className="text-[12px] font-medium text-[#45464d]">Rejets Actifs à Régulariser</span>
            <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
              Action Requise
            </span>
          </div>
          <div className="mt-2">
            <div className="font-headline text-2xl font-bold text-[#ba1a1a]">
              {rejections.filter((r) => r.status !== 'resolved').length} Dossiers
            </div>
            <span className="text-[11px] text-red-700">Total bloqué : 2 480 MAD</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0]">
          <span className="text-[12px] font-medium text-[#45464d]">Taux d'Acceptation Télétransmission</span>
          <div className="mt-2">
            <div className="font-headline text-2xl font-bold text-emerald-700">96.4%</div>
            <span className="text-[11px] text-emerald-800">Conformité nomenclature ANAM 2024</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Rejections List (7 cols) + Right Resolution Sheet (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Rejections Table */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-2xs border border-[#e2e8f0] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#f1f5f9] flex items-center justify-between">
            <div>
              <h3 className="font-headline text-base font-bold text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">report_problem</span>
                Gestion des Rejets & Litiges FSE
              </h3>
              <span className="text-[11px] text-[#76777d]">
                Notifications officielles de rejets retournées par la CNSS & la CNOPS
              </span>
            </div>
            <span className="text-[11px] font-bold bg-[#eff4ff] text-[#006a61] px-2.5 py-1 rounded-md">
              Délai de recours : 15 jours
            </span>
          </div>

          <div className="divide-y divide-[#f1f5f9]">
            {rejections.map((rej) => {
              const isSelected = selectedRejection.id === rej.id;
              const isResolved = rej.status === 'resolved';
              return (
                <div
                  key={rej.id}
                  onClick={() => setSelectedRejection(rej)}
                  className={`p-4 cursor-pointer transition-colors flex items-start justify-between gap-3 ${
                    isSelected ? 'bg-[#e6f7f5]/40' : 'hover:bg-[#f8f9ff]'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[13px] text-[#0b1c30]">{rej.patientName}</span>
                      <span className="text-[11px] font-mono bg-slate-100 text-[#45464d] px-1.5 py-0.2 rounded">
                        CIN: {rej.patientCin}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          rej.organism === 'CNSS' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
                        }`}
                      >
                        {rej.organism}
                      </span>
                      {isResolved ? (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">check</span>
                          Régularisé
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-red-100 text-red-800 px-1.5 py-0.2 rounded">
                          {rej.reasonCode}
                        </span>
                      )}
                    </div>

                    <div className="text-[12px] font-semibold text-[#ba1a1a]">
                      {rej.reasonTitle}
                    </div>

                    <div className="text-[11px] text-[#76777d]">
                      Prescripteur : {rej.doctorName} • Dossier {rej.dossierNumber}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-bold text-[13px] text-[#0b1c30]">{rej.amount} MAD</div>
                    {!isResolved && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded block mt-1">
                        Expire dans {rej.deadlineDays}j
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Resolution Sheet */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-2xs border border-[#e2e8f0] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#f1f5f9]">
              <div>
                <span className="text-[11px] font-semibold text-[#ba1a1a] uppercase tracking-wider">
                  Fiche d'Anomalie Télétransmise
                </span>
                <h3 className="font-headline text-base font-bold text-[#0b1c30]">
                  {selectedRejection.code} • {selectedRejection.patientName}
                </h3>
                <span className="text-[11px] text-[#76777d]">
                  Organisme : {selectedRejection.organism} • Lot {selectedRejection.batchNumber}
                </span>
              </div>
              <span className="text-[12px] font-bold text-[#ba1a1a]">
                {selectedRejection.amount} MAD
              </span>
            </div>

            {/* Diagnostic motif */}
            <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-900 font-bold text-[12px]">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>{selectedRejection.reasonCode} : {selectedRejection.reasonTitle}</span>
              </div>
              <p className="text-[11px] text-red-800 leading-relaxed">
                {selectedRejection.reasonDescription}
              </p>
            </div>

            {/* Resolution workflow */}
            {selectedRejection.status !== 'resolved' ? (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider block">
                  Actions de Régularisation Immédiate
                </span>

                {selectedRejection.id === 'rej-1' && (
                  <div className="p-3 bg-[#eff4ff] border border-[#dae2fd] rounded-xl space-y-2 text-[12px]">
                    <div className="font-semibold text-[#0b1c30]">
                      Contre-signature électronique requise :
                    </div>
                    <div className="text-[11px] text-[#45464d]">
                      Le certificat numérique du Dr. Layla Zahiri (Directrice Médicale) est prêt pour la signature cryptographique du volet 1 FSE.
                    </div>
                    <button
                      onClick={() => handleResolve(selectedRejection.id, 'Signature cryptographique Dr. Zahiri')}
                      className="w-full py-2 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">draw</span>
                      <span>Signer Électroniquement & Re-télétransmettre</span>
                    </button>
                  </div>
                )}

                {selectedRejection.id === 'rej-2' && (
                  <div className="p-3 bg-[#eff4ff] border border-[#dae2fd] rounded-xl space-y-2 text-[12px]">
                    <div className="font-semibold text-[#0b1c30]">
                      Avenant de Prorogation CNOPS :
                    </div>
                    <div className="text-[11px] text-[#45464d]">
                      Générer la demande de renouvellement rétroactif de la prise en charge pour acte radio urgent.
                    </div>
                    <button
                      onClick={() => handleResolve(selectedRejection.id, 'Avenant de prorogation CNOPS joint')}
                      className="w-full py-2 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">attachment</span>
                      <span>Joindre l'Avenant de Prorogation</span>
                    </button>
                  </div>
                )}

                {selectedRejection.id === 'rej-3' && (
                  <div className="p-3 bg-[#eff4ff] border border-[#dae2fd] rounded-xl space-y-2 text-[12px]">
                    <div className="font-semibold text-[#0b1c30]">
                      Mise à jour code INPE ANAM :
                    </div>
                    <div className="text-[11px] text-[#45464d]">
                      Remplacer l'ancien code par l'INPE national certifié <strong>104928371</strong>.
                    </div>
                    <button
                      onClick={() => handleResolve(selectedRejection.id, 'Correction code INPE 104928371')}
                      className="w-full py-2 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">autorenew</span>
                      <span>Appliquer le Nouvel INPE & Renvoyer</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="material-symbols-outlined text-[48px] text-emerald-600">
                  task_alt
                </span>
                <h4 className="font-headline text-base font-bold text-emerald-900">
                  Dossier Régularisé & Transmis
                </h4>
                <p className="text-[12px] text-emerald-800">
                  L'anomalie a été corrigée. Le flux de réclamation a été réinjecté dans le bordereau #BDR-2024-CAS-44.
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#cbd5e1] text-[11px] text-[#45464d] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006a61] text-[18px]">verified</span>
            <span>Accréditation ANAM / Masar Santé n° ANAM-MA-2024-0012</span>
          </div>
        </div>
      </div>
    </div>
  );
};

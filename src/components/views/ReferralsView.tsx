import React, { useState } from 'react';
import { ReferralTransfer, Patient } from '../../types';
import { INITIAL_REFERRALS } from '../../data/saasSeedData';
import { ClinicalSelect, SelectOption } from '../common/ClinicalSelect';
import { DataTable, Column, TableBadge } from '../common/DataTable';

const URGENCY_OPTIONS: SelectOption[] = [
  { value: 'vital', label: 'URGENCE VITALE (SAMU 05)', badge: 'Vital' },
  { value: 'urgent', label: 'Urgente (< 2h)', badge: 'Urgent' },
  { value: 'routine', label: 'Programmée / Convalescence', badge: 'Routine' },
];

const AMBULANCE_OPTIONS: SelectOption[] = [
  { value: 'yes', label: 'Oui - Type A (Réanimation)', badge: 'SAMU A' },
  { value: 'no', label: 'Non - VSL ou famille', badge: 'VSL' },
];

interface ReferralsViewProps {
  patients: Patient[];
}

export const ReferralsView: React.FC<ReferralsViewProps> = ({ patients }) => {
  const [referrals, setReferrals] = useState<ReferralTransfer[]>(INITIAL_REFERRALS);
  const [selectedReferral, setSelectedReferral] = useState<ReferralTransfer>(INITIAL_REFERRALS[0]);
  const [isNewReferralOpen, setIsNewReferralOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patientId: patients[0]?.id || '',
    destinationFacility: 'CHU Ibn Rochd Casablanca (Pôle Cardiologie / USIC)',
    specialty: 'Cardiologie Interventionnelle d\'Urgence',
    reason: '',
    urgency: 'vital' as ReferralTransfer['urgency'],
    ambulanceRequired: true,
    contactPerson: 'Pr. Chami (Garde USIC CHU)'
  });

  const urgencyBadges: Record<ReferralTransfer['urgency'], { label: string; color: string }> = {
    routine: { label: 'Programmée / Routine', color: 'bg-[#eff4ff] text-[#188ace]' },
    urgent: { label: 'Urgente (< 2h)', color: 'bg-[#ffedd5] text-[#c2410c]' },
    vital: { label: 'URGENCE VITALE (SAMU 05)', color: 'bg-[#fee2e2] text-[#ba1a1a] animate-pulse font-bold' }
  };

  const statusBadges: Record<ReferralTransfer['status'], { label: string; color: string }> = {
    requested: { label: 'Demande Émise', color: 'bg-[#fef9c3] text-[#854d0e]' },
    accepted: { label: 'Accord Reçu par l\'Hôpital', color: 'bg-[#e0e7ff] text-[#4338ca]' },
    transport_planned: { label: 'Ambulance SAMU en Route', color: 'bg-[#ffedd5] text-[#c2410c]' },
    transferred: { label: 'Patient Pris en Charge', color: 'bg-[#fae8ff] text-[#86198f]' },
    received: { label: 'Admis au Service Destinataire', color: 'bg-[#dcfce7] text-[#15803d]' },
    closed: { label: 'Dossier Transfert Clôturé', color: 'bg-[#f1f5f9] text-[#475569]' }
  };

  const handleAdvanceStatus = (refId: string, nextStatus: ReferralTransfer['status']) => {
    setReferrals(referrals.map(r => {
      if (r.id === refId) {
        const updated = {
          ...r,
          status: nextStatus,
          transferredAt: nextStatus === 'transferred' ? 'Aujourd\'hui 12:00' : r.transferredAt
        };
        if (selectedReferral.id === refId) setSelectedReferral(updated);
        return updated;
      }
      return r;
    }));
  };

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find(p => p.id === formData.patientId);
    if (!patientObj) return;

    const created: ReferralTransfer = {
      id: `ref-${Date.now()}`,
      patientId: patientObj.id,
      patientName: patientObj.name,
      patientCin: patientObj.cin,
      destinationFacility: formData.destinationFacility,
      specialty: formData.specialty,
      reason: formData.reason,
      urgency: formData.urgency,
      responsibleDoctor: 'Dr. Hicham Amrani',
      ambulanceRequired: formData.ambulanceRequired,
      attachedDocuments: ['Dossier_Medical_Complet.pdf', 'ECG_Bilan_Urgence.pdf'],
      status: 'requested',
      createdAt: 'À l\'instant',
      contactPerson: formData.contactPerson
    };

    setReferrals([created, ...referrals]);
    setSelectedReferral(created);
    setIsNewReferralOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-[#dae2fd]/70 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#e6f7f5] text-[#006a61]">
            <span className="material-symbols-outlined text-[26px]">airport_shuttle</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-[#0b1c30]">Transferts & Évacuations Sanitaires</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#ba1a1a] border border-[#fecaca]">
                Liaison SAMU 05 & CHU
              </span>
            </div>
            <p className="text-[13px] text-[#45464d]">
              Gestion des réorientations, transferts médicalisés d'urgence et suivi inter-hospitalier.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsNewReferralOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#ba1a1a] hover:bg-[#991b1b] text-white text-[13px] font-semibold rounded-lg shadow-xs transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add_alert</span>
          <span>+ Nouveau Transfert Médicalisé</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left List */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs overflow-hidden">
          <div className="p-3.5 bg-[#f8f9ff] border-b border-[#e2e8f0] font-bold text-[13px] text-[#0b1c30]">
            Dossiers d'Évacuation & Transfert ({referrals.length})
          </div>

          <DataTable<ReferralTransfer>
            columns={[
              {
                key: 'patient',
                header: 'Patient & Urgence',
                width: '40%',
                render: (ref) => (
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#0b1c30] truncate">{ref.patientName}</span>
                      <span className="text-[10px] text-[#76777d]">({ref.patientCin})</span>
                    </div>
                    <div className="mt-0.5">
                      {ref.urgency === 'vital' ? (
                        <TableBadge variant="red" icon="warning">URGENCE VITALE</TableBadge>
                      ) : ref.urgency === 'urgent' ? (
                        <TableBadge variant="amber" icon="priority_high">Urgent (&lt;2h)</TableBadge>
                      ) : (
                        <TableBadge variant="blue">Routine</TableBadge>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                key: 'facility',
                header: 'Établissement Destinataire',
                width: '35%',
                render: (ref) => (
                  <div>
                    <div className="font-medium text-[#0b1c30] text-[12px] truncate">{ref.destinationFacility}</div>
                    <div className="text-[10px] text-[#76777d] truncate">
                      Ambulance : {ref.ambulanceRequired ? 'Type A (Réa)' : 'VSL / Famille'}
                    </div>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Statut Transfert',
                width: '25%',
                align: 'right',
                render: (ref) => {
                  const statusInfo = statusBadges[ref.status];
                  const variantMap: Record<ReferralTransfer['status'], 'amber' | 'purple' | 'blue' | 'emerald' | 'neutral'> = {
                    requested: 'amber',
                    accepted: 'purple',
                    transport_planned: 'amber',
                    transferred: 'purple',
                    received: 'emerald',
                    closed: 'neutral',
                  };
                  return (
                    <div className="flex justify-end">
                      <TableBadge variant={variantMap[ref.status] || 'neutral'}>
                        {statusInfo.label}
                      </TableBadge>
                    </div>
                  );
                },
              },
            ]}
            data={referrals}
            onRowClick={(ref) => setSelectedReferral(ref)}
            emptyMessage="Aucun dossier de transfert enregistré."
            rowHeight="h-14"
          />
        </div>

        {/* Right Details */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs p-5 space-y-4">
          <div className="pb-3 border-b border-[#e2e8f0]">
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusBadges[selectedReferral.status].color}`}>
              {statusBadges[selectedReferral.status].label}
            </span>
            <h2 className="text-[16px] font-bold text-[#0b1c30] mt-2">{selectedReferral.patientName}</h2>
            <div className="text-[12px] text-[#76777d]">CIN : {selectedReferral.patientCin}</div>
          </div>

          <div className="bg-[#f8f9ff] p-3.5 rounded-lg border border-[#dae2fd]/60 space-y-2 text-[12px]">
            <div className="flex justify-between">
              <span className="text-[#76777d]">Établissement d'accueil :</span>
              <span className="font-bold text-[#0b1c30] text-right">{selectedReferral.destinationFacility}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#76777d]">Service Spécialisé :</span>
              <span className="font-semibold text-[#006a61]">{selectedReferral.specialty}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#76777d]">Médecin Référent :</span>
              <span className="text-[#0b1c30]">{selectedReferral.responsibleDoctor}</span>
            </div>
            {selectedReferral.contactPerson && (
              <div className="flex justify-between">
                <span className="text-[#76777d]">Contact Établissement :</span>
                <span className="text-[#0b1c30]">{selectedReferral.contactPerson}</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-[#76777d] uppercase">Motif Médical d'Évacuation :</div>
            <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#dae2fd]/60 text-[12px] text-[#0b1c30] leading-relaxed">
              {selectedReferral.reason}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-[#76777d] uppercase">Pièces Médicales Transmises ({selectedReferral.attachedDocuments.length}) :</div>
            <div className="flex flex-wrap gap-1.5">
              {selectedReferral.attachedDocuments.map((doc, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#eff4ff] text-[#188ace] text-[11px] font-mono border border-[#dae2fd]">
                  <span className="material-symbols-outlined text-[13px]">description</span>
                  <span>{doc}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Workflow Action Buttons */}
          <div className="pt-3 border-t border-[#e2e8f0] space-y-2">
            <div className="text-[11px] font-semibold text-[#76777d] uppercase">Actions du Régulateur :</div>
            <div className="flex flex-wrap gap-2">
              {selectedReferral.status === 'requested' && (
                <button
                  onClick={() => handleAdvanceStatus(selectedReferral.id, 'accepted')}
                  className="px-3 py-1.5 bg-[#4338ca] hover:bg-[#3730a3] text-white text-[11px] font-semibold rounded-lg shadow-2xs"
                >
                  Confirmer l'accord d'admission du CHU
                </button>
              )}

              {selectedReferral.status === 'accepted' && (
                <button
                  onClick={() => handleAdvanceStatus(selectedReferral.id, 'transport_planned')}
                  className="px-3 py-1.5 bg-[#c2410c] hover:bg-[#9a3412] text-white text-[11px] font-semibold rounded-lg shadow-2xs"
                >
                  Départ Ambulance SAMU 05
                </button>
              )}

              {selectedReferral.status === 'transport_planned' && (
                <button
                  onClick={() => handleAdvanceStatus(selectedReferral.id, 'transferred')}
                  className="px-3 py-1.5 bg-[#86198f] hover:bg-[#701a75] text-white text-[11px] font-semibold rounded-lg shadow-2xs"
                >
                  Confirmer la Prise en Charge
                </button>
              )}

              {selectedReferral.status === 'transferred' && (
                <button
                  onClick={() => handleAdvanceStatus(selectedReferral.id, 'received')}
                  className="px-3 py-1.5 bg-[#006a61] hover:bg-[#00544d] text-white text-[11px] font-semibold rounded-lg shadow-2xs"
                >
                  Accusé de réception CHU reçu (Clôturer transfert)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Referral Modal */}
      {isNewReferralOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-[16px] text-[#0b1c30]">Créer une Demande de Transfert Médicalisé</h3>
              <button
                onClick={() => setIsNewReferralOpen(false)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateReferral} className="space-y-4 pt-4 text-[12px]">
              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Patient à transférer</label>
                <ClinicalSelect
                  value={formData.patientId}
                  onChange={(val) => setFormData({ ...formData, patientId: val })}
                  options={patients.map(p => ({
                    value: p.id,
                    label: `${p.name} (CIN: ${p.cin})`,
                    sublabel: `${p.specialty || 'Général'} • ${p.currentLocation || 'Non assigné'}`
                  }))}
                  fullWidth
                  size="lg"
                  searchable={true}
                  searchPlaceholder="Rechercher patient par nom ou CIN..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Degré d'urgence</label>
                  <ClinicalSelect
                    value={formData.urgency}
                    onChange={(val) => setFormData({ ...formData, urgency: val as ReferralTransfer['urgency'] })}
                    options={URGENCY_OPTIONS}
                    fullWidth
                    size="lg"
                    searchable={false}
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Ambulance Médicalisée</label>
                  <ClinicalSelect
                    value={formData.ambulanceRequired ? 'yes' : 'no'}
                    onChange={(val) => setFormData({ ...formData, ambulanceRequired: val === 'yes' })}
                    options={AMBULANCE_OPTIONS}
                    fullWidth
                    size="lg"
                    searchable={false}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Établissement Destinataire</label>
                <input
                  type="text"
                  required
                  value={formData.destinationFacility}
                  onChange={(e) => setFormData({ ...formData, destinationFacility: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Service & Spécialité</label>
                <input
                  type="text"
                  required
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Motif Clinique Justifiant le Transfert</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Justification médicale détaillée pour le SAMU et l'hôpital d'accueil..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full p-2.5 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                />
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewReferralOpen(false)}
                  className="px-4 py-2 text-[#45464d] hover:bg-[#f1f5f9] rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#ba1a1a] hover:bg-[#991b1b] text-white rounded-lg font-semibold shadow-xs"
                >
                  Déclencher le Transfert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

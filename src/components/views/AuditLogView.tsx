import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';
import { INITIAL_AUDIT_LOGS } from '../../data/saasSeedData';
import { ClinicalSelect, SelectOption } from '../common/ClinicalSelect';
import { DataTable, ColumnDef, ActionButton, ActionGroup } from '../common/DataTable';

const ACTION_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Toutes les actions' },
  { value: 'CREATE', label: 'Créations', badge: 'CREATE' },
  { value: 'EDIT', label: 'Modifications', badge: 'EDIT' },
  { value: 'VALIDATE', label: 'Validations', badge: 'VALIDATE' },
  { value: 'APPROVE', label: 'Approbations', badge: 'APPROVE' },
  { value: 'REFUND', label: 'Remboursements', badge: 'REFUND' },
  { value: 'EXPORT', label: 'Exports', badge: 'EXPORT' },
];

const ENTITY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Toutes les entités' },
  { value: 'patient', label: 'Patients' },
  { value: 'consultation', label: 'Consultations' },
  { value: 'examen', label: 'Examens' },
  { value: 'soin', label: 'Soins Infirmiers' },
  { value: 'chirurgie', label: 'Chirurgie' },
  { value: 'facture', label: 'Factures' },
  { value: 'caisse', label: 'Caisse' },
];

export const AuditLogView: React.FC = () => {
  const [logs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterEntity, setFilterEntity] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const actionBadges: Record<string, { label: string; color: string }> = {
    CREATE: { label: 'CRÉATION', color: 'bg-[#dcfce7] text-[#15803d]' },
    EDIT: { label: 'MODIFICATION', color: 'bg-[#eff4ff] text-[#188ace]' },
    DELETE: { label: 'SUPPRESSION', color: 'bg-[#fee2e2] text-[#ba1a1a]' },
    VALIDATE: { label: 'VALIDATION', color: 'bg-[#e0e7ff] text-[#4338ca]' },
    EXPORT: { label: 'EXPORTATION', color: 'bg-[#fef9c3] text-[#854d0e]' },
    APPROVE: { label: 'APPROBATION', color: 'bg-[#e6f7f5] text-[#006a61]' },
    REFUND: { label: 'REMBOURSEMENT', color: 'bg-[#ffedd5] text-[#c2410c]' }
  };

  const filteredLogs = logs.filter(log => {
    const q = (search || '').toLowerCase();
    const matchesSearch =
      (log.user || '').toLowerCase().includes(q) ||
      (log.role || '').toLowerCase().includes(q) ||
      (log.entity || '').toLowerCase().includes(q) ||
      (log.module || '').toLowerCase().includes(q) ||
      (log.ipAddress || '').includes(search);

    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesEntity = filterEntity === 'all' || (log.entity || '').toLowerCase().includes(filterEntity.toLowerCase());

    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-[#dae2fd]/70 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#e6f7f5] text-[#006a61]">
            <span className="material-symbols-outlined text-[26px]">history_edu</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-[#0b1c30]">Journal d'Audit & Traçabilité Immuable</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#475569] border border-[#cbd5e1]">
                Logs Sécurisés WORM (Write Once Read Many)
              </span>
            </div>
            <p className="text-[13px] text-[#45464d]">
              Enregistrement infalsifiable de toutes les actions cliniques, financières et administratives pour conformité légale CNDP (Loi 09-08).
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Export du journal d\'audit chiffré en format CSV/JSON certifié pour le Commissaire aux Comptes et la CNDP.')}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-[#f8f9ff] text-[#0b1c30] text-[13px] font-semibold rounded-lg border border-[#cbd5e1] shadow-2xs transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>Exporter Journal Chiffré</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#dae2fd]/70 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Rechercher utilisateur, entité, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[12px] bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden focus:border-[#006a61]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <ClinicalSelect
            value={filterAction}
            onChange={(val) => setFilterAction(val)}
            options={ACTION_OPTIONS}
            size="md"
            className="min-w-[160px]"
            searchable={false}
          />

          <ClinicalSelect
            value={filterEntity}
            onChange={(val) => setFilterEntity(val)}
            options={ENTITY_OPTIONS}
            size="md"
            className="min-w-[160px]"
            searchable={false}
          />
        </div>
      </div>

      {/* Tableau Standardisé du Journal d'Audit WORM */}
      {(() => {
        const columns: ColumnDef<AuditLogEntry>[] = [
          {
            key: 'timestamp',
            header: 'Horodatage',
            width: 'w-[16%]',
            align: 'left',
            render: (log) => (
              <span className="font-mono text-[11px] text-[#45464d]">{log.timestamp}</span>
            ),
          },
          {
            key: 'user',
            header: 'Utilisateur & Rôle',
            width: 'w-[20%]',
            align: 'left',
            render: (log) => (
              <div>
                <div className="font-bold text-[#0b1c30]">{log.user}</div>
                <div className="text-[11px] text-[#76777d] uppercase">{log.role}</div>
              </div>
            ),
          },
          {
            key: 'action',
            header: 'Action',
            width: 'w-[14%]',
            align: 'left',
            render: (log) => {
              const badge = actionBadges[log.action] || {
                label: log.action,
                color: 'bg-slate-100 text-slate-700',
              };
              return (
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${badge.color}`}>
                  {badge.label}
                </span>
              );
            },
          },
          {
            key: 'entity',
            header: 'Entité Ciblée & Module',
            width: 'w-[22%]',
            align: 'left',
            render: (log) => (
              <div>
                <div className="font-semibold text-[#006a61]">{log.entity}</div>
                <div className="text-[11px] text-[#76777d]">{log.module}</div>
              </div>
            ),
          },
          {
            key: 'ip',
            header: 'Adresse IP',
            width: 'w-[13%]',
            align: 'left',
            render: (log) => (
              <span className="font-mono text-[11px] text-[#76777d]">{log.ipAddress}</span>
            ),
          },
          {
            key: 'status',
            header: 'Statut',
            width: 'w-[10%]',
            align: 'left',
            render: (log) => (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-[#15803d] font-semibold">
                <span className="h-2 w-2 rounded-full bg-[#15803d]" />
                <span>{log.result === 'success' ? 'Succès' : log.result}</span>
              </span>
            ),
          },
          {
            key: 'details',
            header: 'Détails',
            width: 'w-[5%]',
            align: 'right',
            render: (log) => (
              <ActionGroup>
                <ActionButton
                  icon="visibility"
                  onClick={() => setSelectedLog(log)}
                  title="Voir le diff d'audit WORM"
                  variant="neutral"
                />
              </ActionGroup>
            ),
          },
        ];

        return (
          <DataTable<AuditLogEntry>
            columns={columns}
            data={filteredLogs}
            keyExtractor={(log) => log.id}
            emptyMessage="Aucun journal d'audit ne correspond aux filtres sélectionnés."
            emptyIcon="security"
            rowHeightClass="h-14"
          />
        );
      })()}

      {/* Diff Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-[16px] text-[#0b1c30]">Détail de l'Action d'Audit WORM</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-3 pt-4 text-[12px]">
              <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#dae2fd]/70 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#76777d]">ID Audit :</span>
                  <span className="font-mono text-[#0b1c30]">{selectedLog.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76777d]">Opérateur :</span>
                  <span className="font-bold text-[#0b1c30]">{selectedLog.user} ({selectedLog.role})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76777d]">Module & Entité :</span>
                  <span className="font-semibold text-[#006a61]">{selectedLog.module} • {selectedLog.entity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#76777d]">Adresse IP & Poste :</span>
                  <span className="font-mono text-[#0b1c30]">{selectedLog.ipAddress}</span>
                </div>
              </div>

              {selectedLog.previousValue && (
                <div>
                  <div className="font-bold text-[#ba1a1a] mb-1">Valeur Antérieure (Avant modification) :</div>
                  <div className="p-3 bg-[#fee2e2]/30 rounded-lg font-mono text-[11px] text-[#7f1d1d] overflow-x-auto border border-[#fecaca]">
                    {selectedLog.previousValue}
                  </div>
                </div>
              )}

              {selectedLog.newValue && (
                <div>
                  <div className="font-bold text-[#15803d] mb-1">Nouvelle Valeur Enregistrée :</div>
                  <div className="p-3 bg-[#dcfce7]/30 rounded-lg font-mono text-[11px] text-[#14532d] overflow-x-auto border border-[#bbf7d0]">
                    {selectedLog.newValue}
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#e2e8f0] flex justify-end">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg font-semibold shadow-xs"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

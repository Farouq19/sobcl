import React, { useState } from 'react';
import { MedicationItem } from '../../types';
import { INITIAL_MEDICATION_STOCK } from '../../data/saasSeedData';
import { ClinicalSelect, SelectOption } from '../common/ClinicalSelect';
import { DataTable, ColumnDef, ActionButton, ActionGroup, TableBadge } from '../common/DataTable';

const SUPPLIER_OPTIONS: SelectOption[] = [
  { value: 'Cooper Pharma Maroc', label: 'Cooper Pharma Maroc', badge: 'Grossiste' },
  { value: 'Laprophan', label: 'Laprophan', badge: 'Laboratoire' },
  { value: 'Sothema', label: 'Sothema', badge: 'Laboratoire' },
  { value: 'Pharmalliance', label: 'Pharmalliance', badge: 'Distributeur' },
];

export const PharmacyView: React.FC = () => {
  const [stock, setStock] = useState<MedicationItem[]>(INITIAL_MEDICATION_STOCK);
  const [search, setSearch] = useState('');
  const [filterAlertsOnly, setFilterAlertsOnly] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedMed, setSelectedMed] = useState<MedicationItem | null>(null);
  const [restockAmount, setRestockAmount] = useState<number>(50);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('Cooper Pharma Maroc');

  const handleOpenRestock = (med: MedicationItem) => {
    setSelectedMed(med);
    setRestockAmount(50);
    setIsRestockModalOpen(true);
  };

  const handleApplyRestock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed) return;

    setStock(stock.map(m => {
      if (m.id === selectedMed.id) {
        return {
          ...m,
          stock: m.stock + restockAmount
        };
      }
      return m;
    }));
    setIsRestockModalOpen(false);
  };

  const filteredStock = stock.filter(m => {
    const q = (search || '').toLowerCase();
    const matchesSearch =
      (m.name || '').toLowerCase().includes(q) ||
      (m.dci || '').toLowerCase().includes(q) ||
      (m.category || '').toLowerCase().includes(q) ||
      (m.batchNumber || '').toLowerCase().includes(q);

    const matchesAlert = !filterAlertsOnly || m.stock <= m.minThreshold;
    return matchesSearch && matchesAlert;
  });

  const lowStockCount = stock.filter(m => m.stock <= m.minThreshold).length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-[#dae2fd]/70 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#e6f7f5] text-[#006a61]">
            <span className="material-symbols-outlined text-[26px]">local_pharmacy</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-[#0b1c30]">Pharmacie Clinique & Gestion des Stocks</h1>
              {lowStockCount > 0 && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#fee2e2] text-[#ba1a1a] border border-[#fecaca] animate-pulse">
                  {lowStockCount} Alerte(s) Rupture Stock
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#45464d]">
              Traçabilité des lots, chaîne du froid (2-8°C), seuils de réapprovisionnement et délivrance hospitalière.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] text-[#76777d]">Valeur Stock Estimée</div>
            <div className="text-[16px] font-bold text-[#006a61]">
              {stock.reduce((acc, m) => acc + (m.stock * m.unitPriceMAD), 0).toLocaleString('fr-FR')} MAD
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#dae2fd]/70 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Rechercher médicament (Nom commercial, DCI, Lot)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-[12px] bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden focus:border-[#006a61]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterAlertsOnly(!filterAlertsOnly)}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-colors ${
              filterAlertsOnly
                ? 'bg-[#ba1a1a] text-white'
                : 'bg-white text-[#ba1a1a] border border-[#ba1a1a]/40 hover:bg-[#fef2f2]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">warning</span>
            <span>Alertes Stock Critique Uniquement ({lowStockCount})</span>
          </button>
        </div>
      </div>

      {/* Tableau Standardisé du Stock Pharmacie */}
      {(() => {
        const columns: ColumnDef<MedicationItem>[] = [
          {
            key: 'specialty',
            header: 'Spécialité & Forme',
            width: 'w-[22%]',
            align: 'left',
            render: (med) => (
              <div>
                <div className="font-bold text-[#0b1c30]">{med.name}</div>
                <div className="text-[11px] text-[#76777d]">{med.dosage} • {med.form}</div>
              </div>
            ),
          },
          {
            key: 'dci',
            header: 'DCI (Dénomination)',
            width: 'w-[16%]',
            align: 'left',
            render: (med) => (
              <span className="font-mono text-[#45464d] text-[11px]">{med.dci}</span>
            ),
          },
          {
            key: 'category',
            header: 'Catégorie',
            width: 'w-[14%]',
            align: 'left',
            render: (med) => (
              <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#188ace] text-[11px] font-medium border border-[#dae2fd]/60">
                {med.category}
              </span>
            ),
          },
          {
            key: 'batch',
            header: 'Lot & Péremption',
            width: 'w-[14%]',
            align: 'left',
            render: (med) => (
              <div className="text-[11px]">
                <div className="font-mono font-medium text-[#0b1c30]">Lot {med.batchNumber}</div>
                <div className="text-[#76777d]">Exp : {med.expiryDate}</div>
              </div>
            ),
          },
          {
            key: 'storage',
            header: 'Conservation',
            width: 'w-[12%]',
            align: 'left',
            render: (med) => (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                  med.storageConditions?.includes('2-8°C')
                    ? 'bg-[#e0f2fe] text-[#0369a1] font-bold border border-[#bae6fd]'
                    : 'bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0]'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {med.storageConditions?.includes('2-8°C') ? 'ac_unit' : 'inventory_2'}
                </span>
                <span>{med.storageConditions}</span>
              </span>
            ),
          },
          {
            key: 'stock',
            header: 'Niveau Stock',
            width: 'w-[10%]',
            align: 'center',
            render: (med) => {
              const isLow = med.stock <= med.minThreshold;
              return (
                <div className="flex flex-col items-center">
                  <span className={`font-bold text-[13px] ${isLow ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'}`}>
                    {med.stock} {med.unit}
                  </span>
                  <span className="text-[10px] text-[#76777d]">
                    Seuil min : {med.minThreshold}
                  </span>
                </div>
              );
            },
          },
          {
            key: 'price',
            header: 'Prix Unitaire',
            width: 'w-[8%]',
            align: 'right',
            render: (med) => (
              <span className="font-bold text-[#006a61]">
                {med.unitPriceMAD.toFixed(2)} MAD
              </span>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            width: 'w-[4%]',
            align: 'right',
            render: (med) => (
              <ActionGroup>
                <ActionButton
                  icon="add_shopping_cart"
                  onClick={() => handleOpenRestock(med)}
                  title="Réapprovisionner le stock"
                  variant="primary"
                />
              </ActionGroup>
            ),
          },
        ];

        return (
          <DataTable<MedicationItem>
            columns={columns}
            data={filteredStock}
            keyExtractor={(med) => med.id}
            emptyMessage="Aucun médicament ne correspond aux critères de recherche."
            emptyIcon="medication"
            rowHeightClass="h-14"
            getRowClassName={(med) =>
              med.stock <= med.minThreshold ? 'bg-[#fee2e2]/15' : ''
            }
          />
        );
      })()}

      {/* Restock Modal */}
      {isRestockModalOpen && selectedMed && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-[16px] text-[#0b1c30]">Réapprovisionnement Pharmacie</h3>
              <button
                onClick={() => setIsRestockModalOpen(false)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleApplyRestock} className="space-y-4 pt-4 text-[12px]">
              <div>
                <label className="block text-[#76777d] mb-1">Médicament</label>
                <div className="font-bold text-[14px] text-[#0b1c30]">{selectedMed.name}</div>
                <div className="text-[#76777d]">{selectedMed.dci} — Stock actuel : {selectedMed.stock} {selectedMed.unit}</div>
              </div>

              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Quantité à ajouter au stock</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Fournisseur / Grossiste Répartiteur</label>
                <ClinicalSelect
                  value={selectedSupplier}
                  onChange={(val) => setSelectedSupplier(val)}
                  options={SUPPLIER_OPTIONS}
                  fullWidth
                  size="lg"
                  searchable={false}
                />
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRestockModalOpen(false)}
                  className="px-4 py-2 text-[#45464d] hover:bg-[#f1f5f9] rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg font-semibold shadow-xs"
                >
                  Valider la réception
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

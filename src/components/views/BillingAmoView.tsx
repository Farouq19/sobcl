import React, { useState } from 'react';
import { Invoice, ViewMode } from '../../types';
import { AppBusinessConfig, DEFAULT_BUSINESS_CONFIG } from '../../data/businessConfig';
import { ClinicalSelect, SelectOption } from '../common/ClinicalSelect';
import { DataTable, Column, TableBadge } from '../common/DataTable';

interface BillingAmoViewProps {
  invoices: Invoice[];
  onNavigate: (view: ViewMode) => void;
  onOpenAmoCheck: () => void;
  onOpenCashRegister: () => void;
  onPayInvoice: (invoiceId: string, paymentMethod: 'cash' | 'card' | 'transfer' | 'cheque') => void;
  businessConfig?: AppBusinessConfig;
}

export const BillingAmoView: React.FC<BillingAmoViewProps> = ({
  invoices,
  onNavigate,
  onOpenAmoCheck,
  onOpenCashRegister,
  onPayInvoice,
  businessConfig = DEFAULT_BUSINESS_CONFIG
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice>(invoices[0]);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'card' | 'transfer' | 'cheque'>('cash');
  const [cashGiven, setCashGiven] = useState<number>(500);
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'bordereaux' | 'rejets'>('invoices');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'rejected'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quote Simulator State based on configured business rules
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simActType, setSimActType] = useState<'general' | 'specialist' | 'emergency' | 'bedSingle' | 'bedVip' | 'orHour'>('specialist');
  const [simCoverageOrg, setSimCoverageOrg] = useState<'cnss' | 'cnops' | 'tadamon' | 'private' | 'none'>('cnss');
  const [simIsNight, setSimIsNight] = useState(false);

  // Calculate based on dynamic configured tariffs & AMO rates
  const getSimBasePrice = () => {
    switch (simActType) {
      case 'general': return businessConfig.tariffs.consultationGeneral;
      case 'specialist': return businessConfig.tariffs.consultationSpecialist;
      case 'emergency': return businessConfig.tariffs.consultationEmergency;
      case 'bedSingle': return businessConfig.tariffs.bedRates.standardSingle;
      case 'bedVip': return businessConfig.tariffs.bedRates.suiteVip;
      case 'orHour': return businessConfig.tariffs.surgery.orHourRateIso5;
      default: return 300;
    }
  };

  const simBasePrice = getSimBasePrice();
  const simSurcharge = simIsNight ? Math.round(simBasePrice * (businessConfig.tariffs.surcharges.nightSurchargePercent / 100)) : 0;
  const simTotalBrut = simBasePrice + simSurcharge;

  const getSimCoverageRate = () => {
    switch (simCoverageOrg) {
      case 'cnss': return businessConfig.amoRules.cnssRatePercent;
      case 'cnops': return businessConfig.amoRules.cnopsRatePercent;
      case 'tadamon': return businessConfig.amoRules.tadamonRatePercent;
      case 'private': return businessConfig.amoRules.privateInsuranceRatePercent;
      case 'none': return 0;
    }
  };

  const simCoveragePercent = getSimCoverageRate();
  const simPartAmo = Math.round(simTotalBrut * (simCoveragePercent / 100));
  const simTicketModerateur = simTotalBrut - simPartAmo;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredInvoices = invoices.filter((inv) => {
    if (filterStatus === 'all') return true;
    return inv.status === filterStatus;
  });

  const changeDue = Math.max(0, cashGiven - selectedInvoice.patientAmount);

  const handleValidatePayment = () => {
    onPayInvoice(selectedInvoice.id, paymentMode);
    setSelectedInvoice({
      ...selectedInvoice,
      status: 'paid',
      paymentMethod: paymentMode
    });
    showToast(`Paiement de ${selectedInvoice.patientAmount} MAD validé. Quittance n° QUITT-${Date.now().toString().slice(-4)} imprimée.`);
  };

  return (
    <div className="space-y-5 pb-12">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#dae2fd]/30 flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-[#86f2e4] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Strip: Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#45464d]">Facturé Aujourd'hui</span>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-headline text-2xl font-bold text-[#006a61]">48 500</span>
              <span className="text-[12px] font-bold text-[#45464d]">MAD</span>
            </div>
            <span className="text-[11px] text-[#76777d]">58 factures émises ce jour</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#45464d]">Tiers-Payant AMO en cours</span>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-headline text-2xl font-bold text-blue-700">112 400</span>
              <span className="text-[12px] font-bold text-[#45464d]">MAD</span>
            </div>
            <span className="text-[11px] text-[#76777d]">Bordereaux CNSS & CNOPS</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between">
          <span className="text-[12px] font-medium text-[#45464d]">Reste à charge guichet</span>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-headline text-2xl font-bold text-amber-600">4 200</span>
              <span className="text-[12px] font-bold text-[#45464d]">MAD</span>
            </div>
            <span className="text-[11px] text-[#76777d]">Tickets modérateurs en cours</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => onNavigate('amo-portal')}
          className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0] hover:border-red-400 cursor-pointer flex flex-col justify-between transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#45464d]">Rejets & Litiges AMO</span>
            <span className="text-[10px] font-bold bg-red-100 text-red-800 px-1.5 py-0.2 rounded">3 dossiers</span>
          </div>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="font-headline text-2xl font-bold text-[#ba1a1a]">850</span>
              <span className="text-[12px] font-bold text-[#45464d]">MAD</span>
            </div>
            <span className="text-[11px] text-red-700 flex items-center gap-1">
              <span>Voir et corriger les rejets</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </span>
          </div>
        </div>
      </div>

      {/* Subnav & Actions */}
      <div className="bg-white rounded-xl px-4 py-2.5 shadow-2xs border border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('invoices')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeSubTab === 'invoices' ? 'bg-[#131b2e] text-white' : 'text-[#45464d] hover:bg-slate-100'
            }`}
          >
            Factures Récentes & Caisse
          </button>
          <button
            onClick={() => onNavigate('amo-portal')}
            className="px-3 py-1.5 text-[12px] font-semibold text-[#45464d] hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px] text-[#006a61]">verified_user</span>
            <span>Bordereaux Tiers-Payant AMO</span>
          </button>
          <button
            onClick={() => onNavigate('amo-portal')}
            className="px-3 py-1.5 text-[12px] font-semibold text-red-700 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">report_problem</span>
            <span>Rejets & Contentieux (3)</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAmoCheck}
            className="px-3 py-1.5 bg-[#e6f7f5] hover:bg-[#c9f1eb] text-[#006a61] text-[12px] font-semibold rounded-lg border border-[#86f2e4]/70 transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Vérifier AMO</span>
          </button>
          <button
            onClick={onOpenCashRegister}
            className="px-3.5 py-1.5 bg-[#131b2e] hover:bg-[#202c46] text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">lock_clock</span>
            <span>Clôture Journalière</span>
          </button>
        </div>
      </div>

      {/* Dynamic Configuration Banner */}
      <div className="bg-[#f8f9ff] rounded-xl p-3.5 border border-[#dae2fd] flex flex-col md:flex-row md:items-center justify-between gap-3 text-[12px]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006a61] text-[20px]">tune</span>
          <div>
            <span className="font-bold text-[#0b1c30]">Barèmes Actifs Paramétrés :</span>{' '}
            <span className="text-[#45464d]">
              CNSS <strong className="text-[#006a61]">{businessConfig.amoRules.cnssRatePercent}%</strong> • 
              CNOPS <strong className="text-[#006a61]">{businessConfig.amoRules.cnopsRatePercent}%</strong> • 
              Tadamon <strong className="text-[#006a61]">{businessConfig.amoRules.tadamonRatePercent}%</strong> • 
              Consultation G. <strong className="text-[#0b1c30]">{businessConfig.tariffs.consultationGeneral} MAD</strong> • 
              Nuitée Simple <strong className="text-[#0b1c30]">{businessConfig.tariffs.bedRates.standardSingle} MAD</strong> • 
              Majoration Nuit <strong className="text-[#d97706]">+{businessConfig.tariffs.surcharges.nightSurchargePercent}%</strong>
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-[#eff4ff] text-[#006a61] font-semibold rounded-lg border border-[#86f2e4] transition-colors flex items-center gap-1 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">calculate</span>
            <span>Simulateur de Devis Dynamique</span>
          </button>
          <button
            onClick={() => onNavigate('settings')}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-[#45464d] font-semibold rounded-lg border border-[#cbd5e1] transition-colors flex items-center gap-1"
            title="Modifier les tarifs dans les paramètres"
          >
            <span className="material-symbols-outlined text-[16px]">settings</span>
            <span>Modifier Barèmes</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Invoices Registry (7 cols) + Right Checkout Terminal (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Registry Table */}
        <div className="lg:col-span-7 bg-white rounded-xl shadow-2xs border border-[#e2e8f0] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#f1f5f9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-headline text-base font-bold text-[#0b1c30] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#006a61] text-[20px]">receipt_long</span>
                Registre des Factures du Jour
              </h3>
              <span className="text-[11px] text-[#76777d]">Affichage dynamique et prise en charge en temps réel</span>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${
                  filterStatus === 'all' ? 'bg-[#131b2e] text-white' : 'bg-[#f1f5f9] text-[#45464d] hover:bg-[#e2e8f0]'
                }`}
              >
                Toutes ({invoices.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${
                  filterStatus === 'pending' ? 'bg-amber-600 text-white' : 'bg-[#f1f5f9] text-[#45464d] hover:bg-[#e2e8f0]'
                }`}
              >
                En attente
              </button>
              <button
                onClick={() => setFilterStatus('paid')}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md ${
                  filterStatus === 'paid' ? 'bg-emerald-600 text-white' : 'bg-[#f1f5f9] text-[#45464d] hover:bg-[#e2e8f0]'
                }`}
              >
                Réglées
              </button>
            </div>
          </div>

          {/* Standardized DataTable */}
          <div className="flex-1 overflow-x-auto">
            <DataTable<Invoice>
              columns={[
                {
                  key: 'invoice',
                  header: 'N° Facture & Heure',
                  width: '22%',
                  render: (inv) => (
                    <div>
                      <div className="font-bold text-[#0b1c30]">{inv.invoiceNumber}</div>
                      <div className="text-[11px] text-[#76777d]">{inv.time}</div>
                    </div>
                  ),
                },
                {
                  key: 'patient',
                  header: 'Patient & CIN',
                  width: '28%',
                  render: (inv) => (
                    <div>
                      <div className="font-semibold text-[#0b1c30]">{inv.patientName}</div>
                      <div className="text-[11px] text-[#76777d]">
                        CIN: {inv.patientCin} • <span className="text-[#006a61] font-medium">{inv.insuranceType}</span>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'totals',
                  header: 'Total / AMO',
                  width: '22%',
                  render: (inv) => (
                    <div>
                      <div className="font-bold text-[#0b1c30]">{inv.totalAmount.toLocaleString()} MAD</div>
                      <div className="text-[11px] text-[#006a61]">
                        AMO: -{inv.amoAmount.toLocaleString()} MAD ({inv.amoCoveragePercent}%)
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'patientAmount',
                  header: 'Reste Patient',
                  width: '16%',
                  render: (inv) => (
                    <span className="font-bold text-[#ba1a1a]">
                      {inv.patientAmount.toLocaleString()} MAD
                    </span>
                  ),
                },
                {
                  key: 'status',
                  header: 'Statut',
                  width: '12%',
                  align: 'right',
                  render: (inv) => {
                    if (inv.status === 'pending') {
                      return (
                        <TableBadge variant="amber" icon="schedule">
                          À Encaisser
                        </TableBadge>
                      );
                    }
                    if (inv.status === 'paid') {
                      return (
                        <TableBadge variant="emerald" icon="check_circle">
                          Réglé
                        </TableBadge>
                      );
                    }
                    if (inv.status === 'rejected') {
                      return (
                        <TableBadge variant="red" icon="cancel">
                          Rejeté AMO
                        </TableBadge>
                      );
                    }
                    if (inv.status === 'transmitted') {
                      return (
                        <TableBadge variant="blue" icon="send">
                          Télétransmis
                        </TableBadge>
                      );
                    }
                    return <TableBadge variant="neutral">{inv.status}</TableBadge>;
                  },
                },
              ]}
              data={filteredInvoices}
              onRowClick={(inv) => setSelectedInvoice(inv)}
              emptyMessage="Aucune facture ne correspond au filtre sélectionné"
              rowHeight="h-14"
            />
          </div>
        </div>

        {/* Right Checkout & Terminal */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-2xs border border-[#e2e8f0] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-3">
                {selectedInvoice.patientPhoto ? (
                  <img
                    src={selectedInvoice.patientPhoto}
                    alt={selectedInvoice.patientName}
                    className="h-11 w-11 rounded-full object-cover border border-[#cbd5e1]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-[#e6f7f5] text-[#006a61] font-bold flex items-center justify-center">
                    {selectedInvoice.patientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-headline text-base font-bold text-[#0b1c30]">
                    {selectedInvoice.patientName}
                  </h3>
                  <div className="text-[11px] text-[#76777d]">
                    {selectedInvoice.invoiceNumber} • CIN: {selectedInvoice.patientCin}
                  </div>
                </div>
              </div>

              <span className="text-[11px] font-bold bg-[#006a61] text-white px-2 py-0.5 rounded">
                {selectedInvoice.insuranceType} ({selectedInvoice.amoCoveragePercent}%)
              </span>
            </div>

            {/* Actes Décomposés */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider block">
                Décomposition des Prestations Réalisées
              </span>
              <div className="bg-[#f8f9ff] rounded-xl p-3 border border-[#dae2fd] space-y-2 text-[12px]">
                {selectedInvoice.items.map((it) => (
                  <div key={it.id} className="flex justify-between items-center py-1 border-b border-white/60 last:border-0">
                    <div>
                      <div className="font-medium text-[#0b1c30]">{it.description}</div>
                      {it.doctor && <div className="text-[10px] text-[#76777d]">{it.doctor}</div>}
                    </div>
                    <div className="font-bold text-[#0b1c30]">{it.amount.toLocaleString()} MAD</div>
                  </div>
                ))}

                <div className="pt-2 border-t border-[#dae2fd] flex justify-between font-bold text-[#0b1c30]">
                  <span>Total Brut des Actes :</span>
                  <span>{selectedInvoice.totalAmount.toLocaleString()} MAD</span>
                </div>
              </div>
            </div>

            {/* Ventilation AMO vs Ticket Modérateur */}
            <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dae2fd] space-y-2 text-[12px]">
              <div className="flex justify-between text-[#006a61]">
                <span className="font-medium">Prise en charge {selectedInvoice.insuranceType} ({selectedInvoice.amoCoveragePercent}%) :</span>
                <span className="font-bold">- {selectedInvoice.amoAmount.toLocaleString()} MAD</span>
              </div>
              <div className="text-[10px] text-[#76777d] italic">
                {selectedInvoice.fseNumber || 'FSE Télétransmise passerelle Masar'}
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-[#dae2fd]">
                <span className="text-[13px] font-bold text-[#0b1c30]">Net à Payer (Ticket Modérateur) :</span>
                <span className="font-headline text-xl font-bold text-[#ba1a1a]">
                  {selectedInvoice.patientAmount.toLocaleString()} MAD
                </span>
              </div>
            </div>

            {/* Payment Mode Selector */}
            {selectedInvoice.status === 'pending' && (
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#45464d] uppercase tracking-wider block">
                  Mode de Règlement Guichet
                </span>

                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setPaymentMode('cash')}
                    className={`py-2 text-[11px] font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      paymentMode === 'cash'
                        ? 'border-[#006a61] bg-[#e6f7f5] text-[#006a61]'
                        : 'border-[#dae2fd] bg-white text-[#45464d] hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span>Espèces</span>
                  </button>

                  <button
                    onClick={() => setPaymentMode('card')}
                    className={`py-2 text-[11px] font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      paymentMode === 'card'
                        ? 'border-[#006a61] bg-[#e6f7f5] text-[#006a61]'
                        : 'border-[#dae2fd] bg-white text-[#45464d] hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                    <span>CMI / TPE</span>
                  </button>

                  <button
                    onClick={() => setPaymentMode('transfer')}
                    className={`py-2 text-[11px] font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      paymentMode === 'transfer'
                        ? 'border-[#006a61] bg-[#e6f7f5] text-[#006a61]'
                        : 'border-[#dae2fd] bg-white text-[#45464d] hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">account_balance</span>
                    <span>Virement</span>
                  </button>

                  <button
                    onClick={() => setPaymentMode('cheque')}
                    className={`py-2 text-[11px] font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      paymentMode === 'cheque'
                        ? 'border-[#006a61] bg-[#e6f7f5] text-[#006a61]'
                        : 'border-[#dae2fd] bg-white text-[#45464d] hover:bg-[#f8f9ff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">receipt</span>
                    <span>Chèque</span>
                  </button>
                </div>

                {/* Cash Calculator if mode == 'cash' */}
                {paymentMode === 'cash' && (
                  <div className="bg-[#f8f9ff] p-3 rounded-xl border border-[#dae2fd] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#45464d]">Espèces remises par le patient :</span>
                      <div className="flex gap-1">
                        {[450, 500, 1000].map((quick) => (
                          <button
                            key={quick}
                            onClick={() => setCashGiven(quick)}
                            className="px-2 py-0.5 text-[10px] font-bold bg-white border border-[#cbd5e1] rounded hover:bg-[#eff4ff] text-[#0b1c30]"
                          >
                            {quick} MAD
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={cashGiven}
                        onChange={(e) => setCashGiven(parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 bg-white text-[14px] font-bold text-[#0b1c30] border border-[#dae2fd] rounded-lg outline-hidden"
                      />
                      <span className="text-[12px] font-bold text-[#76777d]">MAD</span>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#cbd5e1] text-[12px]">
                      <span className="font-semibold text-[#0b1c30]">Monnaie à rendre au patient :</span>
                      <span className="font-headline text-base font-bold text-emerald-700">
                        {changeDue.toFixed(2)} MAD
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="pt-3 border-t border-[#f1f5f9] space-y-2">
            {selectedInvoice.status === 'pending' ? (
              <button
                onClick={handleValidatePayment}
                className="w-full py-2.5 px-4 bg-[#006a61] hover:bg-[#00544d] text-white text-[13px] font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Valider l'Encaissement & Émettre Quittance</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-[12px] text-emerald-800 flex items-center justify-between font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span>Facture entièrement acquittée</span>
                  </span>
                  <span className="font-bold">Mode : {selectedInvoice.paymentMethod || 'Espèces'}</span>
                </div>
                <button
                  onClick={() => showToast('Quittance officielle imprimée avec QR code ANAM')}
                  className="w-full py-2 px-3 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#006a61] text-[12px] font-semibold rounded-lg border border-[#dae2fd] transition-colors flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Réimprimer le Reçu & Quittance</span>
                </button>
              </div>
            )}

            <button
              onClick={() => showToast(`Dossier FSE télétransmis avec succès aux serveurs de l'ANAM.`)}
              className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-[#0b1c30] text-[11px] font-semibold rounded-lg border border-[#cbd5e1] transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006a61]">send</span>
              <span>Télétransmettre à la CNSS / CNOPS (Passerelle Masar)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quote & Co-Pay Simulator Modal based on configured rules */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#006a61] text-[22px]">calculate</span>
                <h3 className="font-bold text-[16px] text-[#0b1c30]">Simulateur de Facturation Dynamique</h3>
              </div>
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-[12px] text-[#76777d]">
              Ce simulateur calcule en temps réel la prise en charge et le reste à charge selon la <strong>configuration active</strong> de votre établissement.
            </p>

            <div className="space-y-3 text-[12px]">
              <div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Prestation ou Acte :</label>
                <ClinicalSelect
                  value={simActType}
                  onChange={(val) => setSimActType(val)}
                  options={[
                    { value: 'general', label: `Consultation Médecine Générale`, badge: `${businessConfig.tariffs.consultationGeneral} MAD` },
                    { value: 'specialist', label: `Consultation Spécialiste`, badge: `${businessConfig.tariffs.consultationSpecialist} MAD` },
                    { value: 'emergency', label: `Consultation Urgences 24/7`, badge: `${businessConfig.tariffs.consultationEmergency} MAD` },
                    { value: 'bedSingle', label: `Nuitée Chambre Individuelle`, badge: `${businessConfig.tariffs.bedRates.standardSingle} MAD` },
                    { value: 'bedVip', label: `Nuitée Suite VIP`, badge: `${businessConfig.tariffs.bedRates.suiteVip} MAD` },
                    { value: 'orHour', label: `1 Heure Bloc ISO 5`, badge: `${businessConfig.tariffs.surgery.orHourRateIso5} MAD` },
                  ]}
                  fullWidth
                  size="md"
                  searchable={false}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#45464d] mb-1">Couverture Patient / Mutuelle :</label>
                <ClinicalSelect
                  value={simCoverageOrg}
                  onChange={(val) => setSimCoverageOrg(val)}
                  options={[
                    { value: 'cnss', label: `CNSS Salarié`, badge: `${businessConfig.amoRules.cnssRatePercent}% PEC` },
                    { value: 'cnops', label: `CNOPS Fonctionnaire`, badge: `${businessConfig.amoRules.cnopsRatePercent}% PEC` },
                    { value: 'tadamon', label: `AMO Tadamon`, badge: `${businessConfig.amoRules.tadamonRatePercent}% Gratuité` },
                    { value: 'private', label: `Assurance Privée`, badge: `${businessConfig.amoRules.privateInsuranceRatePercent}% PEC` },
                    { value: 'none', label: `Sans Couverture (Plein Tarif 100%)`, badge: '100% Patient' },
                  ]}
                  fullWidth
                  size="md"
                  searchable={false}
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#f8f9ff] rounded-lg border border-[#dae2fd]">
                <div>
                  <div className="font-semibold text-[#0b1c30]">Majoration Nuit / Week-end</div>
                  <div className="text-[10px] text-[#76777d]">Applique +{businessConfig.tariffs.surcharges.nightSurchargePercent}% selon la règle active</div>
                </div>
                <input
                  type="checkbox"
                  checked={simIsNight}
                  onChange={(e) => setSimIsNight(e.target.checked)}
                  className="h-5 w-5 text-[#006a61] rounded cursor-pointer"
                />
              </div>

              {/* Simulation Result Card */}
              <div className="p-4 bg-white rounded-xl border-2 border-[#006a61] space-y-2.5 shadow-2xs mt-2">
                <div className="flex justify-between text-[12px] text-[#45464d]">
                  <span>Montant Brut de la Prestation :</span>
                  <span className="font-bold text-[#0b1c30]">{simBasePrice} MAD</span>
                </div>
                {simIsNight && (
                  <div className="flex justify-between text-[12px] text-amber-700">
                    <span>Majoration Nuit (+{businessConfig.tariffs.surcharges.nightSurchargePercent}%) :</span>
                    <span className="font-bold">+{simSurcharge} MAD</span>
                  </div>
                )}
                <div className="flex justify-between text-[12px] text-blue-700 font-semibold pt-1 border-t border-[#f1f5f9]">
                  <span>Part AMO / Tiers-Payant ({simCoveragePercent}%) :</span>
                  <span>{simPartAmo} MAD</span>
                </div>
                <div className="flex justify-between text-[14px] font-bold text-[#006a61] pt-2 border-t border-[#dae2fd]">
                  <span>Reste à Charge Patient (Ticket Modérateur) :</span>
                  <span className="text-lg">{simTicketModerateur} MAD</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setIsSimulatorOpen(false)}
                className="px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#0b1c30] text-[12px] font-semibold rounded-lg"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  showToast(`Devis de ${simTotalBrut} MAD (${simTicketModerateur} MAD à charge) généré.`);
                  setIsSimulatorOpen(false);
                }}
                className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-semibold rounded-lg shadow-xs"
              >
                Générer Devis Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

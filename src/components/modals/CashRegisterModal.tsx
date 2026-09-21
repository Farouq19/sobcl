import React, { useState } from 'react';

interface CashRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalCollected: number;
}

export const CashRegisterModal: React.FC<CashRegisterModalProps> = ({
  isOpen,
  onClose,
  totalCollected = 48500
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [closed, setClosed] = useState(false);

  if (!isOpen) return null;

  const handleConfirmClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setClosed(true);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-[#cbd5e1] w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#131b2e] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#86f2e4] text-[22px]">
              point_of_sale
            </span>
            <div>
              <h3 className="font-headline text-[15px] font-bold">
                Clôture de Caisse Journalière
              </h3>
              <p className="text-[11px] text-slate-300">
                Clinique Al Bassma • Caisse Principale Rez-de-Chaussée
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {!closed ? (
            <>
              <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#dae2fd]">
                <div className="text-[11px] font-semibold text-[#76777d] uppercase tracking-wider">
                  Total des Recettes Guichet Validées
                </div>
                <div className="font-headline text-2xl font-bold text-[#006a61] mt-1">
                  {totalCollected.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                </div>
              </div>

              <div className="space-y-2 text-[12px]">
                <div className="flex justify-between py-1.5 border-b border-[#f1f5f9]">
                  <span className="text-[#45464d] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-emerald-600">payments</span>
                    Espèces en coffre caisse
                  </span>
                  <span className="font-semibold text-[#0b1c30]">24 100,00 MAD</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#f1f5f9]">
                  <span className="text-[#45464d] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-blue-600">credit_card</span>
                    Télécollecte TPE Bancaire CMI
                  </span>
                  <span className="font-semibold text-[#0b1c30]">18 400,00 MAD</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#f1f5f9]">
                  <span className="text-[#45464d] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-amber-600">receipt</span>
                    Chèques certifiés & Virements
                  </span>
                  <span className="font-semibold text-[#0b1c30]">6 000,00 MAD</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-amber-700">warning</span>
                <span>
                  La clôture verrouillera le journal d'encaissements du jour et générera le bordereau de remise en banque.
                </span>
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-3">
              <span className="material-symbols-outlined text-[54px] text-emerald-600">
                check_circle
              </span>
              <h4 className="font-headline text-lg font-bold text-[#0b1c30]">
                Caisse Clôturée avec Succès
              </h4>
              <p className="text-[12px] text-[#45464d] max-w-sm mx-auto">
                Le rapport comptable n° CLT-2024-1024 a été archivé et télétransmis au service comptabilité centrale.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f8f9ff] border-t border-[#dae2fd] flex justify-end gap-2">
          {!closed ? (
            <>
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 text-[12px] font-semibold text-[#45464d] hover:bg-slate-200 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmClose}
                disabled={isClosing}
                className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[#006a61] hover:bg-[#00544d] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[16px]">lock</span>
                {isClosing ? 'Clôture en cours...' : 'Confirmer la Clôture & Télécollecte'}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[#006a61] hover:bg-[#00544d] rounded-lg transition-colors"
            >
              Fermer le Registre
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

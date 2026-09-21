import React, { useState } from 'react';
import { ClinicalSelect, SelectOption } from '../common/ClinicalSelect';

const ORGANISM_OPTIONS: SelectOption[] = [
  { value: 'CNOPS', label: 'CNOPS (Secteur Public)', badge: 'CNOPS' },
  { value: 'CNSS', label: 'CNSS (Secteur Privé)', badge: 'CNSS' },
  { value: 'TADAMON', label: 'AMO TADAMON (Ex-RAMED)', badge: 'Tadamon' },
];

interface AmoCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCin?: string;
}

export const AmoCheckModal: React.FC<AmoCheckModalProps> = ({
  isOpen,
  onClose,
  defaultCin = 'BE482910'
}) => {
  const [cin, setCin] = useState(defaultCin);
  const [organism, setOrganism] = useState<'CNSS' | 'CNOPS' | 'TADAMON'>('CNOPS');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    status: 'eligible' | 'not_found' | 'suspended';
    patientName: string;
    cin: string;
    immatriculation: string;
    rate: number;
    ententeRequise: boolean;
    validityEnd: string;
    mutuelleComplementaire?: string;
  } | null>({
    status: 'eligible',
    patientName: 'M. Youssef Benjelloun',
    cin: 'BE482910',
    immatriculation: '8492019482-01',
    rate: 80,
    ententeRequise: false,
    validityEnd: '31/12/2025',
    mutuelleComplementaire: 'Saham / Sanlam (Couverture 20% reliquat)'
  });

  if (!isOpen) return null;

  const handleQuery = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (cin.toUpperCase().includes('BK55')) {
        setResult({
          status: 'eligible',
          patientName: 'Mme Kenza Berrada',
          cin: cin.toUpperCase(),
          immatriculation: '109823441-90',
          rate: 70,
          ententeRequise: false,
          validityEnd: '30/06/2025',
          mutuelleComplementaire: 'Aucune mutuelle déclarée'
        });
      } else {
        setResult({
          status: 'eligible',
          patientName: 'M. Youssef Benjelloun',
          cin: cin.toUpperCase(),
          immatriculation: '8492019482-01',
          rate: organism === 'CNSS' ? 70 : 80,
          ententeRequise: false,
          validityEnd: '31/12/2025',
          mutuelleComplementaire: 'Saham / Sanlam (20% reliquat)'
        });
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-[#cbd5e1] w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#131b2e] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#86f2e4] text-[22px]">
              verified_user
            </span>
            <div>
              <h3 className="font-headline text-[15px] font-bold">
                Vérification AMO Directe (CNSS / CNOPS)
              </h3>
              <p className="text-[11px] text-slate-300">
                Interrogation sécurisée via la passerelle Masar Santé & ANAM
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

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#45464d] uppercase tracking-wider mb-1">
                N° CIN Patient
              </label>
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value)}
                placeholder="Ex: BE482910"
                className="w-full px-3 py-2 bg-[#f8f9ff] text-[13px] font-bold text-[#0b1c30] border border-[#dae2fd] rounded-lg focus:border-[#006a61] outline-hidden uppercase tracking-wider"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#45464d] uppercase tracking-wider mb-1">
                Organisme Gestionnaire
              </label>
              <ClinicalSelect
                value={organism}
                onChange={(val) => setOrganism(val as any)}
                options={ORGANISM_OPTIONS}
                fullWidth
                size="lg"
                searchable={false}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleQuery}
              disabled={isVerifying || !cin}
              className="flex-1 py-2.5 px-4 bg-[#006a61] hover:bg-[#00544d] text-white text-[13px] font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isVerifying ? 'sync' : 'network_check'}
              </span>
              <span>{isVerifying ? 'Interrogation du serveur ANAM...' : 'Interroger l\'Éligibilité en Direct'}</span>
            </button>
          </div>

          {/* Result Card */}
          {result && !isVerifying && (
            <div className="bg-[#eff4ff] border border-[#dae2fd] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#cbd5e1]/50">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-[13px] font-bold text-emerald-800">
                    Droits Ouverts & Actifs (Tiers-Payant Autorisé)
                  </span>
                </div>
                <span className="text-[11px] font-bold bg-[#006a61] text-white px-2 py-0.5 rounded">
                  {organism} {result.rate}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[12px]">
                <div>
                  <span className="text-[#76777d] block text-[11px]">Bénéficiaire :</span>
                  <span className="font-semibold text-[#0b1c30]">{result.patientName}</span>
                </div>
                <div>
                  <span className="text-[#76777d] block text-[11px]">N° Immatriculation :</span>
                  <span className="font-mono font-medium text-[#0b1c30]">{result.immatriculation}</span>
                </div>
                <div>
                  <span className="text-[#76777d] block text-[11px]">Fin de validité des droits :</span>
                  <span className="font-medium text-[#0b1c30]">{result.validityEnd}</span>
                </div>
                <div>
                  <span className="text-[#76777d] block text-[11px]">Prise en Charge Électronique :</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    Télétransmission FSE OK
                  </span>
                </div>
              </div>

              {result.mutuelleComplementaire && (
                <div className="p-2.5 bg-white rounded-lg border border-[#cbd5e1]/60 text-[11px] text-[#45464d] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006a61] text-[16px]">
                    shield
                  </span>
                  <span>{result.mutuelleComplementaire}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-[#f8f9ff] border-t border-[#dae2fd] flex items-center justify-between">
          <span className="text-[11px] text-[#76777d] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-emerald-600">lock</span>
            Conformité CNDP n° A-M-342/2023
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-[12px] font-semibold text-[#45464d] hover:bg-slate-200 rounded-lg transition-colors"
            >
              Fermer
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[#006a61] hover:bg-[#00544d] rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">check</span>
              Valider pour ce dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

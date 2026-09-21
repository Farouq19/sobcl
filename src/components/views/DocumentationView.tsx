import React, { useState } from 'react';
import { ViewMode } from '../../types';

interface DocumentationViewProps {
  onNavigate: (view: ViewMode) => void;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'flows' | 'amo-tech'>('flows');
  const [selectedFlow, setSelectedFlow] = useState<'admission' | 'consultation' | 'hospitalization' | 'billing' | 'rejection'>('admission');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#dae2fd]/30 flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-[#86f2e4] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-2xs border border-[#e2e8f0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-[#e6f7f5] text-[#006a61] rounded-xl">
            <span className="material-symbols-outlined text-[28px]">menu_book</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-headline text-xl sm:text-2xl font-bold text-[#0b1c30]">
                Guide Opérationnel & Documentation Système
              </h1>
              <span className="text-[11px] font-bold bg-[#eff4ff] text-[#006a61] px-2.5 py-0.5 rounded-full border border-[#dae2fd]">
                Version 2024.1 Certifiée ANAM
              </span>
            </div>
            <p className="text-[13px] text-[#45464d] mt-1">
              Architecture des flux cliniques, spécifications fonctionnelles des modules et conformité réglementaire marocaine.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              window.print();
              showToast('Lancement de l\'impression du guide...');
            }}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-[#0b1c30] text-[12px] font-semibold rounded-lg border border-[#cbd5e1] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Imprimer / Exporter PDF</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl p-1.5 shadow-2xs border border-[#e2e8f0] flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('flows')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'flows'
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">account_tree</span>
          <span>1. Cartographie des Flux Métiers (Flows)</span>
        </button>

        <button
          onClick={() => setActiveTab('modules')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'modules'
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">apps</span>
          <span>2. Modules Fonctionnels Détaillés</span>
        </button>

        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">apartment</span>
          <span>3. Contexte & Rôles Cliniques</span>
        </button>

        <button
          onClick={() => setActiveTab('amo-tech')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-lg text-[13px] font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'amo-tech'
              ? 'bg-[#131b2e] text-white shadow-xs'
              : 'text-[#45464d] hover:bg-[#eff4ff] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">security</span>
          <span>4. Passerelle AMO & Conformité CNDP</span>
        </button>
      </div>

      {/* CONTENT TAB 1: FLOWS */}
      {activeTab === 'flows' && (
        <div className="space-y-6">
          {/* Sub-selector of flows */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedFlow('admission')}
              className={`px-3.5 py-2 text-[12px] font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFlow === 'admission'
                  ? 'bg-[#006a61] text-white shadow-xs'
                  : 'bg-white text-[#45464d] border border-[#cbd5e1] hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>Flow A : Admission & Vérification AMO</span>
            </button>

            <button
              onClick={() => setSelectedFlow('consultation')}
              className={`px-3.5 py-2 text-[12px] font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFlow === 'consultation'
                  ? 'bg-[#006a61] text-white shadow-xs'
                  : 'bg-white text-[#45464d] border border-[#cbd5e1] hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">stethoscope</span>
              <span>Flow B : Prise en Charge Médicale & Examens</span>
            </button>

            <button
              onClick={() => setSelectedFlow('hospitalization')}
              className={`px-3.5 py-2 text-[12px] font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFlow === 'hospitalization'
                  ? 'bg-[#006a61] text-white shadow-xs'
                  : 'bg-white text-[#45464d] border border-[#cbd5e1] hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">bed</span>
              <span>Flow C : Hospitalisation & Plan de Soins</span>
            </button>

            <button
              onClick={() => setSelectedFlow('billing')}
              className={`px-3.5 py-2 text-[12px] font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFlow === 'billing'
                  ? 'bg-[#006a61] text-white shadow-xs'
                  : 'bg-white text-[#45464d] border border-[#cbd5e1] hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>Flow D : Facturation & Caisse Guichet</span>
            </button>

            <button
              onClick={() => setSelectedFlow('rejection')}
              className={`px-3.5 py-2 text-[12px] font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedFlow === 'rejection'
                  ? 'bg-[#006a61] text-white shadow-xs'
                  : 'bg-white text-[#45464d] border border-[#cbd5e1] hover:bg-slate-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>Flow E : Régularisation des Rejets FSE</span>
            </button>
          </div>

          {/* Flow Diagram Card */}
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-6">
            {selectedFlow === 'admission' && (
              <div className="space-y-6">
                <div className="border-b border-[#f1f5f9] pb-4">
                  <span className="text-[11px] font-bold text-[#006a61] uppercase tracking-wider block">
                    Parcours Patient Étape par Étape
                  </span>
                  <h3 className="font-headline text-lg font-bold text-[#0b1c30]">
                    Flow A : Accueil, Identification CIN & Vérification Tiers-Payant
                  </h3>
                  <p className="text-[13px] text-[#45464d] mt-1">
                    Processus exécuté à l'arrivée du patient au guichet d'accueil de la Clinique Al Bassma.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dae2fd] relative">
                    <span className="text-[10px] font-bold bg-[#131b2e] text-white px-2 py-0.5 rounded-full absolute -top-2.5 left-4">
                      Étape 1
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-1">
                      Arrivée & Identification
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1.5">
                      Présentation au guichet. Saisie de la <strong>CIN marocaine</strong> et coordonnées du patient.
                    </p>
                    <div className="mt-3 text-[11px] text-[#006a61] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">badge</span>
                      Acteur : Hôtesse d'accueil
                    </div>
                  </div>

                  <div className="bg-[#e6f7f5]/40 p-4 rounded-xl border border-[#86f2e4] relative">
                    <span className="text-[10px] font-bold bg-[#006a61] text-white px-2 py-0.5 rounded-full absolute -top-2.5 left-4">
                      Étape 2
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-1">
                      Interrogation Masar Santé
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1.5">
                      Vérification immédiate des droits d'assuré social (CNSS, CNOPS, AMO Tadamon) et taux (70% ou 80%).
                    </p>
                    <div className="mt-3 text-[11px] text-[#006a61] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Passerelle ANAM active
                    </div>
                  </div>

                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dae2fd] relative">
                    <span className="text-[10px] font-bold bg-[#131b2e] text-white px-2 py-0.5 rounded-full absolute -top-2.5 left-4">
                      Étape 3
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-1">
                      Orientation & Ticket
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1.5">
                      Attribution du praticien de garde, du box de consultation et impression du ticket d'ordre de passage.
                    </p>
                    <div className="mt-3 text-[11px] text-[#006a61] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">confirmation_number</span>
                      Ticket ex: URG-12
                    </div>
                  </div>

                  <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#dae2fd] relative">
                    <span className="text-[10px] font-bold bg-[#131b2e] text-white px-2 py-0.5 rounded-full absolute -top-2.5 left-4">
                      Étape 4
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-1">
                      Régulation en Direct
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1.5">
                      Le patient intègre la file d'attente sur le <strong>Tableau de Bord</strong> et la colonne 1 du <strong>Kanban</strong>.
                    </p>
                    <div className="mt-3 text-[11px] text-[#006a61] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">monitor</span>
                      Surveillance temps d'attente
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] flex items-center justify-between">
                  <span className="text-[12px] text-[#45464d]">
                    Tester ce parcours directement dans le système :
                  </span>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="px-3 py-1.5 bg-[#006a61] text-white text-[12px] font-semibold rounded-lg hover:bg-[#00544d] transition-colors flex items-center gap-1"
                  >
                    <span>Ouvrir le Tableau de Bord</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {selectedFlow === 'consultation' && (
              <div className="space-y-6">
                <div className="border-b border-[#f1f5f9] pb-4">
                  <span className="text-[11px] font-bold text-[#006a61] uppercase tracking-wider block">
                    Parcours Patient Étape par Étape
                  </span>
                  <h3 className="font-headline text-lg font-bold text-[#0b1c30]">
                    Flow B : Prise en Charge Médicale, Constantes & Examens
                  </h3>
                  <p className="text-[13px] text-[#45464d] mt-1">
                    Processus mené par l'infirmier(e) d'accueil et le médecin spécialiste.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dae2fd]">
                    <span className="text-[10px] font-bold bg-[#131b2e] text-white px-2 py-0.5 rounded-full">
                      1. Appel en Salle
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Appel & Triage
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      Le praticien déclenche l'appel. Le statut passe à <code>calling</code> avec affichage sur grand écran.
                    </p>
                  </div>

                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dae2fd]">
                    <span className="text-[10px] font-bold bg-[#131b2e] text-white px-2 py-0.5 rounded-full">
                      2. Box Médical
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Constantes Vitales
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      Saisie de la TA, Pouls, Saturation O2, et Glycémie. Enregistrement automatique dans le dossier 360°.
                    </p>
                  </div>

                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dae2fd]">
                    <span className="text-[10px] font-bold bg-[#131b2e] text-white px-2 py-0.5 rounded-full">
                      3. Plateau Examen
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Prescription Radio / Labo
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      Transfert vers la colonne "Examens" pour réalisation immédiate d'échographie, scanner ou bilan sanguin.
                    </p>
                  </div>

                  <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#dae2fd]">
                    <span className="text-[10px] font-bold bg-[#006a61] text-white px-2 py-0.5 rounded-full">
                      4. Décision Thérapeutique
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Sortie ou Hospitalisation
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      Prescription de l'ordonnance et décision : transfert en hospitalisation ou orientation caisse de sortie.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] flex items-center justify-between">
                  <span className="text-[12px] text-[#45464d]">
                    Consulter le dossier d'un patient pour voir les constantes :
                  </span>
                  <button
                    onClick={() => onNavigate('patient-files')}
                    className="px-3 py-1.5 bg-[#006a61] text-white text-[12px] font-semibold rounded-lg hover:bg-[#00544d] transition-colors flex items-center gap-1"
                  >
                    <span>Ouvrir les Dossiers Patients</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {selectedFlow === 'hospitalization' && (
              <div className="space-y-6">
                <div className="border-b border-[#f1f5f9] pb-4">
                  <span className="text-[11px] font-bold text-[#006a61] uppercase tracking-wider block">
                    Parcours Patient Étape par Étape
                  </span>
                  <h3 className="font-headline text-lg font-bold text-[#0b1c30]">
                    Flow C : Séjour Hospitalier, Gestion des Lits & Bio-nettoyage
                  </h3>
                  <p className="text-[13px] text-[#45464d] mt-1">
                    Coordination entre médecins, infirmiers de service et agents d'hygiène hospitalière.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dae2fd]">
                    <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full">
                      1. Lit Disponible
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Sélection & Affectation
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      Choix de la chambre selon la spécialité (Étage 1 Chirurgie, Étage 2 Médecine, Aile Sud VIP, USIC).
                    </p>
                  </div>

                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dae2fd]">
                    <span className="text-[10px] font-bold bg-purple-700 text-white px-2 py-0.5 rounded-full">
                      2. Lit Occupé
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Plan de Soins Infirmier
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      Validation des perfusions IV, surveillance des pansements, administration Lovenox et notes de relève.
                    </p>
                  </div>

                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dae2fd]">
                    <span className="text-[10px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded-full">
                      3. Sortie Patient
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Bio-nettoyage Niveau 2
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      À la libération, le lit bascule en désinfection. Heure de fin estimée affichée pour l'admission suivante.
                    </p>
                  </div>

                  <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#dae2fd]">
                    <span className="text-[10px] font-bold bg-[#006a61] text-white px-2 py-0.5 rounded-full">
                      4. Certification
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Remise en Disponibilité
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      Validation du protocole stérile par le surveillant. Le lit redevient immédiatement disponible.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] flex items-center justify-between">
                  <span className="text-[12px] text-[#45464d]">
                    Gérer en direct les 28 lits de la clinique :
                  </span>
                  <button
                    onClick={() => onNavigate('hospitalization')}
                    className="px-3 py-1.5 bg-[#006a61] text-white text-[12px] font-semibold rounded-lg hover:bg-[#00544d] transition-colors flex items-center gap-1"
                  >
                    <span>Ouvrir Hospitalisation & Lits</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {selectedFlow === 'billing' && (
              <div className="space-y-6">
                <div className="border-b border-[#f1f5f9] pb-4">
                  <span className="text-[11px] font-bold text-[#006a61] uppercase tracking-wider block">
                    Parcours Patient Étape par Étape
                  </span>
                  <h3 className="font-headline text-lg font-bold text-[#0b1c30]">
                    Flow D : Facturation, Ventilation Tiers-Payant & Caisse Guichet
                  </h3>
                  <p className="text-[13px] text-[#45464d] mt-1">
                    Processus comptable de clôture du séjour et d'encaissement du ticket modérateur.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dae2fd]">
                    <span className="text-[10px] font-bold bg-[#131b2e] text-white px-2 py-0.5 rounded-full">
                      1. Cotation des Actes
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Consolidation
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      Regroupement des actes (consultation, actes techniques, examens, séjour) selon la nomenclature ANAM.
                    </p>
                  </div>

                  <div className="bg-[#e6f7f5]/40 p-4 rounded-xl border border-[#86f2e4]">
                    <span className="text-[10px] font-bold bg-[#006a61] text-white px-2 py-0.5 rounded-full">
                      2. Ventilation AMO
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Calcul Tiers-Payant
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      Séparation nette entre la part prise en charge (70% ou 80%) et le ticket modérateur restant à charge.
                    </p>
                  </div>

                  <div className="bg-[#f8f9ff] p-4 rounded-xl border border-[#dae2fd]">
                    <span className="text-[10px] font-bold bg-[#131b2e] text-white px-2 py-0.5 rounded-full">
                      3. Encaissement
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Règlement Guichet
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      Paiement Espèces (calculateur de monnaie), TPE CMI ou Chèque. Émission immédiate de la quittance officielle.
                    </p>
                  </div>

                  <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#dae2fd]">
                    <span className="text-[10px] font-bold bg-[#131b2e] text-white px-2 py-0.5 rounded-full">
                      4. Télétransmission FSE
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-[#0b1c30] mt-2">
                      Envoi Masar Santé
                    </h4>
                    <p className="text-[12px] text-[#45464d] mt-1">
                      Génération du flux numérique FSE et télétransmission sécurisée vers la CNSS / CNOPS pour recouvrement.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] flex items-center justify-between">
                  <span className="text-[12px] text-[#45464d]">
                    Ouvrir le registre des factures et le guichet de caisse :
                  </span>
                  <button
                    onClick={() => onNavigate('billing-amo')}
                    className="px-3 py-1.5 bg-[#006a61] text-white text-[12px] font-semibold rounded-lg hover:bg-[#00544d] transition-colors flex items-center gap-1"
                  >
                    <span>Ouvrir Facturation & Caisse</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}

            {selectedFlow === 'rejection' && (
              <div className="space-y-6">
                <div className="border-b border-[#f1f5f9] pb-4">
                  <span className="text-[11px] font-bold text-[#ba1a1a] uppercase tracking-wider block">
                    Gestion des Anomalies Télématiques
                  </span>
                  <h3 className="font-headline text-lg font-bold text-[#0b1c30]">
                    Flow E : Détection, Résolution & Recours des Rejets AMO
                  </h3>
                  <p className="text-[13px] text-[#45464d] mt-1">
                    Procédure pour corriger les rejets sous le délai légal de 15 jours de recours.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50/50 p-4 rounded-xl border border-red-200">
                    <span className="text-[10px] font-bold bg-red-700 text-white px-2 py-0.5 rounded-full">
                      Rejet R-12
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-red-900 mt-2">
                      Contre-Signature
                    </h4>
                    <p className="text-[12px] text-red-800 mt-1">
                      Signature électronique du volet 1 FSE par la Directrice Médicale via certificat numérique certifié.
                    </p>
                  </div>

                  <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200">
                    <span className="text-[10px] font-bold bg-amber-700 text-white px-2 py-0.5 rounded-full">
                      Rejet R-04
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-amber-900 mt-2">
                      Entente Préalable
                    </h4>
                    <p className="text-[12px] text-amber-800 mt-1">
                      Attachement de l'avenant de prorogation CNOPS pour les examens radiologiques d'urgence.
                    </p>
                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200">
                    <span className="text-[10px] font-bold bg-blue-700 text-white px-2 py-0.5 rounded-full">
                      Rejet R-09
                    </span>
                    <h4 className="font-headline font-bold text-[13px] text-blue-900 mt-2">
                      Code INPE Praticien
                    </h4>
                    <p className="text-[12px] text-blue-800 mt-1">
                      Mise à jour immédiate vers le code d'immatriculation national certifié par l'Ordre des Médecins.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] flex items-center justify-between">
                  <span className="text-[12px] text-[#45464d]">
                    Accéder au portail des litiges et des bordereaux AMO :
                  </span>
                  <button
                    onClick={() => onNavigate('amo-portal')}
                    className="px-3 py-1.5 bg-[#006a61] text-white text-[12px] font-semibold rounded-lg hover:bg-[#00544d] transition-colors flex items-center gap-1"
                  >
                    <span>Ouvrir Portail AMO & Rejets</span>
                    <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTENT TAB 2: MODULES */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Module 1 */}
          <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-[#eff4ff] text-[#006a61] rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">grid_view</span>
                  </span>
                  <h3 className="font-headline text-base font-bold text-[#0b1c30]">
                    1. Tableau de Bord & Régulation
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-[#e6f7f5] text-[#006a61] px-2 py-0.5 rounded">
                  Temps Réel
                </span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-2">
                Tour de contrôle opérationnelle : 4 KPIs cliniques, tableau dynamique de la file d'attente, histogramme horaire et alertes délais.
              </p>
              <ul className="mt-3 space-y-1.5 text-[11px] text-[#45464d]">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Appel en salle d'attente sonore & visuel</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Histogramme d'affluence comparatif avec pic à 10h00</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Présence et affectation des praticiens de garde</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full py-2 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#006a61] text-[12px] font-semibold rounded-lg border border-[#dae2fd] transition-colors"
            >
              Accéder au module
            </button>
          </div>

          {/* Module 2 */}
          <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-[#eff4ff] text-[#006a61] rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">folder_shared</span>
                  </span>
                  <h3 className="font-headline text-base font-bold text-[#0b1c30]">
                    2. Dossiers Patients 360°
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-[#eff4ff] text-[#006a61] px-2 py-0.5 rounded">
                  Médical
                </span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-2">
                Dossier médical informatisé complet : identito-vigilance CIN, constantes vitales, ordonnances, antécédents et conformité CNDP.
              </p>
              <ul className="mt-3 space-y-1.5 text-[11px] text-[#45464d]">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Recherche instantanée par CIN, Nom ou Téléphone</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Prise de constantes : TA, FC, SpO2, Glycémie</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Traçabilité CNDP (Loi marocaine n° 09-08)</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('patient-files')}
              className="w-full py-2 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#006a61] text-[12px] font-semibold rounded-lg border border-[#dae2fd] transition-colors"
            >
              Accéder au module
            </button>
          </div>

          {/* Module 3 */}
          <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-[#eff4ff] text-[#006a61] rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">view_kanban</span>
                  </span>
                  <h3 className="font-headline text-base font-bold text-[#0b1c30]">
                    3. Kanban des Flux Patients
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-[#e6f7f5] text-[#006a61] px-2 py-0.5 rounded">
                  Logistique
                </span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-2">
                Suivi visuel des 5 étapes du parcours : Salle d'attente, Consultation, Examens, Hospitalisation, Caisse de sortie.
              </p>
              <ul className="mt-3 space-y-1.5 text-[11px] text-[#45464d]">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Taux de fluidité de 82% et durée moyenne de 48 min</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Chronomètre de séjour par patient</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Cadence de 19.4 consultations par heure</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('patient-flow')}
              className="w-full py-2 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#006a61] text-[12px] font-semibold rounded-lg border border-[#dae2fd] transition-colors"
            >
              Accéder au module
            </button>
          </div>

          {/* Module 4 */}
          <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-[#eff4ff] text-[#006a61] rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">bed</span>
                  </span>
                  <h3 className="font-headline text-base font-bold text-[#0b1c30]">
                    4. Hospitalisation & 28 Lits
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                  Lits & Soins
                </span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-2">
                Cartographie des chambres par étage (Chirurgie, Médecine, VIP, USIC) et gestion interactive des plans de soins infirmiers.
              </p>
              <ul className="mt-3 space-y-1.5 text-[11px] text-[#45464d]">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Statuts lits : Occupé, Disponible, Bio-nettoyage</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Checklist soins : perfusions, pansements, Lovenox</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Certification de désinfection en un clic</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('hospitalization')}
              className="w-full py-2 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#006a61] text-[12px] font-semibold rounded-lg border border-[#dae2fd] transition-colors"
            >
              Accéder au module
            </button>
          </div>

          {/* Module 5 */}
          <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-[#eff4ff] text-[#006a61] rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                  </span>
                  <h3 className="font-headline text-base font-bold text-[#0b1c30]">
                    5. Facturation & Caisse Guichet
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  Finances
                </span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-2">
                Ventilation de la part AMO vs ticket modérateur patient, calculateur d'espèces avec monnaie exacte et clôture journalière.
              </p>
              <ul className="mt-3 space-y-1.5 text-[11px] text-[#45464d]">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Paiements : Espèces, TPE CMI, Chèque, Virement</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Calculateur d'espèces automatique</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Clôture et télécollecte sécurisée</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('billing-amo')}
              className="w-full py-2 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#006a61] text-[12px] font-semibold rounded-lg border border-[#dae2fd] transition-colors"
            >
              Accéder au module
            </button>
          </div>

          {/* Module 6 */}
          <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#e2e8f0] flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-[#eff4ff] text-[#006a61] rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  </span>
                  <h3 className="font-headline text-base font-bold text-[#0b1c30]">
                    6. Portail AMO & Rejets FSE
                  </h3>
                </div>
                <span className="text-[11px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  ANAM Masar
                </span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-2">
                Suivi des bordereaux télétransmis (112 400 MAD) et chaîne de résolution des rejets (contre-signatures, codes INPE, ententes).
              </p>
              <ul className="mt-3 space-y-1.5 text-[11px] text-[#45464d]">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Télétransmission par lots vers CNSS / CNOPS</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Taux d'acceptation 96.4% nomenclature ANAM</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#006a61]" />
                  <span>Actions de remédiation en 1 clic</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => onNavigate('amo-portal')}
              className="w-full py-2 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#006a61] text-[12px] font-semibold rounded-lg border border-[#dae2fd] transition-colors"
            >
              Accéder au module
            </button>
          </div>
        </div>
      )}

      {/* CONTENT TAB 3: OVERVIEW & ROLES */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-4">
            <h3 className="font-headline text-lg font-bold text-[#0b1c30]">
              Missions par Profil Utilisateur
            </h3>
            <p className="text-[13px] text-[#45464d]">
              ClinicFlow est conçu pour répondre aux besoins spécifiques de chaque membre de l'équipe médico-administrative de la clinique.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] space-y-2">
                <div className="flex items-center gap-2 text-[#006a61] font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[18px]">desk</span>
                  <span>Hôtesse d'Accueil</span>
                </div>
                <p className="text-[11px] text-[#45464d]">
                  Enregistrement d'admission rapide, contrôle éligibilité AMO par CIN, distribution de tickets et orientation en salle d'attente.
                </p>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] space-y-2">
                <div className="flex items-center gap-2 text-[#006a61] font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[18px]">stethoscope</span>
                  <span>Médecin Traitant</span>
                </div>
                <p className="text-[11px] text-[#45464d]">
                  Appel des patients au box, saisie d'examen clinique, consultation des constantes, ordonnances électroniques et prescriptions radio/labo.
                </p>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] space-y-2">
                <div className="flex items-center gap-2 text-[#006a61] font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
                  <span>Infirmier(e) de Service</span>
                </div>
                <p className="text-[11px] text-[#45464d]">
                  Exécution et validation du plan de soins hospitalier (perfusions, pansements), rondes médicales et notes de relève de service.
                </p>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] space-y-2">
                <div className="flex items-center gap-2 text-[#006a61] font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[18px]">cleaning_services</span>
                  <span>Hygiène & Logistique</span>
                </div>
                <p className="text-[11px] text-[#45464d]">
                  Prise en charge du bio-nettoyage stérile après libération de chambre et certification de disponibilité des lits.
                </p>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] space-y-2">
                <div className="flex items-center gap-2 text-[#006a61] font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[18px]">point_of_sale</span>
                  <span>Caissier(e)</span>
                </div>
                <p className="text-[11px] text-[#45464d]">
                  Encaissement du ticket modérateur, calcul de rendu de monnaie, émission de quittance et clôture journalière de caisse.
                </p>
              </div>

              <div className="p-4 bg-[#f8f9ff] rounded-xl border border-[#dae2fd] space-y-2">
                <div className="flex items-center gap-2 text-[#006a61] font-bold text-[13px]">
                  <span className="material-symbols-outlined text-[18px]">security</span>
                  <span>Gestionnaire AMO</span>
                </div>
                <p className="text-[11px] text-[#45464d]">
                  Télétransmission des bordereaux FSE par lot, analyse des rejets CNSS/CNOPS et résolution des motifs d'anomalies sous 15 jours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT TAB 4: AMO & TECH */}
      {activeTab === 'amo-tech' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl p-6 shadow-2xs border border-[#e2e8f0] space-y-4">
            <h3 className="font-headline text-lg font-bold text-[#0b1c30] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006a61]">verified</span>
              Interfaçage Télématique Masar Santé & Conformité Légale
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px] pt-2">
              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dae2fd] space-y-2">
                <h4 className="font-bold text-[#0b1c30]">Passerelle Masar Santé ANAM</h4>
                <p className="text-[#45464d]">
                  ClinicFlow communique avec les API certifiées de l'ANAM pour l'échange de feuilles de soins électroniques (FSE) et l'interrogation en temps réel de l'éligibilité des assurés.
                </p>
                <div className="font-mono text-[11px] bg-white p-2 rounded border border-[#cbd5e1] text-[#0b1c30]">
                  Endpoint : https://masar.anam.ma/api/v2/fse<br />
                  Établissement ID : CLIN-CAS-004812
                </div>
              </div>

              <div className="p-4 bg-[#eff4ff] rounded-xl border border-[#dae2fd] space-y-2">
                <h4 className="font-bold text-[#0b1c30]">Protection des Données (CNDP Loi 09-08)</h4>
                <p className="text-[#45464d]">
                  Toutes les données médicales, identifiants CIN et observations cliniques font l'objet d'une traçabilité rigoureuse conformément à la loi marocaine 09-08 avec consentement systématique.
                </p>
                <div className="font-mono text-[11px] bg-white p-2 rounded border border-[#cbd5e1] text-[#0b1c30]">
                  Récépissé CNDP : A-M-342/2023<br />
                  Audit logs : horodatés et infalsifiables
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

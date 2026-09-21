import React, { useState } from 'react';
import { ViewMode } from '../../types';

interface DemoScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView: (view: ViewMode) => void;
}

interface DemoStep {
  step: number;
  title: string;
  category: 'Accueil & Triage' | 'Consultation & Examens' | 'Chirurgie & Hospitalisation' | 'Soins & Pharmacie' | 'Facturation & Clôture';
  actor: string;
  targetView: ViewMode;
  description: string;
  actionLabel: string;
}

export const DemoScenarioModal: React.FC<DemoScenarioModalProps> = ({
  isOpen,
  onClose,
  onNavigateToView
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: DemoStep[] = [
    {
      step: 1,
      title: 'Accueil, Vérification CIN & Détection de Doublons',
      category: 'Accueil & Triage',
      actor: 'Agent d\'Accueil',
      targetView: 'admission',
      description: 'Le patient M. Karim Mansouri arrive aux urgences. Saisie du CIN BK654321, contrôle d\'éligibilité AMO CNSS et détection immédiate de doublon.',
      actionLabel: 'Aller à l\'Admission'
    },
    {
      step: 2,
      title: 'Attribution du Ticket & Priorisation File d\'Attente',
      category: 'Accueil & Triage',
      actor: 'Agent d\'Accueil',
      targetView: 'patient-flow',
      description: 'Génération du ticket U-04. Le Kanban temps-réel s\'actualise avec une alerte de délai d\'attente.',
      actionLabel: 'Voir le Kanban des Flux'
    },
    {
      step: 3,
      title: 'Triage Infirmier & Constantes Vitales',
      category: 'Accueil & Triage',
      actor: 'Infirmier de Triage',
      targetView: 'nursing',
      description: 'Prise de la tension artérielle (145/90 mmHg), fréquence cardiaque (92 bpm) et SpO2 (97%). Évaluation de l\'échelle de douleur EVA à 6/10.',
      actionLabel: 'Ouvrir Poste Infirmier'
    },
    {
      step: 4,
      title: 'Consultation Médicale & Diagnostic CIM-10',
      category: 'Consultation & Examens',
      actor: 'Dr. Layla Zahiri (Cardiologue)',
      targetView: 'consultation',
      description: 'Anamnèse complète, examen clinique cardiovasculaire, diagnostic de Syndrome Coronarien Aigu sans sus-décalage (NSTEMI).',
      actionLabel: 'Consulter la Fiche Médicale'
    },
    {
      step: 5,
      title: 'Prescription Électronique d\'Urgence',
      category: 'Consultation & Examens',
      actor: 'Dr. Layla Zahiri',
      targetView: 'documents',
      description: 'Génération de l\'ordonnance numérique sécurisée avec posologie, forme et règles de non-substitution.',
      actionLabel: 'Consulter l\'Ordonnance'
    },
    {
      step: 6,
      title: 'Demande de Bilan Biologique d\'Urgence',
      category: 'Consultation & Examens',
      actor: 'Dr. Layla Zahiri',
      targetView: 'examinations',
      description: 'Prescription en statut "VITAL" : Troponine I ultra-sensible, CK-MB et Ionogramme sanguin complet.',
      actionLabel: 'Voir Plateau Examens'
    },
    {
      step: 7,
      title: 'Prélèvement Sanguin & Acheminement Tube',
      category: 'Consultation & Examens',
      actor: 'Infirmier',
      targetView: 'examinations',
      description: 'Pose de garrot, prélèvement tube hépariné code-barres TUBE-9042 et horodatage du prélèvement.',
      actionLabel: 'Vérifier Échantillon'
    },
    {
      step: 8,
      title: 'Validation Biologique par le Médecin Biologiste',
      category: 'Consultation & Examens',
      actor: 'Dr. Youssef Berrada (Biologiste)',
      targetView: 'examinations',
      description: 'Saisie des résultats : Troponine à 1.45 ng/mL (Alerte rouge). Signature numérique et notification au cardiologue.',
      actionLabel: 'Inspecter Résultats Biologie'
    },
    {
      step: 9,
      title: 'Demande de Radiologie / Imagerie Numérique',
      category: 'Consultation & Examens',
      actor: 'Dr. Layla Zahiri',
      targetView: 'examinations',
      description: 'Prescription d\'une Radiographie Thoracique face et Coro-scanner.',
      actionLabel: 'Voir Examens Radio'
    },
    {
      step: 10,
      title: 'Compte-Rendu Radiologique & Télé-Imagerie',
      category: 'Consultation & Examens',
      actor: 'Dr. Salma Kabbaj (Radiologue)',
      targetView: 'examinations',
      description: 'Interprétation de la radio : absence d\'épanchement pleural, silhouette cardiaque limite supérieure.',
      actionLabel: 'Voir Compte-Rendu Radio'
    },
    {
      step: 11,
      title: 'Décision d\'Hospitalisation & Choix de Chambre',
      category: 'Chirurgie & Hospitalisation',
      actor: 'Médecin & Accueil',
      targetView: 'hospitalization',
      description: 'Sélection du Lit 102 (Unité Soins Continus). Le statut du lit passe de "Disponible" à "Occupé".',
      actionLabel: 'Ouvrir Plan des 28 Lits'
    },
    {
      step: 12,
      title: 'Passeport de Soins : Régime & Mobilité',
      category: 'Chirurgie & Hospitalisation',
      actor: 'Infirmier Major',
      targetView: 'nursing',
      description: 'Attribution du régime hyposodé diabétique et consigne de repos strict au lit.',
      actionLabel: 'Vérifier Passeport Patient'
    },
    {
      step: 13,
      title: 'Consultation d\'Anesthésie Pré-Opératoire',
      category: 'Chirurgie & Hospitalisation',
      actor: 'Dr. K. Benjelloun (Anesthésiste)',
      targetView: 'operating-room',
      description: 'Évaluation ASA III, vérification des allergies médicamenteuses et choix de l\'anesthésie générale.',
      actionLabel: 'Voir Consultation Pré-Op'
    },
    {
      step: 14,
      title: 'Programmation au Bloc Opératoire (Bloc 1)',
      category: 'Chirurgie & Hospitalisation',
      actor: 'Chirurgien / Cadre de Bloc',
      targetView: 'operating-room',
      description: 'Réservation de la salle d\'opération ISO 5 pour coronarographie et pose de stent actif.',
      actionLabel: 'Ouvrir Planning du Bloc'
    },
    {
      step: 15,
      title: 'Check-list de Sécurité OMS Per-Opératoire',
      category: 'Chirurgie & Hospitalisation',
      actor: 'Équipe de Bloc',
      targetView: 'operating-room',
      description: 'Vérification en 5 points : identité, site, antécédents, oxymètre et antibioprophylaxie validés.',
      actionLabel: 'Vérifier Check-list OMS'
    },
    {
      step: 16,
      title: 'Surveillance en Salle de Réveil (SSPI)',
      category: 'Chirurgie & Hospitalisation',
      actor: 'Infirmier SSPI',
      targetView: 'operating-room',
      description: 'Surveillance continue du réveil. Calcul du Score d\'Aldrete : 10/10 autorisant le retour en chambre.',
      actionLabel: 'Voir Score Aldrete SSPI'
    },
    {
      step: 17,
      title: 'Administration Médicamenteuse (MAR)',
      category: 'Soins & Pharmacie',
      actor: 'Infirmier',
      targetView: 'nursing',
      description: 'Administration de Lovenox 4000 UI SC et Paracétamol 1g IV avec horodatage scellé.',
      actionLabel: 'Voir Feuille MAR'
    },
    {
      step: 18,
      title: 'Délivrance & Gestion du Stock Pharmacie',
      category: 'Soins & Pharmacie',
      actor: 'Pharmacien',
      targetView: 'pharmacy',
      description: 'Décrémentation automatique du stock de Lovenox et contrôle du numéro de lot.',
      actionLabel: 'Inspecter Stock Pharmacie'
    },
    {
      step: 19,
      title: 'Recueil du Consentement Légal & CNDP',
      category: 'Soins & Pharmacie',
      actor: 'Secrétariat Médical',
      targetView: 'documents',
      description: 'Signature numérique du formulaire de consentement éclairé et conformité Loi 09-08 CNDP.',
      actionLabel: 'Vérifier Consentement Signé'
    },
    {
      step: 20,
      title: 'Facturation & Calcul Ticket Modérateur AMO',
      category: 'Facturation & Clôture',
      actor: 'Agent de Facturation',
      targetView: 'billing',
      description: 'Génération de la facture : Actes NGAP, part prise en charge CNSS (80%) et reliquat patient (20%).',
      actionLabel: 'Ouvrir Facturation & AMO'
    },
    {
      step: 21,
      title: 'Encaissement en Caisse & Reçu Émis',
      category: 'Facturation & Clôture',
      actor: 'Caissier',
      targetView: 'cash-register',
      description: 'Règlement du ticket modérateur de 1 200 MAD par carte bancaire CMI. Émission du reçu scellé.',
      actionLabel: 'Ouvrir Session Caisse'
    },
    {
      step: 22,
      title: 'Télétransmission FSE & Bordereau Masar',
      category: 'Facturation & Clôture',
      actor: 'Agent Assurance',
      targetView: 'billing',
      description: 'Transmission du lot de feuilles de soins électroniques à l\'AMO CNSS sans anomalie de matricule.',
      actionLabel: 'Voir FSE Télétransmises'
    },
    {
      step: 23,
      title: 'Gestion & Recours sur Rejet Masar',
      category: 'Facturation & Clôture',
      actor: 'Agent Assurance',
      targetView: 'billing',
      description: 'Traitement d\'un rejet pour prescription manquante : régularisation et renvoi du bordereau.',
      actionLabel: 'Voir Tableau des Rejets'
    },
    {
      step: 24,
      title: 'Clôture de Caisse Journalière & Écart Compte',
      category: 'Facturation & Clôture',
      actor: 'Responsable Caisse',
      targetView: 'cash-register',
      description: 'Comptage physique des espèces et des tickets TPE, rapprochement avec le solde théorique calculé.',
      actionLabel: 'Inspecter Clôture Caisse'
    },
    {
      step: 25,
      title: 'Audit Immuable & Conformité Réglementaire',
      category: 'Facturation & Clôture',
      actor: 'Super Admin / Auditeur',
      targetView: 'audit',
      description: 'Vérification des traces dans le journal d\'audit infalsifiable WORM : traçabilité complète de A à Z.',
      actionLabel: 'Vérifier Journal d\'Audit'
    }
  ];

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleExecute = () => {
    onNavigateToView(currentStep.targetView);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-[#cbd5e1] animate-in fade-in flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#e6f7f5] text-[#006a61]">
              <span className="material-symbols-outlined text-[24px]">route</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[18px] text-[#0b1c30]">Scénario Démo Interactif (25 Étapes Cliniques)</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#188ace] border border-[#dae2fd]">
                  Cycle de Vie Complet
                </span>
              </div>
              <p className="text-[12px] text-[#76777d]">
                Parcourez le parcours patient, clinique, soignant et financier de ClinicFlow Casablanca pas à pas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#76777d] hover:bg-[#f1f5f9]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Progress Tracker Bar */}
        <div className="py-4 border-b border-[#f1f5f9]">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#76777d] mb-1.5">
            <span>Étape {currentStep.step} sur {steps.length}</span>
            <span className="text-[#006a61]">{currentStep.category}</span>
          </div>
          <div className="w-full bg-[#e2e8f0] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#006a61] h-full transition-all duration-300"
              style={{ width: `${(currentStep.step / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Content */}
        <div className="flex-1 overflow-y-auto py-5 space-y-4">
          <div className="bg-[#f8f9ff] p-5 rounded-xl border border-[#dae2fd]/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-[#006a61] text-white text-[11px] font-bold">
                Étape {currentStep.step}
              </span>
              <span className="text-[12px] font-medium text-[#45464d] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#006a61]">person</span>
                <span>Intervenant : <strong>{currentStep.actor}</strong></span>
              </span>
            </div>

            <h4 className="text-[18px] font-bold text-[#0b1c30]">{currentStep.title}</h4>

            <p className="text-[13px] text-[#45464d] leading-relaxed">
              {currentStep.description}
            </p>

            <div className="pt-2 flex items-center gap-2 text-[12px] text-[#006a61]">
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
              <span>Module cible de l'étape : <strong className="uppercase">{currentStep.targetView}</strong></span>
            </div>
          </div>

          {/* Quick Steps Stepper Grid */}
          <div>
            <div className="text-[11px] font-bold uppercase text-[#76777d] mb-2">Accès Direct aux 25 Étapes :</div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {steps.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-8 rounded-lg font-bold text-[11px] transition-all ${
                    currentStepIndex === idx
                      ? 'bg-[#006a61] text-white shadow-xs scale-105'
                      : idx < currentStepIndex
                      ? 'bg-[#e6f7f5] text-[#006a61]'
                      : 'bg-[#f1f5f9] text-[#76777d] hover:bg-[#e2e8f0]'
                  }`}
                  title={s.title}
                >
                  {s.step}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="px-3.5 py-2 text-[12px] font-semibold rounded-lg border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f8f9ff] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Étape Précédente
            </button>
            <button
              onClick={handleNext}
              disabled={currentStepIndex === steps.length - 1}
              className="px-3.5 py-2 text-[12px] font-semibold rounded-lg border border-[#cbd5e1] text-[#0b1c30] hover:bg-[#f8f9ff] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Étape Suivante →
            </button>
          </div>

          <button
            onClick={handleExecute}
            className="px-5 py-2 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg text-[13px] font-bold shadow-xs flex items-center gap-2"
          >
            <span>{currentStep.actionLabel}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

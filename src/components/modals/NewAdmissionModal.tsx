import React, { useState } from 'react';
import { Patient } from '../../types';
import { ClinicalSelect, SelectOption } from '../common/ClinicalSelect';

const GENDER_OPTIONS: SelectOption[] = [
  { value: 'M', label: 'Homme (M)', badge: 'M' },
  { value: 'F', label: 'Femme (F)', badge: 'F' },
];

const AMO_OPTIONS: SelectOption[] = [
  { value: 'CNSS', label: 'CNSS', badge: '70% PEC' },
  { value: 'CNOPS', label: 'CNOPS', badge: '80% PEC' },
  { value: 'Tadamon', label: 'AMO Tadamon', badge: '100% PEC' },
  { value: 'Privé', label: 'Assurance Privée', badge: 'Privée' },
];

const DOCTOR_OPTIONS: SelectOption[] = [
  { value: 'Dr. M. Amrani', label: 'Dr. M. Amrani', sublabel: 'Cardiologie' },
  { value: 'Dr. S. Chraibi', label: 'Dr. S. Chraibi', sublabel: 'Gynécologie' },
  { value: 'Dr. H. Tazi', label: 'Dr. H. Tazi', sublabel: 'Chirurgie' },
  { value: 'Dr. K. Benjelloun', label: 'Dr. K. Benjelloun', sublabel: 'Urgences / Pédiatrie' },
  { value: 'Dr. Layla Zahiri', label: 'Dr. Layla Zahiri', sublabel: 'Médecine Interne' },
];

interface NewAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Patient) => void;
}

export const NewAdmissionModal: React.FC<NewAdmissionModalProps> = ({
  isOpen,
  onClose,
  onAddPatient
}) => {
  const [formData, setFormData] = useState({
    name: '',
    cin: '',
    age: '40',
    gender: 'M' as 'M' | 'F',
    phone: '+212 6 ',
    amoType: 'CNSS' as const,
    specialty: 'Cardiologie',
    assignedDoctor: 'Dr. M. Amrani',
    location: 'Salle d\'Attente',
    priority: 'Normal'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cin) return;

    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      cin: formData.cin.toUpperCase(),
      name: formData.name,
      age: parseInt(formData.age, 10) || 35,
      gender: formData.gender,
      phone: formData.phone,
      amoType: formData.amoType,
      amoRate: formData.amoType === 'CNSS' ? 70 : formData.amoType === 'CNOPS' ? 80 : 0,
      balanceDue: 0,
      status: 'waiting',
      currentLocation: formData.location,
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      assignedDoctor: formData.assignedDoctor,
      specialty: formData.specialty,
      ticketNumber: `#A-${Math.floor(Math.random() * 90 + 10)}`,
      waitingMinutes: 0
    };

    onAddPatient(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131b2e]/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl border border-[#cbd5e1] w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#131b2e] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#86f2e4] text-[22px]">
              person_add
            </span>
            <div>
              <h3 className="font-headline text-[15px] font-bold">
                Nouvelle Admission Patient
              </h3>
              <p className="text-[11px] text-slate-300">
                Enregistrement de garde & orientation immédiate
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#45464d] uppercase tracking-wider mb-1">
                N° CIN (Carte d'identité) *
              </label>
              <input
                type="text"
                required
                value={formData.cin}
                onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                placeholder="Ex: BE482910"
                className="w-full px-3 py-2 bg-[#f8f9ff] text-[13px] font-bold uppercase text-[#0b1c30] border border-[#dae2fd] rounded-lg focus:border-[#006a61] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#45464d] uppercase tracking-wider mb-1">
                Nom & Prénom *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: M. Othmane Tazi"
                className="w-full px-3 py-2 bg-[#f8f9ff] text-[13px] text-[#0b1c30] border border-[#dae2fd] rounded-lg focus:border-[#006a61] outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#45464d] uppercase tracking-wider mb-1">
                Âge
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3 py-2 bg-[#f8f9ff] text-[13px] text-[#0b1c30] border border-[#dae2fd] rounded-lg focus:border-[#006a61] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#45464d] uppercase tracking-wider mb-1">
                Genre
              </label>
              <ClinicalSelect
                value={formData.gender}
                onChange={(val) => setFormData({ ...formData, gender: val as 'M' | 'F' })}
                options={GENDER_OPTIONS}
                fullWidth
                size="lg"
                searchable={false}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#45464d] uppercase tracking-wider mb-1">
                Organisme AMO
              </label>
              <ClinicalSelect
                value={formData.amoType}
                onChange={(val) => setFormData({ ...formData, amoType: val as any })}
                options={AMO_OPTIONS}
                fullWidth
                size="lg"
                searchable={false}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#45464d] uppercase tracking-wider mb-1">
                Téléphone mobile
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-[#f8f9ff] text-[13px] text-[#0b1c30] border border-[#dae2fd] rounded-lg focus:border-[#006a61] outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#45464d] uppercase tracking-wider mb-1">
                Médecin Affecté
              </label>
              <ClinicalSelect
                value={formData.assignedDoctor}
                onChange={(val) => setFormData({ ...formData, assignedDoctor: val })}
                options={DOCTOR_OPTIONS}
                fullWidth
                size="lg"
                searchable={false}
              />
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 bg-[#e6f7f5] rounded-lg border border-[#86f2e4]/70 flex items-center gap-2.5 text-[11px] text-[#006a61]">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Le patient sera immédiatement synchronisé dans le régulateur central et le tableau des flux.</span>
          </div>

          {/* Submit buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[12px] font-semibold text-[#45464d] hover:bg-slate-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-[12px] font-semibold text-white bg-[#006a61] hover:bg-[#00544d] rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Valider l'Admission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

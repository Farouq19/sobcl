import { useState, useEffect } from 'react';
import { ViewMode, Patient, Room, Invoice, UserRole } from './types';
import {
  INITIAL_PATIENTS,
  INITIAL_ROOMS,
  INITIAL_INVOICES
} from './data/mockData';
import {
  loadBusinessConfig,
  saveBusinessConfig,
  AppBusinessConfig
} from './data/businessConfig';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { PatientFilesView } from './components/views/PatientFilesView';
import { PatientFlowView } from './components/views/PatientFlowView';
import { HospitalizationView } from './components/views/HospitalizationView';
import { BillingAmoView } from './components/views/BillingAmoView';
import { AmoPortalView } from './components/views/AmoPortalView';
import { SettingsView } from './components/views/SettingsView';
import { DocumentationView } from './components/views/DocumentationView';

// New SaaS Module Views
import { AdminView } from './components/views/AdminView';
import { ExaminationsView } from './components/views/ExaminationsView';
import { NursingView } from './components/views/NursingView';
import { OperatingRoomView } from './components/views/OperatingRoomView';
import { ReferralsView } from './components/views/ReferralsView';
import { PharmacyView } from './components/views/PharmacyView';
import { DocumentsView } from './components/views/DocumentsView';
import { AuditLogView } from './components/views/AuditLogView';
import { DemoScenarioModal } from './components/views/DemoScenarioModal';

import { AmoCheckModal } from './components/modals/AmoCheckModal';
import { NewAdmissionModal } from './components/modals/NewAdmissionModal';
import { CashRegisterModal } from './components/modals/CashRegisterModal';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  // Persistent state backed by localStorage
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem('clinicflow_patients');
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [selectedPatient, setSelectedPatient] = useState<Patient>(() => patients[0] || INITIAL_PATIENTS[0]);

  const [rooms, setRooms] = useState<Room[]>(() => {
    try {
      const saved = localStorage.getItem('clinicflow_rooms');
      return saved ? JSON.parse(saved) : INITIAL_ROOMS;
    } catch {
      return INITIAL_ROOMS;
    }
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    try {
      const saved = localStorage.getItem('clinicflow_invoices');
      return saved ? JSON.parse(saved) : INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  // SaaS States: Active Persona / Role & Active Clinic
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('clinicflow_role');
      return (saved as UserRole) || 'doctor';
    } catch {
      return 'doctor';
    }
  });

  const [activeClinicId, setActiveClinicId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('clinicflow_active_clinic');
      return saved || 'clinic-casa';
    } catch {
      return 'clinic-casa';
    }
  });

  // Centralized Business Rules & Tariff Configuration (100% user-configurable)
  const [businessConfig, setBusinessConfig] = useState<AppBusinessConfig>(() => loadBusinessConfig());

  // Persist changes to localStorage
  useEffect(() => {
    saveBusinessConfig(businessConfig);
  }, [businessConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('clinicflow_patients', JSON.stringify(patients));
    } catch (e) {
      console.error('Failed to save patients', e);
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem('clinicflow_rooms', JSON.stringify(rooms));
    } catch (e) {
      console.error('Failed to save rooms', e);
    }
  }, [rooms]);

  useEffect(() => {
    try {
      localStorage.setItem('clinicflow_invoices', JSON.stringify(invoices));
    } catch (e) {
      console.error('Failed to save invoices', e);
    }
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem('clinicflow_role', currentUserRole);
    } catch (e) {
      console.error('Failed to save role', e);
    }
  }, [currentUserRole]);

  useEffect(() => {
    try {
      localStorage.setItem('clinicflow_active_clinic', activeClinicId);
    } catch (e) {
      console.error('Failed to save clinic', e);
    }
  }, [activeClinicId]);

  // Reset demo data to factory defaults
  const handleResetData = () => {
    try {
      localStorage.removeItem('clinicflow_patients');
      localStorage.removeItem('clinicflow_rooms');
      localStorage.removeItem('clinicflow_invoices');
      setPatients(INITIAL_PATIENTS);
      setRooms(INITIAL_ROOMS);
      setInvoices(INITIAL_INVOICES);
      setSelectedPatient(INITIAL_PATIENTS[0]);
    } catch (e) {
      console.error('Failed to reset data', e);
    }
  };

  // Modals state
  const [isAmoCheckOpen, setIsAmoCheckOpen] = useState(false);
  const [isNewAdmissionOpen, setIsNewAdmissionOpen] = useState(false);
  const [isCashRegisterOpen, setIsCashRegisterOpen] = useState(false);
  const [isDemoScenarioOpen, setIsDemoScenarioOpen] = useState(false);

  // Global search
  const [searchQuery, setSearchQuery] = useState('');

  // Handle new admission
  const handleAddPatient = (newPatient: Patient) => {
    setPatients([newPatient, ...patients]);
    setSelectedPatient(newPatient);
  };

  // Handle status update
  const handleUpdatePatientStatus = (
    patientId: string,
    newStatus: Patient['status'],
    newLocation?: string
  ) => {
    setPatients(
      patients.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            status: newStatus,
            currentLocation: newLocation || p.currentLocation
          };
        }
        return p;
      })
    );
  };

  // Handle bed status change
  const handleUpdateBedStatus = (
    roomId: string,
    bedId: string,
    status: 'occupied' | 'available' | 'cleaning' | 'reserved',
    notes?: string
  ) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            beds: room.beds.map((bed) => {
              if (bed.id === bedId) {
                return {
                  ...bed,
                  status,
                  notes: notes || bed.notes
                };
              }
              return bed;
            })
          };
        }
        return room;
      })
    );
  };

  // Handle invoice payment
  const handlePayInvoice = (invoiceId: string, paymentMethod: 'cash' | 'card' | 'transfer' | 'cheque') => {
    setInvoices(
      invoices.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: 'paid', paymentMethod }
          : inv
      )
    );
  };

  // Patients filtered by header search if present
  const query = (searchQuery || '').trim().toLowerCase();
  const searchedPatients = query
    ? patients.filter(
        (p) =>
          (p?.name || '').toLowerCase().includes(query) ||
          (p?.cin || '').toLowerCase().includes(query) ||
          (p?.phone || '').includes(searchQuery)
      )
    : patients;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col overflow-x-hidden w-full">
      {/* Main Content Area - Full Width Header Navigation */}
      <div className="flex-1 flex flex-col min-h-screen w-full overflow-x-hidden">
        <Header
          onOpenAmoCheck={() => setIsAmoCheckOpen(true)}
          onOpenNewAdmission={() => setIsNewAdmissionOpen(true)}
          onOpenCashRegister={() => setIsCashRegisterOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUserRole={currentUserRole}
          onChangeRole={setCurrentUserRole}
          onOpenDemoScenario={() => setIsDemoScenarioOpen(true)}
          patients={patients}
          onSelectPatient={(p) => {
            setSelectedPatient(p);
            setCurrentView('patient-files');
          }}
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          waitingCount={patients.filter((p) => p.status === 'waiting' || p.status === 'calling').length}
          occupancyRate={78}
          activeClinicId={activeClinicId}
          onChangeClinic={setActiveClinicId}
        />

        {/* View Switcher */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {/* 1. Dashboard View */}
          {currentView === 'dashboard' && (
            <DashboardView
              patients={searchedPatients}
              onNavigate={setCurrentView}
              onOpenAmoCheck={() => setIsAmoCheckOpen(true)}
              onOpenNewAdmission={() => setIsNewAdmissionOpen(true)}
              onOpenCashRegister={() => setIsCashRegisterOpen(true)}
              onSelectPatient={(p) => setSelectedPatient(p)}
              onUpdatePatientStatus={handleUpdatePatientStatus}
            />
          )}

          {/* 2. Patient 360 Files */}
          {currentView === 'patient-files' && (
            <PatientFilesView
              patients={searchedPatients}
              selectedPatient={selectedPatient}
              onSelectPatient={setSelectedPatient}
              onNavigate={setCurrentView}
              onOpenAmoCheck={() => setIsAmoCheckOpen(true)}
            />
          )}

          {/* 3. Patient Flow & Kanban */}
          {currentView === 'patient-flow' && (
            <PatientFlowView
              patients={searchedPatients}
              onNavigate={setCurrentView}
              onSelectPatient={(p) => {
                setSelectedPatient(p);
                setCurrentView('patient-files');
              }}
              onOpenNewAdmission={() => setIsNewAdmissionOpen(true)}
              onUpdateStatus={handleUpdatePatientStatus}
            />
          )}

          {/* 4. Examinations (Lab & Radiology) */}
          {currentView === 'examinations' && (
            <ExaminationsView
              patients={searchedPatients}
              currentUserRole={currentUserRole}
              onSelectPatient={(p) => {
                setSelectedPatient(p);
                setCurrentView('patient-files');
              }}
            />
          )}

          {/* 5. Nursing Care & MAR */}
          {currentView === 'nursing' && (
            <NursingView
              patients={searchedPatients}
              onSelectPatient={(p) => {
                setSelectedPatient(p);
                setCurrentView('patient-files');
              }}
            />
          )}

          {/* 6. Operating Room & Recovery */}
          {currentView === 'operating-room' && (
            <OperatingRoomView
              patients={searchedPatients}
              minAldreteScore={businessConfig.surgeryConfig.minAldreteScoreForDischarge}
            />
          )}

          {/* 7. Hospitalization & 28 Beds */}
          {currentView === 'hospitalization' && (
            <HospitalizationView
              rooms={rooms}
              onNavigate={setCurrentView}
              onUpdateBedStatus={handleUpdateBedStatus}
            />
          )}

          {/* 8. Referrals & SAMU Evacuation */}
          {currentView === 'referrals' && (
            <ReferralsView patients={searchedPatients} />
          )}

          {/* 9. Billing & Cash Register */}
          {currentView === 'billing-amo' && (
            <BillingAmoView
              invoices={invoices}
              onNavigate={setCurrentView}
              onOpenAmoCheck={() => setIsAmoCheckOpen(true)}
              onOpenCashRegister={() => setIsCashRegisterOpen(true)}
              onPayInvoice={handlePayInvoice}
              businessConfig={businessConfig}
            />
          )}

          {/* 10. Pharmacy & Stock Management */}
          {currentView === 'pharmacy' && (
            <PharmacyView />
          )}

          {/* 11. AMO Portal & Masar */}
          {currentView === 'amo-portal' && (
            <AmoPortalView onOpenAmoCheck={() => setIsAmoCheckOpen(true)} />
          )}

          {/* 12. Documents & Consent Management */}
          {currentView === 'documents' && (
            <DocumentsView patients={searchedPatients} />
          )}

          {/* 13. Administration & RBAC */}
          {currentView === 'administration' && (
            <AdminView
              currentUserRole={currentUserRole}
              onRoleChange={setCurrentUserRole}
            />
          )}

          {/* 14. Audit Log */}
          {currentView === 'audit' && (
            <AuditLogView />
          )}

          {/* 15. Settings */}
          {currentView === 'settings' && (
            <SettingsView
              patientsCount={patients.length}
              roomsCount={rooms.length}
              invoicesCount={invoices.length}
              patients={patients}
              businessConfig={businessConfig}
              onUpdateBusinessConfig={(newCfg) => setBusinessConfig(newCfg)}
              onResetData={handleResetData}
            />
          )}

          {/* 16. Documentation */}
          {currentView === 'documentation' && (
            <DocumentationView onNavigate={setCurrentView} />
          )}

          {/* Aliases for admission and consultation buttons */}
          {currentView === 'admission' && (
            <PatientFlowView
              patients={searchedPatients}
              onNavigate={setCurrentView}
              onSelectPatient={(p) => {
                setSelectedPatient(p);
                setCurrentView('patient-files');
              }}
              onOpenNewAdmission={() => setIsNewAdmissionOpen(true)}
              onUpdateStatus={handleUpdatePatientStatus}
            />
          )}

          {currentView === 'consultation' && (
            <PatientFilesView
              patients={searchedPatients}
              selectedPatient={selectedPatient}
              onSelectPatient={setSelectedPatient}
              onNavigate={setCurrentView}
              onOpenAmoCheck={() => setIsAmoCheckOpen(true)}
            />
          )}

          {currentView === 'billing' && (
            <BillingAmoView
              invoices={invoices}
              onNavigate={setCurrentView}
              onOpenAmoCheck={() => setIsAmoCheckOpen(true)}
              onOpenCashRegister={() => setIsCashRegisterOpen(true)}
              onPayInvoice={handlePayInvoice}
            />
          )}

          {currentView === 'cash-register' && (
            <BillingAmoView
              invoices={invoices}
              onNavigate={setCurrentView}
              onOpenAmoCheck={() => setIsAmoCheckOpen(true)}
              onOpenCashRegister={() => setIsCashRegisterOpen(true)}
              onPayInvoice={handlePayInvoice}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AmoCheckModal
        isOpen={isAmoCheckOpen}
        onClose={() => setIsAmoCheckOpen(false)}
        defaultCin={selectedPatient.cin}
      />

      <NewAdmissionModal
        isOpen={isNewAdmissionOpen}
        onClose={() => setIsNewAdmissionOpen(false)}
        onAddPatient={handleAddPatient}
      />

      <CashRegisterModal
        isOpen={isCashRegisterOpen}
        onClose={() => setIsCashRegisterOpen(false)}
        totalCollected={48500}
      />

      {/* Interactive 25-Step Demonstration Scenario Modal */}
      <DemoScenarioModal
        isOpen={isDemoScenarioOpen}
        onClose={() => setIsDemoScenarioOpen(false)}
        onNavigateToView={(view) => setCurrentView(view)}
      />
    </div>
  );
}

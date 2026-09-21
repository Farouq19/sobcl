import React, { useState } from 'react';
import { ClinicUser, UserRole, RolePermissions, PermissionEntity, PermissionAction } from '../../types';
import { INITIAL_USERS, DEFAULT_ROLE_PERMISSIONS, INITIAL_CLINICS } from '../../data/saasSeedData';
import { ClinicalSelect, SelectOption } from '../common/ClinicalSelect';

interface AdminViewProps {
  currentUserRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ currentUserRole, onRoleChange }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'security'>('users');
  const [users, setUsers] = useState<ClinicUser[]>(INITIAL_USERS);
  const [permissions, setPermissions] = useState<RolePermissions>(DEFAULT_ROLE_PERMISSIONS);
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUserRole);
  const [searchUser, setSearchUser] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal State for New / Edit User
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<ClinicUser | null>(null);
  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    role: 'doctor' as UserRole,
    clinicId: 'clinic-casa',
    department: 'Médecine Générale',
    phone: '',
    specialty: ''
  });

  const rolesList: { role: UserRole; label: string; desc: string; icon: string }[] = [
    { role: 'super-admin', label: 'Super Admin', desc: 'Accès intégral système & paramétrage multi-cliniques', icon: 'admin_panel_settings' },
    { role: 'clinic-admin', label: 'Admin Clinique', desc: 'Gestion opérationnelle, utilisateurs et référentiels', icon: 'manage_accounts' },
    { role: 'doctor', label: 'Médecin / Praticien', desc: 'Consultations, prescriptions, dossiers médicaux et examens', icon: 'stethoscope' },
    { role: 'nurse', label: 'Infirmier / Major', desc: 'Soins, constantes, administration des médicaments, lits', icon: 'vaccines' },
    { role: 'reception', label: 'Réception & Accueil', desc: 'Admissions, file d\'attente, vérification AMO, tickets', icon: 'desk' },
    { role: 'billing', label: 'Facturation & Caisse', desc: 'Feuilles de soins, encaissements, clôture de caisse, avoirs', icon: 'payments' },
    { role: 'insurance-agent', label: 'Agent Assurance / AMO', desc: 'Gestion des rejets FSE, conventions Masar, télétransmission', icon: 'verified_user' },
    { role: 'laboratory', label: 'Biologiste / Labo', desc: 'Validation des prélèvements, saisie des résultats biologiques', icon: 'biotech' },
    { role: 'radiology', label: 'Radiologue / Imagerie', desc: 'Planification examens, comptes-rendus scanner, radio, écho', icon: 'radiology' },
    { role: 'pharmacy', label: 'Pharmacien', desc: 'Gestion des stocks, délivrance prescriptions, alertes réassort', icon: 'local_pharmacy' },
    { role: 'hygiene-agent', label: 'Agent d\'Hygiène', desc: 'Bio-nettoyage des chambres, libération des lits, traçabilité', icon: 'cleaning_services' }
  ];

  const entitiesList: { entity: PermissionEntity; label: string; desc: string }[] = [
    { entity: 'patients', label: 'Dossiers Patients 360°', desc: 'Données d\'identité, CIN, couverture AMO' },
    { entity: 'consultations', label: 'Consultations Médicales', desc: 'Anamnèse, diagnostics et prescriptions' },
    { entity: 'examinations', label: 'Plateau d\'Examens', desc: 'Biologie médicale et imagerie' },
    { entity: 'hospitalization', label: 'Hospitalisation (28 Lits)', desc: 'Affectation et transfert de lits' },
    { entity: 'nursing', label: 'Soins Infirmiers', desc: 'Feuilles d\'administration et constantes' },
    { entity: 'operating-room', label: 'Bloc Opératoire', desc: 'Planning bloc et check-lists sécurité' },
    { entity: 'billing', label: 'Facturation & FSE', desc: 'Feuilles de soins et actes médicaux' },
    { entity: 'cash-register', label: 'Caisse & Encaissement', desc: 'Sessions de caisse et réconciliations' },
    { entity: 'insurance', label: 'AMO & Rejets Masar', desc: 'Bordereaux CNSS/CNOPS et recours' },
    { entity: 'pharmacy', label: 'Pharmacie Clinique', desc: 'Délivrance et catalogue médicaments' },
    { entity: 'transfers', label: 'Transferts & Évacuations', desc: 'Régulation SAMU et hôpitaux partenaires' },
    { entity: 'documents', label: 'Gestion Documentaire', desc: 'Comptes-rendus, ordonnances et consentements' },
    { entity: 'administration', label: 'Administration Système', desc: 'Gestion des comptes et droits d\'accès' },
    { entity: 'audit', label: 'Journal d\'Audit', desc: 'Traces immuables des opérations' }
  ];

  const actionsList: PermissionAction[] = ['view', 'create', 'edit', 'delete', 'validate', 'export', 'approve', 'refund'];

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const handleOpenCreateUser = () => {
    setEditingUser(null);
    setUserFormData({
      name: '',
      email: '',
      role: 'doctor',
      clinicId: 'clinic-casa',
      department: 'Cardiologie',
      phone: '+212 6 ',
      specialty: 'Praticien Spécialiste'
    });
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: ClinicUser) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      clinicId: user.clinicId,
      department: user.department,
      phone: user.phone,
      specialty: user.specialty || ''
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const clinicObj = INITIAL_CLINICS.find(c => c.id === userFormData.clinicId);
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        ...userFormData,
        clinicName: clinicObj?.name || u.clinicName
      } : u));
    } else {
      const newUser: ClinicUser = {
        id: `usr-${Date.now()}`,
        name: userFormData.name,
        email: userFormData.email,
        role: userFormData.role,
        clinicId: userFormData.clinicId,
        clinicName: clinicObj?.name || 'Clinique Al Bassma Casablanca',
        department: userFormData.department,
        phone: userFormData.phone,
        status: 'active',
        lastLogin: 'Jamais connecté (Nouveau compte)',
        specialty: userFormData.specialty
      };
      setUsers([...users, newUser]);
    }
    setIsUserModalOpen(false);
  };

  const handleTogglePermission = (entity: PermissionEntity, action: PermissionAction) => {
    setPermissions(prev => {
      const currentActions = prev[selectedRole][entity] || [];
      const hasAction = currentActions.includes(action);
      const newActions = hasAction
        ? currentActions.filter(a => a !== action)
        : [...currentActions, action];

      return {
        ...prev,
        [selectedRole]: {
          ...prev[selectedRole],
          [entity]: newActions
        }
      };
    });
  };

  const filteredUsers = users.filter(u => {
    const q = (searchUser || '').toLowerCase();
    const matchesSearch = (u?.name || '').toLowerCase().includes(q) ||
                          (u?.email || '').toLowerCase().includes(q) ||
                          (u?.department || '').toLowerCase().includes(q);
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Module Title & Role Switcher Banner */}
      <div className="bg-white rounded-xl border border-[#dae2fd]/70 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#e6f7f5] text-[#006a61]">
              <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
            </span>
            <div>
              <h1 className="text-[20px] font-bold text-[#0b1c30]">Administration & Sécurité RBAC</h1>
              <p className="text-[13px] text-[#45464d]">
                Gestion des utilisateurs, habilitations réglementaires marocaines, et matrice granulaire des permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Live Active Role Simulator */}
        <div className="flex items-center gap-3 bg-[#f8f9ff] p-2.5 rounded-lg border border-[#dae2fd]/60">
          <div className="text-right">
            <div className="text-[10px] uppercase font-semibold text-[#76777d]">Simulateur de Rôle Actif</div>
            <div className="text-[12px] font-bold text-[#006a61]">
              {rolesList.find(r => r.role === currentUserRole)?.label}
            </div>
          </div>
          <ClinicalSelect
            value={currentUserRole}
            onChange={(val) => onRoleChange(val as UserRole)}
            options={rolesList.map(r => ({
              value: r.role,
              label: r.label,
              sublabel: r.desc,
              badge: r.role
            }))}
            size="md"
            align="right"
            searchable={false}
          />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#e2e8f0] gap-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 ${
            activeTab === 'users'
              ? 'border-[#006a61] text-[#006a61]'
              : 'border-transparent text-[#76777d] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">group</span>
          <span>Utilisateurs & Comptes ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 ${
            activeTab === 'roles'
              ? 'border-[#006a61] text-[#006a61]'
              : 'border-transparent text-[#76777d] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">security</span>
          <span>Matrice des Permissions & Rôles</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors border-b-2 ${
            activeTab === 'security'
              ? 'border-[#006a61] text-[#006a61]'
              : 'border-transparent text-[#76777d] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">lock</span>
          <span>Politique de Confidentialité CNDP</span>
        </button>
      </div>

      {/* TAB 1: USERS LIST */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filters & Actions Bar */}
          <div className="bg-white p-4 rounded-xl border border-[#dae2fd]/70 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d] text-[18px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Rechercher utilisateur (nom, email, service)..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-[12px] bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg focus:border-[#006a61] outline-hidden"
                />
              </div>

              <ClinicalSelect
                value={filterRole}
                onChange={(val) => setFilterRole(val)}
                options={[
                  { value: 'all', label: `Tous les rôles (${users.length})` },
                  ...rolesList.map(r => ({
                    value: r.role,
                    label: r.label,
                    badge: r.role
                  }))
                ]}
                size="sm"
                searchable={false}
              />

              <ClinicalSelect
                value={filterStatus}
                onChange={(val) => setFilterStatus(val)}
                options={[
                  { value: 'all', label: 'Tous les statuts' },
                  { value: 'active', label: 'Actif', badge: 'Actif' },
                  { value: 'inactive', label: 'Désactivé', badge: 'Désactivé' },
                ]}
                size="sm"
                searchable={false}
              />
            </div>

            <button
              onClick={handleOpenCreateUser}
              className="w-full md:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span>+ Créer Utilisateur</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#f8f9ff] border-b border-[#e2e8f0] text-[#76777d] font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Utilisateur</th>
                    <th className="py-3 px-4">Rôle Système</th>
                    <th className="py-3 px-4">Clinique Assignée</th>
                    <th className="py-3 px-4">Département</th>
                    <th className="py-3 px-4">Dernière Connexion</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredUsers.map((user) => {
                    const roleInfo = rolesList.find(r => r.role === user.role);
                    return (
                      <tr key={user.id} className="hover:bg-[#f8f9ff]/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-[#e6f7f5] text-[#006a61] font-bold text-[11px] flex items-center justify-center border border-[#86f2e4]/60">
                              {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                            </div>
                            <div>
                              <div className="font-semibold text-[#0b1c30]">{user.name}</div>
                              <div className="text-[11px] text-[#76777d]">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#e6f7f5] text-[#006a61] border border-[#86f2e4]/60">
                            <span className="material-symbols-outlined text-[13px]">{roleInfo?.icon || 'person'}</span>
                            <span>{roleInfo?.label || user.role}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[#45464d] font-medium">
                          {user.clinicName}
                        </td>
                        <td className="py-3 px-4 text-[#45464d]">
                          {user.department}
                        </td>
                        <td className="py-3 px-4 text-[#76777d] text-[11px]">
                          {user.lastLogin}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === 'active'
                              ? 'bg-[#dcfce7] text-[#15803d]'
                              : 'bg-[#fee2e2] text-[#b91c1c]'
                          }`}>
                            {user.status === 'active' ? 'Actif' : 'Désactivé'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditUser(user)}
                              className="p-1.5 rounded hover:bg-[#eff4ff] text-[#006a61]"
                              title="Modifier les informations"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={`p-1.5 rounded hover:bg-[#eff4ff] ${
                                user.status === 'active' ? 'text-[#b91c1c]' : 'text-[#15803d]'
                              }`}
                              title={user.status === 'active' ? 'Désactiver le compte' : 'Activer le compte'}
                            >
                              <span className="material-symbols-outlined text-[16px]">
                                {user.status === 'active' ? 'block' : 'check_circle'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS MATRIX */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#dae2fd]/70 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-[14px] font-bold text-[#0b1c30]">Matrice Granulaire des Droits d'Accès</h2>
              <p className="text-[12px] text-[#76777d]">
                Configurez les autorisations pour chaque rôle selon le principe du moindre privilège (PoLP).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-[#45464d]">Rôle à éditer :</span>
              <ClinicalSelect
                value={selectedRole}
                onChange={(val) => setSelectedRole(val as UserRole)}
                options={rolesList.map(r => ({
                  value: r.role,
                  label: r.label,
                  badge: r.role
                }))}
                size="sm"
                searchable={false}
              />
            </div>
          </div>

          {/* Matrix Table */}
          <div className="bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-[#f8f9ff] border-b border-[#e2e8f0] text-[#76777d] font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-1/3">Module / Entité Fonctionnelle</th>
                    {actionsList.map(action => (
                      <th key={action} className="py-3 px-2 text-center uppercase text-[9px] font-bold">
                        {action === 'view' && 'Voir'}
                        {action === 'create' && 'Créer'}
                        {action === 'edit' && 'Modifier'}
                        {action === 'delete' && 'Supprimer'}
                        {action === 'validate' && 'Valider'}
                        {action === 'export' && 'Exporter'}
                        {action === 'approve' && 'Approuver'}
                        {action === 'refund' && 'Rembourser'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {entitiesList.map(entityItem => {
                    const activeActions = permissions[selectedRole]?.[entityItem.entity] || [];
                    return (
                      <tr key={entityItem.entity} className="hover:bg-[#f8f9ff]/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#0b1c30]">{entityItem.label}</div>
                          <div className="text-[11px] text-[#76777d]">{entityItem.desc}</div>
                        </td>
                        {actionsList.map(action => {
                          const isChecked = activeActions.includes(action);
                          return (
                            <td key={action} className="py-3 px-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleTogglePermission(entityItem.entity, action)}
                                className={`h-6 w-6 rounded-md inline-flex items-center justify-center transition-all ${
                                  isChecked
                                    ? 'bg-[#006a61] text-white shadow-2xs'
                                    : 'bg-[#f1f5f9] text-transparent hover:text-[#94a3b8]'
                                }`}
                                title={`${isChecked ? 'Révoquer' : 'Accorder'} ${action} sur ${entityItem.label}`}
                              >
                                <span className="material-symbols-outlined text-[14px]">check</span>
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#f8f9ff] border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#76777d]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#006a61]" />
                <span>Modification prise en compte immédiatement dans la session active.</span>
              </div>
              <button
                onClick={() => setPermissions(DEFAULT_ROLE_PERMISSIONS)}
                className="text-[#006a61] hover:underline font-semibold"
              >
                Réinitialiser la matrice par défaut
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECURITY & COMPLIANCE */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-[#dae2fd]/70 shadow-2xs space-y-3">
            <div className="h-9 w-9 rounded-lg bg-[#e6f7f5] text-[#006a61] flex items-center justify-center">
              <span className="material-symbols-outlined">gavel</span>
            </div>
            <h3 className="font-bold text-[#0b1c30] text-[14px]">Conformité CNDP (Loi 09-08)</h3>
            <p className="text-[12px] text-[#45464d] leading-relaxed">
              Toutes les données de santé à caractère personnel sont chiffrées au repos (AES-256) et en transit (TLS 1.3). Déclaration CNDP n° D-W-849/2022 enregistrée.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#006a61]">
              Statut : Conforme & Audité
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#dae2fd]/70 shadow-2xs space-y-3">
            <div className="h-9 w-9 rounded-lg bg-[#eff4ff] text-[#188ace] flex items-center justify-center">
              <span className="material-symbols-outlined">history_toggle_off</span>
            </div>
            <h3 className="font-bold text-[#0b1c30] text-[14px]">Politique de Session & Mots de Passe</h3>
            <p className="text-[12px] text-[#45464d] leading-relaxed">
              Déconnexion automatique après 15 minutes d'inactivité sur les postes de consultation. Double authentification (2FA SMS/OTP) obligatoire pour les profils Super Admin et Facturation.
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#188ace]">
              Expiration Session : 15 min
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#dae2fd]/70 shadow-2xs space-y-3">
            <div className="h-9 w-9 rounded-lg bg-[#fef2f2] text-[#b91c1c] flex items-center justify-center">
              <span className="material-symbols-outlined">fingerprint</span>
            </div>
            <h3 className="font-bold text-[#0b1c30] text-[14px]">Signature Électronique Certifiée</h3>
            <p className="text-[12px] text-[#45464d] leading-relaxed">
              L'apposition de la signature des ordonnances et comptes-rendus requiert un certificat horodaté Barid Al Maghrib (Loi 53-05 relative à l'échange électronique des données juridiques).
            </p>
            <div className="pt-2 text-[11px] font-semibold text-[#b91c1c]">
              Certificat : Barid e-Sign Validé
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-[16px] text-[#0b1c30]">
                {editingUser ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 pt-4 text-[12px]">
              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Nom complet avec titre</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Dr. Amine Tazi ou M. Mehdi Alami"
                  value={userFormData.name}
                  onChange={(e) => setUserFormData({ ...userFormData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg focus:border-[#006a61] outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Adresse email institutionnelle</label>
                  <input
                    type="email"
                    required
                    placeholder="nom@albassma.ma"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg focus:border-[#006a61] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Téléphone direct</label>
                  <input
                    type="text"
                    required
                    placeholder="+212 6..."
                    value={userFormData.phone}
                    onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg focus:border-[#006a61] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Rôle Système (RBAC)</label>
                  <ClinicalSelect
                    value={userFormData.role}
                    onChange={(val) => setUserFormData({ ...userFormData, role: val as UserRole })}
                    options={rolesList.map(r => ({
                      value: r.role,
                      label: r.label,
                      badge: r.role
                    }))}
                    fullWidth
                    size="lg"
                    searchable={false}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Clinique Assignée</label>
                  <ClinicalSelect
                    value={userFormData.clinicId}
                    onChange={(val) => setUserFormData({ ...userFormData, clinicId: val })}
                    options={INITIAL_CLINICS.map(c => ({
                      value: c.id,
                      label: c.name,
                      sublabel: c.city,
                      badge: c.city
                    }))}
                    fullWidth
                    size="lg"
                    searchable={false}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Département / Service</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Cardiologie, Accueil, Facturation"
                    value={userFormData.department}
                    onChange={(e) => setUserFormData({ ...userFormData, department: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg focus:border-[#006a61] outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#0b1c30] mb-1">Spécialité / Fonction</label>
                  <input
                    type="text"
                    placeholder="ex: Médecin Référent, Biologiste"
                    value={userFormData.specialty}
                    onChange={(e) => setUserFormData({ ...userFormData, specialty: e.target.value })}
                    className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg focus:border-[#006a61] outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 text-[#45464d] hover:bg-[#f1f5f9] rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg font-semibold shadow-xs"
                >
                  {editingUser ? 'Enregistrer les modifications' : 'Créer le compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { MedicalDocument, PatientConsent, Patient } from '../../types';
import { INITIAL_DOCUMENTS, INITIAL_CONSENTS } from '../../data/saasSeedData';
import { ClinicalSelect, SelectOption } from '../common/ClinicalSelect';
import { DataTable, ColumnDef, ActionButton, ActionGroup, TableBadge } from '../common/DataTable';

const DOC_TYPE_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Tous types de documents' },
  { value: 'prescription', label: 'Ordonnances Médicales', badge: 'Rx' },
  { value: 'medical_report', label: 'Comptes-Rendus Médicaux', badge: 'CR' },
  { value: 'operative_report', label: 'Comptes-Rendus Opératoires', badge: 'Bloc' },
  { value: 'discharge_summary', label: 'Lettres de Sortie', badge: 'Sortie' },
  { value: 'consent_form', label: 'Consentements', badge: 'Légal' },
];

const SIGNER_RELATIONSHIP_OPTIONS: SelectOption[] = [
  { value: 'Patient lui-même', label: 'Patient lui-même (Majeur capable)' },
  { value: 'Représentant légal (Tuteur / Parent)', label: 'Représentant légal (Tuteur / Parent)' },
  { value: 'Personne de confiance désignée', label: 'Personne de confiance désignée' },
  { value: 'Conjoint', label: 'Conjoint' },
];

interface DocumentsViewProps {
  patients: Patient[];
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ patients }) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'consents'>('documents');
  const [documents, setDocuments] = useState<MedicalDocument[]>(INITIAL_DOCUMENTS);
  const [consents, setConsents] = useState<PatientConsent[]>(INITIAL_CONSENTS);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [docViewMode, setDocViewMode] = useState<'table' | 'grid'>('table');
  
  // Modals
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);
  const [selectedConsent, setSelectedConsent] = useState<PatientConsent | null>(null);
  const [isSignConsentOpen, setIsSignConsentOpen] = useState(false);
  const [signRelationship, setSignRelationship] = useState('Patient lui-même');

  const docTypeLabels: Record<string, string> = {
    prescription: 'Ordonnance Médicale',
    'medical-report': 'Compte-Rendu Médical',
    medical_report: 'Compte-Rendu Médical',
    'operative_report': 'Compte-Rendu Opératoire',
    'medical-certificate': 'Certificat Médical',
    'referral-letter': 'Lettre d\'Orientation',
    'hospitalization-report': 'Rapport d\'Hospitalisation',
    'discharge-summary': 'Lettre de Sortie / Liaison',
    discharge_summary: 'Lettre de Sortie / Liaison',
    consent_form: 'Consentement Éclairé',
    consent: 'Consentement Éclairé',
    invoice: 'Facture / Feuille de Soins'
  };

  const handleSignConsent = () => {
    if (!selectedConsent) return;
    setConsents(consents.map(c => {
      if (c.id === selectedConsent.id) {
        return {
          ...c,
          status: 'signed',
          signedAt: 'Aujourd\'hui (À l\'instant)',
          relationship: signRelationship,
          doctorSignature: 'Dr. Hicham Tazi (Signature Électronique Certifiée)'
        };
      }
      return c;
    }));
    setIsSignConsentOpen(false);
    setSelectedConsent(null);
  };

  const filteredDocs = documents.filter(d => {
    const matchesType = typeFilter === 'all' || d.type === typeFilter;
    const q = (search || '').toLowerCase();
    const matchesSearch =
      (d.title || '').toLowerCase().includes(q) ||
      (d.patientName || '').toLowerCase().includes(q) ||
      (d.patientCin || '').toLowerCase().includes(q) ||
      (d.author || '').toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl border border-[#dae2fd]/70 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#e6f7f5] text-[#006a61]">
            <span className="material-symbols-outlined text-[26px]">folder_shared</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[20px] font-bold text-[#0b1c30]">Dossier Documentaire & Consentements CNDP</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#188ace] border border-[#cbd5e1]">
                GED Médicale Certifiée
              </span>
            </div>
            <p className="text-[13px] text-[#45464d]">
              Centralisation des ordonnances, comptes-rendus opératoires, lettres de liaison et gestion des consentements légaux.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
              activeTab === 'documents' ? 'bg-[#006a61] text-white' : 'bg-white text-[#45464d] border border-[#cbd5e1]'
            }`}
          >
            Tous les Documents ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('consents')}
            className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
              activeTab === 'consents' ? 'bg-[#006a61] text-white' : 'bg-white text-[#45464d] border border-[#cbd5e1]'
            }`}
          >
            Consentements Éclairés ({consents.length})
          </button>
        </div>
      </div>

      {/* TAB 1: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white p-4 rounded-xl border border-[#dae2fd]/70 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full md:w-80">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#76777d] text-[18px]">
                search
              </span>
              <input
                type="text"
                placeholder="Rechercher par titre, patient, médecin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-[12px] bg-[#f8f9ff] border border-[#cbd5e1] rounded-lg outline-hidden focus:border-[#006a61]"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between">
              <ClinicalSelect
                value={typeFilter}
                onChange={(val) => setTypeFilter(val)}
                options={DOC_TYPE_OPTIONS}
                size="md"
                className="min-w-[220px]"
                searchable={false}
              />

              <div className="flex bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0]">
                <button
                  type="button"
                  onClick={() => setDocViewMode('table')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all ${
                    docViewMode === 'table'
                      ? 'bg-white text-[#006a61] shadow-2xs'
                      : 'text-[#76777d] hover:text-[#0b1c30]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">table_rows</span>
                  <span>Tableau</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDocViewMode('grid')}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all ${
                    docViewMode === 'grid'
                      ? 'bg-white text-[#006a61] shadow-2xs'
                      : 'text-[#76777d] hover:text-[#0b1c30]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">grid_view</span>
                  <span>Grille</span>
                </button>
              </div>
            </div>
          </div>

          {docViewMode === 'table' ? (
            <DataTable<MedicalDocument>
              columns={[
                {
                  key: 'title',
                  header: 'Document & Type',
                  width: '32%',
                  render: (doc) => (
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-lg bg-[#e6f7f5] text-[#006a61] shrink-0">
                        <span className="material-symbols-outlined text-[18px]">
                          {doc.type === 'prescription'
                            ? 'prescriptions'
                            : doc.type === 'operative_report'
                            ? 'vital_signs'
                            : 'description'}
                        </span>
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-[#0b1c30] truncate">{doc.title}</div>
                        <div className="text-[11px] text-[#76777d] truncate">
                          {docTypeLabels[doc.type] || doc.type}
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'patient',
                  header: 'Patient & CIN',
                  width: '26%',
                  render: (doc) => (
                    <div>
                      <div className="font-semibold text-[#0b1c30]">{doc.patientName}</div>
                      <div className="text-[11px] text-[#76777d]">CIN : {doc.patientCin}</div>
                    </div>
                  ),
                },
                {
                  key: 'author',
                  header: 'Auteur & Date',
                  width: '20%',
                  render: (doc) => (
                    <div>
                      <div className="font-medium text-[#0b1c30] text-[12px]">{doc.author}</div>
                      <div className="text-[11px] text-[#76777d]">{doc.createdAt}</div>
                    </div>
                  ),
                },
                {
                  key: 'status',
                  header: 'Statut',
                  width: '12%',
                  render: (doc) => (
                    <TableBadge
                      variant={doc.status === 'signed' ? 'emerald' : 'amber'}
                      dot
                    >
                      {doc.status === 'signed' ? 'Signé Barid e-Sign' : 'Validé'}
                    </TableBadge>
                  ),
                },
                {
                  key: 'actions',
                  header: 'Actions',
                  width: '10%',
                  align: 'right',
                  render: (doc) => (
                    <ActionGroup align="right" onClick={(e) => e.stopPropagation()}>
                      <ActionButton
                        icon="visibility"
                        variant="teal"
                        title="Consulter le document"
                        onClick={() => setSelectedDoc(doc)}
                      />
                      <ActionButton
                        icon="download"
                        variant="neutral"
                        title="Télécharger"
                        onClick={() => {
                          const blob = new Blob([doc.contentText || doc.title], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${doc.title.replace(/\s+/g, '_')}.txt`;
                          a.click();
                        }}
                      />
                    </ActionGroup>
                  ),
                },
              ]}
              data={filteredDocs}
              onRowClick={(doc) => setSelectedDoc(doc)}
              emptyMessage="Aucun document trouvé pour cette recherche."
              rowHeight="h-14"
            />
          ) : (
            /* Documents Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className="bg-white p-4 rounded-xl border border-[#dae2fd]/70 hover:border-[#006a61] shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff4ff] text-[#188ace] uppercase">
                        {docTypeLabels[doc.type]}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === 'signed' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-[#fef9c3] text-[#854d0e]'
                      }`}>
                        {doc.status === 'signed' ? 'Signé Barid e-Sign' : 'Validé'}
                      </span>
                    </div>

                    <h3 className="font-bold text-[14px] text-[#0b1c30] mt-2.5 line-clamp-1">{doc.title}</h3>
                    <div className="text-[12px] text-[#45464d] mt-1">
                      Patient : <strong className="text-[#0b1c30]">{doc.patientName}</strong> ({doc.patientCin})
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#f1f5f9] text-[11px] text-[#76777d] flex items-center justify-between">
                    <span>Signataire : {doc.author}</span>
                    <span>{doc.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONSENTS */}
      {activeTab === 'consents' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-[#dae2fd]/70 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[14px] text-[#0b1c30]">Registre des Consentements Éclairés</h3>
              <p className="text-[11px] text-[#76777d]">Conformité Loi 09-08 CNDP & Charte des Droits des Malades.</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#eff4ff] text-[#188ace] text-[11px] font-bold border border-[#dae2fd]/60">
              {consents.length} consentements enregistrés
            </span>
          </div>

          {(() => {
            const columns: ColumnDef<PatientConsent>[] = [
              {
                key: 'patient',
                header: 'Patient',
                width: 'w-[20%]',
                align: 'left',
                render: (c) => (
                  <span className="font-semibold text-[#0b1c30]">{c.patientName}</span>
                ),
              },
              {
                key: 'type',
                header: 'Type de Consentement',
                width: 'w-[28%]',
                align: 'left',
                render: (c) => (
                  <span className="font-medium text-[#006a61]">
                    {c.consentType === 'surgery' && 'Consentement Acte Chirurgical'}
                    {c.consentType === 'anesthesia' && 'Consentement Anesthésie Générale / Loco-régionale'}
                    {c.consentType === 'data_cndp' && 'Consentement Traitement Données Personnelles CNDP'}
                    {c.consentType === 'treatment' && 'Consentement Soins Médicaux'}
                  </span>
                ),
              },
              {
                key: 'relationship',
                header: 'Qualité du Signataire',
                width: 'w-[16%]',
                align: 'left',
                render: (c) => (
                  <span className="text-[#45464d]">{c.relationship || 'En attente'}</span>
                ),
              },
              {
                key: 'date',
                header: 'Date de Signature',
                width: 'w-[14%]',
                align: 'left',
                render: (c) => (
                  <span className="font-mono text-[11px] text-[#76777d]">{c.signedAt || 'Non signé'}</span>
                ),
              },
              {
                key: 'status',
                header: 'Statut Légal',
                width: 'w-[14%]',
                align: 'left',
                render: (c) => (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'signed'
                        ? 'bg-[#dcfce7] text-[#15803d]'
                        : 'bg-[#fee2e2] text-[#ba1a1a]'
                    }`}
                  >
                    {c.status === 'signed' ? 'Signé & Archivé' : 'En attente de signature'}
                  </span>
                ),
              },
              {
                key: 'actions',
                header: 'Actions',
                width: 'w-[8%]',
                align: 'right',
                render: (c) => (
                  <ActionGroup>
                    {c.status !== 'signed' ? (
                      <ActionButton
                        icon="edit_document"
                        onClick={() => {
                          setSelectedConsent(c);
                          setIsSignConsentOpen(true);
                        }}
                        title="Recueillir la signature du patient"
                        variant="primary"
                      />
                    ) : (
                      <ActionButton
                        icon="visibility"
                        onClick={() => {
                          setSelectedDoc({
                            id: c.id,
                            patientId: c.patientId,
                            patientName: c.patientName,
                            patientCin: 'CIN',
                            title: `Formulaire Consentement - ${c.patientName}`,
                            type: 'consent_form',
                            author: c.doctorSignature || 'Médecin',
                            contentText: c.consentText,
                            status: 'signed',
                            createdAt: c.signedAt || 'Date',
                          });
                        }}
                        title="Consulter l'acte signé"
                        variant="neutral"
                      />
                    )}
                  </ActionGroup>
                ),
              },
            ];

            return (
              <DataTable<PatientConsent>
                columns={columns}
                data={consents}
                keyExtractor={(c) => c.id}
                emptyMessage="Aucun consentement enregistré dans le registre."
                emptyIcon="description"
                rowHeightClass="h-14"
              />
            );
          })()}
        </div>
      )}

      {/* Document View / Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <div>
                <h3 className="font-bold text-[16px] text-[#0b1c30]">{selectedDoc.title}</h3>
                <div className="text-[12px] text-[#76777d]">
                  Patient : {selectedDoc.patientName} • Rédigé par : {selectedDoc.author}
                </div>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <div className="bg-[#f8f9ff] p-5 rounded-xl border border-[#dae2fd]/70 font-mono text-[12px] whitespace-pre-line text-[#0b1c30] leading-relaxed">
                {selectedDoc.contentText}
              </div>
            </div>

            <div className="pt-3 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#76777d]">
              <div className="flex items-center gap-1.5 text-[#15803d] font-semibold">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Horodatage et intégrité garantis par Barid Al-Maghrib PKI</span>
              </div>
              <button
                onClick={() => alert(`Téléchargement du document PDF sécurisé [${selectedDoc.title}.pdf] lancé.`)}
                className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
                <span>Télécharger PDF Signé</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Consent Modal */}
      {isSignConsentOpen && selectedConsent && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-[#cbd5e1] animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
              <h3 className="font-bold text-[16px] text-[#0b1c30]">Recueil du Consentement Éclairé</h3>
              <button
                onClick={() => setIsSignConsentOpen(false)}
                className="p-1 rounded-md text-[#76777d] hover:bg-[#f1f5f9]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-4 pt-4 text-[12px]">
              <div className="p-3 bg-[#f8f9ff] rounded-lg border border-[#dae2fd]/70">
                <div className="font-semibold text-[#0b1c30]">{selectedConsent.patientName}</div>
                <p className="text-[11px] text-[#45464d] mt-1">{selectedConsent.consentText}</p>
              </div>

              <div>
                <label className="block font-semibold text-[#0b1c30] mb-1">Qualité du signataire</label>
                <ClinicalSelect
                  value={signRelationship}
                  onChange={(val) => setSignRelationship(val)}
                  options={SIGNER_RELATIONSHIP_OPTIONS}
                  fullWidth
                  size="lg"
                  searchable={false}
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-[#e6f7f5] text-[#006a61] border border-[#86f2e4]/60">
                <input type="checkbox" defaultChecked className="h-4 w-4 text-[#006a61] rounded" />
                <span className="font-medium text-[11px]">
                  Le signataire atteste avoir reçu toutes les explications médicales préalables et accepte librement l'intervention.
                </span>
              </div>

              <div className="pt-4 border-t border-[#e2e8f0] flex justify-end gap-2">
                <button
                  onClick={() => setIsSignConsentOpen(false)}
                  className="px-4 py-2 text-[#45464d] hover:bg-[#f1f5f9] rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSignConsent}
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white rounded-lg font-semibold shadow-xs"
                >
                  Apposer la Signature Électronique
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

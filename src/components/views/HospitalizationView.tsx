import React, { useState } from 'react';
import { Room, Bed, ViewMode } from '../../types';
import { DataTable, Column, TableBadge } from '../common/DataTable';

type BedWithRoom = Bed & { room: Room };

interface HospitalizationViewProps {
  rooms: Room[];
  onNavigate: (view: ViewMode) => void;
  onUpdateBedStatus: (roomId: string, bedId: string, status: Bed['status'], notes?: string) => void;
}

export const HospitalizationView: React.FC<HospitalizationViewProps> = ({
  rooms,
  onNavigate,
  onUpdateBedStatus
}) => {
  const [selectedFloor, setSelectedFloor] = useState<'all' | 'Étage 1' | 'Étage 2' | 'Aile Sud' | 'Rez-de-chaussée'>('all');
  const [selectedRoom, setSelectedRoom] = useState<Room>(rooms[0]);
  const [selectedBed, setSelectedBed] = useState<Bed>(rooms[0].beds[0]);
  const [hospViewMode, setHospViewMode] = useState<'rooms' | 'table'>('table');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Care plan checkbox state
  const [careChecklist, setCareChecklist] = useState({
    perfusion: true,
    pansement: true,
    glycemie: false,
    anticoagulant: false
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredRooms = rooms.filter((r) => {
    if (selectedFloor === 'all') return true;
    return r.floor === selectedFloor;
  });

  const allBedsWithRoom = filteredRooms.flatMap((room) =>
    room.beds.map((bed) => ({
      ...bed,
      room,
    }))
  );

  // Calculate totals
  let totalBeds = 0;
  let occupiedBeds = 0;
  let availableBeds = 0;
  let cleaningBeds = 0;

  rooms.forEach((r) => {
    r.beds.forEach((b) => {
      totalBeds += 1;
      if (b.status === 'occupied') occupiedBeds += 1;
      if (b.status === 'available') availableBeds += 1;
      if (b.status === 'cleaning') cleaningBeds += 1;
    });
  });

  const occupancyRate = Math.round((occupiedBeds / totalBeds) * 100);

  return (
    <div className="space-y-4 pb-12">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#131b2e] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#dae2fd]/30 flex items-center gap-2 text-[13px] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-[#86f2e4] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Strip: Key Bed Metrics */}
      <div className="bg-white rounded-xl p-4 shadow-2xs border border-[#e2e8f0] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
            <span className="material-symbols-outlined text-[24px]">bed</span>
          </div>
          <div>
            <h1 className="font-headline text-lg font-bold text-[#0b1c30]">
              Hospitalisation & Gestion des Chambres
            </h1>
            <p className="text-[12px] text-[#45464d]">
              Capacité : 28 lits • Clinique Al Bassma (Chirurgie, Médecine, VIP & USIC)
            </p>
          </div>
        </div>

        {/* Real-time counters */}
        <div className="flex flex-wrap items-center gap-3 text-[12px]">
          <div className="px-3 py-1.5 bg-[#eff4ff] rounded-lg border border-[#dae2fd] flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
            <span>Occupés : <strong>{occupiedBeds} / {totalBeds} ({occupancyRate}%)</strong></span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2 text-emerald-800">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
            <span>Disponibles : <strong>{availableBeds} lits</strong></span>
          </div>
          <div className="px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-2 text-amber-800">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Bio-nettoyage : <strong>{cleaningBeds} en cours</strong></span>
          </div>
        </div>
      </div>

      {/* Sector / Floor Filter Bar & View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedFloor('all')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedFloor === 'all'
                ? 'bg-[#131b2e] text-white'
                : 'bg-white text-[#45464d] border border-[#cbd5e1] hover:bg-slate-50'
            }`}
          >
            Tous les services (28 lits)
          </button>
          <button
            onClick={() => setSelectedFloor('Étage 1')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedFloor === 'Étage 1'
                ? 'bg-[#006a61] text-white'
                : 'bg-white text-[#45464d] border border-[#cbd5e1] hover:bg-slate-50'
            }`}
          >
            Étage 1 • Chirurgie Orthopédique & Générale
          </button>
          <button
            onClick={() => setSelectedFloor('Étage 2')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedFloor === 'Étage 2'
                ? 'bg-[#006a61] text-white'
                : 'bg-white text-[#45464d] border border-[#cbd5e1] hover:bg-slate-50'
            }`}
          >
            Étage 2 • Médecine Interne & Cardiologie
          </button>
          <button
            onClick={() => setSelectedFloor('Aile Sud')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedFloor === 'Aile Sud'
                ? 'bg-purple-800 text-white'
                : 'bg-white text-[#45464d] border border-[#cbd5e1] hover:bg-slate-50'
            }`}
          >
            Aile Sud • Suites VIP & Maternité
          </button>
          <button
            onClick={() => setSelectedFloor('Rez-de-chaussée')}
            className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedFloor === 'Rez-de-chaussée'
                ? 'bg-[#ba1a1a] text-white'
                : 'bg-white text-[#45464d] border border-[#cbd5e1] hover:bg-slate-50'
            }`}
          >
            RDC • USIC & Surveillance Continue
          </button>
        </div>

        <div className="flex bg-[#f1f5f9] p-1 rounded-lg border border-[#e2e8f0]">
          <button
            onClick={() => setHospViewMode('table')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all ${
              hospViewMode === 'table'
                ? 'bg-white text-[#006a61] shadow-2xs'
                : 'text-[#76777d] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">table_rows</span>
            <span>Tableau</span>
          </button>
          <button
            onClick={() => setHospViewMode('rooms')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-md flex items-center gap-1 transition-all ${
              hospViewMode === 'rooms'
                ? 'bg-white text-[#006a61] shadow-2xs'
                : 'text-[#76777d] hover:text-[#0b1c30]'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">meeting_room</span>
            <span>Chambres</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Rooms (7 cols) + Right Bed Care Sheet (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Rooms or Table Grid */}
        <div className="lg:col-span-7 space-y-4">
          {hospViewMode === 'table' ? (
            <div className="bg-white rounded-xl shadow-2xs border border-[#e2e8f0] overflow-hidden">
              <DataTable<BedWithRoom>
                columns={[
                  {
                    key: 'bed',
                    header: 'Lit & Chambre',
                    width: '24%',
                    render: (item) => (
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-[#eff4ff] text-[#006a61] rounded-md shrink-0">
                          <span className="material-symbols-outlined text-[16px]">single_bed</span>
                        </span>
                        <div className="min-w-0">
                          <div className="font-bold text-[#0b1c30] truncate">{item.code}</div>
                          <div className="text-[11px] text-[#76777d] truncate">{item.room.name}</div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: 'service',
                    header: 'Étage & Service',
                    width: '22%',
                    render: (item) => (
                      <div>
                        <div className="font-medium text-[#0b1c30] text-[12px] truncate">{item.room.department}</div>
                        <div className="text-[10px] text-[#76777d]">{item.room.floor}</div>
                      </div>
                    ),
                  },
                  {
                    key: 'status',
                    header: 'Statut Lit',
                    width: '18%',
                    render: (item) => {
                      if (item.status === 'occupied') {
                        return <TableBadge variant="purple" dot>Occupé</TableBadge>;
                      }
                      if (item.status === 'available') {
                        return <TableBadge variant="emerald" dot>Disponible</TableBadge>;
                      }
                      if (item.status === 'cleaning') {
                        return <TableBadge variant="amber" icon="cleaning_services">Nettoyage</TableBadge>;
                      }
                      if (item.status === 'reserved') {
                        return <TableBadge variant="blue" icon="bookmark">Réservé</TableBadge>;
                      }
                      return <TableBadge variant="neutral">{item.status}</TableBadge>;
                    },
                  },
                  {
                    key: 'patient',
                    header: 'Patient Assigné',
                    width: '20%',
                    render: (item) => (
                      item.patientName ? (
                        <div>
                          <div className="font-semibold text-[#0b1c30] truncate">{item.patientName}</div>
                          <div className="text-[10px] text-[#76777d]">
                            {item.admissionDate ? `Entrée : ${item.admissionDate}` : 'Hospitalisé'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#76777d] italic">Lit vacant</span>
                      )
                    ),
                  },
                  {
                    key: 'diagnosis',
                    header: 'Diagnostic / Note',
                    width: '16%',
                    render: (item) => (
                      <span className="text-[11px] text-[#45464d] truncate block" title={item.diagnosis || ''}>
                        {item.diagnosis || (item.status === 'available' ? 'Prêt pour admission' : '—')}
                      </span>
                    ),
                  },
                ]}
                data={allBedsWithRoom}
                onRowClick={(item) => {
                  setSelectedRoom(item.room);
                  setSelectedBed(item);
                }}
                emptyMessage="Aucun lit trouvé pour ce secteur."
                rowHeight="h-14"
              />
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-xl shadow-2xs border border-[#e2e8f0] p-4 flex flex-col justify-between space-y-3 hover:border-[#86f2e4] transition-all"
              >
                {/* Room Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-headline text-base font-bold text-[#0b1c30]">
                        {room.name}
                      </span>
                      {room.isVip && (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded">
                          VIP
                        </span>
                      )}
                      {room.type === 'icu' && (
                        <span className="text-[10px] font-bold bg-red-100 text-red-900 px-1.5 py-0.2 rounded">
                          USIC
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#76777d]">
                      {room.floor} • {room.department}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#45464d] bg-[#f1f5f9] px-2 py-0.5 rounded">
                    {room.beds.length} {room.beds.length > 1 ? 'lits' : 'lit'}
                  </span>
                </div>

                {/* Beds in Room */}
                <div className="space-y-2">
                  {room.beds.map((bed) => {
                    const isBedActive = selectedBed.id === bed.id;
                    return (
                      <div
                        key={bed.id}
                        onClick={() => {
                          setSelectedRoom(room);
                          setSelectedBed(bed);
                        }}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                          isBedActive
                            ? 'border-[#006a61] bg-[#e6f7f5]/40 shadow-xs ring-1 ring-[#006a61]'
                            : 'border-[#e2e8f0] hover:bg-[#f8f9ff]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px] text-[#45464d]">
                              single_bed
                            </span>
                            <span className="text-[12px] font-bold text-[#0b1c30]">
                              {bed.code}
                            </span>
                          </div>

                          {/* Status Badge */}
                          {bed.status === 'occupied' && (
                            <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                              Occupé
                            </span>
                          )}
                          {bed.status === 'available' && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                              Disponible
                            </span>
                          )}
                          {bed.status === 'cleaning' && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              Bio-nettoyage
                            </span>
                          )}
                          {bed.status === 'reserved' && (
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Réservé
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        {bed.status === 'occupied' && (
                          <div className="mt-1.5 text-[11px] text-[#45464d]">
                            <div className="font-semibold text-[#0b1c30]">
                              {bed.patientName} {bed.patientAge ? `(${bed.patientAge} ans)` : ''}
                            </div>
                            <div className="text-[#76777d] truncate">{bed.diagnosis}</div>
                          </div>
                        )}
                        {bed.status === 'cleaning' && (
                          <div className="mt-1.5 text-[11px] text-amber-800">
                            Agent d'hygiène en cours • Fin estimée {bed.cleaningEstimatedEnd || '12h15'}
                          </div>
                        )}
                        {bed.status === 'reserved' && (
                          <div className="mt-1.5 text-[11px] text-blue-800">
                            Prévu pour sortie bloc à {bed.reservedForTime || '11h30'} : {bed.patientName}
                          </div>
                        )}
                        {bed.status === 'available' && (
                          <div className="mt-1.5 text-[11px] text-emerald-700">
                            Lit stérile prêt pour admission immédiate
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Right Bed Care Sheet Detail */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-2xs border border-[#e2e8f0] p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#f1f5f9]">
              <div>
                <span className="text-[11px] font-semibold text-[#006a61] uppercase tracking-wider">
                  Détail de Prise en Charge Hospitalière
                </span>
                <h3 className="font-headline text-lg font-bold text-[#0b1c30]">
                  {selectedRoom.name} • {selectedBed.code}
                </h3>
                <span className="text-[11px] text-[#76777d]">
                  {selectedRoom.department} ({selectedRoom.floor})
                </span>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  selectedBed.status === 'occupied'
                    ? 'bg-purple-100 text-purple-800'
                    : selectedBed.status === 'available'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {selectedBed.status.toUpperCase()}
              </span>
            </div>

            {selectedBed.status === 'occupied' ? (
              <>
                {/* Patient Overview */}
                <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#dae2fd] space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-[14px] text-[#0b1c30]">
                        {selectedBed.patientName}
                      </div>
                      <div className="text-[11px] text-[#76777d]">
                        CIN: {selectedBed.patientCin || 'BK928314'} • {selectedBed.patientAge || 42} ans
                      </div>
                    </div>
                    <span className="text-[11px] font-bold bg-[#006a61] text-white px-2 py-0.5 rounded">
                      {selectedBed.stayDay || 'J+1 Post-op'}
                    </span>
                  </div>

                  <div className="text-[12px] text-[#0b1c30] pt-1 border-t border-[#dae2fd]">
                    <span className="font-semibold text-[#45464d]">Diagnostic : </span>
                    {selectedBed.diagnosis}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#45464d] pt-1">
                    <div>
                      <span className="text-[#76777d] block">Médecin Traitant :</span>
                      <span className="font-semibold text-[#0b1c30]">{selectedBed.doctor || 'Dr. Hicham Tazi'}</span>
                    </div>
                    <div>
                      <span className="text-[#76777d] block">Prise en charge AMO :</span>
                      <span className="font-semibold text-[#006a61]">{selectedBed.coverage || 'AMO CNSS 80% (Forfait 800 MAD/j)'}</span>
                    </div>
                  </div>
                </div>

                {/* Plan de soins actif */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-headline text-[13px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#006a61] text-[18px]">checklist</span>
                      Plan de Soins Infirmier Actif
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-semibold">2/4 validés</span>
                  </div>

                  <div className="space-y-2 text-[12px]">
                    <label className="flex items-start gap-2.5 p-2 bg-[#f8f9ff] rounded-lg cursor-pointer hover:bg-[#eff4ff]">
                      <input
                        type="checkbox"
                        checked={careChecklist.perfusion}
                        onChange={(e) => setCareChecklist({ ...careChecklist, perfusion: e.target.checked })}
                        className="mt-0.5 rounded text-[#006a61] focus:ring-[#006a61]"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-[#0b1c30] block">Perfusion IV NaCl 500ml + Paracétamol 1g</span>
                        <span className="text-[11px] text-[#76777d]">Passé à 08:30 par Infirmière Samira B.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2 bg-[#f8f9ff] rounded-lg cursor-pointer hover:bg-[#eff4ff]">
                      <input
                        type="checkbox"
                        checked={careChecklist.pansement}
                        onChange={(e) => setCareChecklist({ ...careChecklist, pansement: e.target.checked })}
                        className="mt-0.5 rounded text-[#006a61] focus:ring-[#006a61]"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-[#0b1c30] block">Réfection pansement chirurgical propre</span>
                        <span className="text-[11px] text-[#76777d]">Contrôle cicatrice sans écoulement</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2 bg-[#f8f9ff] rounded-lg cursor-pointer hover:bg-[#eff4ff]">
                      <input
                        type="checkbox"
                        checked={careChecklist.glycemie}
                        onChange={(e) => setCareChecklist({ ...careChecklist, glycemie: e.target.checked })}
                        className="mt-0.5 rounded text-[#006a61] focus:ring-[#006a61]"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-[#0b1c30] block">Contrôle glycémie capillaire & constantes (14h00)</span>
                        <span className="text-[11px] text-amber-700 font-medium">À réaliser</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2 bg-[#f8f9ff] rounded-lg cursor-pointer hover:bg-[#eff4ff]">
                      <input
                        type="checkbox"
                        checked={careChecklist.anticoagulant}
                        onChange={(e) => setCareChecklist({ ...careChecklist, anticoagulant: e.target.checked })}
                        className="mt-0.5 rounded text-[#006a61] focus:ring-[#006a61]"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-[#0b1c30] block">Injection Lovenox 0.4ml SC le soir (20h00)</span>
                        <span className="text-[11px] text-[#76777d]">Prévention thrombo-embolique post-op</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Staff note */}
                <div className="p-3 bg-white rounded-lg border border-[#cbd5e1] text-[11px] text-[#45464d]">
                  <span className="font-bold text-[#0b1c30] block mb-0.5">Note de relève :</span>
                  {selectedBed.notes || 'Surveillance clinique normale. Mobilisation douce au fauteuil autorisée par le Dr. Tazi cet après-midi.'}
                </div>
              </>
            ) : selectedBed.status === 'available' ? (
              <div className="p-8 text-center space-y-3">
                <span className="material-symbols-outlined text-[48px] text-emerald-600">
                  check_circle
                </span>
                <h4 className="font-headline text-base font-bold text-[#0b1c30]">
                  Ce lit est prêt et immédiatement disponible
                </h4>
                <p className="text-[12px] text-[#45464d]">
                  Le protocole de bio-nettoyage a été validé. Vous pouvez y affecter une nouvelle admission ou une sortie de bloc.
                </p>
                <button
                  onClick={() => {
                    onUpdateBedStatus(selectedRoom.id, selectedBed.id, 'occupied', 'Patient admis depuis les urgences');
                    showToast(`Nouveau patient admis dans le ${selectedBed.code}`);
                  }}
                  className="px-4 py-2 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Affecter un Patient à ce Lit
                </button>
              </div>
            ) : (
              <div className="p-8 text-center space-y-3">
                <span className="material-symbols-outlined text-[48px] text-amber-600">
                  cleaning_services
                </span>
                <h4 className="font-headline text-base font-bold text-[#0b1c30]">
                  Bio-nettoyage en cours
                </h4>
                <p className="text-[12px] text-[#45464d]">
                  Désinfection de niveau 2 après sortie patient. Fin estimée : 12h15.
                </p>
                <button
                  onClick={() => {
                    onUpdateBedStatus(selectedRoom.id, selectedBed.id, 'available', 'Bio-nettoyage terminé et validé');
                    showToast(`Bio-nettoyage certifié pour le ${selectedBed.code}`);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Certifier Lit Propre & Disponible
                </button>
              </div>
            )}
          </div>

          {/* Action Footer */}
          {selectedBed.status === 'occupied' && (
            <div className="pt-3 border-t border-[#f1f5f9] flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate('billing-amo')}
                className="flex-1 py-2 px-3 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#0b1c30] text-[11px] font-semibold rounded-lg border border-[#cbd5e1] transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">receipt_long</span>
                <span>Transférer Facturation</span>
              </button>
              <button
                onClick={() => showToast('Feuille d\'hospitalisation et pancarte imprimées')}
                className="py-2 px-3 bg-[#f8f9ff] hover:bg-[#eff4ff] text-[#0b1c30] text-[11px] font-semibold rounded-lg border border-[#cbd5e1] transition-colors flex items-center justify-center gap-1"
              >
                <span className="material-symbols-outlined text-[15px]">print</span>
                <span>Imprimer Feuille</span>
              </button>
              <button
                onClick={() => showToast('Ronde médicale enregistrée')}
                className="w-full py-2 px-4 bg-[#006a61] hover:bg-[#00544d] text-white text-[12px] font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Valider Ronde Médicale & Constantes</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

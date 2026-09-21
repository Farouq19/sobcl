import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Patient } from '../types';
import { INITIAL_ROOMS, ACTIVE_DOCTORS } from '../data/mockData';
import { INITIAL_USERS, INITIAL_SURGERY_SCHEDULE } from '../data/saasSeedData';

export interface ServiceOption {
  id: string;
  label: string;
  count?: number;
  badge?: string;
}

interface ServiceSelectDropdownProps {
  value: string;
  onChange: (value: string, label: string) => void;
  patients?: Patient[];
  className?: string;
}

export const ServiceSelectDropdown: React.FC<ServiceSelectDropdownProps> = ({
  value,
  onChange,
  patients = [],
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Extract ALL available services dynamically from all existing data sources
  const allServices = useMemo<ServiceOption[]>(() => {
    // 1. Fixed base items that MUST be preserved
    const baseFirstOption: ServiceOption = {
      id: 'all',
      label: 'Tous les services (Cardio, Urgences, Bloc...)',
      count: patients.length
    };

    const baseExistingOptions: ServiceOption[] = [
      { id: 'cardio', label: 'Cardiologie' },
      { id: 'urgences', label: 'Urgences 24/7' },
      { id: 'pediatrie', label: 'Pédiatrie' }
    ];

    // 2. Gather unique service/department names from existing datasets
    const discoveredNames = new Set<string>();

    // From patients specialties & locations
    patients.forEach((p) => {
      if (p.specialty && p.specialty.trim()) {
        discoveredNames.add(p.specialty.trim());
      }
    });

    // From hospital rooms departments
    INITIAL_ROOMS.forEach((r) => {
      if (r.department && r.department.trim()) {
        discoveredNames.add(r.department.trim());
      }
    });

    // From medical staff on duty
    ACTIVE_DOCTORS.forEach((s) => {
      if (s.specialty && s.specialty.trim()) {
        discoveredNames.add(s.specialty.trim());
      }
    });

    // From clinic users (departments and specialties)
    INITIAL_USERS.forEach((u) => {
      if (u.department && u.department.trim()) {
        discoveredNames.add(u.department.trim());
      }
      if (u.specialty && u.specialty.trim()) {
        discoveredNames.add(u.specialty.trim());
      }
    });

    // From operating rooms
    INITIAL_SURGERY_SCHEDULE.forEach((surg) => {
      if (surg.operatingRoom && surg.operatingRoom.trim()) {
        discoveredNames.add(surg.operatingRoom.trim());
      }
    });

    // Remove duplicates already handled in base options (case-insensitive)
    const existingLabels = new Set(baseExistingOptions.map((b) => b.label.toLowerCase().trim()));
    existingLabels.add('tous les services');
    existingLabels.add('tous les services (cardio, urgences, bloc...)');

    const additionalOptions: ServiceOption[] = [];

    discoveredNames.forEach((name) => {
      const lower = name.toLowerCase().trim();
      // Skip if exactly matches base labels or generic non-services
      if (!existingLabels.has(lower) && lower.length > 2) {
        // Calculate matching patients count for extra context
        const matchingPatients = patients.filter((p) => {
          const spec = (p.specialty || '').toLowerCase();
          const loc = (p.currentLocation || '').toLowerCase();
          return spec.includes(lower) || lower.includes(spec) || loc.includes(lower);
        });

        additionalOptions.push({
          id: name,
          label: name,
          count: matchingPatients.length
        });
      }
    });

    // Calculate count for base items
    baseExistingOptions.forEach((item) => {
      const lower = item.id.toLowerCase();
      const count = patients.filter((p) => {
        const spec = (p.specialty || '').toLowerCase();
        const loc = (p.currentLocation || '').toLowerCase();
        const doc = (p.assignedDoctor || '').toLowerCase();
        const ticket = (p.ticketNumber || '').toLowerCase();

        if (lower === 'cardio') return spec.includes('cardio') || loc.includes('cardio') || doc.includes('amrani');
        if (lower === 'urgences') return spec.includes('urg') || loc.includes('urg') || ticket.startsWith('#u');
        if (lower === 'pediatrie') return spec.includes('péd') || p.name.toLowerCase().includes('enfant');
        return spec.includes(lower);
      }).length;
      item.count = count;
    });

    // Sort additional options alphabetically
    additionalOptions.sort((a, b) => a.label.localeCompare(b.label, 'fr', { sensitivity: 'base' }));

    // Concatenate: "Tous les services" is guaranteed in first position, followed by base options and all discovered services
    return [baseFirstOption, ...baseExistingOptions, ...additionalOptions];
  }, [patients]);

  // Current selected option label
  const selectedOption = useMemo(() => {
    return allServices.find((s) => s.id === value) || allServices[0];
  }, [allServices, value]);

  // Filtered services based on search query
  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allServices;

    return allServices.filter((s) => {
      const label = s.label.toLowerCase();
      const id = s.id.toLowerCase();
      return label.includes(q) || id.includes(q);
    });
  }, [allServices, searchQuery]);

  const handleSelect = (service: ServiceOption) => {
    onChange(service.id, service.label);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="w-full sm:w-auto min-w-[260px] max-w-sm px-3 py-1.5 bg-white text-[12px] font-semibold text-[#0b1c30] border border-[#cbd5e1] hover:border-[#006a61] focus:border-[#006a61] focus:ring-2 focus:ring-[#006a61]/15 rounded-lg shadow-2xs transition-all outline-hidden cursor-pointer flex items-center justify-between gap-2.5"
      >
        <span className="truncate text-left text-[#0b1c30] flex-1">
          {selectedOption?.label || 'Tous les services (Cardio, Urgences, Bloc...)'}
        </span>

        {/* Selected count badge if > 0 and not 'all' */}
        {selectedOption?.id !== 'all' && (selectedOption?.count ?? 0) > 0 && (
          <span className="shrink-0 px-1.5 py-0.2 bg-[#e6f7f5] text-[#006a61] text-[10px] font-bold rounded-md">
            {selectedOption.count} pt{selectedOption.count! > 1 ? 's' : ''}
          </span>
        )}

        {/* Chevron Icon */}
        <span
          className={`material-symbols-outlined text-[18px] text-[#006a61] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 mt-1.5 w-[330px] sm:w-[380px] bg-white rounded-xl shadow-xl border border-[#cbd5e1] z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 origin-top-left"
        >
          {/* Top Search Bar */}
          <div className="p-2.5 bg-[#f8f9ff] border-b border-[#cbd5e1]/70 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#76777d]">search</span>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un service..."
              className="flex-1 bg-white text-[12px] font-medium text-[#0b1c30] placeholder-[#76777d] px-2.5 py-1.5 rounded-lg border border-[#cbd5e1] hover:border-[#006a61] focus:border-[#006a61] focus:ring-2 focus:ring-[#006a61]/15 outline-hidden transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-[#e2e8f0] text-[#76777d] hover:text-[#0b1c30] rounded-md transition-colors"
                title="Effacer la recherche"
              >
                <span className="material-symbols-outlined text-[16px] block">close</span>
              </button>
            )}
            <span className="text-[10px] font-bold text-[#76777d] bg-white px-1.5 py-1 rounded border border-[#cbd5e1]/60 whitespace-nowrap">
              {filteredServices.length}
            </span>
          </div>

          {/* Options List with Controlled Max-Height & Modern Scrollbar */}
          <div className="max-h-[340px] overflow-y-auto dropdown-scrollbar p-1.5 space-y-0.5">
            {filteredServices.length === 0 ? (
              <div className="py-6 px-4 text-center">
                <span className="material-symbols-outlined text-[28px] text-[#76777d]/60 mb-1 block">search_off</span>
                <p className="text-[12px] font-medium text-[#45464d]">
                  Aucun service trouvé pour « <span className="font-bold text-[#0b1c30]">{searchQuery}</span> »
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-2 text-[11px] font-semibold text-[#006a61] hover:underline"
                >
                  Afficher tous les services
                </button>
              </div>
            ) : (
              filteredServices.map((service) => {
                const isSelected = service.id === value;
                return (
                  <div
                    key={service.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(service)}
                    className={`w-full px-3 py-2 text-left rounded-lg text-[12px] transition-all flex items-center justify-between gap-2.5 cursor-pointer group ${
                      isSelected
                        ? 'bg-[#e6f7f5] text-[#006a61] font-bold shadow-2xs'
                        : 'text-[#0b1c30] font-medium hover:bg-[#f1f5f9] hover:text-[#006a61]'
                    }`}
                  >
                    {/* Service Label (Untruncated, fully legible) */}
                    <span className="flex-1 leading-snug whitespace-normal break-words">
                      {service.label}
                    </span>

                    {/* Right side: Count badge & Check icon */}
                    <div className="flex items-center gap-2 shrink-0">
                      {service.count !== undefined && service.count > 0 && (
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-[#006a61] text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-[#e6f7f5] group-hover:text-[#006a61]'
                          }`}
                        >
                          {service.count} pt{service.count > 1 ? 's' : ''}
                        </span>
                      )}

                      {/* Check mark for selected item */}
                      {isSelected ? (
                        <span className="material-symbols-outlined text-[18px] text-[#006a61] font-bold">
                          check
                        </span>
                      ) : (
                        <span className="w-[18px]" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer info bar */}
          <div className="px-3 py-1.5 bg-[#f8f9ff] border-t border-[#cbd5e1]/50 flex items-center justify-between text-[10px] text-[#76777d]">
            <span>Total : {allServices.length} services configurés</span>
            <span className="text-[#006a61] font-medium">Clinique Al Bassma</span>
          </div>
        </div>
      )}
    </div>
  );
};

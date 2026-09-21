import React, { useState, useRef, useEffect, useMemo } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  icon?: string;
  disabled?: boolean;
}

export interface ClinicalSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: (SelectOption | string)[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
  align?: 'left' | 'right';
  searchable?: boolean;
  searchPlaceholder?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  id?: string;
  title?: string;
  fullWidth?: boolean;
}

export const ClinicalSelect: React.FC<ClinicalSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Sélectionner...',
  className = '',
  triggerClassName = '',
  dropdownClassName = '',
  align = 'left',
  searchable,
  searchPlaceholder = 'Rechercher...',
  size = 'md',
  disabled = false,
  id,
  title,
  fullWidth = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to SelectOption[]
  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  // Current selected option
  const selectedOption = useMemo(() => {
    return normalizedOptions.find((opt) => opt.value === value);
  }, [normalizedOptions, value]);

  // Auto-enable search if there are more than 7 options unless explicitly set to false
  const isSearchEnabled = useMemo(() => {
    if (searchable !== undefined) return searchable;
    return normalizedOptions.length > 7;
  }, [searchable, normalizedOptions.length]);

  // Close dropdown on click outside or escape key
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

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      if (isSearchEnabled) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    } else {
      setSearchQuery('');
    }
  }, [isOpen, isSearchEnabled]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return normalizedOptions;

    return normalizedOptions.filter((opt) => {
      const labelMatch = opt.label.toLowerCase().includes(q);
      const sublabelMatch = opt.sublabel?.toLowerCase().includes(q);
      const valMatch = opt.value.toLowerCase().includes(q);
      return labelMatch || sublabelMatch || valMatch;
    });
  }, [normalizedOptions, searchQuery]);

  // Size styling classes
  const sizeStyles = {
    sm: 'text-[11px] py-1 px-2.5 rounded-md min-h-[28px]',
    md: 'text-[12px] py-1.5 px-3 rounded-lg min-h-[34px]',
    lg: 'text-[13px] py-2 px-3 rounded-lg min-h-[40px]',
  };

  const chevronSizes = {
    sm: 'text-[16px]',
    md: 'text-[18px]',
    lg: 'text-[20px]',
  };

  const handleSelect = (opt: SelectOption) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      id={id}
      title={title}
      className={`relative ${fullWidth ? 'w-full' : 'inline-block'} text-left ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full bg-white font-medium text-[#0b1c30] border border-[#cbd5e1] hover:border-[#006a61] focus:border-[#006a61] focus:ring-2 focus:ring-[#006a61]/15 shadow-2xs transition-all outline-hidden cursor-pointer flex items-center justify-between gap-2 ${
          sizeStyles[size]
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''} ${triggerClassName}`}
      >
        <span className="truncate text-left flex-1">
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        {selectedOption?.badge && (
          <span className="shrink-0 px-1.5 py-0.5 bg-[#e6f7f5] text-[#006a61] text-[10px] font-bold rounded">
            {selectedOption.badge}
          </span>
        )}

        <span
          className={`material-symbols-outlined ${chevronSizes[size]} text-[#006a61] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Modern Popover Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className={`absolute ${
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          } mt-1.5 ${
            fullWidth
              ? 'w-full min-w-0 max-w-full'
              : 'min-w-[200px] max-w-[calc(100vw-32px)] sm:max-w-md w-max'
          } bg-white rounded-xl shadow-xl border border-[#cbd5e1] z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 ${dropdownClassName}`}
        >
          {/* Search bar when enabled */}
          {isSearchEnabled && (
            <div className="p-2 bg-[#f8f9ff] border-b border-[#cbd5e1]/70 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#76777d]">search</span>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="flex-1 bg-white text-[12px] font-medium text-[#0b1c30] placeholder-[#76777d] px-2 py-1 rounded-md border border-[#cbd5e1] hover:border-[#006a61] focus:border-[#006a61] focus:ring-2 focus:ring-[#006a61]/15 outline-hidden transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-[#e2e8f0] text-[#76777d] hover:text-[#0b1c30] rounded transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px] block">close</span>
                </button>
              )}
              <span className="text-[10px] font-bold text-[#76777d] bg-white px-1.5 py-0.5 rounded border border-[#cbd5e1]/60">
                {filteredOptions.length}
              </span>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-[340px] overflow-y-auto dropdown-scrollbar p-1 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 px-3 text-center text-[12px] text-[#76777d]">
                Aucun résultat pour « {searchQuery} »
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    className={`w-full px-2.5 py-1.5 text-left rounded-lg text-[12px] transition-all flex items-center justify-between gap-2 cursor-pointer group min-w-0 ${
                      opt.disabled
                        ? 'opacity-40 cursor-not-allowed bg-slate-50'
                        : isSelected
                        ? 'bg-[#e6f7f5] text-[#006a61] font-bold shadow-2xs'
                        : 'text-[#0b1c30] font-medium hover:bg-[#f1f5f9] hover:text-[#006a61]'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="leading-snug truncate font-medium">{opt.label}</div>
                      {opt.sublabel && (
                        <div className="text-[10px] text-[#76777d] group-hover:text-[#006a61]/80 truncate">
                          {opt.sublabel}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {opt.badge && (
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded shrink-0 ${
                            isSelected
                              ? 'bg-[#006a61] text-white'
                              : 'bg-slate-100 text-slate-600 group-hover:bg-[#e6f7f5] group-hover:text-[#006a61]'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}

                      {isSelected ? (
                        <span className="material-symbols-outlined text-[16px] text-[#006a61] font-bold shrink-0">
                          check
                        </span>
                      ) : (
                        <span className="w-[16px] shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

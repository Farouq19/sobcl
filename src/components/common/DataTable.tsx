import React from 'react';

/**
 * Interface définissant une colonne de tableau standardisé
 */
export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  /**
   * Largeur fixe recommandée en pourcentage Tailwind (ex: 'w-[20%]') ou classe Tailwind
   */
  width?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  headerClassName?: string;
  render: (item: T, index: number) => React.ReactNode;
}

export type Column<T> = ColumnDef<T>;

/**
 * Propriétés du composant DataTable réutilisable
 */
export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  keyExtractor?: (item: T, index: number) => string | number;
  onRowClick?: (item: T) => void;
  selectedId?: string | number | null;
  emptyMessage?: string;
  emptyIcon?: string;
  emptyAction?: React.ReactNode;
  /**
   * Hauteur standardisée de ligne (défaut : 'h-14' = 56px)
   */
  rowHeightClass?: string;
  rowHeight?: string;
  className?: string;
  headerClassName?: string;
  stickyHeader?: boolean;
  maxHeight?: string;
  /**
   * Fonction retournant des classes personnalisées par ligne (ex: surbrillance alerte)
   */
  getRowClassName?: (item: T, index: number) => string;
}

/**
 * Bouton d'action standardisé w-8 h-8 pour les tableaux et listes
 */
export interface ActionButtonProps {
  icon: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  title?: string;
  variant?: 'neutral' | 'primary' | 'teal' | 'success' | 'danger' | 'warning' | 'info' | 'ghost' | 'secondary';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  onClick,
  title,
  variant = 'neutral',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const baseClasses =
    'w-8 h-8 flex items-center justify-center rounded-lg transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

  const variantClasses: Record<NonNullable<ActionButtonProps['variant']>, string> = {
    neutral: 'text-[#45464d] hover:text-[#006a61] hover:bg-[#e6f7f5] active:bg-[#cbf2ec]',
    ghost: 'text-[#45464d] hover:text-[#006a61] hover:bg-[#e6f7f5] active:bg-[#cbf2ec]',
    secondary: 'bg-[#eff4ff] text-[#006a61] hover:bg-[#dbeafe] active:bg-[#cbf2ec]',
    primary: 'bg-[#006a61] text-white hover:bg-[#00544d] shadow-2xs active:bg-[#003d38]',
    teal: 'text-[#006a61] hover:bg-[#e6f7f5] active:bg-[#cbf2ec]',
    success: 'text-[#15803d] hover:bg-[#dcfce7] active:bg-[#bbf7d0]',
    danger: 'text-[#ba1a1a] hover:bg-[#fee2e2] active:bg-[#fecaca]',
    warning: 'text-[#b45309] hover:bg-[#fef3c7] active:bg-[#fde68a]',
    info: 'text-[#188ace] hover:bg-[#eff4ff] active:bg-[#dbeafe]',
  };

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick(e);
      }}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel || title}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
    </button>
  );
};

/**
 * Groupe de boutons d'action avec alignement à droite et espacement standard gap-1.5 ou gap-2
 */
export const ActionGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}> = ({ children, className = '', align = 'right', onClick }) => {
  const alignClass =
    align === 'left' ? 'justify-start' : align === 'center' ? 'justify-center' : 'justify-end';
  return (
    <div onClick={onClick} className={`flex items-center gap-1.5 ${alignClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Badge de tableau standardisé pour les statuts et indicateurs
 */
export interface TableBadgeProps {
  label?: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'emerald' | 'amber' | 'rose' | 'red' | 'sky' | 'blue' | 'indigo' | 'slate' | 'neutral' | 'purple' | 'teal';
  icon?: string;
  dot?: boolean;
  className?: string;
}

export const TableBadge: React.FC<TableBadgeProps> = ({
  label,
  children,
  variant = 'slate',
  icon,
  dot = false,
  className = '',
}) => {
  const content = children !== undefined ? children : label;

  const variantStyles: Record<string, string> = {
    emerald: 'bg-[#dcfce7] text-[#15803d] border-[#86efac]/50',
    teal: 'bg-[#e6f7f5] text-[#006a61] border-[#86f2e4]/60',
    amber: 'bg-[#fef9c3] text-[#854d0e] border-[#fde047]/50',
    rose: 'bg-[#fee2e2] text-[#ba1a1a] border-[#fca5a5]/50',
    red: 'bg-[#fee2e2] text-[#ba1a1a] border-[#fca5a5]/50',
    sky: 'bg-[#eff4ff] text-[#188ace] border-[#bfdbfe]/60',
    blue: 'bg-[#eff4ff] text-[#188ace] border-[#bfdbfe]/60',
    indigo: 'bg-[#e0e7ff] text-[#4338ca] border-[#c7d2fe]/60',
    purple: 'bg-[#fae8ff] text-[#86198f] border-[#f5d0fe]/60',
    slate: 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]/60',
    neutral: 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]/60',
  };

  const dotColors: Record<string, string> = {
    emerald: 'bg-emerald-500',
    teal: 'bg-[#006a61]',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    red: 'bg-red-500',
    sky: 'bg-sky-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    slate: 'bg-slate-400',
    neutral: 'bg-slate-400',
  };

  const styleClass = variantStyles[variant] || variantStyles.slate;
  const dotColor = dotColors[variant] || dotColors.slate;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${styleClass} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />}
      {icon && <span className="material-symbols-outlined text-[13px]">{icon}</span>}
      <span>{content}</span>
    </span>
  );
};

/**
 * Composant de tableau de données DataTable harmonisé
 * - Hauteur de ligne standardisée (h-14)
 * - Padding horizontal et vertical uniforme (px-4 py-3.5)
 * - Largeur de colonnes fixes et alignement clair
 * - En-tête sobre et lisible
 * - Support du défilement horizontal fluide et état vide
 */
export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectedId,
  emptyMessage = 'Aucune donnée disponible',
  emptyIcon = 'inbox',
  emptyAction,
  rowHeightClass,
  rowHeight,
  className = '',
  headerClassName = '',
  stickyHeader = false,
  maxHeight,
  getRowClassName,
}: DataTableProps<T>): React.ReactElement {
  const effectiveRowHeight = rowHeightClass || rowHeight || 'h-14';
  const getKey = keyExtractor || ((item: any, idx: number) => item?.id ?? idx);

  return (
    <div
      className={`w-full overflow-hidden rounded-xl border border-[#dae2fd]/70 bg-white shadow-2xs ${className}`}
    >
      <div
        className="w-full overflow-x-auto"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <table className="w-full border-collapse text-left text-[12px]">
          {/* En-tête standardisée */}
          <thead
            className={`border-b border-[#e2e8f0] bg-[#f8f9ff] text-[11px] font-bold uppercase tracking-wider text-[#45464d] ${
              stickyHeader ? 'sticky top-0 z-10 shadow-2xs' : ''
            } ${headerClassName}`}
          >
            <tr>
              {columns.map((col) => {
                const alignClass =
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left';
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={`px-4 py-3 font-bold whitespace-nowrap ${alignClass} ${
                      col.width || ''
                    } ${col.headerClassName || ''}`}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Corps de tableau avec lignes harmonisées */}
          <tbody className="divide-y divide-[#f1f5f9]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[#76777d]"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[36px] text-[#cbd5e1]">
                      {emptyIcon}
                    </span>
                    <p className="text-[13px] font-medium text-[#45464d]">
                      {emptyMessage}
                    </p>
                    {emptyAction && <div className="mt-2">{emptyAction}</div>}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const rowKey = getKey(item, index);
                const isSelected = selectedId !== undefined && selectedId !== null && selectedId === rowKey;
                const customRowClass = getRowClassName ? getRowClassName(item, index) : '';
                const isClickable = !!onRowClick;

                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={`group transition-colors ${effectiveRowHeight} ${
                      isClickable ? 'cursor-pointer' : ''
                    } ${
                      isSelected
                        ? 'bg-[#e6f7f5]/40 font-medium'
                        : 'hover:bg-[#f8f9ff]/80'
                    } ${customRowClass}`}
                  >
                    {columns.map((col) => {
                      const alignClass =
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';
                      return (
                        <td
                          key={col.key}
                          className={`px-4 py-3.5 align-middle ${alignClass} ${
                            col.width || ''
                          } ${col.className || ''}`}
                        >
                          {col.render(item, index)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Carte de liste verticale harmonisée pour les affichages maître-détail
 * (Examens, Transferts, Interventions de bloc, etc.)
 */
export interface DataListCardProps {
  onClick?: () => void;
  isSelected?: boolean;
  children: React.ReactNode;
  className?: string;
  borderAccentColor?: string;
}

export const DataListCard: React.FC<DataListCardProps> = ({
  onClick,
  isSelected = false,
  children,
  className = '',
  borderAccentColor = '#006a61',
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        borderLeftColor: isSelected ? borderAccentColor : 'transparent',
      }}
      className={`min-h-[56px] px-4 py-3 rounded-lg border-l-4 transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'bg-[#e6f7f5]/40 shadow-xs'
          : 'hover:bg-[#f8f9ff] bg-white'
      } ${className}`}
    >
      {children}
    </div>
  );
};

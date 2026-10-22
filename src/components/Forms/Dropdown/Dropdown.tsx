import * as React from 'react';
import { cn } from '../../../lib/utils';
import { SelectableField } from './Atoms/SelectableField';
import { EmptyStateContent, type DropdownSize } from './Atoms/EmptyStateContent';


// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Define el contenido que se renderiza dentro del contenedor desplegable.
 */
export type DropdownVariant = 'Few Results' | 'Many Results' | 'Auto Height' | 'Empty State' | 'Custom';

export interface DropdownProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Define el tamaño de las filas (L: 64 px; M: 48 px). */
  size?: DropdownSize;
  /** Define el contenido que se renderiza dentro del panel. */
  variant?: DropdownVariant;
  /** Mensaje que se muestra cuando no hay resultados. */
  emptyText?: string;
  /**
   * Reemplaza el contenido de ejemplo en cualquier variante.
   */
  children?: React.ReactNode;
  /** Clases adicionales que se aplican al contenedor raíz. */
  className?: string;
  /** Ref de React 19 para acceder directamente al panel flotante. */
  ref?: React.Ref<HTMLDivElement>;
}

// ─── Static placeholder items ──────────────────────────────────────────────

const PLACEHOLDER_ITEMS_L = ['Ávila Hogar 200 Mbps', 'Ávila Hogar 400 Mbps', 'Ávila Móvil Plan S', 'Ávila Móvil Plan M', 'Ávila TV Total', 'Ávila TV Básico'];
const PLACEHOLDER_ITEMS_M = ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5', 'Opción 6'];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Panel flotante para filas seleccionables, estados vacíos o contenido
 * personalizado. Su ancho es fijo de 312 px (w-78), según el diseño.
 * Debe posicionarse debajo de un elemento disparador; no se usa de forma aislada.
 */
export const Dropdown = React.memo(({
  size = 'L',
  variant = 'Few Results',
  emptyText = 'There are no results for your search',
  children,
  className,
  ref,
  role = 'listbox',
  ...props
}: DropdownProps) => {
  const isManyResults = variant === 'Many Results';
  const isAutoHeight = variant === 'Auto Height';

  // ─── Render the inner content ─────────────────────────────────────────────
  function renderContent() {
    if (variant === 'Empty State') {
      return children ?? <EmptyStateContent size={size} text={emptyText} />;
    }

    const isCustom = variant === 'Custom';
    if (isCustom) {
      return <div className="w-full">{children}</div>;
    }

    const placeholders = size === 'L' ? PLACEHOLDER_ITEMS_L : PLACEHOLDER_ITEMS_M;
    const itemsToRender = children ?? placeholders.map((label) => (
      <SelectableField
        key={label as string}
        size={size}
        mainText={label as string}
        className="w-full shrink-0"
      />
    ));

    return (
      <div
        className={cn(
          'w-full min-h-0 flex-1 overflow-auto custom-scrollbar pr-[1px]',
          isManyResults ? 'h-[284px]' : (!isAutoHeight && 'max-h-[284px]')
        )}
      >
        <div className="h-full">
          <div className={cn(
            "w-full flex flex-col",
            isCustom ? "" : "gap-1"
          )}>
            {itemsToRender}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      {...props}
      ref={ref}
      role={role}
      className={cn(
        // Layout
        'inline-flex flex-col items-start',
        // Sizing
        isManyResults && 'w-[316px] h-[300px] max-h-[312px]',
        !isManyResults && !className?.includes('w-') && 'w-[316px]',
        // Spacing: keep the native scrollbar 4px away from the panel edge.
        'pl-2 py-2 pr-[4px]',
        // Aesthetics
        'bg-neutral-bg-surface-level-2',
        'rounded-container-base',
        'shadow-dropdown',
        // Clip: rounded corners only, scroll handled by ScrollArea
        'overflow-clip',
        className
      )}
    >
      {renderContent()}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

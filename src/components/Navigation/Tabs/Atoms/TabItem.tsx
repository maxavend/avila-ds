// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { cn } from '../../../../lib/utils';
import { TabsContext } from '../TabsContext';

// ============================================================================
// TYPES
// ============================================================================

export interface TabItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Identificador único del tab */
  value: string;
  /** Texto a mostrar */
  label: string;
  /** Icono izquierdo opcional */
  leftIcon?: React.ReactNode;
  /** Deshabilita la pestaña individual */
  disabled?: boolean;
}

// ============================================================================
// STYLES & CONSTANTS
// ============================================================================

// Estilos específicos para la variante Underline
const UNDERLINE_STYLES = {
  active: {
    Primary: 'border-transparent text-primary-text-default',
    Secondary: 'border-transparent text-secondary-text-default',
  },
  inactive: 'border-transparent text-neutral-text-default hover:text-neutral-text-headline',
  disabled: 'border-neutral-border-action-disabled text-neutral-text-action-disabled cursor-not-allowed',
};

// Estilos específicos para la variante Contained
const CONTAINED_STYLES = {
  active: {
    Primary: 'bg-transparent text-primary-text-default hover:text-primary-text-strong',
    Secondary: 'bg-transparent text-secondary-text-strong',
  },
  inactive: 'bg-neutral-bg-subtle text-neutral-text-default hover:bg-neutral-bg-soft hover:text-neutral-text-headline',
  disabled: 'bg-neutral-bg-action-disabled text-neutral-text-action-disabled cursor-not-allowed',
};

// ============================================================================
// COMPONENT
// ============================================================================

export const TabItem = ({
  value,
  label,
  leftIcon,
  className,
  disabled = false,
  ref,
  onClick,
  type = 'button',
  tabIndex,
  ...props
}: TabItemProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const context = React.useContext(TabsContext);

  // Obtener variantes y estado del contexto (con fallbacks seguros)
  const styleType = context?.styleType ?? 'Underline';
  const variant = context?.variant ?? 'Primary';
  const isActive = context ? context.value === value : false;

  // Manejador del clic que actualiza el estado del componente Tabs padre
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    context?.onValueChange?.(value);
    onClick?.(event);
  };

  // Computar estilos dinámicos basados en la variante y el estado
  let stateStyles = '';
  if (styleType === 'Underline') {
    if (disabled) {
      stateStyles = UNDERLINE_STYLES.disabled;
    } else if (isActive) {
      stateStyles = UNDERLINE_STYLES.active[variant];
    } else {
      stateStyles = UNDERLINE_STYLES.inactive;
    }
  } else { // Contained
    if (disabled) {
      stateStyles = CONTAINED_STYLES.disabled;
    } else if (isActive) {
      stateStyles = CONTAINED_STYLES.active[variant];
    } else {
      stateStyles = CONTAINED_STYLES.inactive;
    }
  }

  return (
    <button
      {...props}
      ref={ref}
      type={type}
      role="tab"
      aria-selected={isActive}
      tabIndex={tabIndex ?? (context ? (isActive ? 0 : -1) : undefined)}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        // Base de diseño del botón
        'relative flex items-center justify-center gap-2 px-4 pt-3 pb-2.5',
        'font-sans text-base/[20px] font-medium    select-none',
        'cursor-pointer focus:outline-none',
        // Anillo de foco (accesibilidad): normal para Underline, inset para Contained para evitar cortes por overflow-hidden
        styleType === 'Underline'
          ? 'focus-visible:ring-2 focus-visible:ring-focus-primary focus-visible:ring-offset-1'
          : 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-primary',
        // Estilos estructurales por variante
        styleType === 'Underline' ? '-mb-px border-b-2' : 'rounded-full overflow-hidden',
        styleType === 'Contained' && [
          't-tabs-tab-contained',
          variant === 'Primary' ? 't-tabs-tab-contained-primary' : 't-tabs-tab-contained-secondary',
        ],
        // Clases de estado y color
        stateStyles,
        't-tabs-tab',
        className
      )}
    >
      {leftIcon && (
        <span className="shrink-0 size-5 flex items-center justify-center relative z-10" aria-hidden="true">
          {leftIcon}
        </span>
      )}
      <span className="t-tabs-tab-label truncate relative z-10">{label}</span>
    </button>
  );
};

TabItem.displayName = 'TabItem';

// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Icon, type IconName } from '../Icon/Icon';
import { Divider } from '../../Layout/Divider/Divider';

// ============================================================================
// TYPES
// ============================================================================

export type ItemListVariant = 'Base' | 'Default' | 'Shadow' | 'Outline' | 'Flat';
/** Estado visual. Los valores 'Hover' y 'Pressed' quedan obsoletos: se retiran en 4.0; usa los selectores CSS `hover:`/`active:`. */
export type ItemListState = 'Default' | 'Hover' | 'Pressed' | 'Disabled';

export interface ItemListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Título principal del ítem. */
  title?: string;
  /** Texto superior opcional (14px). */
  overline?: string;
  /** Texto de descripción o cuerpo opcional (16px). */
  bodyText?: string;
  /** Elemento visual a la izquierda (por ejemplo, una imagen, avatar o ícono). */
  leadingItem?: React.ReactNode;
  /** Elemento visual a la derecha (ChevronRight por defecto, null/false para ocultar). */
  trailingItem?: React.ReactNode;
  /** Variante visual del contenedor. Default: 'Base'. */
  variant?: ItemListVariant;
  /** Estado de interacción estático o dinámico. Default: 'Default'. */
  state?: ItemListState;
  /** Si es true, renderiza un divisor inferior absoluto (solo aplicable a variant="Base"). Default: true. */
  hasDivider?: boolean;
  /** Si es true, renderiza el slot de selección a la izquierda del leadingItem. Default: false. */
  hasSelector?: boolean;
  /** Elemento selector personalizado (e.g. Checkbox o Radio). */
  selector?: React.ReactNode;
  /** Si es true, renderiza un slot de soporte a la izquierda del trailingItem. Default: false. */
  hasSupportingItem?: boolean;
  /** Elemento de soporte personalizado (e.g. Tooltip o Info icon). */
  supportingItem?: React.ReactNode;
}

// ============================================================================
// STYLES
// ============================================================================

const VARIANT_BASE_STYLES: Record<ItemListVariant, string> = {
  Base: 'bg-transparent relative border-none rounded-none',
  Default: 'bg-transparent relative border-none rounded-none p-3',
  Flat: 'bg-neutral-bg-subtle rounded-container-base border border-transparent p-3',
  Outline: 'bg-neutral-bg-surface-level-2 border border-neutral-border-soft rounded-container-base p-3',
  Shadow: 'bg-neutral-bg-surface-level-2 rounded-container-base shadow-card-overlay-m border-none p-3',
};

// Estilos cuando se fuerza un estado estático (Hover o Pressed)
const STATE_OVERRIDE_STYLES: Record<ItemListVariant, Record<'Hover' | 'Pressed', string>> = {
  Base: {
    Hover: '',
    Pressed: '',
  },
  Default: {
    Hover: 'bg-neutral-bg-action-soft-hover',
    Pressed: 'bg-neutral-bg-action-soft-pressed',
  },
  Flat: {
    Hover: 'bg-neutral-bg-subtle border-neutral-border-soft',
    Pressed: 'bg-neutral-bg-action-soft-pressed',
  },
  Outline: {
    Hover: 'bg-neutral-bg-action-soft-hover border-secondary-border-soft',
    Pressed: 'bg-neutral-bg-action-soft-pressed border-secondary-border-default',
  },
  Shadow: {
    Hover: 'bg-neutral-bg-action-soft-hover shadow-none',
    Pressed: 'bg-neutral-bg-action-soft-pressed shadow-card-overlay-m',
  },
};

// Clases interactivas por CSS para cuando state === 'Default'
const INTERACTIVE_STYLES: Record<ItemListVariant, string> = {
  Base: 'cursor-pointer ',
  Default: 'hover:bg-neutral-bg-action-soft-hover active:bg-neutral-bg-action-soft-pressed cursor-pointer ',
  Flat: 'hover:border-neutral-border-soft active:bg-neutral-bg-action-soft-pressed cursor-pointer ',
  Outline: 'hover:bg-neutral-bg-action-soft-hover hover:border-secondary-border-soft active:bg-neutral-bg-action-soft-pressed active:border-secondary-border-default cursor-pointer ',
  Shadow: 'hover:bg-neutral-bg-action-soft-hover hover:shadow-none active:bg-neutral-bg-action-soft-pressed active:shadow-card-overlay-m cursor-pointer ',
};

// ============================================================================
// COMPONENT
// ============================================================================

export const ItemList = React.memo(({
  title,
  overline,
  bodyText,
  leadingItem,
  trailingItem = <ChevronRight className="w-5 h-5 text-neutral-text-soft" />,
  variant = 'Base',
  state = 'Default',
  hasDivider = true,
  hasSelector = false,
  selector,
  hasSupportingItem = false,
  supportingItem,
  className,
  onClick,
  ref,
  ...props
}: ItemListProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const isInteractive = state === 'Default';
  const isHovered = state === 'Hover';
  const isPressed = state === 'Pressed';
  const isDisabled = state === 'Disabled';

  return (
    <div
      ref={ref}
      className={cn(
        // Base - Layout (sin padding para que la Card lo otorgue)
        'flex gap-2 items-center w-full select-none relative',
        
        // Estilos base de la variante
        VARIANT_BASE_STYLES[variant],

        // Lógica de estados
        isDisabled && 'opacity-disabled pointer-events-none cursor-not-allowed !transition-none',
        
        // Si no es interactivo y tiene un estado estático forzado
        !isInteractive && !isDisabled && (isHovered || isPressed) && STATE_OVERRIDE_STYLES[variant][isHovered ? 'Hover' : 'Pressed'],

        // Si es interactivo (Default)
        isInteractive && !isDisabled && INTERACTIVE_STYLES[variant],
        isInteractive && 't-control-colors',

        className
      )}
      onClick={onClick}
      {...props}
    >
      {/* 1. Selector Slot (Checkbox / Radio) */}
      {hasSelector && (
        <div className="flex shrink-0 items-center justify-center z-10">
          {selector || (
            <div className="w-5 h-5 border border-neutral-border-default rounded-[4px]" />
          )}
        </div>
      )}

      {/* Contenedor izquierdo: Leading Item y Bloque de Texto */}
      <div className="flex flex-1 gap-3 items-center min-w-0">
        {/* Leading Item Slot */}
        {leadingItem && (
          <div className="flex shrink-0 items-center justify-center">
            {typeof leadingItem === 'string' ? (
              <Icon name={leadingItem as IconName} className="w-5 h-5 text-neutral-text-default" size={20} />
            ) : (
              leadingItem
            )}
          </div>
        )}

        {/* Bloque de Textos */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          {overline && (
            <p className="font-sans font-normal text-sm/[16px] text-neutral-text-soft truncate">
              {overline}
            </p>
          )}
          {title && (
            <p className="font-sans font-medium text-base/[20px] text-neutral-text-headline truncate">
              {title}
            </p>
          )}
          {bodyText && (
            <p className="font-sans font-normal text-base/[20px] text-neutral-text-default line-clamp-2">
              {bodyText}
            </p>
          )}
        </div>
      </div>

      {/* 2. Supporting Item Slot (Tooltip / Info icon) */}
      {hasSupportingItem && (
        <div className="flex items-center shrink-0 justify-center z-10">
          {supportingItem || (
            <Icon name="Info" className="w-4 h-4 text-neutral-text-default" size={16} />
          )}
        </div>
      )}

      {/* Trailing Item Slot */}
      {trailingItem && (
        <div className="flex items-center shrink-0 justify-center z-10">
          {typeof trailingItem === 'string' ? (
            <Icon name={trailingItem as IconName} className="w-5 h-5 text-neutral-text-soft" size={20} />
          ) : (
            trailingItem
          )}
        </div>
      )}

      {/* 3. Default Variant Divider Line */}
      {variant === 'Default' && hasDivider && (
        <Divider className="absolute bottom-[-0.5px] left-3 right-5 w-auto" />
      )}

    </div>
  );
});

ItemList.displayName = 'ItemList';

// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Chip, type ChipColor } from '../../DataDisplay/Chip/Chip';
import { Icon, type IconName } from '../../DataDisplay/Icon/Icon';

// ============================================================================
// TYPES
// ============================================================================

export type KeyButtonVariant = 'Overlay' | 'Flat';
/** Estado visual. Los valores 'Hover' y 'Pressed' quedan obsoletos: se retiran en 4.0; usa los selectores CSS `hover:`/`active:`. */
export type KeyButtonState = 'Default' | 'Hover' | 'Pressed';

export interface KeyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Superficie elevada con sombra o superficie plana integrada al fondo. */
  variant?: KeyButtonVariant;
  /** Estado visual forzado para documentar estados; en producción hover y pressed provienen de CSS. */
  state?: KeyButtonState;
  /** Nombre de icono de Lucide o ReactNode que se muestra sobre la etiqueta. */
  icon?: IconName | React.ReactNode;
  /** Texto de la etiqueta centrado bajo el icono. */
  label?: React.ReactNode;
  /** Texto del chip informativo anclado en la esquina superior derecha. */
  chip?: string;
  /** Color semántico del chip superior. */
  chipColor?: ChipColor;
}

// ============================================================================
// STYLES
// ============================================================================

const VARIANT_STYLES: Record<KeyButtonVariant, string> = {
  Overlay: cn(
    "bg-neutral-bg-surface-level-2 shadow-overlay-s",           // Base
    "hover:bg-neutral-bg-surface-level-2 hover:shadow-overlay-l", // Hover
    "active:bg-neutral-bg-action-soft-pressed active:shadow-none" // Pressed
  ),
  Flat: cn(
    "bg-neutral-bg-subtle",                                     // Base
    "hover:bg-neutral-bg-action-soft-hover",                    // Hover
    "active:bg-neutral-bg-action-soft-pressed"                  // Pressed
  ),
};

const STATE_FORCED_STYLES: Record<KeyButtonVariant, Record<KeyButtonState, string>> = {
  Overlay: {
    Default: "shadow-overlay-s",
    Hover: "shadow-overlay-l",
    Pressed: "bg-neutral-bg-action-soft-pressed shadow-none",
  },
  Flat: {
    Default: "",
    Hover: "bg-neutral-bg-action-soft-hover",
    Pressed: "bg-neutral-bg-action-soft-pressed",
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Botón cuadrado para teclados de servicios, menús de acceso rápido y teclados numéricos.
 * Admite superficies elevada o plana y un chip informativo opcional.
 */
export const KeyButton = React.memo(({
  variant = 'Overlay',
  state = 'Default',
  icon,
  label = 'Placeholder',
  chip,
  chipColor = 'Secondary',
  className,
  disabled,
  ref,
  ...props
}: KeyButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const isForced = state !== 'Default';
  const isInactive = disabled;

  const renderIcon = () => {
    if (!icon) return <Icon name="LayoutGrid" size={24} />;
    
    if (typeof icon === 'string') {
      return <Icon name={icon as IconName} size={24} />;
    }
    
    return icon; // ReactNode
  };

  const hasWidth = className?.split(' ').some(cls => cls.startsWith('w-') || cls.startsWith('max-w-') || cls.startsWith('min-w-'));
  const hasMinW = className?.includes('min-w-');

  return (
    <div 
      className={cn(
        "relative inline-flex shrink-0",
        !hasWidth && "w-25 min-w-25",
        hasWidth && !hasMinW && "min-w-25",
        className
      )}
    >
      {chip && (
        <div className="absolute right-1.5 z-10 pointer-events-none -top-3">
          <Chip 
            label={chip} 
            variant="Solid" 
            color={chipColor} 
            size="S" 
          />
        </div>
      )}

      <button
        ref={ref}
        type="button"
        disabled={isInactive}
        className={cn(
          "group/keybutton inline-flex flex-col items-center justify-center gap-1 cursor-pointer t-control-colors",
          "px-2 py-3 rounded-container-md",
          "w-full h-full",
          "  ",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-primary disabled:transition-none",
          !isForced ? VARIANT_STYLES[variant] : STATE_FORCED_STYLES[variant][state],
          isInactive && "bg-neutral-bg-action-disabled text-neutral-text-action-disabled shadow-none opacity-100 cursor-not-allowed pointer-events-none"
        )}
        {...props}
      >
        <div className="flex flex-col items-center gap-1 flex-1 w-full min-w-0 z-0">
          <span className={cn(
            "flex min-h-8 min-w-8 items-center justify-center shrink-0",
            isInactive ? "text-neutral-text-action-disabled" : "text-neutral-text-default",
          )}>
            {renderIcon()}
          </span>

          <span className={cn(
            "block w-full font-sans font-regular text-base/[20px] text-center truncate group-hover/keybutton:font-medium",
            state === 'Hover' && "font-medium",
            isInactive ? "text-neutral-text-action-disabled" : "text-neutral-text-default",
          )}>
            {label}
          </span>
        </div>
      </button>
    </div>
  );
});

KeyButton.displayName = 'KeyButton';

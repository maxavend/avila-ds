// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Icon, type IconName } from '../../DataDisplay/Icon/Icon';
import { Badge, type BadgeProps } from '../../DataDisplay/Badge/Badge';

// ============================================================================
// TYPES
// ============================================================================

export type ActionIconVariant = 'Neutral' | 'Theme' | 'Danger';
export type ActionIconSize = 'L' | 'M' | 'S';
/** Estado visual. Los valores 'Hover' y 'Pressed' quedan obsoletos: se retiran en 4.0; usa los selectores CSS `hover:`/`active:`. */
export type ActionIconState = 'Default' | 'Hover' | 'Pressed' | 'Disabled';

export interface ActionIconProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Variante visual del componente */
  variant?: ActionIconVariant;
  /** Tamaño del contenedor e icono */
  size?: ActionIconSize;
  /** Estado visual forzado (opcional) */
  state?: ActionIconState;
  /** Icono a mostrar (nombre de Lucide o nodo React) */
  icon: IconName | React.ReactNode;
  /** Configuración opcional del Badge (notificación) */
  badge?: Partial<BadgeProps>;
}

// ============================================================================
// STYLES
// ============================================================================

const SIZE_STYLES: Record<ActionIconSize, string> = {
  L: 'size-10',
  M: 'size-7',
  S: 'size-5.5', // 22px — TODO: Tokenize pending DEC-001 (no --size-actionicon-* in @theme)
};

const ICON_SIZE_STYLES: Record<ActionIconSize, number> = {
  L: 24,
  M: 20,
  S: 16,
};

const ICON_CONTAINER_CLASSES: Record<ActionIconSize, string> = {
  L: 'size-6',
  M: 'size-5',
  S: 'size-4',
};

const VARIANT_STYLES: Record<ActionIconVariant, string> = {
  Neutral: cn(
    "text-neutral-text-default",
    "hover:bg-neutral-bg-action-soft-hover",
    "active:bg-neutral-bg-action-soft-pressed"
  ),
  Theme: cn(
    "text-primary-text-default",
    "hover:bg-primary-bg-action-soft-hover",
    "active:bg-primary-bg-action-soft-pressed"
  ),
  Danger: cn(
    "text-danger-text-default",
    "hover:bg-danger-bg-action-soft-hover",
    "active:bg-danger-bg-action-soft-pressed"
  ),
};

const STATE_STYLES: Record<ActionIconVariant, Record<ActionIconState, string>> = {
  Neutral: {
    Default: "bg-transparent text-neutral-text-default",
    Hover: "bg-neutral-bg-action-soft-hover text-neutral-text-default",
    Pressed: "bg-neutral-bg-action-soft-pressed text-neutral-text-default",
    Disabled: "bg-transparent text-neutral-text-action-disabled",
  },
  Theme: {
    Default: "bg-transparent text-primary-text-default",
    Hover: "bg-primary-bg-action-soft-hover text-primary-text-default",
    Pressed: "bg-primary-bg-action-soft-pressed text-primary-text-default",
    Disabled: "bg-transparent text-neutral-text-action-disabled",
  },
  Danger: {
    Default: "bg-transparent text-danger-text-default",
    Hover: "bg-danger-bg-action-soft-hover text-danger-text-default",
    Pressed: "bg-danger-bg-action-soft-pressed text-danger-text-default",
    Disabled: "bg-transparent text-neutral-text-action-disabled",
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * ActionIcon — Componente de acción ligero basado en iconos.
 * Soporta estados de interacción suaves e integración nativa con Badge para notificaciones.
 */
export const ActionIcon = React.memo(({
  variant = 'Neutral',
  size = 'L',
  state,
  icon,
  badge,
  className,
  disabled,
  ref,
  ...props
}: ActionIconProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const iconSize = ICON_SIZE_STYLES[size];
  const isInactive = disabled || state === 'Disabled';

  const iconContainerClass = ICON_CONTAINER_CLASSES[size];

  const content = (
    <button
      ref={ref}
      disabled={isInactive}
      className={cn(
        // Base
        "inline-flex items-center justify-center shrink-0 relative t-control-colors",
        "rounded-icon-button-sm cursor-pointer border-none bg-transparent outline-none",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus-primary disabled:transition-none",
        
        // Sizing
        SIZE_STYLES[size],
        
        // Variant & Forced State
        state ? STATE_STYLES[variant][state] : VARIANT_STYLES[variant],
        
        // Disabled
        isInactive && !state && "opacity-100 text-neutral-text-action-disabled cursor-not-allowed pointer-events-none",
        
        className
      )}
      {...props}
    >
      <span className={cn("flex items-center justify-center pointer-events-none", iconContainerClass)}>
        {typeof icon === 'string' ? (
          <Icon name={icon as IconName} size={iconSize} />
        ) : (
          icon
        )}
      </span>
      
      {/* Badge integrado internamente para facilitar el patrón de notificaciones */}
      {badge && (
        <Badge
          variant="Danger"
          isUndefined
          isOverlay
          {...badge}
          className={cn(
            "absolute pointer-events-none",
            size === 'L' && "top-1 right-1",
            size === 'M' && "top-0.5 right-0.5 scale-75",
            size === 'S' && "top-0 right-0 scale-50",
            badge.className
          )}
        />
      )}
    </button>
  );

  return content;
});

ActionIcon.displayName = 'ActionIcon';

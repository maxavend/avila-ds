// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Icon, type IconName } from '../../DataDisplay/Icon/Icon';
import { Loader2 } from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

export type IconButtonVariant = 'Primary' | 'Secondary' | 'Tertiary' | 'Subtle' | 'Neutral' | 'Shadowed' | 'Danger';
export type IconButtonSize = 'L' | 'M' | 'S';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** La variante visual del componente. */
  variant?: IconButtonVariant;
  /** El tamaño del componente. L=52px, M=44px, S=32px. */
  size?: IconButtonSize;
  /** El icono a mostrar. Puede ser el nombre de un icono de Lucide o un nodo React. */
  icon?: IconName | React.ReactNode;
  /** Muestra un spinner de carga y deshabilita la interacción. */
  loading?: boolean;
  /** Etiqueta accesible obligatoria para lectores de pantalla. Este componente es solo-icono, por lo que el texto descriptivo es requerido. */
  "aria-label": string;
}

// ============================================================================
// STYLES
// ============================================================================

const SIZE_STYLES: Record<IconButtonSize, string> = {
  L: "p-4 rounded-container-base",
  M: "p-3 rounded-icon-button-default",
  S: "p-2 rounded-icon-button-sm",
};

const VARIANT_STYLES: Record<IconButtonVariant, string> = {
  Primary: cn(
    "bg-primary-bg-default text-neutral-text-contrast",
    "hover:bg-primary-bg-action-hover",
    "active:bg-primary-bg-action-pressed"
  ),
  Secondary: cn(
    "bg-primary-bg-soft text-primary-text-default",
    "hover:bg-primary-bg-action-soft-hover",
    "active:bg-primary-bg-action-soft-pressed"
  ),
  Tertiary: cn(
    "bg-transparent text-neutral-text-default",
    "hover:bg-neutral-bg-action-soft-hover hover:shadow-[0px_2px_2px_0px_var(--color-effect-shadow-subtle),0px_0px_4px_0px_var(--color-effect-shadow-subtle)]",
    "active:bg-neutral-bg-action-soft-pressed active:shadow-none"
  ),
  Subtle: cn(
    "bg-neutral-bg-subtle text-neutral-text-default",
    "hover:bg-neutral-bg-action-soft-hover hover:shadow-[0px_2px_2px_0px_var(--color-effect-shadow-subtle),0px_0px_4px_0px_var(--color-effect-shadow-subtle)]",
    "active:bg-neutral-bg-action-soft-pressed active:shadow-none"
  ),
  Neutral: cn(
    "bg-neutral-bg-default text-neutral-text-contrast",
    "hover:bg-neutral-bg-action-hover",
    "active:bg-neutral-bg-action-pressed"
  ),
  Shadowed: cn(
    "bg-neutral-bg-surface-level-2 text-neutral-text-default shadow-[0px_0px_8px_0px_var(--color-effect-shadow-subtle),0px_0px_12px_0px_var(--color-effect-shadow-subtle)]",
    "hover:bg-neutral-bg-action-soft-hover hover:shadow-none",
    "active:bg-neutral-bg-action-soft-pressed active:shadow-none"
  ),
  Danger: cn(
    "bg-transparent text-danger-text-default",
    "hover:bg-danger-bg-action-soft-hover",
    "active:bg-danger-bg-action-soft-pressed"
  ),
};

// ============================================================================
// COMPONENT
// ============================================================================

export const IconButton = React.memo(({
  variant = 'Primary',
  size = 'L',
  icon,
  loading = false,
  className,
  disabled,
  ref,
  ...props
}: IconButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const isInactive = disabled || loading;
  const iconSize = size === 'S' ? 16 : 20;

  return (
    <button
      ref={ref}
      disabled={isInactive}
      aria-busy={loading}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap t-control-colors",
        "shrink-0",
        SIZE_STYLES[size],
        "  ",
        "cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus-primary disabled:transition-none",
        VARIANT_STYLES[variant],
        isInactive && cn(
          "text-neutral-text-action-disabled cursor-not-allowed pointer-events-none shadow-none",
          variant === 'Danger' ? "bg-transparent" : "bg-neutral-bg-action-disabled"
        ),
        className
      )}
      {...props}
    >
      <span className="flex-shrink-0 flex items-center justify-center pointer-events-none relative" style={{ width: iconSize, height: iconSize }}>
        {loading ? (
          <Loader2 size={iconSize} className=" absolute inset-0 m-auto" />
        ) : typeof icon === 'string' ? (
          <Icon name={icon as IconName} size={iconSize} />
        ) : (
          icon
        )}
      </span>
    </button>
  );
});

IconButton.displayName = 'IconButton';

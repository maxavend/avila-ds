// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { cn } from '../../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export type BadgeVariant = 'Secondary' | 'Danger' | 'Success' | 'Warning' | 'Accent' | 'Neutral' | 'Disabled';

export interface BadgeProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** Variante de color del badge. */
  variant?: BadgeVariant;
  /** Estilo sutil (fondo avila, texto oscuro). */
  isSoft?: boolean;
  /** Si se muestra sobre otro elemento (añade borde blanco de contraste). */
  isOverlay?: boolean;
  /** Modo punto (sin texto, 12px fix). */
  isUndefined?: boolean;
  /** Valor numérico o texto corto a mostrar. */
  label?: string | number;
  /** Clases adicionales. */
  className?: string;
}

// ============================================================================
// STYLES
// ============================================================================

/** Mapeo de estilos por variante (Solid vs Soft) */
const VARIANT_STYLES: Record<BadgeVariant, { solid: string; soft: string }> = {
  Secondary: {
    solid: "bg-secondary-bg-default text-neutral-text-contrast",
    soft: "bg-secondary-bg-soft text-secondary-text-default",
  },
  Danger: {
    solid: "bg-danger-bg-default text-neutral-text-contrast",
    soft: "bg-danger-bg-soft text-danger-text-default",
  },
  Success: {
    solid: "bg-success-bg-default text-neutral-text-contrast",
    soft: "bg-success-bg-soft text-success-text-default",
  },
  Warning: {
    solid: "bg-warning-bg-default text-neutral-text-headline",
    soft: "bg-warning-bg-soft text-warning-text-default",
  },
  Accent: {
    solid: "bg-accent-bg-default text-neutral-text-contrast",
    soft: "bg-accent-bg-soft text-accent-text-default",
  },
  Neutral: {
    solid: "bg-neutral-bg-default text-neutral-text-contrast",
    soft: "bg-neutral-bg-soft text-neutral-text-headline",
  },
  Disabled: {
    solid: "bg-neutral-bg-action-disabled text-neutral-text-action-disabled",
    soft: "bg-neutral-bg-action-disabled text-neutral-text-action-disabled",
  },
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Badge — componente para mostrar indicadores de estado o recuentos.
 */
export const Badge = React.memo(({
  variant = 'Secondary',
  isSoft = false,
  isOverlay = false,
  isUndefined = false,
  label,
  className,
  ref,
  ...props
}: BadgeProps) => {
  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES['Secondary'];
  const appliedStyles = isSoft ? styles.soft : styles.solid;

  return (
    <div
      ref={ref}
      role="status"
      aria-label={label?.toString() || 'Notification'}
      className={cn(
        // Base
        "inline-flex items-center justify-center rounded-full overflow-hidden  ",
        // Color
        appliedStyles,
        // Sizing
        isUndefined ? "size-3" : "h-[18px] min-w-[18px] px-1 py-0.5",
        // Overlay (Contrast border)
        isOverlay && "border-2 border-neutral-border-contrast",
        className
      )}
      {...props}
    >
      {!isUndefined && label && (
        <span className="font-sans text-[12px] font-medium leading-[14px] whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
});

Badge.displayName = 'Badge';

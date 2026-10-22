// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { IconSwap } from '../IconSwap';

// ============================================================================
// TYPES
// ============================================================================

export type ToggleButtonSize = 'S' | 'M' | 'L';
export type ToggleButtonVariant = 'Default' | 'Outline';
export type ToggleButtonState = 'Default' | 'Hover' | 'Disabled';

export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Indica si el botón está seleccionado/activo. */
  isActive?: boolean;
  /** Tamaño del botón. */
  size?: ToggleButtonSize;
  /** Variante visual. */
  variant?: ToggleButtonVariant;
  /** Estado visual forzado (para Storybook). */
  state?: ToggleButtonState;
  /** Texto descriptivo del botón. */
  label?: string;
  /** Icono personalizado a renderizar antes del texto. */
  icon?: React.ReactNode;
}

// ============================================================================
// STYLES
// ============================================================================

const SIZE_STYLES: Record<ToggleButtonSize, string> = {
  L: "py-4 px-6 gap-2 rounded-container-base text-base leading-[--line-height-20]",
  M: "py-3 px-6 gap-2 rounded-container-md text-base leading-[--line-height-20]",
  S: "py-2 px-4 gap-2 rounded-container-sm text-sm leading-[--line-height-16]",
};

const TOGGLE_BASE_STYLES: Record<ToggleButtonVariant, Record<'active' | 'inactive', string>> = {
  Default: {
    active: "bg-secondary-bg-soft text-secondary-text-strong border border-transparent",
    inactive: "bg-neutral-bg-subtle text-neutral-text-default border border-transparent",
  },
  Outline: {
    active: "bg-secondary-bg-default text-neutral-text-contrast border border-transparent",
    inactive: "bg-transparent text-neutral-text-default border border-solid border-neutral-border-soft",
  },
};

const ToggleIconSwap = ({ icon, size }: { icon: React.ReactNode; size: number }) => {
  const renderIcon = (value: React.ReactNode) => {
    if (!value) return null;
    if (React.isValidElement(value)) {
      const element = value as React.ReactElement<{
        size?: number;
        className?: string;
        [attribute: string]: unknown;
      }>;
      return React.cloneElement(element, {
        size: element.props.size || size,
        className: cn('shrink-0', element.props.className),
      });
    }
    return <span className="shrink-0">{value}</span>;
  };

  return <IconSwap value={icon} renderIcon={renderIcon} />;
};

// ============================================================================
// COMPONENT
// ============================================================================

export const ToggleButton = React.memo(({
  isActive = false,
  size = 'L',
  variant = 'Default',
  state = 'Default',
  label = 'Placeholder',
  icon = null,
  className,
  disabled,
  ref,
  onClick,
  ...props
}: ToggleButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const isInactive = state === 'Disabled' || disabled;
  const isForcedHover = state === 'Hover';
  const activeKey = isActive ? 'active' : 'inactive';

  const defaultIconSize = size === 'L' || (size === 'M' && variant === 'Default') ? 20 : 16;

  return (
    <button
      ref={ref}
      disabled={isInactive}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center box-border",
        SIZE_STYLES[size],
        "font-sans font-medium text-center outline-none",
        TOGGLE_BASE_STYLES[variant][activeKey],
        " ",
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus-primary",
        !isInactive && variant === 'Default' && isActive && cn(
          isForcedHover ? 'bg-secondary-bg-action-soft-hover' : 'hover:bg-secondary-bg-action-soft-hover'
        ),
        !isInactive && variant === 'Default' && !isActive && cn(
          isForcedHover ? 'bg-neutral-bg-soft' : 'hover:bg-neutral-bg-soft'
        ),
        !isInactive && variant === 'Outline' && !isActive && cn(
          isForcedHover ? 'border-secondary-border-default text-secondary-border-default' : 'hover:border-secondary-border-default hover:text-secondary-border-default'
        ),
        isInactive
          ? 'cursor-not-allowed pointer-events-none opacity-100 text-neutral-text-action-disabled bg-neutral-bg-action-disabled border border-transparent'
          : 'cursor-pointer',
        className
      )}
      {...props}
    >
      {icon && <ToggleIconSwap icon={icon} size={defaultIconSize} />}
      <span className="truncate">{label}</span>
    </button>
  );
});

ToggleButton.displayName = 'ToggleButton';

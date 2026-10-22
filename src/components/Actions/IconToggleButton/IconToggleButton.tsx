// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Icon, type IconName } from '../../DataDisplay/Icon/Icon';
import { IconSwap } from '../IconSwap';

// ============================================================================
// TYPES
// ============================================================================

export interface IconToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Nombre del icono (Lucide) o elemento React */
  icon: string | React.ReactNode;
  /** Indica si el botón está en estado seleccionado */
  isActive?: boolean;
  /** Variante visual correspondiente a Figma */
  variant?: 'Primary' | 'Secondary' | 'Outline';
  /** Escala del componente */
  size?: 'L' | 'M' | 'S';
}

// ============================================================================
// STYLES
// ============================================================================

const SIZE_STYLES: Record<string, string> = {
  L: 'p-4 rounded-container-base',
  M: 'p-3 rounded-container-md',
  S: 'p-2 rounded-container-sm',
};

const ICON_SIZES: Record<string, number> = {
  L: 20,
  M: 20,
  S: 16,
};

const IconToggleIconSwap = ({ icon, size, colorClass }: {
  icon: IconToggleButtonProps['icon'];
  size: number;
  colorClass: string;
}) => {
  const renderIcon = (value: React.ReactNode) => {
    if (typeof value === 'string') {
      return <Icon name={value as IconName} size={size} className={colorClass} />;
    }

    return (
      <span className={cn('flex items-center justify-center', colorClass)}>
        {value}
      </span>
    );
  };

  return <IconSwap value={icon} renderIcon={renderIcon} style={{ width: size, height: size }} />;
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * IconToggleButton — Botón de acción que alterna entre estados activo/inactivo.
 * Ideal para selectores de modo, favoritos o filtros persistentes.
 */
export const IconToggleButton = React.memo(({
  icon,
  isActive = false,
  variant = 'Primary',
  size = 'L',
  className,
  disabled,
  ref,
  ...props
}: IconToggleButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {

  // Background and Border logic based on isActive and variant
  const getVariantClasses = () => {
    if (disabled) {
      if (variant === 'Outline' && !isActive) {
        return 'bg-transparent border border-neutral-border-action-disabled cursor-not-allowed';
      }
      return 'bg-neutral-bg-soft cursor-not-allowed border-none';
    }

    if (isActive) {
      if (variant === 'Primary') {
        return 'bg-primary-bg-default hover:bg-primary-bg-action-hover border-none';
      }
      if (variant === 'Secondary') {
        return 'bg-secondary-bg-soft hover:bg-secondary-bg-action-soft-hover border-none';
      }
      return 'bg-secondary-bg-default hover:bg-secondary-bg-action-hover border-none';
    }

    if (variant === 'Outline') {
      return 'bg-transparent border border-neutral-border-soft hover:border-secondary-border-default';
    }
    return 'bg-neutral-bg-subtle hover:bg-neutral-bg-soft border-none';
  };

  const getIconColorClass = () => {
    if (disabled) return 'text-neutral-text-action-disabled';

    if (isActive) {
      if (variant === 'Primary') return 'text-neutral-text-contrast';
      if (variant === 'Secondary') return 'text-secondary-text-default';
      return 'text-neutral-text-contrast';
    }

    return 'text-neutral-text-default';
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-pressed={isActive}
      className={cn(
        'inline-flex items-center justify-center    shrink-0 cursor-pointer',
        SIZE_STYLES[size],
        getVariantClasses(),
        className
      )}
      {...props}
    >
      <IconToggleIconSwap icon={icon} size={ICON_SIZES[size]} colorClass={getIconColorClass()} />
    </button>
  );
});

IconToggleButton.displayName = 'IconToggleButton';

import * as React from 'react';
import { cn } from '../../../../lib/utils';
import { Icon, type IconName } from '../../../DataDisplay/Icon/Icon';

/** Tamaño visual de la fila; `L` tiene mayor padding vertical que `M`. */
export type SelectableFieldSize = 'L' | 'M';

/**
 * Estado de interacción de SelectableField. Usa `Default` para el estado de
 * reposo y `Disabled` para marcar opciones no disponibles.
 */
export type SelectableFieldState = 'Default' | 'Disabled';

export interface SelectableFieldProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Tamaño visual de la fila. */
  size?: SelectableFieldSize;
  /** Estado de interacción. */
  state?: SelectableFieldState;
  /** Marca el ítem como opción seleccionada/activa y aplica fondo primario. */
  isActive?: boolean;
  /** Conserva el estado presionado mientras se cierra el dropdown contenedor. */
  isPressed?: boolean;
  /** Texto principal de la etiqueta. */
  mainText?: string;
  /** Línea descriptiva secundaria opcional debajo del texto principal. */
  supportingText?: string;
  /** Icono opcional de lucide-react mostrado antes del texto. */
  icon?: IconName | React.ReactNode;
  /** Imagen o thumbnail opcional antes del texto; tiene prioridad sobre `icon`. */
  image?: React.ReactNode;
  /** Contador numérico mostrado a la derecha; se oculta si es `undefined` o `0`. */
  badge?: number;
}

// Base container styles shared across all states
const BASE_CONTAINER =
  'group flex items-center gap-2 overflow-hidden w-full rounded-container-sm cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-focus-primary t-control-colors disabled:transition-none';

/**
 * SelectableField — átomo para filas seleccionables dentro de Dropdown, Select
 * y Autocomplete. Debe componerse dentro de un contenedor de lista o menú.
 */
export const SelectableField = ({
  size = 'L',
  state = 'Default',
  isActive = false,
  isPressed = false,
  mainText = 'Placeholder',
  supportingText,
  icon,
  image,
  badge,
  onClick,
  className,
  disabled,
  ref,
  ...props
}: SelectableFieldProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const isDisabled = disabled || state === 'Disabled';

  // ── Container background logic ──────────────────────────────────────────
  const containerBg = cn(
    // Disabled overrides everything
    isDisabled && 'bg-neutral-bg-action-disabled cursor-not-allowed pointer-events-none',
    // Pressed wins over hover and active while the parent closes.
    isPressed && !isDisabled && (isActive
      ? 'bg-primary-bg-action-soft-pressed'
      : 'bg-neutral-bg-action-soft-pressed'),
    // Active state (default): primary-tinted
    !isPressed && isActive && !isDisabled && 'bg-primary-bg-subtle hover:bg-primary-bg-action-soft-hover',
    // Inactive state (default): transparent with hover
    !isPressed && !isActive && !isDisabled && 'bg-transparent hover:bg-neutral-bg-action-soft-hover',
    !isPressed && !isDisabled && (isActive
      ? 'active:bg-primary-bg-action-soft-pressed'
      : 'active:bg-neutral-bg-action-soft-pressed')
  );

  // ── Text colour logic ───────────────────────────────────────────────────
  const textColor = cn(
    isDisabled
      ? 'text-neutral-text-action-disabled'
      : isPressed
        ? isActive
          ? 'text-primary-text-default font-medium'
          : 'text-neutral-text-default'
        : isActive
          ? 'text-primary-text-default font-medium'
          : 'text-neutral-text-default group-hover:text-neutral-text-headline'
  );

  const iconColor = cn(
    isDisabled
      ? 'text-neutral-text-action-disabled'
      : isPressed
        ? isActive
          ? 'text-primary-text-default'
          : 'text-neutral-text-default'
        : isActive
          ? 'text-primary-text-default'
          : 'text-neutral-text-soft group-hover:text-neutral-text-headline'
  );

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      data-pressed={isPressed || undefined}
      className={cn(
        BASE_CONTAINER,
        size === 'L' ? 'px-3 py-4' : 'p-3',
        containerBg,
        className
      )}
      {...props}
    >
      {/* Leading image slot */}
      {image && (
        <span className="flex-shrink-0 flex items-center justify-center p-2 rounded-container-md size-[34px] bg-neutral-bg-soft overflow-hidden">
          {image}
        </span>
      )}

      {/* Leading icon slot (only when no image) */}
      {!image && icon && (
        <span className={cn('flex-shrink-0 flex items-center justify-center size-4', iconColor)}>
          {typeof icon === 'string' ? <Icon name={icon as IconName} size={16} /> : icon}
        </span>
      )}

      {/* Text container */}
      <span className="flex flex-col flex-1 min-w-0 items-start justify-center font-sans not-italic">
        <span
          className={cn(
            'text-base leading-[20px] truncate w-full',
            textColor
          )}
        >
          {mainText}
        </span>
        {supportingText && (
          <span className="text-[12px] leading-[14px] truncate w-full text-neutral-text-soft whitespace-nowrap">
            {supportingText}
          </span>
        )}
      </span>

      {/* Trailing badge */}
      {!!badge && (
        <span className="flex-shrink-0 flex items-center justify-center min-w-[18px] px-1 py-0.5 rounded-full bg-danger-bg-default">
          <span className="text-[12px] leading-[14px] text-neutral-text-contrast font-sans truncate">
            {badge}
          </span>
        </span>
      )}
    </button>
  );
};

SelectableField.displayName = 'SelectableField';

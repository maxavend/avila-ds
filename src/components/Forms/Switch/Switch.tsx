import * as React from 'react';
import { cn } from '../../../lib/utils';

export type SwitchState = 'Default' | 'Disabled';

/** Props del átomo Switch. */
export interface SwitchProps extends Omit<React.ComponentProps<'input'>, 'value' | 'type' | 'onToggle' | 'autoComplete'> {
  autoComplete?: never;
  /** Figma: isActive. Define si el switch está activo visual y funcionalmente. */
  isActive?: boolean;
  /** Figma: state. Sobrescribe el estado visual de interacción. */
  state?: SwitchState;
  /** Callback ejecutado cuando cambia el estado del switch. */
  onToggle?: (active: boolean) => void;
  /** Etiquetas opcionales que se muestran junto al switch. */
  label?: string;
}

const TRACK_BASE = "relative box-border w-11 h-6 shrink-0 overflow-hidden rounded-full    cursor-pointer flex items-center justify-start px-0.5";
const THUMB_BASE = "size-5 shrink-0 bg-white-white rounded-full    shadow-sm";

const TRACK_VARIANTS: Record<SwitchState, { active: string, inactive: string }> = {
  Default: {
    active: "bg-secondary-bg-default",
    inactive: "bg-neutral-bg-soft",
  },
  Disabled: {
    active: "bg-neutral-bg-action-disabled",
    inactive: "bg-neutral-bg-action-disabled",
  },
};

/**
 * Control interactivo para configuraciones binarias.
 * Sigue la especificación del componente en Figma (Node 434:819).
 */
export const Switch = React.memo(({
  isActive,
  state: forcedState = 'Default',
  onToggle,
  label,
  className,
  disabled,
  onChange,
  ref,
  ...props
}: SwitchProps) => {
  const isControlled = isActive !== undefined;
  const [internalActive, setInternalActive] = React.useState(() => isActive ?? false);

  const finalState: SwitchState = disabled ? 'Disabled' : forcedState;
  const isSelected = isControlled ? Boolean(isActive) : internalActive;
  const isDisabled = finalState === 'Disabled';

  const handleToggle = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    const nextValue = e.target.checked;
    if (!isControlled) setInternalActive(nextValue);
    onToggle?.(nextValue);
    onChange?.(e);
  }, [isControlled, isDisabled, onToggle, onChange]);

  const trackStyles = isSelected 
    ? TRACK_VARIANTS[finalState].active 
    : TRACK_VARIANTS[finalState].inactive;

  const thumbColor = isDisabled ? "bg-neutral-bg-subtle" : "bg-neutral-bg-surface-level-0";

  const toggleControl = (
    <div className="relative inline-flex items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        ref={ref}
        checked={isSelected}
        onChange={handleToggle}
        disabled={isDisabled}
        {...props}
      />
      
      {/* Keep focus feedback for keyboard users; state changes are binary only. */}
      <div 
        className={cn(
          "t-toggle-track",
          TRACK_BASE,
          trackStyles,
          "peer-focus-visible:shadow-card-active-ring"
        )}
        data-on={String(isSelected)}
      >
        <div className={cn("t-toggle-thumb", THUMB_BASE, thumbColor)} />
      </div>
    </div>
  );

  return (
    <label 
      className={cn(
        "inline-flex items-center w-full min-h-[24px] gap-3 select-none",
        label ? "justify-between" : "justify-start",
        !isDisabled ? "cursor-pointer" : "cursor-not-allowed",
        isDisabled && "opacity-disabled",
        className
      )}
    >
      {label && (
        <span 
          className={cn(
            "font-sans font-normal text-base leading-[20px] text-neutral-text-default",
            isDisabled && "text-neutral-text-action-disabled"
          )}
        >
          {label}
        </span>
      )}
      {toggleControl}
    </label>
  );
});

Switch.displayName = 'Switch';

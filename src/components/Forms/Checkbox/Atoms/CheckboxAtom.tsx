import { Check, Minus } from 'lucide-react';
import { cn } from '../../../../lib/utils';

/** Estado visual. Los valores 'Hover' y 'Pressed' quedan obsoletos: se retiran en 4.0; usa los selectores CSS `hover:`/`active:`. */
export type CheckboxState = 'Default' | 'Hover' | 'Pressed' | 'Disabled';

export interface CheckboxAtomProps {
  /** Muestra la marca de selección. */
  isActive?: boolean;
  /** Muestra el indicador de selección parcial. */
  isIndeterminate?: boolean;
  /** Estado visual de interacción del control. */
  state?: CheckboxState;
  /** Clases adicionales opcionales. */
  className?: string;
}

export const CheckboxAtom = ({ isActive, isIndeterminate, state = 'Default', className }: CheckboxAtomProps) => {
  const isChecked = isActive || isIndeterminate;
  const isDisabled = state === 'Disabled';

  return (
    <div className={cn(
      // Fixed Box Geometry (20x20px, 4px rounding)
      // border-box ensures size includes border, preventing layout shifts
      "t-checkbox-atom size-5 rounded flex items-center justify-center shrink-0 box-border",
      "border border-solid   ",
      
      // UNCHECKED
      !isChecked && [
        "bg-transparent border-neutral-border-default",
        state === 'Hover' && "border-secondary-bg-action-hover"
      ],
      
      // CHECKED / INDETERMINATE
      isChecked && [
        "bg-secondary-bg-default border-transparent",
        state === 'Hover' && "bg-secondary-bg-action-hover",
        // Active state token assumed from system
        "active:bg-secondary-bg-action-pressed" 
      ],
      
      // DISABLED OVERRIDES
      isDisabled && [
        "bg-neutral-bg-action-disabled border-transparent text-neutral-text-action-disabled cursor-not-allowed",
        "group-hover/checkbox:bg-neutral-bg-action-disabled"
      ],
      // Keyboard focus only
      "peer-focus-visible:shadow-card-active-ring",
      
      className
    )}
      data-checked={isActive || undefined}
      data-indeterminate={isIndeterminate || undefined}
      data-disabled={isDisabled || undefined}
    >
      <Check
        size={16}
        strokeWidth={3}
        aria-hidden="true"
        className={cn(
          "t-checkbox-mark t-checkbox-mark-check shrink-0",
          isDisabled ? "text-neutral-text-action-disabled" : "text-neutral-text-contrast",
          !isChecked && "t-checkbox-mark-ghost text-neutral-border-default",
        )}
      />
      <Minus
        size={16}
        strokeWidth={3}
        aria-hidden="true"
        className={cn(
          "t-checkbox-mark t-checkbox-mark-indeterminate shrink-0",
          isDisabled ? "text-neutral-text-action-disabled" : "text-neutral-text-contrast",
        )}
      />
    </div>
  );
};

CheckboxAtom.displayName = 'CheckboxAtom';

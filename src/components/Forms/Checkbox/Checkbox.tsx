import * as React from 'react';
import { cn } from '../../../lib/utils';
import { CheckboxAtom, type CheckboxState } from './Atoms/CheckboxAtom';

// ============================================================================
// TYPES
// ============================================================================

/** Props del componente Checkbox. */
export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'state' | 'autoComplete'> {
  autoComplete?: never;
  /** Figma: isActive. Define si la casilla está seleccionada. */
  isActive?: boolean;
  /** Figma: propUndefined. Define el estado indeterminado o parcial. */
  isIndeterminate?: boolean;
  /** Fuerza el estado visual de interacción. */
  state?: CheckboxState;
  /**
   * Contenido que se muestra junto a la casilla. El contenido no interactivo
   * alterna la casilla; los enlaces dentro de la etiqueta conservan su comportamiento nativo.
   */
  label?: React.ReactNode;
}

// ============================================================================
// MAIN COMPONENT (Label + Atom Wrapper)
// ============================================================================

export const Checkbox = React.memo(({
  isActive = false,
  isIndeterminate = false,
  state: forcedState,
  label,
  className,
  disabled,
  checked,
  onChange,
  readOnly,
  ref,
  ...props
}: CheckboxProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const internalRef = React.useRef<HTMLInputElement>(null);
  React.useImperativeHandle(ref, () => internalRef.current!);

  // Sync state derived from HTML props if provided
  const finalIsActive = checked !== undefined ? checked : isActive;
  const finalDisabled = disabled || forcedState === 'Disabled';
  const finalState = forcedState || (finalDisabled ? 'Disabled' : 'Default');

  // Sync indeterminate property with the native input
  React.useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = !!isIndeterminate;
    }
  }, [isIndeterminate]);

  const hasLabel = label !== undefined && label !== null && label !== false;
  const handleLabelContentClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    const target = event.target;
    if (target instanceof Element && target.closest('a, button, [role="link"]')) {
      // Prevent the ancestor <label> from forwarding an interactive-link click
      // to the checkbox while preserving the link's own default behavior.
      event.stopPropagation();
    }
  };

  return (
    <label className={cn(
      "inline-flex items-center gap-3 select-none group/checkbox",
      // Use relative positioning and block size to prevent layout shifts
      "relative min-h-6 rounded-container-sm  ",
      finalDisabled ? "cursor-not-allowed" : "cursor-pointer",
      // Hover background (Ávila DS interaction area)
      !finalDisabled && "hover:bg-neutral-bg-subtle/50",
      className
    )}>
      <div className="flex items-center justify-center p-0.5 shrink-0">
        <input
          type="checkbox"
          ref={internalRef}
          checked={finalIsActive}
          disabled={finalDisabled}
          onChange={onChange}
          readOnly={readOnly || !onChange}
          className="peer sr-only"
          {...props}
        />
        
        <CheckboxAtom 
          isActive={finalIsActive} 
          isIndeterminate={isIndeterminate} 
          state={finalState} 
        />
      </div>

      {hasLabel && (
        <span className={cn(
          "font-sans font-normal text-base leading-5  ",
          "text-neutral-text-default",
          finalDisabled && "text-neutral-text-action-disabled"
        )} onClick={handleLabelContentClick}>
          {label}
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

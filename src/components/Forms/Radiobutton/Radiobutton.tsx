import * as React from 'react';
import { cn } from '../../../lib/utils';
import { RadiobuttonAtom, type RadiobuttonState } from './Atoms/RadiobuttonAtom';

/** Props del componente Radiobutton. */
export interface RadiobuttonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'autoComplete'> {
  autoComplete?: never;
  /** Figma: isActive. Define si el radio está seleccionado visual y funcionalmente. */
  isActive?: boolean;
  /** Figma: state. Sobrescribe el estado visual de interacción. */
  state?: RadiobuttonState;
  /** Figma: placeholder. Etiqueta de texto opcional junto al radio. */
  label?: string;
  /** Clase CSS opcional para ajustar el contenedor. */
  className?: string;
}

export const Radiobutton = React.memo(({
  isActive = false,
  state = 'Default',
  label,
  className,
  disabled,
  onChange,
  readOnly,
  ref,
  ...props
}: RadiobuttonProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const isInactive = state === 'Disabled' || disabled;

  // Render alone if no label
  if (!label) {
    return (
      <div className={cn("relative inline-flex items-center justify-center group/radiobutton", className)}>
        <input
          type="radio"
          ref={ref}
          className="peer sr-only"
          disabled={isInactive}
          checked={isActive}
          onChange={onChange}
          readOnly={readOnly ?? !onChange}
          {...props}
        />
        {/* La lógica peer permite mostrar el foco sobre el átomo cuando el input recibe foco. */}
        <RadiobuttonAtom 
          isActive={isActive} 
          state={isInactive ? 'Disabled' : state}
          className={cn(
            "peer-focus-visible:shadow-card-active-ring",
            !isActive && !isInactive && "peer-hover:border-neutral-border-strong",
            isActive && !isInactive && "peer-hover:bg-secondary-bg-action-hover"
          )} 
        />
      </div>
    );
  }

  // Render with label (Molecule-like behavior)
  return (
    <label
      className={cn(
        "inline-flex relative items-center gap-3 cursor-pointer group/radiobutton",
        isInactive && "cursor-not-allowed",
        className
      )}
    >
      <input
        type="radio"
        ref={ref}
        className="peer sr-only"
        disabled={isInactive}
        checked={isActive}
        onChange={onChange}
        readOnly={readOnly ?? !onChange}
        {...props}
      />
      <RadiobuttonAtom 
        isActive={isActive} 
        state={isInactive ? 'Disabled' : state}
        className={cn(
          "peer-focus-visible:shadow-card-active-ring",
          !isActive && !isInactive && "peer-hover:border-neutral-border-strong",
          isActive && !isInactive && "peer-hover:bg-secondary-bg-action-hover"
        )} 
      />
      
      {label && (
        <span 
          className={cn(
            "font-sans font-normal text-base leading-[20px] text-neutral-text-default",
            isInactive && "text-neutral-text-action-disabled"
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
});

Radiobutton.displayName = 'Radiobutton';

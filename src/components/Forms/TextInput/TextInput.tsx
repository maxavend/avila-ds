import * as React from 'react';
import { HelpText, type HelpTextState } from '../../Feedback/HelpText/HelpText';
import { useHelpTextPresence } from '../../Feedback/HelpText/useHelpTextPresence';
import { cn } from '../../../lib/utils';
import { Icon, type IconName } from '../../DataDisplay/Icon/Icon';

// ============================================================================
// TYPES
// ============================================================================

export type TextInputSize = 'L' | 'M';
/** Estado visual. Los valores 'Hover' y 'Pressed' quedan obsoletos: se retiran en 4.0; usa los selectores CSS `hover:`/`active:`. */
export type TextInputState = 'Default' | 'Hover' | 'Pressed' | 'Error' | 'Success' | 'ReadOnly' | 'Disabled';

/** Props del componente TextInput. */
export interface TextInputProps extends Omit<React.ComponentProps<'input'>, 'size' | 'autoComplete'> {
  /** Úsalo solo para un campo de usuario dentro de un flujo de autenticación. */
  autoComplete?: 'username';
  /** Tamaño del campo: L estándar o M compacto. */
  size?: TextInputSize;
  /** Sobrescribe el estado visual de interacción. */
  state?: TextInputState;
  /** Texto de ayuda, error o éxito que se muestra bajo el campo. */
  helpText?: string;
  /** Fuerza visualmente el estado de campo completado. */
  forcedFilled?: boolean;
  /** Etiqueta del campo. */
  label?: string;
  /** Agrega un asterisco para indicar que el campo es obligatorio. */
  isMandatory?: boolean;
  /** Nombre de icono o ReactNode personalizado que se muestra en el campo. */
  icon?: IconName | React.ReactNode;
}

// ============================================================================
// STYLES MAPPING
// ============================================================================

const SIZE_STYLES: Record<TextInputSize, string> = {
  L: "p-4",
  M: "px-4 py-3",
};

const STATE_STYLES: Record<TextInputState, string> = {
  Default: "bg-neutral-bg-surface-level-2 border-neutral-border-soft shadow-none",
  Hover: "bg-neutral-bg-surface-level-2 border-neutral-border-soft shadow-card-overlay-s",
  Pressed: "bg-neutral-bg-surface-level-2 border-secondary-border-default shadow-card-active-ring",
  Error: "bg-neutral-bg-surface-level-2 border-danger-border-default shadow-none text-danger-text-default",
  Success: "bg-neutral-bg-surface-level-2 border-success-border-default shadow-none text-success-text-default",
  ReadOnly: "bg-neutral-bg-subtle border-neutral-border-action-disabled shadow-none",
  Disabled: "bg-neutral-bg-action-disabled border-neutral-border-action-disabled shadow-none cursor-not-allowed",
};

const TEXT_STYLES: Record<TextInputState, string> = {
  Default: "text-neutral-text-default",
  Hover: "text-neutral-text-default",
  Pressed: "text-neutral-text-default",
  Error: "text-neutral-text-default",
  Success: "text-neutral-text-default",
  ReadOnly: "text-neutral-text-default",
  Disabled: "text-neutral-text-action-disabled",
};

// ============================================================================
// COMPONENT
// ============================================================================

export const TextInput = React.memo(({
  size = 'L',
  state: forcedState = 'Default',
  label,
  isMandatory = false,
  icon,
  helpText,
  className,
  disabled,
  onChange,
  readOnly,
  id,
  value,
  defaultValue,
  ref,
  ...props
}: TextInputProps) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const helpTextId = `${inputId}-help`;

  // Compute final state
  let finalState = forcedState;
  if (disabled) finalState = 'Disabled';
  else if (readOnly && finalState !== 'Error' && finalState !== 'Success') finalState = 'ReadOnly';

  const isInvalid = finalState === 'Error';
  const isDisabled = finalState === 'Disabled';
  const isReadOnly = finalState === 'ReadOnly' || readOnly;

  const helpTextState: HelpTextState = isInvalid ? 'Error' : (finalState === 'Success' ? 'Success' : (isDisabled ? 'Disabled' : 'Default'));
  const helpTextPresence = useHelpTextPresence({
    open: Boolean(helpText),
    children: helpText,
    state: helpTextState,
    hasIcon: Boolean(helpText),
  });

  return (
    <div className={cn("flex flex-col gap-1 w-full items-start", className)}>
      
      {/* LABEL SLOT */}
      {label && (
        <label 
          htmlFor={inputId}
          className={cn(
            "flex items-center w-full font-sans font-medium text-base leading-[20px] overflow-hidden",
            (isDisabled || isReadOnly || finalState === 'ReadOnly') ? "text-neutral-text-action-disabled" : "text-neutral-text-headline"
          )}
        >
          <span className="truncate">{label}</span>
          {isMandatory && (
            <span className="shrink-0 text-danger-text-default ml-1">*</span>
          )}
        </label>
      )}

      {/* INPUT CONTAINER */}
      <div 
        className={cn(
          "t-input flex items-center w-full relative overflow-clip border border-solid rounded-input-default   group gap-2 self-stretch",
          SIZE_STYLES[size],
          STATE_STYLES[finalState],
          // Automatic interactives
          !isDisabled && !isReadOnly && finalState === 'Default' && "[&:hover:not(:focus-within)]:border-neutral-border-soft [&:hover:not(:focus-within)]:shadow-card-overlay-s focus-within:border-secondary-border-default focus-within:shadow-card-active-ring",

          (finalState === 'Pressed' || finalState === 'Hover') && "z-20"
        )}
        data-error={isInvalid ? 'true' : undefined}
      >
        {/* Left Icon (Optional) */}
        {icon && (
          <div className="shrink-0 flex items-center justify-center size-[20px] text-neutral-text-soft">
            {React.isValidElement(icon) ? icon : <Icon name={icon as IconName} size={20} color="currentColor" />}
          </div>
        )}

        {/* NATIVE INPUT */}
        <input
          id={inputId}
          ref={ref}
          type="text"
          disabled={isDisabled}
          readOnly={isReadOnly || (value !== undefined && !onChange)}
          onChange={onChange}
          aria-invalid={isInvalid}
          aria-describedby={helpText ? helpTextId : undefined}
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none border-none",
            "font-sans font-normal text-base leading-[20px]",
            TEXT_STYLES[finalState],
            // Placeholder color using Tailwind's placeholder pseudo-class
            "placeholder:text-neutral-text-soft",
            (isDisabled || isReadOnly || finalState === 'ReadOnly') && "placeholder:text-neutral-text-action-disabled"
          )}
          value={value}
          defaultValue={defaultValue}
          {...props}
        />
      </div>
      {/* HELP TEXT SLOT — CSS GRID TRANSITION */}
      <div
        className="ds-disclosure-text t-stagger"
        data-state={helpText ? 'open' : 'closed'}
        aria-hidden={!helpText}
        ref={helpTextPresence.disclosureRef}
      >
        <div className="ds-disclosure-text__content">
          {helpTextPresence.isMounted && (
            <HelpText
              id={helpTextId}
              state={helpTextPresence.state}
              hasIcon={helpTextPresence.hasIcon}
              className="mt-1"
            >
              {helpTextPresence.children}
            </HelpText>
          )}
        </div>
      </div>
    </div>
  );
});

TextInput.displayName = 'TextInput';

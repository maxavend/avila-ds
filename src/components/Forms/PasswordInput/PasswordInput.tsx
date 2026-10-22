import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { HelpText, type HelpTextState } from '../../Feedback/HelpText/HelpText';
import { useHelpTextPresence } from '../../Feedback/HelpText/useHelpTextPresence';
import { cn } from '../../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export type PasswordInputSize = 'L' | 'M';
/** Estado visual. Los valores 'Hover' y 'Pressed' quedan obsoletos: se retiran en 4.0; usa los selectores CSS `hover:`/`active:`. */
export type PasswordInputState = 'Default' | 'Hover' | 'Pressed' | 'Error' | 'Success' | 'Disabled' | 'ReadOnly';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'autoComplete'> {
  /** Password-manager purpose for authentication and password-creation flows. */
  autoComplete?: 'current-password' | 'new-password';
  size?: PasswordInputSize;
  /** Fuerza visualmente el estado de campo completado. */
  forcedFilled?: boolean;
  /** Define si se muestra el estado visual de solo lectura. */
  readOnly?: boolean;
  /** Estado visual de retroalimentación. */
  state?: PasswordInputState;
  /** Etiqueta del campo. */
  label?: string;
  /** Agrega un asterisco para indicar que el campo es obligatorio. */
  isMandatory?: boolean;
  /** Texto de ayuda que se muestra bajo el campo. */
  helpText?: string;
  /** Muestra el icono para ocultar o mostrar la contraseña. */
  hasHideIcon?: boolean;
}

// ============================================================================
// STYLES MAPPING
// ============================================================================

const SIZE_STYLES: Record<PasswordInputSize, string> = {
  L: "p-4",
  M: "px-4 py-3",
};

const STATE_STYLES: Record<PasswordInputState, string> = {
  Default: "bg-neutral-bg-surface-level-2 border-neutral-border-soft shadow-none",
  Hover: "bg-neutral-bg-surface-level-2 border-neutral-border-soft shadow-card-overlay-s",
  Pressed: "bg-neutral-bg-surface-level-2 border-secondary-border-default shadow-card-active-ring",
  Error: "bg-neutral-bg-surface-level-2 border-danger-border-default shadow-none",
  Success: "bg-neutral-bg-surface-level-2 border-success-border-default shadow-none",
  ReadOnly: "bg-neutral-bg-subtle border-neutral-border-action-disabled shadow-none",
  Disabled: "bg-neutral-bg-action-disabled border-neutral-border-action-disabled shadow-none cursor-not-allowed",
};

const TEXT_STYLES: Record<PasswordInputState, string> = {
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

export const PasswordInput = React.memo(({
  size = 'L',
  state: forcedState = 'Default',
  label,
  isMandatory = false,
  helpText,
  hasHideIcon = true,
  className,
  disabled,
  onChange,
  readOnly,
  id,
  value,
  defaultValue,
  ref,
  ...props
}: PasswordInputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const helpTextId = `${inputId}-help`;
  
  const [showPassword, setShowPassword] = React.useState(false);

  // Derive filled state
  // const isFilled = forcedFilled ?? (Boolean(value) || Boolean(defaultValue)); // Not currently used but kept for logic consistency

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

  const togglePasswordVisibility = React.useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

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
          !isDisabled && !isReadOnly && forcedState === 'Default' && "[&:hover:not(:focus-within)]:shadow-card-overlay-s",
          !isDisabled && !isReadOnly && forcedState === 'Default' && "focus-within:border-secondary-border-default focus-within:shadow-card-active-ring"

        )}
        data-error={isInvalid ? 'true' : undefined}
      >
        {/* NATIVE INPUT */}
        <input
          id={inputId}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          disabled={isDisabled}
          readOnly={isReadOnly || (value !== undefined && !onChange)}
          onChange={onChange}
          aria-invalid={isInvalid}
          aria-describedby={helpText ? helpTextId : undefined}
          aria-required={isMandatory}
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none border-none",
            "font-sans font-normal text-base leading-[20px]",
            TEXT_STYLES[finalState],
            "placeholder:text-neutral-text-soft",
            (isDisabled || isReadOnly || finalState === 'ReadOnly') && "placeholder:text-neutral-text-action-disabled"
          )}
          value={value}
          defaultValue={defaultValue}
          {...props}
        />

        {/* EYE ICON SLOT */}
        {hasHideIcon && (
          <button
            type="button"
            disabled={isDisabled}
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className={cn(
              "shrink-0 flex items-center justify-center size-[20px]  bg-transparent border-none outline-none focus-visible:shadow-card-active-ring rounded-sm cursor-pointer disabled:cursor-not-allowed",
              isDisabled ? "text-neutral-text-action-disabled" : (isReadOnly ? "text-neutral-text-default" : "text-neutral-text-soft hover:text-neutral-text-default")
            )}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
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

PasswordInput.displayName = 'PasswordInput';

import * as React from 'react';
import { HelpText, type HelpTextState } from '../../Feedback/HelpText/HelpText';
import { useHelpTextPresence } from '../../Feedback/HelpText/useHelpTextPresence';
import { cn } from '../../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

/** Estado visual. Los valores 'Hover' y 'Pressed' quedan obsoletos: se retiran en 4.0; usa los selectores CSS `hover:`/`active:`. */
export type TextAreaState = 'Default' | 'Hover' | 'Pressed' | 'Error' | 'Disabled';

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'autoComplete'> {
  autoComplete?: never;
  /** Sobrescribe el estado visual de interacción. */
  state?: TextAreaState;
  /** Texto de ayuda o error que se muestra bajo el campo. */
  helpText?: string;
  /** Etiqueta del campo. */
  label?: string;
  /** Agrega un asterisco para indicar que el campo es obligatorio. */
  isMandatory?: boolean;
  /** Fuerza visualmente el estado de campo completado. */
  forcedFilled?: boolean;
  /** Muestra el contador de caracteres cuando se define maxLength. */
  showCounter?: boolean;
}

// ============================================================================
// STYLES MAPPING
// ============================================================================

const CONTAINER_STATE_STYLES: Record<TextAreaState, string> = {
  Default: 'bg-neutral-bg-surface-level-2 border-neutral-border-soft shadow-none',
  Hover: 'bg-neutral-bg-surface-level-2 border-neutral-border-soft shadow-card-overlay-s',
  Pressed: 'bg-neutral-bg-surface-level-2 border-secondary-border-default shadow-card-active-ring',
  Error: 'bg-neutral-bg-surface-level-2 border-danger-border-default shadow-none text-danger-text-default',
  Disabled: 'bg-neutral-bg-action-disabled border-neutral-border-action-disabled shadow-none cursor-not-allowed',
};

const TEXT_STATE_STYLES: Record<TextAreaState, string> = {
  Default: 'text-neutral-text-default',
  Hover: 'text-neutral-text-default',
  Pressed: 'text-neutral-text-default',
  Error: 'text-neutral-text-default',
  Disabled: 'text-neutral-text-action-disabled',
};

// ============================================================================
// COMPONENT
// ============================================================================

export const TextArea = React.memo(({
  state: forcedState = 'Default',
  helpText,
  label,
  isMandatory = false,
  forcedFilled = false,
  showCounter = true,
  className,
  disabled,
  id,
  value,
  defaultValue,
  maxLength,
  onChange,
  rows = 3,
  ref,
  ...props
}: TextAreaProps & { ref?: React.Ref<HTMLTextAreaElement> }) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const helpTextId = `${inputId}-help`;

  // Internal value tracking to calculate character count
  const isControlled = value !== undefined;
  const initialValue = (isControlled ? value : (defaultValue !== undefined ? defaultValue : '')) as string;
  const [internalValue, setInternalValue] = React.useState<string>(initialValue);

  // Layout state: track whether scrollbar is physically active
  const [hasActiveScroll, setHasActiveScroll] = React.useState(false);

  // Refs for scroll synchronization and custom scrollbar
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const backdropRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const thumbRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isControlled) {
      setInternalValue((value as string) || '');
    }
  }, [value, isControlled]);

  const currentLength = internalValue.length;
  const isFilled = forcedFilled || currentLength > 0;
  const isOverLimit = maxLength !== undefined && currentLength > maxLength;

  // Compute final state
  let finalState = forcedState;
  if (disabled) {
    finalState = 'Disabled';
  } else if (isOverLimit && finalState !== 'Disabled') {
    finalState = 'Error';
  }

  const isInvalid = finalState === 'Error';
  const isDisabled = finalState === 'Disabled';

  const handleScroll = React.useCallback(() => {
    if (textareaRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = textareaRef.current;
      const active = scrollHeight > clientHeight;

      setHasActiveScroll(active);

      // Sync backdrop scroll
      if (backdropRef.current) {
        backdropRef.current.scrollTop = scrollTop;
        backdropRef.current.scrollLeft = textareaRef.current.scrollLeft;
      }

      // Sync custom scrollbar
      if (thumbRef.current && trackRef.current) {
        const trackHeight = trackRef.current.clientHeight;
        if (active) {
          const thumbHeight = Math.max(16, (clientHeight / scrollHeight) * trackHeight);
          const maxScrollTop = scrollHeight - clientHeight;
          const scrollPercent = scrollTop / maxScrollTop;
          const thumbTop = scrollPercent * (trackHeight - thumbHeight);

          thumbRef.current.style.height = `${thumbHeight}px`;
          thumbRef.current.style.transform = `translateY(${thumbTop}px)`;
          thumbRef.current.style.opacity = '1';
        } else {
          thumbRef.current.style.opacity = '0';
        }
      }
    }
  }, []);

  React.useEffect(() => {
    handleScroll();
  }, [internalValue, handleScroll]);

  // Handle resizing and initial layout synchronization
  React.useEffect(() => {
    const observer = new ResizeObserver(() => {
      handleScroll();
    });
    if (textareaRef.current) {
      observer.observe(textareaRef.current);
    }
    return () => observer.disconnect();
  }, [handleScroll]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    onChange?.(e);
  };

  const handleRef = (node: HTMLTextAreaElement | null) => {
    (textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
    if (ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    }
  };

  // Determine correct HelpTextState
  const helpTextState: HelpTextState = isInvalid 
    ? 'Error' 
    : isDisabled 
      ? 'Disabled' 
      : 'Default';

  const helpTextPresence = useHelpTextPresence({
    open: Boolean(helpText),
    children: helpText,
    state: helpTextState,
  });
  const hasFooter = helpTextPresence.isMounted || (showCounter && maxLength !== undefined);

  // Backdrop highlighter logic
  const showBackdrop = !isDisabled && maxLength !== undefined;

  const renderBackdropContent = () => {
    const text = isControlled ? (value as string) || '' : internalValue;
    const dispText = text.endsWith('\n') ? text + ' ' : text;

    if (maxLength === undefined) {
      return dispText;
    }

    const normalText = dispText.slice(0, maxLength);
    const overflowText = dispText.slice(maxLength);

    return (
      <>
        {normalText}
        {overflowText && (
          <span className="text-danger-text-default bg-danger-bg-subtle/20">
            {overflowText}
          </span>
        )}
      </>
    );
  };

  return (
    <div className={cn('flex flex-col gap-1 w-full items-start', className)}>
      
      {/* LABEL SLOT */}
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            'flex items-center w-full font-sans font-medium text-base/[20px] mb-1 px-0.5 overflow-hidden',
            isDisabled ? 'text-neutral-text-action-disabled' : 'text-neutral-text-headline'
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
          't-input flex items-start w-full relative overflow-clip border border-solid rounded-container-md   group px-3 py-2 min-h-[92px] self-stretch',
          CONTAINER_STATE_STYLES[finalState],
          !isDisabled && finalState === 'Default' && '[&:hover:not(:focus-within)]:border-neutral-border-soft [&:hover:not(:focus-within)]:shadow-card-overlay-s focus-within:border-secondary-border-default focus-within:shadow-card-active-ring',
          (finalState === 'Pressed' || finalState === 'Hover') && 'z-20'
        )}
        data-filled={isFilled ? 'true' : undefined}
        data-error={isInvalid ? 'true' : undefined}
      >
        {/* Writing wrapper area (always px-3 / 12px parent padding) */}
        <div className="relative flex-1 min-w-0 self-stretch min-h-[76px]">
          {/* Backing Highlighter Layer */}
          {showBackdrop && (
            <div
              ref={backdropRef}
              aria-hidden="true"
              className={cn(
                'absolute inset-0 size-full pointer-events-none select-none overflow-hidden break-words whitespace-pre-wrap font-sans font-normal text-base/[20px] py-0 border-none outline-none text-neutral-text-default box-border',
                hasActiveScroll ? 'pr-1' : 'pr-0'
              )}
            >
              {renderBackdropContent()}
            </div>
          )}

          {/* Interactive Native Textarea */}
          <textarea
            id={inputId}
            ref={handleRef}
            disabled={isDisabled}
            value={isControlled ? value : internalValue}
            defaultValue={isControlled ? undefined : defaultValue}
            onChange={handleChange}
            onScroll={handleScroll}
            aria-invalid={isInvalid}
            aria-describedby={helpText ? helpTextId : undefined}
            rows={rows}
            className={cn(
              'absolute inset-0 size-full bg-transparent outline-none border-none resize-none font-sans font-normal text-base/[20px] scrollbar-none overflow-y-auto py-0 box-border',
              showBackdrop ? 'text-transparent caret-neutral-text-headline' : TEXT_STATE_STYLES[finalState],
              'placeholder:text-neutral-text-soft',
              isDisabled && 'placeholder:text-neutral-text-action-disabled',
              hasActiveScroll ? 'pr-1' : 'pr-0'
            )}
            {...props}
          />
        </div>

        {/* Custom scrollbar track positioned absolutely at 4px from right border, adjusting dynamically */}
        {!isDisabled && (
          <div
            ref={trackRef}
            className="absolute right-[4px] top-[8px] bottom-[8px] w-[4px] pointer-events-none rounded-[8px]"
          >
            <div
              ref={thumbRef}
              className="w-full rounded-[8px] bg-neutral-border-subtle opacity-0  "
              style={{ minHeight: '16px' }}
            />
          </div>
        )}
      </div>

      {/* FOOTER: HELP TEXT & COUNTER */}
      {hasFooter && (
        <div className="flex justify-between items-start w-full mt-1 px-0.5">
          {/* Helper Text */}
          <div className="flex-1 min-w-0">
            <div
              className="ds-disclosure-text t-stagger"
              data-state={helpText ? 'open' : 'closed'}
              aria-hidden={!helpText}
              ref={helpTextPresence.disclosureRef}
            >
              <div className="ds-disclosure-text__content">
                {helpTextPresence.isMounted && (
                  <HelpText id={helpTextId} state={helpTextPresence.state}>
                    {helpTextPresence.children}
                  </HelpText>
                )}
              </div>
            </div>
          </div>

          {/* Character Counter */}
          {showCounter && maxLength !== undefined && (
            <span
              className={cn(
                'shrink-0 font-sans font-normal text-base/[20px] ml-4 min-w-[76px] text-right',
                isDisabled 
                  ? 'text-neutral-text-action-disabled' 
                  : isOverLimit 
                    ? 'text-danger-text-default' 
                    : 'text-neutral-text-default'
              )}
            >
              {isOverLimit ? `-${currentLength - maxLength}/${maxLength}` : `${currentLength}/${maxLength}`}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

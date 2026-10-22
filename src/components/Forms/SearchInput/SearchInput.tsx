// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Icon } from '../../DataDisplay/Icon/Icon';
import { Dropdown } from '../Dropdown/Dropdown';
import { useDropdownPresence } from '../../../lib/useDropdownPresence';

// ============================================================================
// TYPES
// ============================================================================

export type SearchInputSize = 'L' | 'M';
/** Estado visual. Los valores 'Hover' y 'Pressed' quedan obsoletos: se retiran en 4.0; usa los selectores CSS `hover:`/`active:`. */
export type SearchInputState = 'Default' | 'Hover' | 'Pressed' | 'Disabled';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'autoComplete'> {
  /** Autocomplete is intentionally unavailable for search fields. */
  autoComplete?: never;
  /** Tamaño del input. L: 52px height (approx), M: 44px height (approx). */
  size?: SearchInputSize;
  /** Estado visual forzado. */
  state?: SearchInputState;
  /** Texto del placeholder o label flotante. */
  label?: string;
  /** Contenido del dropdown de sugerencias (usualmente opciones de búsqueda). */
  children?: React.ReactNode;
  /** Callback ejecutado al limpiar el input mediante el botón "X". */
  onClear?: () => void;
  /** Ref para el elemento input interno (React 19 prop). */
  ref?: React.Ref<HTMLInputElement>;
}

// ============================================================================
// COMPONENT
// ============================================================================

const SIZE_STYLES: Record<SearchInputSize, string> = {
  L: 'px-3 py-4',
  M: 'p-3',
};

const CONTAINER_STATE_STYLES: Record<SearchInputState, string> = {
  Default: 'bg-neutral-bg-subtle',
  Hover: 'bg-neutral-bg-subtle ring-1 ring-inset ring-neutral-border-soft shadow-none',
  Pressed: 'bg-neutral-bg-subtle border-secondary-border-default shadow-none',
  Disabled: 'bg-neutral-bg-action-disabled',
};

const ICON_STATE_STYLES: Record<SearchInputState, string> = {
  Default: 'text-neutral-text-soft',
  Hover: 'text-neutral-text-headline',
  Pressed: 'text-neutral-text-default',
  Disabled: 'text-neutral-text-action-disabled',
};

const TEXT_STATE_STYLES: Record<SearchInputState, string> = {
  Default: 'text-neutral-text-default',
  Hover: 'text-neutral-text-headline',
  Pressed: 'text-neutral-text-default',
  Disabled: 'text-neutral-text-action-disabled',
};

/**
 * SearchInput — Entrada de texto especializada para búsquedas con icono, 
 * botón de limpieza y soporte para dropdown de sugerencias.
 */
export const SearchInput = ({
  size = 'L',
  state: forcedState,
  label = "What are you looking for?",
  children,
  onClear,
  className,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled,
  ref,
  ...props
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [lastDropdownContent, setLastDropdownContent] = React.useState<React.ReactNode>(children);
  
  const isControlled = value !== undefined;
  const displayValue = isControlled ? value : internalValue;
  const isFilled = String(displayValue).length > 0;
  const inputDisabled = disabled || forcedState === 'Disabled';
  if (inputDisabled && isFocused) setIsFocused(false);
  const isDropdownOpen = !inputDisabled && isFocused && isFilled && Boolean(children);
  if (isDropdownOpen && lastDropdownContent !== children) setLastDropdownContent(children);
  const {
    isMounted: isDropdownMounted,
    isClosing: isDropdownClosing,
    transitionStatus,
    surfaceRef,
  } = useDropdownPresence(isDropdownOpen);
  const renderedDropdownContent = isDropdownOpen ? children : lastDropdownContent;

  // Compute final state
  let finalState: SearchInputState = forcedState || 'Default';
  if (disabled) finalState = 'Disabled';
  else if (isFocused) finalState = 'Pressed';

  const isDisabled = finalState === 'Disabled';
  const isPressed = finalState === 'Pressed';
  const isHover = finalState === 'Hover';
  const iconColorClass = ICON_STATE_STYLES[finalState];
  const textColorClass = isDisabled
    ? TEXT_STATE_STYLES.Disabled
    : (isFilled && !isPressed && !isHover ? 'text-neutral-text-headline' : TEXT_STATE_STYLES[finalState]);
  const placeholderColorClass = isDisabled
    ? 'placeholder:text-neutral-text-action-disabled'
    : (isHover ? 'placeholder:text-neutral-text-headline' : 'placeholder:text-neutral-text-default');
  const placeholderText = isPressed && !isFilled ? '' : label;

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isControlled) setInternalValue('');
    onClear?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);
  };

  const handleContainerBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = e.relatedTarget as Node | null;
    if (nextTarget && containerRef.current?.contains(nextTarget)) return;
    if (!nextTarget && containerRef.current?.contains(document.activeElement)) return;
    setLastDropdownContent(children);
    setIsFocused(false);
  };

  return (
    <div
      ref={containerRef}
      onBlurCapture={handleContainerBlur}
      className={cn('flex flex-col relative w-full isolate items-start', className)}
    >
      <div 
        className={cn(
          'content-stretch flex gap-2 items-center overflow-clip w-full box-border border border-solid border-transparent rounded-input-default   ',
          SIZE_STYLES[size],
          CONTAINER_STATE_STYLES[finalState],
          !isDisabled && finalState === 'Default' && '[&:hover:not(:focus-within)]:bg-neutral-bg-subtle [&:hover:not(:focus-within)]:ring-1 [&:hover:not(:focus-within)]:ring-inset [&:hover:not(:focus-within)]:ring-neutral-border-soft [&:hover:not(:focus-within)]:shadow-none focus-within:shadow-card-active-ring focus-within:bg-neutral-bg-subtle',
          !isDisabled && isPressed && 'focus-within:border-secondary-border-default focus-within:shadow-card-active-ring',
          !isDisabled && 'active:shadow-none',
          !isDisabled && isHover && 'shadow-none'
        )}
      >
        <Icon 
          name="Search" 
          size={20} 
          className={cn('flex-none ', iconColorClass)}
        />
        
        <input
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isDisabled}
          placeholder={placeholderText}
          {...props}
          type="text"
          className={cn(
            'flex-1 min-w-0 bg-transparent border-none outline-none font-sans text-base leading-[20px] caret-secondary-border-default',
            textColorClass,
            placeholderColorClass
          )}
        />

        {isFilled && !isDisabled && (
          <button 
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleClear}
            className="flex-none cursor-pointer text-neutral-text-soft hover:text-neutral-text-default  outline-none focus-visible:shadow-card-active-ring rounded-container-sm"
            aria-label="Limpiar búsqueda"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>

      {/* Dropdown Suggestions */}
      {isDropdownMounted && renderedDropdownContent && (
          <div
            className={cn(
              't-dropdown-surface absolute top-[calc(100%+8px)] left-0 right-0 w-full z-20',
            )}
            data-origin="top-left"
            data-open={isDropdownOpen ? '' : undefined}
            data-closed={!isDropdownOpen ? '' : undefined}
            data-starting-style={transitionStatus === 'starting' ? '' : undefined}
            data-ending-style={isDropdownClosing ? '' : undefined}
            aria-hidden={!isDropdownOpen}
            inert={!isDropdownOpen ? true : undefined}
            ref={surfaceRef}
          >
            <Dropdown 
              size={size}
              variant="Few Results"
              className="w-full"
            >
              <div
                className="w-full"
                onClick={() => {
                  setLastDropdownContent(children);
                  setIsFocused(false);
                }}
              >
                {renderedDropdownContent}
              </div>
            </Dropdown>
          </div>
      )}
    </div>
  );
};

SearchInput.displayName = 'SearchInput';

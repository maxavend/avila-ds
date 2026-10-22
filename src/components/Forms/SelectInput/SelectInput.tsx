import * as React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { HelpText, type HelpTextState } from '../../Feedback/HelpText/HelpText';
import { useHelpTextPresence } from '../../Feedback/HelpText/useHelpTextPresence';
import { Dropdown } from '../Dropdown/Dropdown';
import { Icon, type IconName } from '../../DataDisplay/Icon/Icon';
import { SelectableField } from '../Dropdown/Atoms/SelectableField';
import { useSelectInputSearch, type SelectInputSearchOption } from './useSelectInputSearch';
import { useDropdownPresence } from '../../../lib/useDropdownPresence';

export type { SelectInputSearchOption } from './useSelectInputSearch';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SelectInputSize = 'L' | 'M';

/** Estados visuales estáticos del campo disparador. */
export type SelectInputState = 'Default' | 'Error' | 'Success' | 'Disabled' | 'ReadOnly';

export interface SelectInputProps<T extends SelectInputSearchOption = SelectInputSearchOption> extends React.HTMLAttributes<HTMLDivElement> {
  /** Densidad vertical del campo disparador. */
  size?: SelectInputSize;
  /** Estado visual del campo; `Hover` se resuelve con CSS y la apertura con `isOpen`. */
  state?: SelectInputState;
  /** Etiqueta sobre el campo; si se omite, no se renderiza esa área. */
  label?: string;
  /** Añade un asterisco de obligatoriedad junto a la etiqueta. */
  isMandatory?: boolean;
  /** Texto mostrado cuando no hay un valor seleccionado. */
  placeholder?: string;
  /** Texto del valor seleccionado actualmente. */
  value?: string;
  /** Mensaje de ayuda o error bajo el campo disparador. */
  helperText?: string;
  /** Icono inicial del disparador; acepta un nombre de Lucide o un nodo React. */
  icon?: IconName | React.ReactNode;
  /** Indica si el panel está abierto. Es una prop controlada. */
  isOpen?: boolean;
  /** Notifica que el consumidor debe abrir o cerrar el panel. */
  onOpenChange?: (open: boolean) => void;
  /** Convierte el mismo disparador en un input editable y filtra `options` en vivo. */
  searchable?: boolean;
  /** Opciones que se filtran y renderizan en modo searchable. */
  options?: readonly T[];
  /** Notifica la opción seleccionada en modo searchable. */
  onOptionSelect?: (option: T) => void;
  /** Placeholder del input integrado cuando está vacío y searchable. */
  searchPlaceholder?: string;
  /** Contenido del panel Dropdown, normalmente filas `<SelectableField />`. */
  children?: React.ReactNode;
}

// base trigger styles
const BASE_TRIGGER = 't-input flex gap-2 items-center w-full overflow-hidden text-left border border-solid rounded-input-default cursor-pointer    focus:outline-none focus-visible:shadow-card-active-ring focus-within:shadow-card-active-ring active:shadow-none';

/**
 * Campo de selección con etiqueta que muestra un panel Dropdown al activarse.
 * En modo searchable, el mismo disparador se convierte en un combobox editable.
 * La apertura se controla externamente mediante `isOpen` y `onOpenChange`.
 */
export const SelectInput = <T extends SelectInputSearchOption = SelectInputSearchOption>({
  size = 'L',
  state = 'Default',
  label,
  isMandatory = false,
  placeholder = 'Choose one...',
  value,
  helperText,
  icon,
  isOpen = false,
  onOpenChange,
  searchable = false,
  options = [],
  onOptionSelect,
  searchPlaceholder = 'Busca una opción',
  children,
  className,
  ref,
  ...props
}: SelectInputProps<T> & { ref?: React.Ref<HTMLDivElement> }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [pressedOptionValue, setPressedOptionValue] = React.useState<string | null>(null);
  const isDisabled = state === 'Disabled';
  const isError = state === 'Error';
  const isReadOnly = state === 'ReadOnly';
  const {
    isMounted: isDropdownMounted,
    isClosing: isDropdownClosing,
    transitionStatus,
    surfaceRef,
  } = useDropdownPresence(isOpen && !isDisabled);
  const hasValue = Boolean(value);
  const isSearchableOpen = searchable && isOpen && !isDisabled;
  const {
    searchTerm,
    safeHighlightedIndex,
    filteredOptions,
    selectOption,
    handleKeyDown,
    handleSearchChange,
    resetSearch,
  } = useSelectInputSearch({
    options,
    onOpenChange,
    onOptionSelect,
  });

  const handleSelectOption = (option: T) => {
    setPressedOptionValue(option.value);
    selectOption(option);
  };

  // Combine refs for the container
  React.useImperativeHandle(ref, () => containerRef.current!);

  // ── Click Outside Logic ───────────────────────────────────────────────
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onOpenChange?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onOpenChange]);

  // ── Derived visual tokens ──────────────────────────────────────────────
  const labelColor = (isDisabled || isReadOnly)
    ? 'text-neutral-text-action-disabled'
    : 'text-neutral-text-headline';

  const valueColor = isDisabled
    ? 'text-neutral-text-action-disabled'
    : (hasValue || isReadOnly)
      ? 'text-neutral-text-default'
      : 'text-neutral-text-soft';

  const iconColor = isDisabled
    ? 'text-neutral-text-action-disabled'
    : isReadOnly
      ? 'text-neutral-text-default'
      : 'text-neutral-text-soft';

  const helpTextState: HelpTextState = isError
    ? 'Error'
    : state === 'Success'
      ? 'Success'
        : isReadOnly || isDisabled
          ? 'Disabled'
          : 'Default';

  // ── Trigger border/bg: open overrides state unless disabled ────────────
  const stateStyles = cn(
    state === 'Default' && 'bg-neutral-bg-surface-level-2 border-neutral-border-soft [&:hover:not(:focus-within)]:shadow-card-overlay-s focus-within:bg-neutral-bg-surface-level-2 focus-within:border-secondary-border-default focus-within:shadow-card-active-ring',
    state === 'Error' && 'bg-neutral-bg-surface-level-2 border-danger-border-default',
    state === 'Success' && 'bg-neutral-bg-surface-level-2 border-success-border-default',
    state === 'Disabled' && 'bg-neutral-bg-action-disabled border-neutral-border-action-disabled cursor-not-allowed pointer-events-none',
    state === 'ReadOnly' && 'bg-neutral-bg-subtle border-neutral-border-action-disabled cursor-default pointer-events-none shadow-none'
  );

  const triggerStyles = (isDisabled || isReadOnly)
    ? stateStyles
    : isOpen
      ? 'bg-neutral-bg-surface-level-2 border-secondary-border-default shadow-card-active-ring'
      : cn(stateStyles, state === 'Default' && '[&:hover:not(:focus-within)]:shadow-card-overlay-s');

  const triggerId = React.useId();
  const hasValidChildren = React.Children.toArray(children).some(Boolean);
  const dropdownContent = isSearchableOpen && options.length > 0 ? (
    <div id={`${triggerId}-options`} className="flex w-full flex-col gap-1">
      {filteredOptions.length > 0 ? filteredOptions.map((option, index) => (
        <SelectableField
          key={option.value}
          id={`${triggerId}-option-${index}`}
          role="option"
          aria-selected={option.label === value}
          size={size}
          mainText={option.label}
          isActive={isSearchableOpen && index === safeHighlightedIndex}
          isPressed={pressedOptionValue === option.value}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => handleSelectOption(option)}
        />
      )) : (
        <p className="p-4 text-center text-base/[20px] text-neutral-text-soft">No encontramos opciones</p>
      )}
    </div>
  ) : hasValidChildren ? children : null;
  const dropdownIsOpen = isOpen && !isDisabled;
  const latestDropdownContentRef = React.useRef<React.ReactNode>(dropdownContent);
  const [lastDropdownContent, setLastDropdownContent] = React.useState<React.ReactNode>(dropdownContent);
  const previousDropdownOpenRef = React.useRef(dropdownIsOpen);

  React.useLayoutEffect(() => {
    if (dropdownIsOpen) latestDropdownContentRef.current = dropdownContent;
  });

  React.useLayoutEffect(() => {
    if (!dropdownIsOpen && previousDropdownOpenRef.current) {
      setLastDropdownContent(latestDropdownContentRef.current);
    }
    previousDropdownOpenRef.current = dropdownIsOpen;
  }, [dropdownIsOpen]);

  const renderedDropdownContent = dropdownIsOpen ? dropdownContent : lastDropdownContent;

  const {
    children: helpTextContent,
    state: helpTextContentState,
    isMounted: isHelpTextMounted,
    disclosureRef: helpTextDisclosureRef,
  } = useHelpTextPresence({
    open: Boolean(helperText),
    children: helperText,
    state: helpTextState,
  });

  return (
    <div ref={containerRef} className={cn('flex min-w-0 flex-col gap-1 items-start w-full', className)} {...props}>

      {/* ── Label ──────────────────────────────────────────────────────── */}
      {label && (
        <label
          htmlFor={triggerId}
          className={cn(
            'flex items-center w-full font-sans font-medium text-base leading-[20px] overflow-hidden',
            labelColor
          )}
        >
          <span className="truncate">{label}</span>
          {isMandatory && (
            <span className={cn('shrink-0 ml-0.5', isDisabled ? 'text-neutral-text-action-disabled' : 'text-danger-text-default')}>*</span>
          )}
        </label>
      )}

      {/* ── Inner Wrapper for Positioning ─────────────────────────────── */}
      <div className="relative w-full">
        {/* ── Trigger / Search Input ────────────────────────────────────── */}
        {searchable && !isDisabled ? (
          <div
            className={cn(
              BASE_TRIGGER,
              size === 'L' ? 'p-4' : 'px-4 py-3',
              triggerStyles,
            )}
            data-error={isError ? 'true' : undefined}
          >
            {icon && (
              <span className={cn('flex-shrink-0 flex items-center justify-center size-4', iconColor)}>
                {typeof icon === 'string' ? <Icon name={icon as IconName} size={16} /> : icon}
              </span>
            )}
            <input
              id={triggerId}
              type="text"
              role="combobox"
              aria-label={searchPlaceholder}
              aria-autocomplete="list"
              aria-controls={`${triggerId}-options`}
              aria-expanded={isOpen}
              aria-activedescendant={filteredOptions[safeHighlightedIndex] ? `${triggerId}-option-${safeHighlightedIndex}` : undefined}
              value={isSearchableOpen ? searchTerm : value ?? ''}
              placeholder={isSearchableOpen ? searchPlaceholder : placeholder}
              onFocus={() => {
                if (!isOpen) {
                  setPressedOptionValue(null);
                  resetSearch();
                  onOpenChange?.(true);
                }
              }}
              onChange={(event) => {
                handleSearchChange(event.target.value);
                if (!isOpen) {
                  setPressedOptionValue(null);
                  onOpenChange?.(true);
                }
              }}
              onKeyDown={handleKeyDown}
              disabled={isDisabled}
              className={cn(
                'min-w-0 flex-1 bg-transparent font-sans text-base/[20px] text-neutral-text-default placeholder:text-neutral-text-soft outline-none',
                isSearchableOpen ? 'cursor-text' : 'cursor-pointer',
              )}
            />
            <span className={cn('flex-shrink-0 ', iconColor)} aria-hidden="true">
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          </div>
        ) : (
          <button
            id={triggerId}
            type="button"
            disabled={isDisabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-invalid={isError}
            onClick={() => {
              if (isDisabled || isReadOnly) return;
              if (!isOpen) {
                setPressedOptionValue(null);
                resetSearch();
              }
              onOpenChange?.(!isOpen);
            }}
            className={cn(
              BASE_TRIGGER,
              size === 'L' ? 'p-4' : 'px-4 py-3',
              triggerStyles,
            )}
            data-error={isError ? 'true' : undefined}
          >
            {/* Leading icon slot */}
            {icon && (
              <span className={cn('flex-shrink-0 flex items-center justify-center size-4', iconColor)}>
                {typeof icon === 'string' ? <Icon name={icon as IconName} size={16} /> : icon}
              </span>
            )}

            {/* Value / Placeholder */}
            <span className={cn('flex-1 min-w-0 font-sans font-normal text-base leading-[20px] truncate', valueColor)}>
              {value || placeholder}
            </span>

            {/* Chevron — down when closed, up when open */}
            <span className={cn('flex-shrink-0  ', iconColor)}>
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </span>
          </button>
        )}

        {/* ── Floating Dropdown Panel ────────────────────────────────────── */}
        {isDropdownMounted && !isDisabled && (
            <div
              className={cn(
                't-dropdown-surface absolute top-full right-0 z-50 mt-1 w-full origin-top',
              )}
              data-origin="top-right"
              data-open={isOpen ? '' : undefined}
              data-closed={!isOpen ? '' : undefined}
              data-starting-style={transitionStatus === 'starting' ? '' : undefined}
              data-ending-style={isDropdownClosing ? '' : undefined}
              aria-hidden={!isOpen}
              inert={!isOpen ? true : undefined}
              ref={surfaceRef}
            >
              <Dropdown
                size={size}
                variant={isSearchableOpen && filteredOptions.length <= 6 ? 'Auto Height' : 'Many Results'}
                className="w-full h-fit"
              >
                {renderedDropdownContent}
              </Dropdown>
            </div>
        )}
      </div>

      {/* HELP TEXT SLOT — CSS GRID TRANSITION */}
      <div
        className="ds-disclosure-text t-stagger"
        data-state={helperText ? 'open' : 'closed'}
        aria-hidden={!helperText}
        ref={helpTextDisclosureRef}
      >
        <div className="ds-disclosure-text__content">
          {isHelpTextMounted && (
            <HelpText state={helpTextContentState} className="mt-1">
              {helpTextContent}
            </HelpText>
          )}
        </div>
      </div>
    </div>
  );
};

SelectInput.displayName = 'SelectInput';

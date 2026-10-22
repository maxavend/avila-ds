import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { HelpText, type HelpTextState } from '../../Feedback/HelpText/HelpText';
import { useHelpTextPresence } from '../../Feedback/HelpText/useHelpTextPresence';
import { Calendar } from '../Calendar/Calendar';
import { Dropdown } from '../Dropdown/Dropdown';
import { cn } from '../../../lib/utils';
import { Icon } from '../../DataDisplay/Icon/Icon';
import type { DateRange } from 'react-day-picker';
import { useDropdownPresence } from '../../../lib/useDropdownPresence';

// ============================================================================
// TYPES
// ============================================================================

export type DatePickerSize = 'L' | 'M';
/** Estado visual. Los valores 'Hover' y 'Pressed' quedan obsoletos: se retiran en 4.0; usa los selectores CSS `hover:`/`active:`. */
export type DatePickerState = 'Default' | 'Hover' | 'Pressed' | 'Error' | 'Success' | 'Read Only' | 'Disabled';

export interface DatePickerProps {
  /** Modo de selección única o por rango. */
  mode?: 'single' | 'range';
  /** Fecha seleccionada en modo único. */
  selectedDate?: Date;
  /** Callback ejecutado cuando cambia la fecha. */
  onDateChange?: (date: Date | undefined) => void;
  /** Rango seleccionado en modo de rango. */
  selectedRange?: { from: Date | undefined; to: Date | undefined };
  /** Callback ejecutado cuando cambia el rango. */
  onRangeChange?: (range: { from: Date | undefined; to: Date | undefined } | undefined) => void;

  /** Tamaño del campo: L estándar o M compacto. */
  size?: DatePickerSize;
  /** Sobrescribe el estado visual de interacción. */
  state?: DatePickerState;
  /** Fuerza visualmente el estado de campo completado. */
  isFilled?: boolean;
  /** Etiqueta principal del campo. */
  label?: string;
  /** Marca el campo como obligatorio y agrega un asterisco a la etiqueta. */
  isMandatory?: boolean;
  /** Icono opcional a la izquierda del campo. */
  icon?: React.ReactNode;
  /** Descriptive help, error, or success text displayed below the input. */
  helpText?: string;
  /** Texto de placeholder. */
  placeholder?: string;
  /** Deshabilita el campo. */
  disabled?: boolean;
  /** Deja el campo en modo solo lectura. */
  readOnly?: boolean;
  /** Clases adicionales para el contenedor. */
  className?: string;
}

// ============================================================================
// STYLES MAPPING
// ============================================================================

const SIZE_STYLES: Record<DatePickerSize, string> = {
  L: 'p-4',
  M: 'px-4 py-3',
};

const STATE_STYLES: Record<DatePickerState, string> = {
  Default: 'bg-neutral-bg-surface-level-2 border-neutral-border-soft',
  Hover: 'bg-neutral-bg-surface-level-2 border-neutral-border-soft shadow-card-overlay-s',
  Pressed: 'bg-neutral-bg-surface-level-2 border-secondary-border-default shadow-card-active-ring',
  Error: 'bg-neutral-bg-surface-level-2 border-danger-border-default text-danger-text-default',
  Success: 'bg-neutral-bg-surface-level-2 border-success-border-default text-success-text-default',
  'Read Only': 'bg-neutral-bg-subtle border-neutral-border-action-disabled',
  Disabled: 'bg-neutral-bg-action-disabled border-transparent cursor-not-allowed',
};

// ============================================================================
// COMPONENT
// ============================================================================

export const DatePicker = React.memo(({
  mode = 'single',
  selectedDate,
  onDateChange,
  selectedRange,
  onRangeChange,
  size = 'L',
  state: forcedState,
  label,
  isMandatory = false,
  icon = <CalendarIcon size={20} />,
  helpText,
  className,
  disabled = false,
  readOnly = false,
  placeholder = 'Selecciona una fecha',
  ref,
}: DatePickerProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [pressedDate, setPressedDate] = React.useState<Date | undefined>();
  const {
    isMounted: isDropdownMounted,
    isClosing: isDropdownClosing,
    transitionStatus,
    surfaceRef,
  } = useDropdownPresence(isOpen);
  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => containerRef.current!);
  const triggerId = React.useId();

  // Close calendar on click outside
  React.useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Compute final interaction state
  let finalState: DatePickerState = forcedState || (isOpen ? 'Pressed' : 'Default');
  if (disabled) finalState = 'Disabled';
  else if (readOnly && finalState !== 'Error' && finalState !== 'Success') finalState = 'Read Only';

  const isDisabled = finalState === 'Disabled';
  const isReadOnly = finalState === 'Read Only';
  const isError = finalState === 'Error';

  // Toggle open
  const handleToggle = () => {
    if (!isDisabled && !isReadOnly) {
      if (!isOpen) setPressedDate(undefined);
      setIsOpen((prev) => !prev);
    }
  };

  // Selection — compatible with react-day-picker v9 OnSelectHandler:
  //   onSelect(selected, triggerDate, modifiers, e)
  // We only need the first argument.
  const handleSelect = (_selected: unknown, selectedDay: Date) => {
    if (mode === 'single') {
      onDateChange?.(selectedDay || undefined);
      if (selectedDay) {
        setPressedDate(selectedDay);
        setIsOpen(false);
      }
    } else {
      if (!selectedDay) return;

      const isStartOfNewRange = !selectedRange?.from || (selectedRange?.from && selectedRange?.to);

      if (isStartOfNewRange) {
        onRangeChange?.({ from: selectedDay, to: undefined });
      } else {
        const from = selectedRange.from!;
        if (selectedDay < from) {
          onRangeChange?.({ from: selectedDay, to: undefined });
        } else {
          onRangeChange?.({ from, to: selectedDay });
          setPressedDate(selectedDay);
          setIsOpen(false);
        }
      }
    }
  };

  // Formatted display value
  let displayValue = '';
  if (mode === 'single') {
    displayValue = selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: es }) : '';
  } else {
    const from = selectedRange?.from ? format(selectedRange.from, 'dd/MM/yyyy', { locale: es }) : '';
    const to = selectedRange?.to ? format(selectedRange.to, 'dd/MM/yyyy', { locale: es }) : '';
    displayValue = from ? (to ? `${from} - ${to}` : from) : '';
  }

  // Build Calendar's selected prop
  const calendarSelected =
    mode === 'single'
      ? (selectedDate ?? undefined)
      : selectedRange?.from
        ? ({ from: selectedRange.from, to: selectedRange.to ?? undefined } satisfies DateRange)
        : undefined;

  const helpTextState: HelpTextState = isError ? 'Error' : finalState === 'Success' ? 'Success' : isDisabled ? 'Disabled' : 'Default';
  const helpTextPresence = useHelpTextPresence({
    open: Boolean(helpText),
    children: helpText,
    state: helpTextState,
  });

  return (
    <div ref={containerRef} className={cn('flex flex-col gap-1 w-[320px] items-start relative select-none', className)}>
      {/* LABEL */}
      {label && (
        <label
          htmlFor={triggerId}
          className={cn(
            'flex items-center w-full font-sans font-medium text-base leading-[20px] px-[2px] overflow-hidden',
            isDisabled || isReadOnly
              ? 'text-neutral-text-action-disabled'
              : isError
                ? 'text-danger-text-default'
                : 'text-neutral-text-headline'
          )}
        >
          <span className="truncate">{label}</span>
          {isMandatory && <span className="shrink-0 text-danger-text-default ml-0.5">*</span>}
        </label>
      )}

      {/* INPUT + POPOVER WRAPPER */}
      <div className="relative w-full">
        {/* TRIGGER */}
        <div
          id={triggerId}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? undefined : 0}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (isDisabled || isReadOnly) return;
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
          className={cn(
            't-input flex items-center w-full relative overflow-clip border border-solid rounded-input-default   gap-2 cursor-pointer outline-none focus-visible:shadow-card-active-ring active:shadow-none',
            SIZE_STYLES[size],
            STATE_STYLES[finalState],
            isOpen && !isDisabled && !isReadOnly && 'border-secondary-border-default shadow-card-active-ring',
            !isDisabled && !isReadOnly && !forcedState && !isOpen && 'hover:border-neutral-border-soft hover:shadow-card-overlay-s',
            (finalState === 'Pressed' || finalState === 'Hover') && 'z-20'
          )}
          data-error={isError ? 'true' : undefined}
        >
          {/* Icon */}
          {icon && (
            <div
              className={cn(
                'shrink-0 flex items-center justify-center size-[20px]',
                isDisabled || isReadOnly ? 'text-neutral-text-action-disabled' : 'text-neutral-text-soft'
              )}
            >
              {icon}
            </div>
          )}

          {/* Value / Placeholder */}
          <span
            className={cn(
              'flex-1 min-w-0 font-sans font-normal text-base leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap text-left',
              displayValue
                ? isDisabled
                  ? 'text-neutral-text-action-disabled'
                  : 'text-neutral-text-default'
                : 'text-neutral-text-soft'
            )}
          >
            {displayValue || placeholder}
          </span>

          {/* Clear button */}
          {displayValue && !isDisabled && !isReadOnly && (
            <button
              type="button"
              aria-label="Limpiar selección"
              onClick={(e) => {
                e.stopPropagation();
                if (mode === 'single') onDateChange?.(undefined);
                else onRangeChange?.(undefined);
              }}
              className="shrink-0 flex items-center justify-center size-[20px] text-neutral-text-soft hover:text-neutral-text-default cursor-pointer  border-none bg-transparent outline-none p-0 focus-visible:shadow-card-active-ring rounded-sm"
            >
              <Icon name="X" size={20} />
            </button>
          )}
        </div>

        {/* CALENDAR POPOVER */}
        {isDropdownMounted && !isDisabled && !isReadOnly && (
            <div
              className={cn(
                't-dropdown-surface absolute top-full mt-1 left-0 z-50',
              )}
              data-origin="top-left"
              data-open={isOpen ? '' : undefined}
              data-closed={!isOpen ? '' : undefined}
              data-starting-style={transitionStatus === 'starting' ? '' : undefined}
              data-ending-style={isDropdownClosing ? '' : undefined}
              aria-hidden={!isOpen}
              inert={!isOpen ? true : undefined}
              ref={surfaceRef}
            >
              <Dropdown
                variant="Custom"
                role="dialog"
                aria-label="Selector de fecha"
                className="w-[320px] p-4"
              >
                <Calendar
                  className="w-full"
                  mode={mode}
                  selected={calendarSelected as never}
                  pressedDate={pressedDate}
                  onSelect={handleSelect as never}
                  required={false}
                />
              </Dropdown>
            </div>
        )}
      </div>

      {/* HELP TEXT — CSS GRID TRANSITION */}
      <div
        className="ds-disclosure-text t-stagger"
        data-state={helpText ? 'open' : 'closed'}
        aria-hidden={!helpText}
        ref={helpTextPresence.disclosureRef}
      >
        <div className="ds-disclosure-text__content">
          {helpTextPresence.isMounted && (
            <HelpText state={helpTextPresence.state}>
              {helpTextPresence.children}
            </HelpText>
          )}
        </div>
      </div>
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

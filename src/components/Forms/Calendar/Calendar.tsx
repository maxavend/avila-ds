import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import type { DayButtonProps, DayPickerProps } from 'react-day-picker';
import type { DateRange, OnSelectHandler } from 'react-day-picker';
import { es } from 'date-fns/locale';
import { format, isSameDay, setMonth, setYear } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { CalendarCell, type CalendarCellState } from './CalendarCell/CalendarCell';

// ============================================================================
// TYPES
// ============================================================================

export type CalendarView = 'Day' | 'Month' | 'Year';
type CalendarSelection = Date | DateRange | Date[] | undefined;
type CalendarSelectHandler = OnSelectHandler<CalendarSelection>;
type MonthDirection = -1 | 0 | 1;

export type CalendarProps = DayPickerProps & {
  /** Initial view mode (Default: 'Day'). */
  initialView?: CalendarView;
  /** Day that remains visually pressed while a single-select popup closes. */
  pressedDate?: Date;
};

type CalendarDayButtonContextValue = {
  pressedDate?: Date;
  rangeStart?: Date;
  hoverDate?: Date;
  isSelectingRange: boolean;
  setHoverDate: (date: Date | undefined) => void;
};

type CalendarMonthState = {
  month: Date;
  direction: MonthDirection;
  revision: number;
  yearRevision: number;
  requestKey: string;
};

// ============================================================================
// CONSTANTS
// ============================================================================

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const WEEKDAY_LABELS = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];

const NAV_BUTTON = cn(
  't-control-colors p-3 text-neutral-text-default hover:bg-neutral-bg-subtle rounded-full',
  'cursor-pointer bg-transparent border-none outline-none',
  'focus-visible:ring-2 focus-visible:ring-focus-primary'
);

const HEADER_TITLE = cn(
  'flex items-center font-sans font-bold text-xl leading-[26px]',
  'text-neutral-text-default hover:underline cursor-pointer bg-transparent',
  'border-none outline-none focus-visible:underline capitalize overflow-visible h-full'
);

const CalendarDayButtonContext = React.createContext<CalendarDayButtonContextValue>({
  isSelectingRange: false,
  setHoverDate: () => undefined,
});

// ============================================================================
// HELPERS
// ============================================================================

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

function getMonthKey(date: Date): string {
  return String(date.getFullYear()) + '-' + String(date.getMonth());
}

function getMonthOrdinal(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

function getMonthDirection(previous: Date, next: Date): MonthDirection {
  const previousOrdinal = getMonthOrdinal(previous);
  const nextOrdinal = getMonthOrdinal(next);
  if (nextOrdinal > previousOrdinal) return 1;
  if (nextOrdinal < previousOrdinal) return -1;
  return 0;
}

function getSelectionMonth(selection: unknown): Date | undefined {
  if (selection instanceof Date) return selection;
  if (selection && typeof selection === 'object') {
    const range = selection as { from?: unknown };
    return range.from instanceof Date ? range.from : undefined;
  }
  return undefined;
}

function getInitialMonth(props: CalendarProps): Date {
  const selected = (props as { selected?: unknown }).selected;
  if (selected instanceof Date) return selected;
  if (selected && typeof selected === 'object') {
    const range = selected as { from?: unknown };
    if (range.from instanceof Date) return range.from;
  }
  if (props.month instanceof Date) return props.month;
  return new Date();
}

function getSelectionKey(selection: unknown): string {
  if (selection instanceof Date) return selection.toISOString();
  if (selection && typeof selection === 'object') {
    const range = selection as { from?: unknown; to?: unknown };
    if (range.from instanceof Date) {
      return range.from.toISOString() + '_' + (range.to instanceof Date ? range.to.toISOString() : '');
    }
  }
  return '';
}

function createMonthState(month: Date, requestKey: string): CalendarMonthState {
  return {
    month,
    direction: 0,
    revision: 0,
    yearRevision: 0,
    requestKey,
  };
}

// ============================================================================
// PRIVATE PRESENTATION COMPONENTS
// ============================================================================

const CalendarDigitGroup = ({ value, revision }: { value: string; revision: number }) => {
  const cycle = revision > 0 ? String(revision % 2) : undefined;

  return (
    <span className="t-calendar-digit-group" data-cycle={cycle}>
      {value.split('').map((digit, index) => (
        <span
          key={value + '-' + String(index)}
          className="t-calendar-digit"
          data-index={index}
          style={{ '--calendar-digit-delay': String(Math.min(index * 33, 99)) + 'ms' } as React.CSSProperties}
        >
          {digit}
        </span>
      ))}
    </span>
  );
};

const CalendarDayButton = ({
  day,
  modifiers,
  className: rdpClassName,
  ref: forwardedRef,
  ...restProps
}: DayButtonProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const {
    pressedDate,
    rangeStart,
    hoverDate,
    isSelectingRange,
    setHoverDate,
  } = React.useContext(CalendarDayButtonContext);
  const internalRef = React.useRef<HTMLButtonElement>(null);

  const setButtonRef = React.useCallback((node: HTMLButtonElement | null) => {
    internalRef.current = node;
    assignRef(forwardedRef, node);
  }, [forwardedRef]);

  // Keep the native react-day-picker focus contract for keyboard navigation.
  React.useEffect(() => {
    if (modifiers.focused) {
      internalRef.current?.focus();
    }
  }, [modifiers.focused]);

  let state: CalendarCellState = 'Default';
  let isActive = false;
  let rangePosition: 'start' | 'middle' | 'end' | undefined;
  const isOutside = !!modifiers.outside;
  const isPressed = pressedDate ? isSameDay(day.date, pressedDate) : false;

  if (isOutside) {
    state = 'Disabled';
  } else {
    // 1. Locked range (from react-day-picker modifiers)
    if (modifiers.range_start && modifiers.range_end) {
      isActive = true;
    } else if (modifiers.range_start) {
      rangePosition = 'start';
      isActive = true;
    } else if (modifiers.range_middle) {
      rangePosition = 'middle';
      isActive = true;
    } else if (modifiers.range_end) {
      rangePosition = 'end';
      isActive = true;
    }
    // 2. Hover preview range
    else if (isSelectingRange && rangeStart && hoverDate) {
      const dayTime = day.date.getTime();
      const startTime = rangeStart.getTime();
      const endTime = hoverDate.getTime();

      if (startTime === endTime) {
        if (dayTime === startTime) {
          isActive = true;
        }
      } else {
        const min = Math.min(startTime, endTime);
        const max = Math.max(startTime, endTime);

        if (dayTime >= min && dayTime <= max) {
          isActive = true;
          if (dayTime === min) {
            rangePosition = 'start';
          } else if (dayTime === max) {
            rangePosition = 'end';
          } else {
            rangePosition = 'middle';
          }
        }
      }
    }
    // 3. Single selection
    else if (modifiers.selected) {
      isActive = true;
    }
    // 4. Disabled
    else if (modifiers.disabled) {
      state = 'Disabled';
    }
  }

  // A single-select popup closes immediately after selection. Keep the
  // clicked day neutral instead of flashing the active treatment.
  if (isPressed) {
    isActive = false;
    rangePosition = undefined;
  }

  const todayClass = modifiers.today && !isActive && !isOutside
    ? 'border border-neutral-border-default'
    : '';

  const eventProps: React.HTMLAttributes<HTMLButtonElement> = isOutside
    ? {
        onClick: (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        onPointerDown: (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        onMouseDown: (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        onPointerEnter: (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
        onKeyDown: (event) => {
          event.preventDefault();
          event.stopPropagation();
        },
      }
    : {
        onPointerEnter: (event) => {
          if (isSelectingRange) {
            setHoverDate(day.date);
          }
          restProps.onPointerEnter?.(event);
        },
      };

  const isStartOfWeek = day.date.getDay() === 1;
  const isEndOfWeek = day.date.getDay() === 0;

  return (
    <CalendarCell
      ref={setButtonRef}
      state={state}
      isActive={isActive}
      isPressed={isPressed}
      rangePosition={rangePosition}
      isStartOfWeek={isStartOfWeek}
      isEndOfWeek={isEndOfWeek}
      className={cn(rdpClassName, todayClass)}
      {...restProps}
      {...eventProps}
    >
      {day.date.getDate()}
    </CalendarCell>
  );
};

CalendarDayButton.displayName = 'CalendarDayButton';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Calendar = React.memo(({
  className,
  showOutsideDays = true,
  initialView = 'Day',
  ref,
  ...props
}: CalendarProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const {
    mode,
    pressedDate,
    selected: selectedProp,
    onSelect: onSelectProp,
    autoFocus: autoFocusProp,
    ...dayPickerProps
  } = props as CalendarProps & {
    selected?: unknown;
    onSelect?: unknown;
    autoFocus?: boolean;
  };
  const selected = selectedProp;
  const onSelect = onSelectProp;
  const hasExternalSelected = selected !== undefined;
  const hasExternalOnSelect = typeof onSelect === 'function';
  const effectiveMode = mode ?? 'single';

  // Internal selection is only used when the consumer does not provide one.
  const [internalSelected, setInternalSelected] = React.useState<CalendarSelection>();
  const effectiveSelected = hasExternalSelected ? selected : internalSelected;
  const selectionMonth = getSelectionMonth(effectiveSelected);
  const requestedMonth = selectionMonth;
  const requestedMonthKey = getSelectionKey(effectiveSelected);
  const initialMonth = getInitialMonth(props);

  // Month presence, direction and CSS cycle are one state owner. A guarded
  // render syncs external month/selection changes without an effect restart.
  const [monthState, setMonthState] = React.useState<CalendarMonthState>(() => (
    createMonthState(initialMonth, requestedMonthKey)
  ));

  if (requestedMonthKey && requestedMonthKey !== monthState.requestKey) {
    setMonthState((previous) => {
      if (previous.requestKey === requestedMonthKey) return previous;

      const nextMonth = requestedMonth ?? previous.month;
      const direction = getMonthDirection(previous.month, nextMonth);
      const monthChanged = getMonthKey(previous.month) !== getMonthKey(nextMonth);
      const yearChanged = previous.month.getFullYear() !== nextMonth.getFullYear();

      return {
        month: nextMonth,
        direction: monthChanged ? direction : 0,
        revision: monthChanged ? previous.revision + 1 : previous.revision,
        yearRevision: yearChanged ? previous.yearRevision + 1 : previous.yearRevision,
        requestKey: requestedMonthKey,
      };
    });
  }

  const currentMonth = monthState.month;

  // ── Hover preview state for range selection ────────────────────────
  const [rangeStart, setRangeStart] = React.useState<Date | undefined>();
  const [hoverDate, setHoverDate] = React.useState<Date | undefined>();
  const [isSelectingRange, setIsSelectingRange] = React.useState(false);

  // ── View and focus state ───────────────────────────────────────────
  const [view, setView] = React.useState<CalendarView>(initialView);
  const [viewRevision, setViewRevision] = React.useState(0);
  const [focusDayOnViewChange, setFocusDayOnViewChange] = React.useState(false);
  const pendingViewCellFocus = React.useRef<CalendarView | null>(null);
  const activeViewCellRef = React.useRef<HTMLButtonElement | null>(null);

  const changeView = (nextView: CalendarView) => {
    if (nextView === view) return;
    if (nextView === 'Day') {
      setFocusDayOnViewChange(true);
    } else {
      pendingViewCellFocus.current = nextView;
    }
    setView(nextView);
    setViewRevision((revision) => revision + 1);
  };

  React.useLayoutEffect(() => {
    if (view !== 'Day' && pendingViewCellFocus.current === view) {
      activeViewCellRef.current?.focus();
      pendingViewCellFocus.current = null;
    }
  }, [view, viewRevision]);

  // ── Navigation ────────────────────────────────────────────────────

  const changeMonth = (nextMonth: Date) => {
    setMonthState((previous) => {
      const direction = getMonthDirection(previous.month, nextMonth);
      const monthChanged = getMonthKey(previous.month) !== getMonthKey(nextMonth);
      const yearChanged = previous.month.getFullYear() !== nextMonth.getFullYear();

      if (!monthChanged) return previous;

      return {
        ...previous,
        month: nextMonth,
        direction,
        revision: previous.revision + 1,
        yearRevision: yearChanged ? previous.yearRevision + 1 : previous.yearRevision,
      };
    });
  };

  const goBack = () => {
    if (view === 'Day') changeMonth(setMonth(currentMonth, currentMonth.getMonth() - 1));
    else if (view === 'Month') changeMonth(setYear(currentMonth, currentMonth.getFullYear() - 1));
    else changeMonth(setYear(currentMonth, currentMonth.getFullYear() - 12));
  };

  const goForward = () => {
    if (view === 'Day') changeMonth(setMonth(currentMonth, currentMonth.getMonth() + 1));
    else if (view === 'Month') changeMonth(setYear(currentMonth, currentMonth.getFullYear() + 1));
    else changeMonth(setYear(currentMonth, currentMonth.getFullYear() + 12));
  };

  // ── Selection ─────────────────────────────────────────────────────

  const handleSelect: CalendarSelectHandler = (selectedRange, selectedDay, activeModifiers, event) => {
    if (activeModifiers.outside) return;

    if (effectiveMode === 'range') {
      const currentRange = effectiveSelected as DateRange | undefined;

      // Starting a new range
      if (
        (currentRange?.from && currentRange?.to)
        || (currentRange?.from && selectedDay < currentRange.from)
      ) {
        setIsSelectingRange(true);
        setRangeStart(selectedDay);
        setHoverDate(selectedDay);

        const newValue: DateRange = { from: selectedDay, to: undefined };
        if (hasExternalOnSelect) {
          (onSelect as CalendarSelectHandler | undefined)?.(newValue, selectedDay, activeModifiers, event);
        } else if (!hasExternalSelected) {
          setInternalSelected(newValue);
        }
        return;
      }

      // Second click - range is completed
      if (currentRange?.from && !currentRange?.to) {
        setIsSelectingRange(false);
        setRangeStart(undefined);
        setHoverDate(undefined);
      }

      // First click
      if (!currentRange?.from) {
        setIsSelectingRange(true);
        setRangeStart(selectedDay);
        setHoverDate(selectedDay);
      }
    }

    if (hasExternalOnSelect) {
      (onSelect as CalendarSelectHandler | undefined)?.(selectedRange, selectedDay, activeModifiers, event);
    } else if (!hasExternalSelected) {
      setInternalSelected(selectedRange);
    }
  };

  // ── Header ────────────────────────────────────────────────────────

  const renderHeader = (): React.ReactNode => {
    const headerCycle = viewRevision > 0 ? String(viewRevision % 2) : undefined;
    const yearStart = Math.floor(currentMonth.getFullYear() / 12) * 12;

    return (
      <div className="t-calendar-header relative overflow-visible w-full h-[44px]">
        <div
          className="t-calendar-header-view flex items-center justify-between w-full h-full"
          data-view={view}
          data-cycle={headerCycle}
        >
          {view === 'Day' && (
            <>
              <button type="button" onClick={goBack} className={NAV_BUTTON} aria-label="Mes anterior">
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => changeView('Month')}
                className={cn(HEADER_TITLE, 'justify-center')}
              >
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <span>{format(currentMonth, 'MMMM', { locale: es })}</span>
                  <CalendarDigitGroup value={format(currentMonth, 'yyyy')} revision={monthState.yearRevision} />
                </span>
              </button>
              <button type="button" onClick={goForward} className={NAV_BUTTON} aria-label="Mes siguiente">
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {view === 'Month' && (
            <>
              <button type="button" onClick={goBack} className={NAV_BUTTON} aria-label="Año anterior">
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={() => changeView('Year')}
                className={cn(HEADER_TITLE, 'justify-center capitalize')}
              >
                {format(currentMonth, 'yyyy')}
              </button>
              <button type="button" onClick={goForward} className={NAV_BUTTON} aria-label="Año siguiente">
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {view === 'Year' && (
            <>
              <button type="button" onClick={goBack} className={NAV_BUTTON} aria-label="12 años anteriores">
                <ChevronLeft size={20} />
              </button>
              <span
                className="t-calendar-header-title font-sans font-bold text-xl leading-[26px] text-neutral-text-default overflow-visible h-full flex items-center"
              >
                {String(yearStart) + ' - ' + String(yearStart + 11)}
              </span>
              <button type="button" onClick={goForward} className={NAV_BUTTON} aria-label="12 años siguientes">
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // ── Content ───────────────────────────────────────────────────────

  const renderDayContent = (): React.ReactNode => {
    const renderedDayPickerProps = {
      ...dayPickerProps,
      mode: effectiveMode as 'single' | 'multiple' | 'range',
      selected: effectiveSelected as CalendarSelection,
      onSelect: handleSelect,
      captionLayout: 'label' as const,
      month: currentMonth,
      onMonthChange: changeMonth,
      autoFocus: Boolean(autoFocusProp || focusDayOnViewChange),
      hideNavigation: true,
      locale: es,
      showOutsideDays,
      fixedWeeks: true,
      className: 'p-0 border-none m-0',
    } as unknown as DayPickerProps;

    return (
      <div className="w-full">
        <div className="flex w-full h-[20px] mb-4" aria-hidden="true">
          {WEEKDAY_LABELS.map((label) => (
            <span key={label} className="flex-1 text-center font-sans font-medium text-base text-neutral-text-default">
              {label}
            </span>
          ))}
        </div>

        <div
          className="t-calendar-month relative w-full h-[236px] overflow-visible"
          data-direction={monthState.direction > 0 ? 'forward' : monthState.direction < 0 ? 'backward' : undefined}
          data-cycle={monthState.revision > 0 ? String(monthState.revision % 2) : undefined}
          data-month={getMonthKey(currentMonth)}
        >
          <section className="t-calendar-month-page w-full h-full">
            <CalendarDayButtonContext.Provider value={{
              pressedDate,
              rangeStart,
              hoverDate,
              isSelectingRange,
              setHoverDate,
            }}>
              <DayPicker
                {...renderedDayPickerProps}
                components={{
                  ...(dayPickerProps.components ?? {}),
                  DayButton: CalendarDayButton,
                }}
                classNames={{
                  months: 'flex flex-col space-y-4',
                  month: 'space-y-4',
                  month_caption: 'hidden',
                  month_grid: 'w-full flex flex-col',
                  weekdays: 'hidden',
                  weekday: 'hidden',
                  weeks: 'flex flex-col gap-1',
                  week: 'flex w-full',
                  day: 'p-0 flex-1 flex items-center justify-center w-full min-w-0 bg-transparent border-none',
                  selected: 'bg-transparent!',
                  range_start: 'bg-transparent!',
                  range_middle: 'bg-transparent!',
                  range_end: 'bg-transparent!',
                  today: 'bg-transparent!',
                  outside: 'bg-transparent!',
                  disabled: 'bg-transparent!',
                  hidden: 'invisible',
                  ...dayPickerProps.classNames,
                }}
              />
            </CalendarDayButtonContext.Provider>
          </section>
        </div>
      </div>
    );
  };

  const renderMonthContent = (): React.ReactNode => (
    <div className="grid grid-cols-3 gap-1 w-full h-[276px]">
      {MONTH_LABELS.map((label, index) => (
        <div key={label} className="flex items-center justify-center">
          <CalendarCell
            ref={index === currentMonth.getMonth() ? activeViewCellRef : undefined}
            isActive={index === currentMonth.getMonth()}
            state="Default"
            onClick={() => {
              changeMonth(setMonth(currentMonth, index));
              changeView('Day');
            }}
            className="w-full h-full capitalize"
          >
            {label}
          </CalendarCell>
        </div>
      ))}
    </div>
  );

  const renderYearContent = (): React.ReactNode => {
    const yearStart = Math.floor(currentMonth.getFullYear() / 12) * 12;
    const years = Array.from({ length: 12 }, (_, index) => yearStart + index);

    return (
      <div className="grid grid-cols-3 gap-1 w-full h-[276px]">
        {years.map((year) => (
          <div key={year} className="flex items-center justify-center">
            <CalendarCell
              ref={year === currentMonth.getFullYear() ? activeViewCellRef : undefined}
              isActive={year === currentMonth.getFullYear()}
              state="Default"
              onClick={() => {
                changeMonth(setYear(currentMonth, year));
                changeView('Month');
              }}
              className="w-full h-full"
            >
              {year}
            </CalendarCell>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = (): React.ReactNode => (
    <div
      className="t-calendar-view relative overflow-visible w-full min-h-[276px]"
      data-view={view}
      data-cycle={viewRevision > 0 ? String(viewRevision % 2) : undefined}
    >
      {view === 'Day' && renderDayContent()}
      {view === 'Month' && renderMonthContent()}
      {view === 'Year' && renderYearContent()}
    </div>
  );

  return (
    <div
      ref={ref}
      data-slot="calendar"
      className={cn('flex w-full flex-col gap-4 overflow-visible', className)}
      onPointerLeave={() => {
        if (isSelectingRange) setHoverDate(undefined);
      }}
    >
      {renderHeader()}
      {renderContent()}
    </div>
  );
});

Calendar.displayName = 'Calendar';

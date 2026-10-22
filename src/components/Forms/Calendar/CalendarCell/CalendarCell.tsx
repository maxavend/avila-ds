import * as React from 'react';
import { cn } from '../../../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export type CalendarCellState = 'Default' | 'Static' | 'Hover' | 'Disabled' | 'Start' | 'Between' | 'End';

export interface CalendarCellProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  isActive?: boolean;
  /** Keeps the clicked day neutral while its containing popup exits. */
  isPressed?: boolean;
  state?: CalendarCellState;
  rangePosition?: 'start' | 'middle' | 'end';
  isStartOfWeek?: boolean;
  isEndOfWeek?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const BASE_STYLES = cn(
  't-calendar-cell t-control-colors focus:transition-none focus-visible:transition-none',
  'flex-1 flex items-center justify-center',
  'font-sans font-medium text-base/[20px]',
  'relative   select-none',
  'border-none outline-none py-2'
);

const VARIANT_STYLES: Record<string, string> = {
  'Default-false': cn(
    'bg-neutral-bg-surface-level-2 text-neutral-text-default px-2',
    'rounded-full cursor-pointer',
    'hover:bg-neutral-bg-subtle'
  ),
  'Static-false': cn(
    'bg-neutral-bg-surface-level-2 text-neutral-text-default px-2',
    'rounded-full'
  ),
  'Hover-false': cn(
    'bg-neutral-bg-subtle text-neutral-text-default px-2',
    'rounded-full cursor-pointer'
  ),
  'Disabled-false': cn(
    'bg-neutral-bg-surface-level-2 text-neutral-text-action-disabled px-2',
    'rounded-xl cursor-not-allowed !transition-none'
  ),
  'Default-true': cn(
    'bg-primary-bg-default text-neutral-text-contrast px-2',
    'rounded-full cursor-pointer',
    'hover:bg-primary-bg-action-hover',
    'focus-visible:ring-2 focus-visible:ring-focus-primary focus-visible:ring-offset-1'
  ),
  'Hover-true': cn(
    'bg-primary-bg-action-hover text-neutral-text-contrast px-2',
    'rounded-full cursor-pointer',
    'focus-visible:ring-2 focus-visible:ring-focus-primary focus-visible:ring-offset-1'
  ),
  'Start-true': cn(
    'bg-primary-bg-default text-neutral-text-contrast px-2',
    'rounded-l-full'
  ),
  'Between-true': cn(
    'bg-primary-bg-subtle text-primary-text-default px-[6px]',
    'rounded-none'
  ),
  'End-true': cn(
    'bg-primary-bg-default text-neutral-text-contrast px-2',
    'rounded-r-full'
  ),
};

/** States that render as a <button> per Figma. */
const BUTTON_STATES = new Set(['Default-true', 'Hover-true', 'Hover-false']);

// ============================================================================
// COMPONENT
// ============================================================================

export const CalendarCell = ({
  children,
  isActive = false,
  isPressed = false,
  state = 'Default',
  className,
  ref,
  rangePosition,
  isStartOfWeek = false,
  isEndOfWeek = false,
  ...props
}: CalendarCellProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const variantKey = `${state}-${isActive}`;
  const variantClasses = isPressed
    ? cn(
        'bg-neutral-bg-action-soft-pressed text-neutral-text-default px-2',
        'rounded-full cursor-pointer'
      )
    : VARIANT_STYLES[variantKey] || VARIANT_STYLES['Default-false'];
  const isButton = BUTTON_STATES.has(variantKey) || props.onClick !== undefined;
  const isRange = rangePosition !== undefined;

  const sharedClassName = cn(BASE_STYLES, variantClasses, className);

  const content = (
    <span className="overflow-hidden text-ellipsis whitespace-nowrap text-center w-full">
      {children}
    </span>
  );

  // ── Range decorations (soft background + red semicircles) ──────────
  if (isRange) {
    const rangeClasses = cn(
      't-calendar-cell t-control-colors focus:transition-none focus-visible:transition-none',
      'bg-transparent',
      rangePosition === 'middle' ? 'text-primary-text-default' : 'text-neutral-text-contrast',
      'w-full h-[36px] p-0',
      className,
    );

    const inner = (
      <>
        {/* Soft background covering specific parts depending on range position */}
        {rangePosition === 'start' && (
          <div className="absolute inset-y-0 right-0 left-1/2 bg-primary-bg-subtle pointer-events-none" />
        )}
        {rangePosition === 'end' && (
          <div className="absolute inset-y-0 left-0 right-1/2 bg-primary-bg-subtle pointer-events-none" />
        )}
        {rangePosition === 'middle' && (
          <div className={cn(
            "absolute inset-0 bg-primary-bg-subtle pointer-events-none",
            isStartOfWeek && "rounded-l-container-sm",
            isEndOfWeek && "rounded-r-container-sm"
          )} />
        )}

        {/* Selected date capsule (centered and matching the capsule default shape) */}
        {rangePosition !== 'middle' && (
          <div className="absolute inset-0 rounded-full bg-primary-bg-default group-hover:bg-primary-bg-action-hover  pointer-events-none" />
        )}

        <span className="relative z-10 overflow-hidden text-ellipsis whitespace-nowrap text-center w-full">
          {children}
        </span>
      </>
    );

    if (state === 'Disabled') {
      return (
        <div className={cn('t-calendar-cell relative w-full h-[36px] flex items-center justify-center !transition-none', className)}>
          {inner}
        </div>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'relative w-full h-[36px] p-0 flex items-center justify-center group',
          'font-sans font-medium text-base/[20px]',
          'select-none border-none outline-none focus-visible:ring-2 focus-visible:ring-focus-primary focus-visible:ring-offset-1',
          'cursor-pointer',
          rangeClasses,
        )}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {inner}
      </button>
    );
  }

  // ── Standard rendering ─────────────────────────────────────────────
  if (isButton) {
    return (
      <button
        ref={ref}
        type="button"
        className={cn('cursor-pointer', sharedClassName)}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  return (
    <div ref={ref as React.Ref<HTMLDivElement>} className={sharedClassName} {...props}>
      {content}
    </div>
  );
};

CalendarCell.displayName = 'CalendarCell';

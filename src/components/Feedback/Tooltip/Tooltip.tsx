import * as React from 'react';
import { cn } from '../../../lib/utils';

export type TooltipPosition = 'Top' | 'Bottom' | 'Left' | 'Right';
export type TooltipAlignment = 'Start' | 'Center' | 'End';

let scrollLocked = false;
let pointerPosition: { x: number; y: number } | null = null;
let scrollTrackingStarted = false;
const scrollLockListeners = new Set<() => void>();

function setScrollLocked(locked: boolean) {
  if (scrollLocked === locked) return;
  scrollLocked = locked;
  scrollLockListeners.forEach((listener) => listener());
}

function startScrollTracking() {
  if (scrollTrackingStarted || typeof window === 'undefined') return;
  scrollTrackingStarted = true;

  window.addEventListener('scroll', () => setScrollLocked(true), true);
  window.addEventListener('wheel', (event) => {
    pointerPosition = { x: event.clientX, y: event.clientY };
    setScrollLocked(true);
  }, true);
  window.addEventListener('touchmove', () => setScrollLocked(true), true);
  window.addEventListener('pointermove', (event) => {
    const moved = pointerPosition && (
      pointerPosition.x !== event.clientX || pointerPosition.y !== event.clientY
    );
    pointerPosition = { x: event.clientX, y: event.clientY };
    if (moved) setScrollLocked(false);
  }, true);
  window.addEventListener('focusin', () => setScrollLocked(false), true);
}

function subscribeScrollLock(listener: () => void) {
  startScrollTracking();
  scrollLockListeners.add(listener);
  return () => { scrollLockListeners.delete(listener); };
}

function getScrollLock() {
  return scrollLocked;
}

if (typeof window !== 'undefined') startScrollTracking();

export interface TooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onDrop' | 'onAnimationStart' | 'onAnimationComplete' | 'onAnimationCancel' | 'onAnimationIteration' | 'onAnimationEnd'> {
  position?: TooltipPosition;
  align?: TooltipAlignment;
  title?: string;
  bodyText?: string;
  open?: boolean;
  defaultOpen?: boolean;
}

export const Tooltip = React.memo(({
  position = 'Bottom',
  align = 'End',
  title,
  bodyText,
  open,
  defaultOpen = false,
  className,
  style,
  ref,
  ...props
}: TooltipProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const bgColor = 'var(--color-neutral-bg-opacity-thick, rgba(0, 0, 0, 0.6))';
  const isOpen = open ?? defaultOpen;
  const lockedByScroll = React.useSyncExternalStore(subscribeScrollLock, getScrollLock, () => false);
  const [dismissedByScroll, setDismissedByScroll] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) setDismissedByScroll(false);
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const dismiss = () => setDismissedByScroll(true);
    window.addEventListener('scroll', dismiss, true);
    window.addEventListener('wheel', dismiss, true);
    window.addEventListener('touchmove', dismiss, true);
    return () => {
      window.removeEventListener('scroll', dismiss, true);
      window.removeEventListener('wheel', dismiss, true);
      window.removeEventListener('touchmove', dismiss, true);
    };
  }, [isOpen]);

  const isVisible = isOpen && !dismissedByScroll && !lockedByScroll;

  const arrowClasses = cn(
    "absolute w-0 h-0 border-solid pointer-events-none",
    position === 'Bottom' && "top-0 -translate-y-full border-x-transparent border-t-transparent border-b-[6px] border-x-[8px]",
    position === 'Bottom' && align === 'Start'  && "left-6",
    position === 'Bottom' && align === 'Center' && "left-1/2",
    position === 'Bottom' && align === 'End'    && "right-6",
    position === 'Top' && "bottom-0 translate-y-full border-x-transparent border-b-transparent border-t-[6px] border-x-[8px]",
    position === 'Top' && align === 'Start'  && "left-6",
    position === 'Top' && align === 'Center' && "left-1/2",
    position === 'Top' && align === 'End'    && "right-6",
    position === 'Left' && "right-0 translate-x-full border-y-transparent border-r-transparent border-l-[6px] border-y-[8px]",
    position === 'Left' && align === 'Start'  && "top-2.5",
    position === 'Left' && align === 'Center' && "top-1/2",
    position === 'Left' && align === 'End'    && "bottom-2.5",
    position === 'Right' && "left-0 -translate-x-full border-y-transparent border-l-transparent border-r-[6px] border-y-[8px]",
    position === 'Right' && align === 'Start'  && "top-2.5",
    position === 'Right' && align === 'Center' && "top-1/2",
    position === 'Right' && align === 'End'    && "bottom-2.5"
  );

  const arrowPositionStyle =
    (position === 'Top' || position === 'Bottom') && align === 'Center'
      ? { left: 'calc(50% - 8px)' }
      : (position === 'Left' || position === 'Right') && align === 'Center'
        ? { top: 'calc(50% - 8px)' }
        : undefined;

  const containerClasses = cn(
    "t-tt absolute flex flex-col gap-2 p-3",
    "max-w-[324px] select-text z-50",
    bodyText ? "w-[294px]" : "w-max",
    "text-neutral-text-contrast rounded-container-base shadow-card-overlay-m",

    position === 'Top' && "bottom-full",
    position === 'Top' && align === 'Start'  && "left-[-14px]",
    position === 'Top' && align === 'Center' && "left-1/2",
    position === 'Top' && align === 'End'    && "right-[-14px]",

    position === 'Bottom' && "top-full",
    position === 'Bottom' && align === 'Start'  && "left-[-14px]",
    position === 'Bottom' && align === 'Center' && "left-1/2",
    position === 'Bottom' && align === 'End'    && "right-[-14px]",

    position === 'Left' && "right-full",
    position === 'Left' && align === 'Start'  && "top-[-14px]",
    position === 'Left' && align === 'Center' && "top-1/2",
    position === 'Left' && align === 'End'    && "bottom-[-14px]",

    position === 'Right' && "left-full",
    position === 'Right' && align === 'Start'  && "top-[-14px]",
    position === 'Right' && align === 'Center' && "top-1/2",
    position === 'Right' && align === 'End'    && "bottom-[-14px]",

    className
  );

  return (
    <div
      ref={ref}
      role="tooltip"
      aria-hidden={!isVisible || undefined}
      data-open={isVisible ? '' : undefined}
      data-closed={!isVisible ? '' : undefined}
      data-position={position.toLowerCase()}
      data-align={align.toLowerCase()}
      style={{
        backgroundColor: bgColor,
        ...style,
        visibility: dismissedByScroll || lockedByScroll ? 'hidden' : undefined,
      }}
      className={containerClasses}
      {...props}
    >
      {title && (
        <span data-slot="tooltip-title" className="font-sans font-medium text-ellipsis overflow-hidden whitespace-nowrap text-left">
          {title}
        </span>
      )}
      {bodyText && (
        <span data-slot="tooltip-body" className="font-sans font-regular text-neutral-text-contrast text-left whitespace-pre-wrap">
          {bodyText}
        </span>
      )}
      <div
        aria-hidden="true"
        className={arrowClasses}
        style={{
          ...arrowPositionStyle,
          borderBottomColor: position === 'Bottom' ? bgColor : undefined,
          borderTopColor:    position === 'Top'    ? bgColor : undefined,
          borderLeftColor:   position === 'Left'   ? bgColor : undefined,
          borderRightColor:  position === 'Right'  ? bgColor : undefined,
        }}
      />
    </div>
  );
});

Tooltip.displayName = 'Tooltip';

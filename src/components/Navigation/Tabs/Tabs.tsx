// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { TabsContext } from './TabsContext';
import type { TabsVariant, TabsStyleType } from './TabsContext';

// ============================================================================
// TYPES
// ============================================================================

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /** Variante visual de color */
  variant?: TabsVariant;
  /** Variante estructural */
  styleType?: TabsStyleType;
  /** Valor del tab activo (controlado) */
  value?: string;
  /** Valor por defecto (no controlado) */
  defaultValue?: string;
  /** Callback al cambiar de tab */
  onValueChange?: (value: string) => void;
  /** Contenido (usualmente componentes TabItem) */
  children: React.ReactNode;
}

// ============================================================================
// STYLES
// ============================================================================

const TABS_CONTAINER_STYLES = {
  Underline: 'flex border-b border-neutral-border-subtle w-full overflow-x-auto overflow-y-hidden scrollbar-none',
  Contained: 'flex gap-3 items-center py-1 overflow-x-auto overflow-y-hidden scrollbar-none',
};

const TABS_INDICATOR_STYLES = 'absolute bottom-0 left-0 h-[2px] z-10';

// ============================================================================
// COMPONENT
// ============================================================================

export const Tabs = ({
  variant = 'Primary',
  styleType = 'Underline',
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  ref,
  onKeyDown,
  ...props
}: TabsProps & { ref?: React.Ref<HTMLDivElement> }) => {
  // Mantener un identificador por instancia para conservar el contrato del contexto.
  const tabsId = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState({
    width: 0,
    offset: 0,
    ready: false,
    animate: false,
  });

  // Manejo de estado controlado y no controlado
  const isControlled = value !== undefined;
  const [localValue, setLocalValue] = React.useState(defaultValue || '');

  // El valor activo es el valor controlado o el local
  const activeValue = isControlled ? value : localValue;
  const previousActiveValueRef = React.useRef(activeValue);

  const setRootRef = React.useCallback((node: HTMLDivElement | null) => {
    rootRef.current = node;

    if (typeof ref === 'function') {
      ref(node);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  }, [ref]);

  const measureIndicator = React.useCallback((animate = false) => {
    const root = rootRef.current;
    const activeTab = root?.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]');

    if (!root || !activeTab) {
      setIndicator((current) => (current.ready
        ? { width: 0, offset: 0, ready: false, animate: false }
        : current));
      return;
    }

    const rootRect = root.getBoundingClientRect();
    const activeTabRect = activeTab.getBoundingClientRect();
    const nextWidth = activeTabRect.width;
    // The indicator is an absolutely positioned child of the scrolling root.
    // Convert the viewport measurement back to the root's content coordinate so
    // its position remains stable while the tablist scrolls. `clientLeft`
    // removes the root border, which is outside the absolute containing block.
    const nextOffset = activeTabRect.left - rootRect.left + root.scrollLeft - root.clientLeft;

    setIndicator((current) => {
      const geometryChanged = current.width !== nextWidth || current.offset !== nextOffset;
      if (!geometryChanged && current.ready) {
        return current;
      }

      return {
        width: nextWidth,
        offset: nextOffset,
        ready: true,
        // Selection changes animate. Scroll, resize, font and child-content
        // measurements update the geometry immediately.
        animate: geometryChanged && animate,
      };
    });
  }, []);

  React.useLayoutEffect(() => {
    // La geometría medida es necesaria para que el indicador se coloque antes del primer paint.
    const selectionChanged = previousActiveValueRef.current !== activeValue;
    previousActiveValueRef.current = activeValue;
    measureIndicator(selectionChanged);
  }, [activeValue, children, measureIndicator, styleType, variant]);

  React.useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;
    const observedElements = new Set<HTMLElement>();
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? undefined
      : new ResizeObserver(() => {
          if (disposed) return;
          measureIndicator(false);
        });

    const observeTabs = () => {
      if (disposed) return;
      const nextElements = new Set<HTMLElement>([
        root,
        ...root.querySelectorAll<HTMLElement>('[role="tab"]'),
        ...root.querySelectorAll<HTMLElement>('.t-tabs-tab-label'),
      ]);

      observedElements.forEach((element) => {
        if (!nextElements.has(element)) {
          resizeObserver?.unobserve(element);
          observedElements.delete(element);
        }
      });
      nextElements.forEach((element) => {
        if (!observedElements.has(element)) {
          resizeObserver?.observe(element);
          observedElements.add(element);
        }
      });
    };

    observeTabs();

    // A tab can be replaced after a data/font update. Keep the observer set in
    // sync with the relevant children instead of relying on the root size alone.
    const mutationObserver = typeof MutationObserver === 'undefined'
      ? undefined
      : new MutationObserver(() => {
          if (disposed) return;
          observeTabs();
          measureIndicator(false);
        });
    mutationObserver?.observe(root, { childList: true, subtree: true });

    const handleScroll = () => measureIndicator(false);
    root.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
      observedElements.clear();
      root.removeEventListener('scroll', handleScroll);
    };
  }, [measureIndicator]);

  // Callback para cambiar de pestaña
  const handleValueChange = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setLocalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  // Valor provisto por el contexto
  const contextValue = React.useMemo(
    () => ({
      value: activeValue,
      variant,
      styleType,
      tabsId,
      onValueChange: handleValueChange,
    }),
    [activeValue, variant, styleType, tabsId, handleValueChange]
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      const tabs = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')
      );
      const currentIndex = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (currentIndex < 0 || tabs.length === 0) return;

      let nextIndex: number | undefined;
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
      if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = tabs.length - 1;
      if (nextIndex === undefined) return;

      event.preventDefault();
      tabs[nextIndex]?.focus();
      tabs[nextIndex]?.click();
    },
    [onKeyDown]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div
        {...props}
        ref={setRootRef}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={cn(
          TABS_CONTAINER_STYLES[styleType],
          'relative',
          className
        )}
      >
        {styleType === 'Underline' && (
          <div
            aria-hidden="true"
            data-ready={indicator.ready ? 'true' : 'false'}
            data-animate={indicator.animate ? 'true' : 'false'}
            className={cn(
              't-tabs-indicator pointer-events-none',
              TABS_INDICATOR_STYLES,
              variant === 'Primary' ? 'bg-primary-border-default' : 'bg-secondary-border-default',
            )}
            style={{
              width: `${indicator.width}px`,
              transform: `translateX(${indicator.offset}px)`,
            }}
          />
        )}
        {children}
      </div>
    </TabsContext.Provider>
  );
};

Tabs.displayName = 'Tabs';

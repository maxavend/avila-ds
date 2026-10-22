import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { cn } from '../../../lib/utils';
import { BottomNavbarTab } from './Atoms/BottomNavbarTab';

// === TYPES ===

export interface BottomNavbarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface BottomNavbarProps {
  items: BottomNavbarItem[];
  activeId?: string;
  defaultActiveId?: string;
  onSelect?: (id: string) => void;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

// === COMPONENT ===

/**
 * Bottom Navigation Bar — variante flotante (glassmorphism).
 */
export const BottomNavbar = ({
  items,
  activeId,
  defaultActiveId,
  onSelect,
  className,
  ref,
}: BottomNavbarProps) => {
  const [internalActiveId, setInternalActiveId] = useState(
    defaultActiveId ?? items[0]?.id,
  );
  
  const currentActiveId = activeId !== undefined ? activeId : internalActiveId;
  const itemIds = items.map((item) => item.id).join('|');
  const navRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicatorX, setIndicatorX] = useState<number | null>(null);

  const updateIndicator = useCallback(() => {
    const nav = navRef.current;
    const activeTab = currentActiveId ? tabRefs.current[currentActiveId] : null;

    if (!nav || !activeTab) {
      setIndicatorX(null);
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    setIndicatorX(tabRect.left - navRect.left + tabRect.width / 2 - 26);
  }, [currentActiveId]);

  useLayoutEffect(() => {
    updateIndicator();

    const nav = navRef.current;
    if (!nav) return undefined;

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(updateIndicator)
      : null;

    observer?.observe(nav);
    window.addEventListener('resize', updateIndicator);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updateIndicator);
    };
  }, [updateIndicator, itemIds]);

  const handleSelect = (id: string) => {
    if (activeId === undefined) {
      setInternalActiveId(id);
    }
    onSelect?.(id);
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col isolate items-start px-4 relative w-full mx-auto z-50 overflow-visible',
        className,
      )}
    >
      <nav
        ref={navRef}
        className="backdrop-blur-dense bg-neutral-bg-transparency-dense shadow-navbar flex items-center justify-center gap-0 px-3 rounded-container-full shrink-0 w-full h-[74px] relative z-[2] overflow-visible"
        role="tablist"
        aria-label="Navegación principal"
      >
        <div
          aria-hidden="true"
          className="t-bottom-navbar-indicator absolute top-[11px] left-0 size-[52px] bg-primary-bg-default rounded-full z-0 pointer-events-none"
          style={{
            opacity: indicatorX === null ? 0 : 1,
            transform: `translate3d(${indicatorX ?? 0}px, -50%, 0)`,
          }}
        />
        {items.map((item) => (
          <BottomNavbarTab
            key={item.id}
            ref={(element) => {
              tabRefs.current[item.id] = element;
            }}
            label={item.label}
            icon={item.icon}
            isActive={currentActiveId === item.id}
            onClick={() => handleSelect(item.id)}
          />
        ))}
      </nav>
    </div>
  );
};

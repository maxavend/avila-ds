import { type ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// === TYPES ===

export interface BottomNavbarTabProps {
  label: string;
  icon: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  layoutId?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

// === STYLES ===

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// === COMPONENT ===

/**
 * Átomo individual de la barra de navegación inferior.
 */
export const BottomNavbarTab = ({
  label,
  icon,
  isActive = false,
  onClick,
  className,
  ref,
}: BottomNavbarTabProps) => {
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        'relative z-10 flex flex-col items-center justify-end flex-1 max-w-[68px] min-w-0 outline-none cursor-pointer px-1 pb-[8px] h-[58px] overflow-visible',
        className,
      )}
    >
      {/* Contenedor del Icono */}
      <div
        className={cn(
          't-bottom-navbar-tab-icon absolute left-1/2 top-[18px] -translate-x-1/2 -translate-y-1/2 size-5 flex items-center justify-center shrink-0 z-10',
          isActive ? 'text-neutral-text-contrast' : 'text-neutral-text-soft',
        )}
        data-active={isActive ? 'true' : 'false'}
      >
        <div className="size-5 flex items-center justify-center">{icon}</div>
      </div>

      {/* Label */}
      <span
        className={cn(
          't-bottom-navbar-tab-label relative z-10 text-xs/[14px] font-sans font-medium text-center truncate w-full',
          isActive ? 'text-primary-text-default font-semibold' : 'text-neutral-text-soft',
        )}
      >
        {label}
      </span>

      {isActive && <span className="sr-only">(Seleccionado)</span>}
    </button>
  );
};

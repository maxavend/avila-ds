import * as React from 'react';
import { cn } from '../../../../lib/utils';
import { Icon } from '../../../DataDisplay/Icon/Icon';

export interface BreadcrumbItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Texto a mostrar en el item */
  label: string;
  /** Indica si el item es el actual/activo */
  isActive?: boolean;
  /** Indica si es el último item para ocultar el separador */
  isLast?: boolean;
  /** Soporte para iconos a la izquierda (según Figma) */
  leftIcon?: React.ReactNode;
}

/**
 * BreadcrumbItem — Átomo individual para la navegación de migas de pan.
 * Maneja estados activos/inactivos y la visualización del separador.
 */
export const BreadcrumbItem = ({
  label,
  isActive = false,
  isLast = false,
  leftIcon,
  className,
  ...props
}: BreadcrumbItemProps) => {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <a
        className={cn(
          "t-control-colors flex items-center gap-2 no-underline  ",
          "font-medium text-base/[20px]",
          isActive 
            ? "text-primary-text-default cursor-default pointer-events-none" 
            : "text-neutral-text-soft hover:text-neutral-text-default cursor-pointer",
          className
        )}
        {...props}
      >
        {leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span className="truncate max-w-[160px]">{label}</span>
      </a>
      
      {!isLast && (
        <Icon 
          name="ChevronRight" 
          size={20} 
          className="text-neutral-text-soft shrink-0" 
        />
      )}
    </div>
  );
};

BreadcrumbItem.displayName = 'BreadcrumbItem';

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { BreadcrumbItem, type BreadcrumbItemProps } from './Atoms/BreadcrumbItem';

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /** Colección de items a mostrar */
  items: Array<Omit<BreadcrumbItemProps, 'isLast'>>;
}

/**
 * Breadcrumb — Componente de navegación que indica la ubicación del usuario en la jerarquía.
 * Construido a partir de átomos de BreadcrumbItem.
 */
export const Breadcrumb = ({
  items = [],
  className,
  ...props
}: BreadcrumbProps) => {
  if (items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-2 p-3 w-full bg-transparent",
        className
      )}
      {...props}
    >
      {items.map((item, index) => (
        <BreadcrumbItem
          key={`${item.label}-${index}`}
          {...item}
          isLast={index === items.length - 1}
        />
      ))}
    </nav>
  );
};

Breadcrumb.displayName = 'Breadcrumb';

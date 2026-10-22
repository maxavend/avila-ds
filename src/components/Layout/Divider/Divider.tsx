import * as React from 'react';
import { cn } from '../../../lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

export type DividerPosition = 'Horizontal' | 'Vertical';

/**
 * Separador visual semántico para layouts horizontales o secciones contiguas.
 * Puede mostrar una etiqueta de texto centrada que interrumpe la línea.
 * No se usa como elemento decorativo; para espacios en blanco, usa tokens de espaciado.
 */
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Orientación de la línea separadora. */
  position?: DividerPosition;
  /**
   * Etiqueta opcional centrada en la línea. Cuando se informa, la línea se
   * divide visualmente alrededor del texto; si se omite, se muestra una línea simple.
   */
  text?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Divider = React.memo(({
  position = 'Horizontal',
  text,
  className,
  ref,
  ...props
}: DividerProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const isVertical = position === 'Vertical';

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={isVertical ? 'vertical' : 'horizontal'}
      className={cn(
        'flex items-center',
        isVertical ? 'flex-col w-px self-stretch' : 'flex-row w-full',
        className
      )}
      {...props}
    >
      {/* First line segment */}
      <span
        className={cn(
          'bg-neutral-bg-soft flex-1',
          isVertical ? 'w-px min-h-px' : 'h-px min-w-px'
        )}
      />

      {/* Optional centered label — clips the line with a matching background */}
      {text && (
        <span
          className={cn(
            'shrink-0 px-1',
            'bg-neutral-bg-surface-level-2',
            'font-sans font-normal text-xs leading-[14px]',
            'text-neutral-text-soft whitespace-nowrap',
          )}
        >
          {text}
        </span>
      )}

      {/* Second line segment */}
      <span
        className={cn(
          'bg-neutral-bg-soft flex-1',
          isVertical ? 'w-px min-h-px' : 'h-px min-w-px'
        )}
      />
    </div>
  );
});

Divider.displayName = 'Divider';

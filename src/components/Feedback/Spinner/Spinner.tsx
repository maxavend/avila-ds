import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type SpinnerColor = 'Primary' | 'Secondary' | 'Neutral' | 'White';
export type SpinnerSize = 'XL' | 'L' | 'M' | 'S';

export interface SpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
  /** Color semántico del spinner */
  color?: SpinnerColor;
  /** Tamaño predefinido del spinner */
  size?: SpinnerSize;
}

const COLOR_STYLES: Record<SpinnerColor, string> = {
  Primary: 'text-primary-bg-default',
  Secondary: 'text-secondary-bg-default',
  Neutral: 'text-neutral-text-soft',
  White: 'text-neutral-text-contrast',
};

const SIZE_VALUES: Record<SpinnerSize, number> = {
  XL: 40,
  L: 32,
  M: 24,
  S: 16,
};

/**
 * Componente Spinner — Indicador de carga animado.
 * Utiliza Lucide Loader2 con animación de rotación estándar.
 */
export const Spinner = React.memo(({
  color = 'Primary',
  size = 'M',
  className,
  ref,
  ...props
}: SpinnerProps & { ref?: React.Ref<SVGSVGElement> }) => {
  return (
    <Loader2
      ref={ref}
      size={SIZE_VALUES[size]}
      className={cn(
        't-spinner shrink-0',
        COLOR_STYLES[color],
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
});

Spinner.displayName = 'Spinner';

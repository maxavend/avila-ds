import * as React from 'react';
import { cn } from '../../../lib/utils';

/**
 * Rol tipográfico: define tamaño, interlineado y peso con un token `text-<rol>`.
 * Mantén la lista sincronizada con `TEXT_ROLES` de `lib/utils`.
 */
export type TextVariant =
  | 'display'
  | 'heading-lg'
  | 'heading-md'
  | 'label'
  | 'label-sm'
  | 'body'
  | 'body-sm'
  | 'caption';

/** Color semántico del texto. `inherit` conserva el color del contenedor. */
export type TextTone =
  | 'headline'
  | 'default'
  | 'soft'
  | 'contrast'
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'inherit';

/** Peso que reemplaza el del rol cuando la jerarquía lo requiere. */
export type TextWeight = 'regular' | 'medium' | 'bold';

/** Props del componente Text. */
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Rol tipográfico. */
  variant?: TextVariant;
  /** Elemento raíz. Por defecto depende del rol: `h2` para display y heading-lg, `h3` para heading-md, `span` para label y `p` para el resto. */
  as?: React.ElementType;
  /** Color semántico. Por defecto, `headline` en títulos y `default` en el resto. */
  tone?: TextTone;
  /** Reemplaza el peso del rol. */
  weight?: TextWeight;
  /** Corta el texto con elipsis: `true` en una línea, un número para limitar líneas. */
  truncate?: boolean | number;
}

const VARIANT_STYLES: Record<TextVariant, string> = {
  display: 'text-display',
  'heading-lg': 'text-heading-lg',
  'heading-md': 'text-heading-md',
  label: 'text-label',
  'label-sm': 'text-label-sm',
  body: 'text-body',
  'body-sm': 'text-body-sm',
  caption: 'text-caption',
};

const DEFAULT_ELEMENT: Record<TextVariant, React.ElementType> = {
  display: 'h2',
  'heading-lg': 'h2',
  'heading-md': 'h3',
  label: 'span',
  'label-sm': 'span',
  body: 'p',
  'body-sm': 'p',
  caption: 'p',
};

const HEADING_VARIANTS = new Set<TextVariant>(['display', 'heading-lg', 'heading-md']);

const TONE_STYLES: Record<TextTone, string | undefined> = {
  headline: 'text-neutral-text-headline',
  default: 'text-neutral-text-default',
  soft: 'text-neutral-text-soft',
  contrast: 'text-neutral-text-contrast',
  primary: 'text-primary-text-default',
  info: 'text-info-text-default',
  success: 'text-success-text-default',
  warning: 'text-warning-text-default',
  danger: 'text-danger-text-default',
  inherit: undefined,
};

// `font-normal` en vez de `font-regular`: twMerge lee `font-regular` como familia
// y eliminaría `font-sans`.
const WEIGHT_STYLES: Record<TextWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  bold: 'font-bold',
};

/**
 * Texto con un rol tipográfico del sistema. Reemplaza combinaciones sueltas como
 * `text-base/[20px] font-medium` por un rol con nombre, color semántico y
 * elemento semántico por defecto.
 */
export const Text = ({
  variant = 'body',
  as,
  tone,
  weight,
  truncate = false,
  className,
  style,
  children,
  ref,
  ...props
}: TextProps & { ref?: React.Ref<HTMLElement> }) => {
  const Component = as ?? DEFAULT_ELEMENT[variant];
  const resolvedTone = tone ?? (HEADING_VARIANTS.has(variant) ? 'headline' : 'default');
  const lines = typeof truncate === 'number' && truncate > 1 ? truncate : undefined;

  return (
    <Component
      ref={ref}
      className={cn(
        'm-0 font-sans',
        VARIANT_STYLES[variant],
        TONE_STYLES[resolvedTone],
        weight && WEIGHT_STYLES[weight],
        truncate === true || truncate === 1 ? 'truncate' : undefined,
        lines && 'line-clamp-(--text-lines)',
        className,
      )}
      style={lines ? { '--text-lines': lines, ...style } as React.CSSProperties : style}
      {...props}
    >
      {children}
    </Component>
  );
};

Text.displayName = 'Text';

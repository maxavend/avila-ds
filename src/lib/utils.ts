import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Roles tipográficos de `design-system-tailwind.css`, expuestos como utilidades `text-<rol>`. */
export const TEXT_ROLES = [
  'display',
  'heading-lg',
  'heading-md',
  'label',
  'label-sm',
  'body',
  'body-sm',
  'caption',
] as const;

// Sin esta extensión, twMerge lee `text-heading-lg` como color de texto y lo
// descarta al combinarlo con `text-neutral-text-*`.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [...TEXT_ROLES] }],
    },
  },
});

/**
 * Utilidad para combinar clases de Tailwind y resolver clases condicionales.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

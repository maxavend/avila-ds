import * as React from 'react';
import type * as LucideIcons from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';
import { ICON_REGISTRY } from './icon-registry';

/**
 * Nombres de iconos válidos de la biblioteca lucide-react.
 */
export type IconName = keyof typeof LucideIcons;

export interface IconProps extends LucideProps {
  /**
   * Nombre del icono de lucide-react que se renderiza.
   * @example 'ArrowRight', 'Check', 'Info'
   */
  name: IconName;
}

type IconLookup = (name: string) => LucideIcon | null;

// Resolución de nombres fuera del registro, disponible tras la primera carga
// diferida; desde entonces cualquier nombre se resuelve sin espera.
let lookupIcon: IconLookup | undefined;
let lookupRequest: Promise<void> | undefined;

const isLucideIcon = (value: unknown): value is LucideIcon =>
  typeof value === 'object' && value !== null && '$$typeof' in value;

/** `ArrowRightIcon` o `LucideArrowRight` → `ArrowRight`. */
const stripAffixes = (name: string) => name.replace(/^Lucide(?=[A-Z])/, '').replace(/(?<=.)Icon$/, '');

async function createLookup(): Promise<IconLookup> {
  // El build CJS es un único archivo sin code splitting: resuelve desde el paquete completo.
  if (import.meta.env.MODE === 'avila-cjs') {
    const lucide = await import('lucide-react');
    return (name) => {
      const icon: unknown = Reflect.get(lucide, name);
      return isLucideIcon(icon) ? icon : null;
    };
  }

  // El índice canónico es un módulo distinto del barrel que importa el registro,
  // así el bundler lo separa en un chunk diferido en lugar de incluir lucide
  // completo en la carga inicial.
  const [icons, { ICON_ALIASES }] = await Promise.all([
    // @ts-expect-error lucide no publica tipos para su índice interno de iconos.
    import('lucide-react/dist/esm/icons/index.mjs') as Promise<Readonly<Partial<Record<string, LucideIcon>>>>,
    import('./icon-aliases'),
  ]);
  return (name) => {
    const base = stripAffixes(name);
    const canonical = ICON_ALIASES[base] ?? base;
    return icons[canonical] ?? null;
  };
}

function loadLookup() {
  lookupRequest ??= createLookup().then(
    (lookup) => { lookupIcon = lookup; },
    () => { lookupIcon = () => null; },
  );
  return lookupRequest;
}

/** Icono de lucide para `name`, `null` si no existe o `undefined` mientras la carga diferida no termina. */
function resolveIcon(name: string): LucideIcon | null | undefined {
  return ICON_REGISTRY[name] ?? lookupIcon?.(name);
}

/**
 * Componente de icono centralizado del Ávila Design System.
 * Envuelve lucide-react para usar iconos de forma consistente mediante nombres.
 *
 * Los iconos que usa la propia librería se incluyen de forma estática. El primer
 * nombre fuera del registro carga el resto de lucide en un chunk diferido:
 * mientras llega, un SVG vacío del mismo tamaño reserva el espacio.
 */
export const Icon = React.memo(({
  name,
  color = 'currentColor',
  size = 24,
  strokeWidth = 2,
  ref,
  ...props
}: IconProps & { ref?: React.Ref<SVGSVGElement> }) => {
  const [, refresh] = React.useReducer((count: number) => count + 1, 0);
  const LucideIcon = resolveIcon(name);
  const isPending = LucideIcon === undefined;

  React.useEffect(() => {
    if (!isPending) return;
    let active = true;
    void loadLookup().then(() => {
      if (active) refresh();
    });
    return () => {
      active = false;
    };
  }, [isPending]);

  if (LucideIcon === null) {
    if (import.meta.env?.DEV) {
      console.warn(`[Icon] Icon "${name}" not found in lucide-react.`);
    }
    return null;
  }

  if (!LucideIcon) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        aria-hidden="true"
        className={props.className}
        style={props.style}
      />
    );
  }

  return (
    <LucideIcon
      ref={ref}
      color={color}
      size={size}
      strokeWidth={strokeWidth}
      {...props}
    />
  );
});

Icon.displayName = 'Icon';

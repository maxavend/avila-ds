// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Icon, type IconName } from '../../DataDisplay/Icon/Icon';
import { Spinner } from '../../Feedback/Spinner/Spinner';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Variantes que definen la jerarquía visual y la intención de la acción.
 *
 * `Primary` es la opción recomendada para la acción principal. `Destructive` está
 * reservada para acciones destructivas o potencialmente irreversibles.
 */
export type ButtonVariant = 'Primary' | 'Secondary' | 'Tertiary' | 'Destructive';

/**
 * Tamaños disponibles para el botón.
 *
 * `L`, `M` y `S` representan alturas nominales de 52px, 44px y 32px,
 * respectivamente.
 */
export type ButtonSize = 'L' | 'M' | 'S';

/**
 * Estados que pueden documentarse o representarse en una integración.
 *
 * `Disabled` y `Loading` modifican el comportamiento del botón. `Hover` y
 * `Pressed` son valores descriptivos: asignarlos no fuerza una apariencia.
 * Los estilos de hover y pulsación dependen de los selectores CSS `hover:` y
 * `active:` y de la interacción real del usuario. `Hover` y `Pressed` quedan
 * obsoletos y se retiran en 4.0.
 */
export type ButtonState = 'Default' | 'Hover' | 'Pressed' | 'Disabled' | 'Loading';

/**
 * Props del botón de acción.
 *
 * Extiende los atributos nativos de `button`, por lo que conserva propiedades
 * como `type`, `onClick`, `aria-*` y `className`. El contenido se construye con
 * `label` y los iconos; sin `label`, se renderizan los `children` en su lugar.
 */
export interface ButtonProps extends React.ComponentProps<'button'> {
  /**
   * Variante visual; todas las variantes conservan la semántica de botón.
   * @default 'Primary'
   */
  variant?: ButtonVariant;
  /**
   * Altura nominal y densidad: `L`=52px, `M`=44px, `S`=32px.
   * @default 'L'
   */
  size?: ButtonSize;
  /**
   * `Disabled` y `Loading` bloquean la interacción mediante `disabled` nativo.
   * `Default`, `Hover` y `Pressed` no fuerzan estilos ni anulan las props
   * `disabled` o `loading`.
   * @default 'Default'
   */
  state?: ButtonState;
  /**
   * Texto visible de la acción y nombre accesible, salvo que se defina mediante ARIA.
   * Si se omite, se renderizan los `children` con el mismo truncado.
   */
  label?: string;
  /** Nombre de `Icon` a la izquierda del texto; permanece visible durante la carga. */
  leftIcon?: IconName;
  /** Nombre de `Icon` que se muestra a la derecha del texto; se reemplaza por el spinner durante la carga. */
  rightIcon?: IconName;
  /**
   * Activa la carga, muestra un spinner, establece `aria-busy` y bloquea la
   * interacción. La carga está activa si `loading` es `true` o si
   * `state="Loading"`; `loading={false}` no anula ese estado.
   * El consumidor debe actualizar esta prop al iniciar y finalizar la operación;
   * el botón no gestiona promesas devueltas por `onClick`.
   * @default false
   */
  loading?: boolean;
}

// ============================================================================
// STYLES
// ============================================================================

const HOVER_SHADOW = "hover:shadow-button-interaction";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  Primary: cn(
    "bg-(--color-theme-background-primary) text-(--color-neutral-text-contrast)",
    "hover:bg-(--color-theme-background-hover)",
    "active:bg-(--color-theme-background-pressed)"
  ),
  Secondary: cn(
    "bg-(--color-theme-background-soft) text-(--color-theme-text-primary)",
    `hover:bg-(--color-theme-background-soft) hover:text-(--color-theme-text-strong) ${HOVER_SHADOW}`,
    "active:bg-(--color-theme-background-soft) active:text-(--color-theme-text-strong) active:shadow-none"
  ),
  Tertiary: cn(
    "bg-transparent text-(--color-theme-text-primary) underline shadow-none",
    "hover:text-(--color-theme-text-strong)",
    "active:text-(--color-theme-text-strong) active:shadow-none"
  ),
  Destructive: cn(
    "bg-(--color-red-background-default) text-(--color-neutral-text-contrast)",
    "hover:bg-(--color-red-background-hover)",
    "active:bg-(--color-red-background-pressed)"
  ),
};

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Botón nativo para ejecutar acciones dentro de una interfaz.
 *
 * Mantiene la etiqueta visible mientras carga y combina `disabled`,
 * `state="Disabled"`, `loading` y `state="Loading"` para determinar si el
 * control puede interactuar. Durante la carga establece `aria-busy` en `true`
 * por defecto y reemplaza el icono derecho por un spinner (o lo añade si no
 * había icono). Un `aria-busy` explícito del consumidor sobrescribe ese valor.
 *
 * Como hereda los atributos nativos de `button`, define `type` explícitamente
 * cuando el botón se use dentro de un formulario: `type="submit"` para enviar
 * y `type="button"` para otras acciones. El componente no asigna un `type`
 * predeterminado. Acepta `ref` al elemento `HTMLButtonElement`.
 *
 * @remarks
 * Usa etiquetas breves y orientadas a la acción. Reserva `Primary` para la
 * acción principal del contexto, combina acciones de apoyo con `Secondary` o
 * `Tertiary` y usa `Destructive` solo para acciones destructivas. Para navegación,
 * utiliza un enlace. En operaciones asíncronas, controla `loading` desde el
 * consumidor para comunicar el progreso y evitar interacciones duplicadas.
 *
 * @example
 * ```tsx
 * <Button
 *   type="button"
 *   label="Continuar"
 *   variant="Primary"
 *   onClick={handleContinue}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Button type="submit" label="Guardar cambios" loading={isSaving} />
 * ```
 */
export const Button = React.memo(({
  variant = 'Primary',
  size = 'L',
  state = 'Default',
  label,
  leftIcon,
  rightIcon,
  loading = false,
  className,
  disabled,
  children,
  ref,
  ...props
}: ButtonProps) => {
  const isLoaderActive = loading || state === 'Loading';
  const isDisabled = disabled || state === 'Disabled';
  const isInactive = isDisabled || isLoaderActive;

  const iconSize = size === 'S' ? 16 : 20;

  return (
    <button
      ref={ref}
      disabled={isInactive}
      aria-busy={isLoaderActive}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap overflow-hidden text-ellipsis t-control-colors",
        "font-sans font-medium",
        "rounded-(--radius-button) border-none",
        "gap-2",
        "shadow-none",
        "  ",
        "cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus-primary disabled:transition-none",
        size === 'L' && "h-[52px] px-6 text-base leading-5",
        size === 'M' && "h-11 px-6 text-base leading-5",
        size === 'S' && "h-8 px-4 text-sm leading-4",
        VARIANT_STYLES[variant],
        isInactive && cn(
          "text-(--color-neutral-text-disabled) opacity-100 cursor-not-allowed pointer-events-none border-none shadow-none",
          variant !== 'Tertiary' && "bg-(--color-neutral-background-disabled)"
        ),
        className
      )}
      {...props}
    >
      {leftIcon && (
        <span className="flex-shrink-0 flex items-center justify-center pointer-events-none">
          <Icon name={leftIcon} size={iconSize} />
        </span>
      )}
      <span className="relative z-10 pointer-events-none truncate">{label ?? children}</span>
      {isLoaderActive ? (
        <span className="flex-shrink-0 flex items-center justify-center pointer-events-none">
          <Spinner size={size === 'S' ? 'S' : 'M'} color="Neutral" className="text-current" />
        </span>
      ) : rightIcon ? (
        <span className="flex-shrink-0 flex items-center justify-center pointer-events-none">
          <Icon name={rightIcon} size={iconSize} />
        </span>
      ) : null}
    </button>
  );
});

Button.displayName = 'Button';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Icon, type IconName } from '../Icon/Icon';

export type ChipVariant = 'Solid' | 'Soft';
export type ChipSize = 'L' | 'M' | 'S';
export type ChipColor = 
  | 'Neutral' 
  | 'Primary' 
  | 'Secondary' 
  | 'Accent' 
  | 'Info' 
  | 'Success' 
  | 'Warning' 
  | 'Error' 
  | 'Disabled';

export interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Texto que se muestra dentro del chip. */
  label: string;
  /** Variante visual del chip. */
  variant?: ChipVariant;
  /** Color semántico del chip. */
  color?: ChipColor;
  /** Tamaño del chip. */
  size?: ChipSize;
  /** Icono izquierdo opcional; acepta un nombre de Lucide o un ReactNode. */
  leftIcon?: IconName | React.ReactNode;
  /** Muestra una acción para cerrar el chip. */
  isClosable?: boolean;
  /** Callback ejecutado al hacer clic en la acción de cierre. */
  onClose?: () => void;
}

const SIZE_STYLES: Record<ChipSize, string> = {
  L: "h-7 px-2 py-1 gap-1 text-base leading-[20px] font-medium rounded-container-sm",
  M: "h-6 px-2 py-1 gap-1 text-sm leading-[16px] font-medium rounded-container-sm",
  S: "h-[22px] px-2 py-1 gap-1 text-xs leading-[14px] font-medium rounded-container-sm",
};

const L_ICON_SIZE: Record<ChipSize, number> = {
  L: 16,
  M: 14,
  S: 14,
};

const CLOSE_ICON_SIZE: Record<ChipSize, number> = {
  L: 16,
  M: 16,
  S: 14,
};

const COLOR_STYLES: Record<ChipColor, Record<ChipVariant, string>> = {
  Neutral: {
    Solid: "bg-neutral-bg-default text-neutral-text-contrast",
    Soft: "bg-neutral-bg-subtle text-neutral-text-default",
  },
  Primary: {
    Solid: "bg-primary-bg-default text-neutral-text-contrast",
    Soft: "bg-primary-bg-soft text-primary-text-brand",
  },
  Secondary: {
    Solid: "bg-secondary-bg-default text-neutral-text-contrast",
    Soft: "bg-secondary-bg-soft text-secondary-text-strong",
  },
  Accent: {
    Solid: "bg-accent-bg-default text-neutral-text-contrast",
    Soft: "bg-accent-bg-soft text-accent-text-default",
  },
  Info: {
    Solid: "bg-info-bg-default text-neutral-text-contrast",
    Soft: "bg-info-bg-soft text-info-text-default",
  },
  Success: {
    Solid: "bg-success-bg-default text-neutral-text-contrast",
    Soft: "bg-success-bg-subtle text-success-text-default",
  },
  Warning: {
    Solid: "bg-warning-bg-default text-neutral-text-headline",
    Soft: "bg-warning-bg-soft text-warning-text-default",
  },
  Error: {
    Solid: "bg-danger-bg-soft border border-danger-border-default text-primary-text-default",
    Soft: "bg-neutral-bg-surface-level-2 border border-danger-border-default text-danger-text-default",
  },
  Disabled: {
    Solid: "bg-neutral-bg-action-disabled text-neutral-text-action-disabled",
    Soft: "bg-neutral-bg-action-disabled text-neutral-text-action-disabled opacity-disabled",
  },
};

export const Chip = React.memo(({
  label,
  variant = 'Solid',
  color = 'Neutral',
  size = 'L',
  leftIcon,
  isClosable = false,
  onClose,
  className,
  ref,
  ...props
}: ChipProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const canClose = isClosable;
  // En S el ícono es opcional: los estados publicados de Figma lo usan a 14 px.
  const showLeftIcon = Boolean(leftIcon);

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center  ",
        SIZE_STYLES[size],
        COLOR_STYLES[color][variant],
        className
      )}
      {...props}
    >
      {showLeftIcon && (
        <span className="shrink-0 flex items-center justify-center">
          {leftIcon ? (
            typeof leftIcon === 'string' ? (
              <Icon name={leftIcon as IconName} size={L_ICON_SIZE[size]} />
            ) : (
              leftIcon
            )
          ) : (
            <span className="block" style={{ width: L_ICON_SIZE[size], height: L_ICON_SIZE[size] }} />
          )}
        </span>
      )}
      
      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
        {label}
      </span>

      {canClose && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose?.();
          }}
          className={cn(
            "shrink-0 flex items-center justify-center hover:opacity-70 t-control-opacity p-0",
            "focus:transition-none focus-visible:transition-none",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus-primary rounded-full"
          )}
          aria-label={`Close ${label}`}
        >
          <X size={CLOSE_ICON_SIZE[size]} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
});

Chip.displayName = 'Chip';

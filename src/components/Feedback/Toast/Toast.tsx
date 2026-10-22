import * as React from 'react';
import type { IconName } from '../../DataDisplay/Icon/Icon';
import { cn } from '../../../lib/utils';
import { IconBox } from '../../DataDisplay/IconBox/IconBox';
import type { IconBoxColor } from '../../DataDisplay/IconBox/IconBox';
import { IconButton } from '../../Actions/IconButton/IconButton';

export type ToastColor = 'Neutral' | 'Primary' | 'Secondary' | 'Accent' | 'Info' | 'Success' | 'Warning' | 'Danger';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: ToastColor;
  hasIcon?: boolean;
  isClosable?: boolean;
  mainText?: string;
  supportingText?: string;
  primaryAction?: string;
  secondaryAction?: string;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
}

const COLOR_ICON: Record<ToastColor, IconName> = {
  Neutral: 'Info',
  Primary: 'Info',
  Secondary: 'Star',
  Accent: 'Settings',
  Info: 'Info',
  Success: 'CheckCircle',
  Warning: 'AlertTriangle',
  Danger: 'AlertCircle',
};

// Map Toast color to IconBox color
const COLOR_MAP: Record<ToastColor, IconBoxColor> = {
  Neutral: 'Neutral',
  Primary: 'Primary',
  Secondary: 'Secondary',
  Accent: 'Accent',
  Info: 'Info',
  Success: 'Success',
  Warning: 'Warning',
  Danger: 'Error', // IconBox uses 'Error' for red
};

/**
 * Componente para mensajes breves sobre procesos de la aplicación.
 * Su estructura mantiene estable el layout al mostrar u ocultar el botón de cierre.
 */
export const Toast = ({
  color = 'Neutral',
  hasIcon = true,
  isClosable = true,
  mainText = "Toast message",
  supportingText,
  primaryAction = "Primary action",
  secondaryAction = "Secondary action",
  className,
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  ref,
  ...props
}: ToastProps & { ref?: React.Ref<HTMLDivElement> }) => {
  return (
    <div
      ref={ref}
      className={cn(
        "t-toast bg-neutral-bg-surface-level-2 flex items-start p-4 rounded-container-md shadow-overlay-l",
        "w-full max-w-[499px]", 
        className
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      <div className="flex flex-1 gap-3 items-center">
        {hasIcon && (
          <IconBox
            data-slot="icon-box"
            variant="Component"
            size="M"
            shape="Circle"
            color={COLOR_MAP[color]}
            icon={COLOR_ICON[color]}
            className="shrink-0"
          />
        )}
        
        <div className="flex flex-col flex-1 gap-3">
          {/* Header Row: Contains Title, Description and Close Button in a stable flex structure */}
          <div className="flex justify-between items-start gap-1">
            <div className="flex flex-col gap-1 flex-1">
              {mainText && (
                <h4 className="text-base font-medium text-neutral-text-headline leading-[20px]">
                  {mainText}
                </h4>
              )}
              {supportingText && (
                <p className="text-base font-normal text-neutral-text-default leading-[20px]">
                  {supportingText}
                </p>
              )}
            </div>

            {isClosable && (
              <IconButton
                variant="Tertiary"
                size="S"
                icon="X"
                onClick={onClose}
                aria-label="Close"
                className="-mt-1.5 -mr-1.5 text-neutral-text-soft hover:text-neutral-text-headline"
              />
            )}
          </div>
          
          {(primaryAction || secondaryAction) && (
            <div className="flex items-start justify-end gap-3 text-base leading-[20px] whitespace-nowrap">
              {secondaryAction && (
                <button
                  type="button"
                  onClick={onSecondaryAction}
                  className="font-normal text-neutral-text-default underline decoration-solid decoration-1 underline-offset-4 hover:text-neutral-text-headline  cursor-pointer"
                >
                  {secondaryAction}
                </button>
              )}
              {primaryAction && (
                <button
                  type="button"
                  onClick={onPrimaryAction}
                  className="font-medium text-neutral-text-headline underline decoration-solid decoration-1 underline-offset-4 hover:opacity-80  cursor-pointer"
                >
                  {primaryAction}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Toast.displayName = 'Toast';

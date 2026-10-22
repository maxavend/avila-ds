import * as React from 'react';
import { Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

export type HelpTextState = 'Default' | 'Error' | 'Success' | 'Disabled';

export interface HelpTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Estado visual del texto de ayuda. */
  state?: HelpTextState;
  /** Contenido principal del texto de ayuda. */
  children: React.ReactNode;
  /** Muestra automáticamente el icono asociado al estado. */
  hasIcon?: boolean;
  /** Componente explícito que reemplaza el icono estándar. */
  icon?: React.ReactNode;
}

const STATE_STYLES: Record<HelpTextState, string> = {
  Default: "text-neutral-text-default",
  Error: "text-danger-text-default",
  Success: "text-success-text-default",
  Disabled: "text-neutral-text-action-disabled",
};

export const HelpText = React.memo(({
  state = 'Default',
  children,
  hasIcon = true,
  icon,
  className,
  ref,
  ...props
}: HelpTextProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const renderIcon = () => {
    if (icon) return icon;
    if (!hasIcon) return null;

    const size = 20;
    switch (state) {
      case 'Error':
        return <AlertTriangle size={size} className="shrink-0" />;
      case 'Success':
        return <CheckCircle2 size={size} className="shrink-0" />;
      case 'Default':
      case 'Disabled':
      default:
        return <Info size={size} className="shrink-0" />;
    }
  };

  const renderedIcon = renderIcon();

  return (
    <div 
      ref={ref}
      className={cn(
        "flex items-start gap-2 w-full shrink-0 font-sans font-normal text-base/[20px] py-0",
        STATE_STYLES[state],
        className
      )}
      {...props}
    >
      {renderedIcon && (
        <span className="t-stagger-line t-stagger-line--1 shrink-0">
          {renderedIcon}
        </span>
      )}
      <span className="t-stagger-line t-stagger-line--2 flex-1">
        {children}
      </span>
    </div>
  );
});

HelpText.displayName = 'HelpText';

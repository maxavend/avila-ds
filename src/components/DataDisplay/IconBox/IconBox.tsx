import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Icon, type IconName } from '../Icon/Icon';

export type IconBoxVariant = 'Body' | 'Headline' | 'Component';
export type IconBoxSize = 'S' | 'M' | 'L';
export type IconBoxShape = 'Circle' | 'Square';
export type IconBoxColor = 'Neutral' | 'Primary' | 'Secondary' | 'Accent' | 'Info' | 'Success' | 'Warning' | 'Error';

export interface IconBoxProps extends React.ComponentPropsWithRef<'div'> {
  variant?: IconBoxVariant;
  size?: IconBoxSize;
  shape?: IconBoxShape;
  color?: IconBoxColor;
  /** Icono que se muestra; acepta un nombre de Lucide o un ReactNode personalizado. */
  icon: IconName | React.ReactNode;
}

const COLOR_STYLES: Record<IconBoxColor, string> = {
  Neutral: "bg-neutral-bg-soft text-neutral-text-headline",
  Primary: "bg-primary-bg-soft text-primary-text-default",
  Secondary: "bg-secondary-bg-soft text-secondary-text-default",
  Accent: "bg-accent-bg-soft text-accent-text-default",
  Info: "bg-info-bg-soft text-info-text-default",
  Success: "bg-success-bg-soft text-success-text-default",
  Warning: "bg-warning-bg-soft text-warning-text-default",
  Error: "bg-danger-bg-soft text-danger-text-default",
};

interface Geometry {
  padding: string;
  iconSize: string;
  radius: string;
}

const GEOMETRY_CONFIG: Record<string, Geometry> = {
  // Body Variants (Figma 40001319:9029)
  'Body-S': { padding: "p-[3px]", iconSize: "[&_svg]:size-2", radius: "rounded-container-sm" }, // Total: 14px
  'Body-M': { padding: "p-[3px]", iconSize: "[&_svg]:size-[10px]", radius: "rounded-container-sm" }, // Total: 16px
  'Body-L': { padding: "p-[4px]", iconSize: "[&_svg]:size-3", radius: "rounded-container-sm" }, // Total: 20px
  
  // Headline Variants (Figma 40001319:9029)
  'Headline-S': { padding: "p-[5px]", iconSize: "[&_svg]:size-4", radius: "rounded-container-sm" }, // Total: 26px
  'Headline-M': { padding: "p-[5px]", iconSize: "[&_svg]:size-[18px]", radius: "rounded-container-sm" }, // Total: 28px
  'Headline-L': { padding: "p-[5px]", iconSize: "[&_svg]:size-[18px]", radius: "rounded-container-sm" }, // Fallback as Figma L is missing for Headline
  
  // Component Variants (Figma 40001319:9029)
  'Component-S': { padding: "p-2", iconSize: "[&_svg]:size-4", radius: "rounded-container-sm" }, // Total: 32px
  'Component-M': { padding: "p-2.5", iconSize: "[&_svg]:size-6", radius: "rounded-container-md" }, // Total: 44px
  'Component-L': { padding: "p-3", iconSize: "[&_svg]:size-7", radius: "rounded-container-md" }, // Total: 52px
};

/**
 * Contenedor de icono con geometría mapeada de forma explícita.
 * Mantiene la geometría definida para el componente en Figma (Node 40001319:9029).
 */
export const IconBox = React.memo(({
  variant = 'Body',
  size = 'M',
  shape = 'Square',
  color = 'Neutral',
  icon,
  className,
  ...props
}: IconBoxProps) => {
  const configKey = `${variant}-${size}`;
  const geometry = React.useMemo(() => GEOMETRY_CONFIG[configKey] || GEOMETRY_CONFIG['Body-M'], [configKey]);

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center shrink-0 overflow-hidden",
        COLOR_STYLES[color],
        geometry.padding,
        geometry.iconSize,
        shape === 'Circle' ? 'rounded-container-full' : geometry.radius,
        className
      )}
      {...props}
    >
      {typeof icon === 'string' ? <Icon name={icon as IconName} /> : icon}
    </div>
  );
});

IconBox.displayName = 'IconBox';

// ============================================================================
// IMPORTS
// ============================================================================

import * as React from 'react';
import { User } from 'lucide-react';
import { cn } from '../../../lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export type AvatarSize = 'L' | 'M' | 'S';
export type AvatarFilled = 'Name' | 'Img';

/**
 * Avatar — Átomo visual del Ávila Design System.
 * Soporta iniciales (Name) o imágenes (Img) en tres tamaños fijos.
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tamaño del avatar. L=52px (Sidebar), M=44px, S=32px. */
  size?: AvatarSize;
  /** Tipo de contenido. 'Name' para iniciales, 'Img' para imagen. */
  isFilled?: AvatarFilled;
  /** URL de la imagen (solo si isFilled='Img'). */
  src?: string;
  /** Texto alternativo para la imagen. */
  alt?: string;
  /** Iniciales a mostrar (máx 2 caracteres). Se usa si isFilled='Name'. */
  initials?: string;
  /** Ref del contenedor. */
  ref?: React.Ref<HTMLDivElement>;
}

// ============================================================================
// STYLES
// ============================================================================

const SIZE_STYLES: Record<AvatarSize, string> = {
  L: 'size-[52px]',
  M: 'size-[44px]',
  S: 'size-[32px]',
};

const TEXT_SIZE_STYLES: Record<AvatarSize, string> = {
  L: 'text-2xl',
  M: 'text-xl',
  S: 'text-base',
};

const ICON_SIZE_STYLES: Record<AvatarSize, number> = {
  L: 32,
  M: 24,
  S: 20,
};

// ============================================================================
// COMPONENT
// ============================================================================

export const Avatar = ({
  size = 'L',
  isFilled = 'Name',
  src,
  alt = 'User Avatar',
  initials,
  className,
  ref,
  ...props
}: AvatarProps) => {
  const isImage = isFilled === 'Img' && Boolean(src);
  const isName = isFilled === 'Name' && Boolean(initials);

  return (
    <div
      ref={ref}
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        isImage
          ? 'border-1 border-neutral-border-subtle'
          : 'border-2 border-neutral-border-contrast bg-secondary-bg-soft text-secondary-text-default',
        SIZE_STYLES[size],
        className,
      )}
      {...props}
    >
      {isImage ? (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 size-full object-cover"
        />
      ) : isName ? (
        <span className={cn('select-none font-bold leading-none', TEXT_SIZE_STYLES[size])}>
          {initials}
        </span>
      ) : (
        <User size={ICON_SIZE_STYLES[size]} aria-hidden="true" />
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

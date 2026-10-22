import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Image as ImageIcon } from 'lucide-react';
import { LoadedMedia } from '../Media/LoadedMedia';

export type ImageSize = '4XL' | '3XL' | '2XL' | 'XL' | 'L' | 'M' | 'S' | 'XS';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onDrag' | 'onDragEnd' | 'onDragEnter' | 'onDragExit' | 'onDragLeave' | 'onDragOver' | 'onDragStart' | 'onDrop' | 'onAnimationStart' | 'onAnimationComplete' | 'onAnimationCancel' | 'onAnimationIteration' | 'onAnimationEnd'> {
  /** Variante de tamaño visual según los estándares del DS. */
  size?: ImageSize;
  /** Si es `false`, muestra el placeholder aunque se haya informado `src`. */
  isFilled?: boolean;
  /** Estrategia de ajuste de la imagen. */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * Image — Contenedor estandarizado para imágenes con tamaños definidos,
 * radios semánticos y placeholders automáticos.
 */
export const Image = React.memo(({
  src,
  alt = '',
  size = 'M',
  isFilled = true,
  objectFit = 'cover',
  className,
  onLoad,
  onError,
  ref,
  ...props
}: ImageProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const SIZE_STYLES: Record<ImageSize, string> = {
    'XS': 'size-[22px] rounded-container-sm',
    'S': 'size-[26px] rounded-container-sm',
    'M': 'size-[32px] rounded-container-md',
    'L': 'size-[42px] rounded-container-base',
    'XL': 'size-[52px] rounded-container-base',
    '2XL': 'size-[72px] rounded-container-lg',
    '3XL': 'size-[104px] rounded-container-lg',
    '4XL': 'size-[148px] rounded-container-lg',
  };

  const ICON_SIZES: Record<ImageSize, number> = {
    'XS': 12,
    'S': 14,
    'M': 16,
    'L': 20,
    'XL': 24,
    '2XL': 32,
    '3XL': 48,
    '4XL': 64,
  };

  const { srcSet, sizes, ...imageProps } = props;

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden flex items-center justify-center shrink-0",
        SIZE_STYLES[size],
        className
      )}
    >
      <LoadedMedia
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        enabled={isFilled}
        alt={alt}
        className="absolute inset-0"
        imageClassName={cn(
          "w-full h-full",
          objectFit === 'cover' && "object-cover",
          objectFit === 'contain' && "object-contain",
          objectFit === 'fill' && "object-fill",
          objectFit === 'none' && "object-none",
          objectFit === 'scale-down' && "object-scale-down"
        )}
        imageProps={imageProps}
        placeholder={(
          <div className="flex items-center justify-center w-full h-full bg-neutral-bg-soft text-neutral-text-default opacity-disabled">
            <ImageIcon size={ICON_SIZES[size]} strokeWidth={1.5} aria-hidden="true" />
          </div>
        )}
        onLoad={onLoad}
        onError={onError}
      />
    </div>
  );
});

Image.displayName = 'Image';

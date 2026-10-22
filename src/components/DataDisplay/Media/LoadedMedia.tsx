import * as React from 'react';
import { cn } from '../../../lib/utils';
import { waitForCssMotion } from '../../../lib/waitForCssMotion';

type MediaRequest = {
  src: string;
  srcSet?: string;
  sizes?: string;
};

type MediaLayer = {
  id: number;
  request: MediaRequest;
  status: 'loading' | 'loaded';
  settled: boolean;
};

type MediaState = {
  nextId: number;
  request: MediaRequest | null;
  layers: MediaLayer[];
};

type ManagedImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'srcSet' | 'sizes' | 'alt' | 'className' | 'style' | 'onLoad' | 'onError'
> & {
  style?: React.CSSProperties;
  className?: string;
};

export interface LoadedMediaProps {
  /** Request identity. A request is replaced when any of these fields changes. */
  src?: string;
  srcSet?: string;
  sizes?: string;
  /** Disables the request and restores the placeholder state. */
  enabled?: boolean;
  alt?: string;
  className?: string;
  imageClassName?: string;
  imageStyle?: React.CSSProperties;
  imageProps?: ManagedImageProps;
  placeholder?: React.ReactNode;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  onError?: React.ReactEventHandler<HTMLImageElement>;
}

function sameRequest(left: MediaRequest | null, right: MediaRequest | null) {
  return left?.src === right?.src
    && left?.srcSet === right?.srcSet
    && left?.sizes === right?.sizes;
}

function acceptsOpacityTransition(animation: Animation) {
  return animation instanceof CSSTransition && animation.transitionProperty === 'opacity';
}

type CallbackFlags = { load: boolean; error: boolean };

function decorativeImageProps(props: ManagedImageProps): ManagedImageProps {
  return Object.fromEntries(
    Object.entries(props).filter(([name]) => !name.startsWith('on')),
  ) as ManagedImageProps;
}

/**
 * Private native image lifecycle shared by Image and Banner.
 *
 * Loaded layers remain in document order until a newer layer has covered them.
 * A pending request can therefore be replaced without removing the last valid
 * pixels, and a loaded layer keeps its current opacity when another request is
 * added above it. No public loading state or animation runtime is introduced.
 */
export function LoadedMedia({
  src,
  srcSet,
  sizes,
  enabled = true,
  alt = '',
  className,
  imageClassName,
  imageStyle,
  imageProps,
  placeholder,
  onLoad,
  onError,
}: LoadedMediaProps) {
  const desiredRequest = enabled && src
    ? { src, srcSet, sizes }
    : null;
  const [state, setState] = React.useState<MediaState>(() => {
    const initialLayer = desiredRequest
      ? { id: 1, request: desiredRequest, status: 'loading' as const, settled: false }
      : null;
    return {
      nextId: initialLayer?.id ?? 0,
      request: desiredRequest,
      layers: initialLayer ? [initialLayer] : [],
    };
  });
  const stateRef = React.useRef(state);
  const layerRefs = React.useRef(new Map<number, HTMLImageElement>());
  const callbackFlags = React.useRef(new Map<number, CallbackFlags>());
  const onLoadRef = React.useRef(onLoad);
  const onErrorRef = React.useRef(onError);

  React.useLayoutEffect(() => {
    stateRef.current = state;
    onLoadRef.current = onLoad;
    onErrorRef.current = onError;
  }, [onError, onLoad, state]);

  // Keep request reconciliation synchronous with the render that receives a
  // new source. Only loaded layers survive a replacement; obsolete loading
  // nodes have no valid pixels to preserve and are safe to discard.
  if (!sameRequest(state.request, desiredRequest)) {
    if (!desiredRequest) {
      setState({ nextId: state.nextId, request: null, layers: [] });
    } else {
      const loadedLayers = state.layers.filter((layer) => layer.status === 'loaded');
      const incoming: MediaLayer = {
        id: state.nextId + 1,
        request: desiredRequest,
        status: 'loading',
        settled: false,
      };
      setState({
        nextId: incoming.id,
        request: desiredRequest,
        layers: [...loadedLayers, incoming],
      });
    }
  }

  const getCallbackFlags = React.useCallback((id: number) => {
    const current = callbackFlags.current.get(id);
    if (current) return current;
    const created = { load: false, error: false };
    callbackFlags.current.set(id, created);
    return created;
  }, []);

  const markLoaded = React.useCallback((layer: MediaLayer, event?: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const current = stateRef.current;
    const currentLayer = current.layers.find((candidate) => candidate.id === layer.id);
    if (!currentLayer || currentLayer.id !== current.layers.at(-1)?.id
      || !sameRequest(current.request, layer.request)) return;

    const flags = getCallbackFlags(layer.id);
    if (event && !flags.load) {
      flags.load = true;
      onLoadRef.current?.(event);
    }
    if (currentLayer.status === 'loaded') return;

    setState((previous) => ({
      ...previous,
      layers: previous.layers.map((candidate) => (
        candidate.id === layer.id
          ? { ...candidate, status: 'loaded', settled: false }
          : candidate
      )),
    }));
  }, [getCallbackFlags]);

  const markError = React.useCallback((layer: MediaLayer, event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const current = stateRef.current;
    const currentLayer = current.layers.find((candidate) => candidate.id === layer.id);
    if (!currentLayer || currentLayer.id !== current.layers.at(-1)?.id
      || !sameRequest(current.request, layer.request)) return;

    const flags = getCallbackFlags(layer.id);
    if (flags.error) return;
    flags.error = true;
    onErrorRef.current?.(event);
    setState((previous) => {
      if (!previous.layers.some((candidate) => candidate.id === layer.id)
        || !sameRequest(previous.request, layer.request)) return previous;
      return {
        ...previous,
        layers: previous.layers.filter((candidate) => candidate.id !== layer.id),
      };
    });
  }, [getCallbackFlags]);

  const settleLayer = React.useCallback((layer: MediaLayer) => {
    setState((previous) => {
      const layerIndex = previous.layers.findIndex((candidate) => candidate.id === layer.id);
      if (layerIndex < 0 || previous.layers[layerIndex].status !== 'loaded') return previous;
      // Once this layer is opaque, every layer beneath it is covered. Layers
      // above it remain so an in-progress newer request can continue without
      // exposing a gap.
      return {
        ...previous,
        layers: previous.layers
          .slice(layerIndex)
          .map((candidate) => candidate.id === layer.id ? { ...candidate, settled: true } : candidate),
      };
    });
  }, []);

  React.useEffect(() => {
    const loading = state.layers.find((layer) => layer.status === 'loading');
    if (!loading) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const image = layerRefs.current.get(loading.id);
      // A cached response can complete before React's event listener is
      // observed. naturalWidth distinguishes that success from a broken
      // completed image, whose error event remains authoritative.
      if (image?.complete && image.naturalWidth > 0) markLoaded(loading);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [markLoaded, state.layers]);

  React.useEffect(() => {
    const cancelWaits = state.layers
      .filter((layer) => layer.status === 'loaded' && !layer.settled)
      .map((layer) => waitForCssMotion(
        layerRefs.current.get(layer.id) ?? null,
        () => settleLayer(layer),
        acceptsOpacityTransition,
      ));

    return () => cancelWaits.forEach((cancel) => cancel());
  }, [settleLayer, state.layers]);

  React.useEffect(() => {
    const flags = callbackFlags.current;
    const activeIds = new Set(state.layers.map((layer) => layer.id));
    flags.forEach((_flags, id) => {
      if (!activeIds.has(id)) flags.delete(id);
    });
  }, [state.layers]);

  const setLayerRef = React.useCallback((id: number, node: HTMLImageElement | null) => {
    if (node) layerRefs.current.set(id, node);
    else layerRefs.current.delete(id);
  }, []);

  const showPlaceholder = state.layers.length === 0 || !state.layers.some((layer) => layer.settled);
  const restImageProps = imageProps ?? {};

  return (
    <div
      className={cn('t-media-crossfade relative', className)}
      data-placeholder={showPlaceholder ? 'true' : 'false'}
    >
      {showPlaceholder && (
        <div className="t-media-crossfade__placeholder" aria-hidden="true">
          {placeholder}
        </div>
      )}
      {state.layers.map((layer, index) => {
        const isCurrent = index === state.layers.length - 1;
        const layerImageProps = isCurrent ? restImageProps : decorativeImageProps(restImageProps);
        const layerClassName = cn('t-media-crossfade__layer', imageClassName, layerImageProps.className);
        const layerStyle = { ...layerImageProps.style, ...imageStyle };
        return (
          <img
            {...layerImageProps}
            key={layer.id}
            ref={(node) => setLayerRef(layer.id, node)}
            src={layer.request.src}
            srcSet={layer.request.srcSet}
            sizes={layer.request.sizes}
            alt={isCurrent ? alt : ''}
            aria-hidden={isCurrent ? layerImageProps['aria-hidden'] : true}
            tabIndex={isCurrent ? layerImageProps.tabIndex : -1}
            inert={isCurrent ? undefined : true}
            className={layerClassName}
            style={layerStyle}
            data-media-slot={isCurrent ? 'current' : 'previous'}
            data-media-state={layer.status}
            onLoad={isCurrent ? (event) => markLoaded(layer, event) : undefined}
            onError={isCurrent ? (event) => markError(layer, event) : undefined}
          />
        );
      })}
    </div>
  );
}

LoadedMedia.displayName = 'LoadedMedia';
